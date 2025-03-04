import {
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  Keypair,
  SendTransactionError
} from "@solana/web3.js";
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import * as anchor from "@project-serum/anchor";
import bs58 from "bs58";
import * as readline from "readline";
import dotenv from 'dotenv';

require('dotenv').config();
// Solana 연결 설정
const connection = new Connection(
  "https://restless-floral-snow.solana-mainnet.quiknode.pro/b6bb6a0c6f46c517ae3f6b50c8e486c0b04f729d",
  "confirmed"
);

// 비밀키 설정 (주의: 실제 사용 시 보안에 주의하세요)
const secretKey: Uint8Array = bs58.decode(process.env.PRIVATE_KEY || "");
const wallet: Keypair = Keypair.fromSecretKey(secretKey);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function transferSPLToken(
  payer: Keypair,
  tokenMintAddress: string,
  sourceWalletAddress: string,
  destinationWalletAddress: string,
  owner: Keypair,
  amount: bigint
): Promise<void> {
  try {
    const tokenMintPublicKey = new PublicKey(tokenMintAddress);
    const sourceWalletPublicKey = new PublicKey(sourceWalletAddress);
    const destinationWalletPublicKey = new PublicKey(destinationWalletAddress);

    // 토큰 계정 주소 찾기
    const sourceTokenAccount = await getAssociatedTokenAddress(
        tokenMintPublicKey,
        sourceWalletPublicKey
      );
      const destinationTokenAccount = await getAssociatedTokenAddress(
        tokenMintPublicKey,
        destinationWalletPublicKey
      );
  
      // 목적지 토큰 계정이 존재하는지 확인
      const destinationAccountInfo = await connection.getAccountInfo(
        destinationTokenAccount
      );
  
      let transaction = new Transaction();
  
      // 목적지 토큰 계정이 없다면 생성
      if (destinationAccountInfo === null) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            payer.publicKey,
            destinationTokenAccount,
            destinationWalletPublicKey,
            tokenMintPublicKey
          )
        );
      }
  
      // 전송 명령 추가
      transaction.add(
        createTransferInstruction(
          sourceTokenAccount,
          destinationTokenAccount,
          owner.publicKey,
          amount
        )
      );

    console.log("전송 정보:");
    console.log("보내는 주소:", sourceWalletAddress);
    console.log("받는 주소:", destinationWalletAddress);
    console.log("토큰 주소:", tokenMintAddress);
    console.log("전송 수량:", amount.toString());

    const confirm = await askQuestion("전송을 진행하시겠습니까? (y/n): ");
    if (confirm.toLowerCase() !== "y") {
      console.log("사용자에 의해 전송이 취소되었습니다.");
      return;
    }

    // 트랜잭션 전송 및 확인
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      payer,
      owner,
    ]);

    console.log("전송 완료. 트랜잭션 서명:", signature);

  } catch (error) {
    console.error("전송 과정 오류:", (error as Error).message);
    if (error instanceof SendTransactionError) {
      console.error("상세 로그:", error.logs);
    }
  }
}

async function main(): Promise<void> {
  const tokenMintAddress = "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm";
  const sourceWalletAddress = wallet.publicKey.toString();
  const destinationWalletAddress =
    "DvW4tysMe4opWdqg63xGfwRJeWsTx736PNGA8j26mYhw";
  const amount = BigInt(1000000);

  await transferSPLToken(
    wallet,
    tokenMintAddress,
    sourceWalletAddress,
    destinationWalletAddress,
    wallet,
    amount
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    rl.close();
  });
