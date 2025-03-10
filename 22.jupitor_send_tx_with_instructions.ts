import { Connection, Keypair, VersionedTransaction, TransactionInstruction, PublicKey, AddressLookupTableAccount, TransactionMessage, ComputeBudgetProgram } from '@solana/web3.js';
import { Wallet } from '@coral-xyz/anchor';
import bs58 from 'bs58';
import fetch from 'cross-fetch';
import dotenv from 'dotenv';

require('dotenv').config();
(async () => {
    const connection = new Connection("https://mainnet.helius-rpc.com/?api-key=5dec48fb-af4a-4f69-8763-ca196750f8d1", "processed");
    //https://mainnet.helius-rpc.com/?api-key=5dec48fb-af4a-4f69-8763-ca196750f8d1
    const wallet = new Wallet(Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY || '')));

    console.log(wallet.publicKey.toBase58());
    
    const inputMint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
    const outputMint = "So11111111111111111111111111111111111111112";
    const amount = 1000000; //0.1 USDC
    const slippageBps = 100; //1%
    const restrictIntermediateTokens = true; //직접 스왑

    const quoteResponse = await (
        await fetch(
            `https://api.jup.ag/swap/v1/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}&restrictIntermediateTokens=${restrictIntermediateTokens}`
        )
    ).json();
    //restrictIntermediateTokens=true -> 바로 직 스왑
    //restrictIntermediateTokens=false -> 중간 토큰 사용
    //asLegacyTransaction -> 예전 트랜잭션 형식
    //asVersionedTransaction -> 새로운 트랜잭션 형식
    //onlyDirectRoute -> 직접 경로 여부
  
    console.log(JSON.stringify(quoteResponse, null, 2));

    const instructions = await (
        await fetch('https://api.jup.ag/swap/v1/swap-instructions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quoteResponse,
            userPublicKey: wallet.publicKey.toString(),
        })
        })
    ).json();
    
    if (instructions.error) {
        throw new Error("Failed to get swap instructions: " + instructions.error);
    }
    
    const {
        tokenLedgerInstruction, // If you are using `useTokenLedger = true`.
        computeBudgetInstructions, // The necessary instructions to setup the compute budget.
        setupInstructions, // Setup missing ATA for the users.
        swapInstruction: swapInstructionPayload, // The actual swap instruction.
        cleanupInstruction, // Unwrap the SOL if `wrapAndUnwrapSol = true`.
        addressLookupTableAddresses, // The lookup table addresses that you can use if you are using versioned transaction.
    } = instructions;
    
    const deserializeInstruction = (instruction) => {
        return new TransactionInstruction({
        programId: new PublicKey(instruction.programId),
        keys: instruction.accounts.map((key) => ({
            pubkey: new PublicKey(key.pubkey),
            isSigner: key.isSigner,
            isWritable: key.isWritable,
        })),
        data: Buffer.from(instruction.data, "base64"),
        });
    };
    
    const getAddressLookupTableAccounts = async (
        keys: string[]
    ): Promise<AddressLookupTableAccount[]> => {
        const addressLookupTableAccountInfos =
        await connection.getMultipleAccountsInfo(
            keys.map((key) => new PublicKey(key))
        );
    
        return addressLookupTableAccountInfos.reduce((acc, accountInfo, index) => {
        const addressLookupTableAddress = keys[index];
        if (accountInfo) {
            const addressLookupTableAccount = new AddressLookupTableAccount({
            key: new PublicKey(addressLookupTableAddress),
            state: AddressLookupTableAccount.deserialize(accountInfo.data),
            });
            acc.push(addressLookupTableAccount);
        }
    
        return acc;
        }, new Array<AddressLookupTableAccount>());
    };
    
    const addressLookupTableAccounts: AddressLookupTableAccount[] = [];
    
    addressLookupTableAccounts.push(
        ...(await getAddressLookupTableAccounts(addressLookupTableAddresses))
    );
    
    const blockhash = (await connection.getLatestBlockhash()).blockhash;
    
    // Priority fee 설정 (예: 1,000,000 lamports = 0.001 SOL)
    const priorityFeeInstruction = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 1000000
    });

    const messageV0 = new TransactionMessage({
        payerKey: wallet.publicKey,
        recentBlockhash: blockhash,
        instructions: [
            priorityFeeInstruction, // Priority fee 인스트럭션 추가
            ...(setupInstructions?.map(deserializeInstruction) || []),
            ...(computeBudgetInstructions?.map(deserializeInstruction) || []),
            deserializeInstruction(swapInstructionPayload),
            ...(cleanupInstruction ? [deserializeInstruction(cleanupInstruction)] : []),
        ],
    }).compileToV0Message(addressLookupTableAccounts);
    const transaction = new VersionedTransaction(messageV0);
    
    // 트랜잭션에 서명
    transaction.sign([wallet.payer]);

    // 트랜잭션 직렬화
    const transactionBinary = transaction.serialize();
    console.log('Transaction Binary:', transactionBinary);

    // 트랜잭션 전송
    const signature = await connection.sendRawTransaction(transactionBinary, {
        maxRetries: 10,
        skipPreflight: true
    });
    console.log(`트랜잭션 처리중: https://solscan.io/tx/${signature}/`);
    
    // 트랜잭션 확인
    const confirmation = await connection.confirmTransaction(signature, "confirmed");

    if (confirmation.value.err) {
        throw new Error(`트랜잭션 실패: ${JSON.stringify(confirmation.value.err)}\nhttps://solscan.io/tx/${signature}/`);
    } else {
        console.log(`트랜잭션 성공: https://solscan.io/tx/${signature}/`);
    }
})();