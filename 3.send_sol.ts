import * as web3 from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import bs58 from "bs58";
import dotenv from 'dotenv';

require('dotenv').config();
const connection = new web3.Connection("https://restless-floral-snow.solana-mainnet.quiknode.pro/b6bb6a0c6f46c517ae3f6b50c8e486c0b04f729d", "confirmed");

const secretKey = bs58.decode(process.env.PRIVATE_KEY || "");

const wallet = web3.Keypair.fromSecretKey(secretKey);
console.log(wallet);
const privateKey = bs58.encode(secretKey);

const toWallet = new web3.PublicKey('DvW4tysMe4opWdqg63xGfwRJeWsTx736PNGA8j26mYhw');
console.log("public key", wallet.publicKey.toString());
console.log("private key", wallet.secretKey);
console.log("private key", privateKey);

const amount = web3.LAMPORTS_PER_SOL * 0.00121;

async function main() {
    // 잔액 확인 추가
    const balance = await connection.getBalance(wallet.publicKey);
    console.log(`현재 지갑 잔액: ${balance / web3.LAMPORTS_PER_SOL} SOL`);

    const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: toWallet,
            lamports: amount,
        })
      );
    
      // 트랜잭션 전송 및 확인
      const signature = await web3.sendAndConfirmTransaction(connection, transaction, [
        wallet,
      ]);
    
      console.log("전송 완료! 트랜잭션 서명:", signature);
      console.log("solscan", `https://solscan.io/tx/${signature}`);
      
    
}

main().catch(console.error);