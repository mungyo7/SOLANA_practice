import * as web3 from "@solana/web3.js";
import { Keypair, SystemProgram } from "@solana/web3.js";
import bs58 from "bs58";
import dotenv from 'dotenv';

require('dotenv').config();
(async () => {
  // Connect to cluster
  const connection = new web3.Connection(
    "https://restless-floral-snow.solana-mainnet.quiknode.pro/b6bb6a0c6f46c517ae3f6b50c8e486c0b04f729d",
    "confirmed"
  );

  const payer = Keypair.generate();
  const recipient = Keypair.generate();

  const transferInstruction = SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: recipient.publicKey,
    lamports: 1000000, // 0.001 SOL
  });

  const recentBlockhash = await connection.getLatestBlockhash();

  const messageParams = {
    accountKeys: [
      payer.publicKey.toString(),
      recipient.publicKey.toString(),
      SystemProgram.programId.toString(),
    ],
    header: {
      numReadonlySignedAccounts: 0,
      numReadonlyUnsignedAccounts: 1,
      numRequiredSignatures: 1,
    },
    instructions: [
      {
        accounts: [0, 1],
        data: bs58.encode(transferInstruction.data),
        programIdIndex: 2,
      },
    ],
    recentBlockhash: recentBlockhash.blockhash,
  };

  const message = new web3.Message(messageParams);

  const fees = await connection.getFeeForMessage(message);
  console.log(`Estimated SOL transfer cost: ${fees.value} lamports`);
  // Estimated SOL transfer cost: 5000 lamports
})();