import {
    clusterApiUrl,
    Connection,
    Keypair,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
  } from "@solana/web3.js";
  import {
    createInitializeMintInstruction,
    TOKEN_PROGRAM_ID,
    MINT_SIZE,
    getMinimumBalanceForRentExemptMint,
    createMint,
  } from "@solana/spl-token";
  import bs58 from "bs58";
  import dotenv from 'dotenv';

require('dotenv').config();
  (async () => {
    // connection
    const connection = new Connection("https://restless-floral-snow.solana-mainnet.quiknode.pro/b6bb6a0c6f46c517ae3f6b50c8e486c0b04f729d", "confirmed");
    const recentBlockhash = await connection.getLatestBlockhash();
  
    // 5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8
    const feePayer = Keypair.fromSecretKey(
      bs58.decode(process.env.PRIVATE_KEY || ""),
    );
  
    // G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY
    const alice = Keypair.fromSecretKey(
      bs58.decode(
        "4NMwxzmYj2uvHuq8xoqhY8RXg63KSVJM1DXkpbmkUY7YQWuoyQgFnnzn6yo3CMnqZasnNPNuAT2TLwQsCaKkUddp",
      ),
    );
  
    // 1) use build-in function
    let mintPubkey = await createMint(
      connection, // connection
      feePayer, // fee payer
      feePayer.publicKey, // mint authority
      feePayer.publicKey, // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
      8, // decimals
    );
    console.log(`mint: ${mintPubkey.toBase58()}`);
  
    // // or
  
    // // 2) compose by yourself
    // const mint = Keypair.generate();
    // console.log(`mint: ${mint.publicKey.toBase58()}`);
  
    // const transaction = new Transaction().add(
    //   // create mint account
    //   SystemProgram.createAccount({
    //     fromPubkey: feePayer.publicKey,
    //     newAccountPubkey: mint.publicKey,
    //     space: MINT_SIZE,
    //     lamports: await getMinimumBalanceForRentExemptMint(connection),
    //     programId: TOKEN_PROGRAM_ID,
    //   }),
    //   // init mint account
    //   createInitializeMintInstruction(
    //     mint.publicKey, // mint pubkey
    //     8, // decimals
    //     alice.publicKey, // mint authority
    //     alice.publicKey, // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
    //   ),
    // );
  
    // // Send transaction
    // const transactionSignature = await sendAndConfirmTransaction(
    //   connection,
    //   transaction,
    //   [feePayer, mint], // Signers
    // );
  
    // console.log(`txhash: ${transactionSignature}`);
  })();