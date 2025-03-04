import { BN, web3 } from "@coral-xyz/anchor";
import {
  Keypair,
  Connection,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  ComputeBudgetProgram,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import dotenv from 'dotenv';

require('dotenv').config();
(async () => {
    const secretKey = bs58.decode(process.env.PRIVATE_KEY || "");

    
    const payer = web3.Keypair.fromSecretKey(secretKey);
    
    const toWallet = new web3.PublicKey('DvW4tysMe4opWdqg63xGfwRJeWsTx736PNGA8j26mYhw');

  const connection = new Connection(
    "https://restless-floral-snow.solana-mainnet.quiknode.pro/b6bb6a0c6f46c517ae3f6b50c8e486c0b04f729d",
    "confirmed"
  );
  // request a specific compute unit budget
  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    units: 1000000,
  });
  console.log(modifyComputeUnits);
  // set the desired priority fee
  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 1,
  });

  // Total fee will be 5,001 Lamports for 1M CU
  const transaction = new Transaction()
    .add(modifyComputeUnits)
    .add(addPriorityFee)
    .add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: toWallet,
        lamports: 1000000,
      }),
    );

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    payer,
  ]);
  console.log(signature);

  const result = await connection.getParsedTransaction(signature);
  console.log(result);
})();