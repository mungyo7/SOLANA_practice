import {
    SystemProgram,
    Keypair,
    Transaction,
    sendAndConfirmTransaction,
    Connection,
    clusterApiUrl,
    LAMPORTS_PER_SOL,
    PublicKey
  } from "@solana/web3.js";
import bs58 from "bs58";
import dotenv from 'dotenv';

require('dotenv').config();
(async () => {
    const connection = new Connection(
        "https://restless-floral-snow.solana-mainnet.quiknode.pro/b6bb6a0c6f46c517ae3f6b50c8e486c0b04f729d",
        "confirmed"
    );

    const secretKey = bs58.decode(process.env.PRIVATE_KEY || "");

    const payer = Keypair.fromSecretKey(secretKey);

    const newAccount = Keypair.generate();
    console.log(newAccount);


    // amount of space to reserve for the account
    const space = 0;

    // Seed the created account with lamports for rent exemption
    const rentLamports = await connection.getMinimumBalanceForRentExemption(space);

    const createAccountTransaction = new Transaction().add(
    SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: newAccount.publicKey,
        lamports: rentLamports,
        space,
        programId: SystemProgram.programId,
    }),
    );

    const tx = await sendAndConfirmTransaction(connection, createAccountTransaction, [
        payer,
        newAccount
    ]);
    console.log(tx);
})();