import { Connection, Keypair, VersionedTransaction } from '@solana/web3.js';
import { Wallet } from '@coral-xyz/anchor';
import bs58 from 'bs58';
import fetch from 'cross-fetch';
import dotenv from 'dotenv';

require('dotenv').config();
(async () => {
    const connection = new Connection("https://restless-floral-snow.solana-mainnet.quiknode.pro/b6bb6a0c6f46c517ae3f6b50c8e486c0b04f729d", "confirmed");

    const wallet = new Wallet(Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY || '')));

    console.log(wallet.publicKey.toBase58());

    const inputMint = "So11111111111111111111111111111111111111112";
    const outputMint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
    const amount = 100000000;
    const slippageBps = 50; //0.5%
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
})();