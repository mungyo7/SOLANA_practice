import {
    clusterApiUrl,
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    sendAndConfirmTransaction,
  } from "@solana/web3.js";
  import {
    createAssociatedTokenAccount,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
  } from "@solana/spl-token";
  import bs58 from "bs58";
  import dotenv from 'dotenv';

require('dotenv').config();
  (async () => {
    // connection
    const connection = new Connection("https://restless-floral-snow.solana-mainnet.quiknode.pro/b6bb6a0c6f46c517ae3f6b50c8e486c0b04f729d", "confirmed");
  
    const feePayer = Keypair.fromSecretKey(
      bs58.decode(process.env.PRIVATE_KEY || ""),
    );
  
    const mintPubkey = new PublicKey(
      "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN", //trump
    );
  
    // 1) use build-in function
    {
      let ata = await createAssociatedTokenAccount(
        connection, // connection
        feePayer, // fee payer
        mintPubkey, // mint
        feePayer.publicKey, // owner,
      );
      console.log(`ATA: ${ata.toBase58()}`);
    }
  
    // // or
  
    // // 2) composed by yourself
    // {
    //   // calculate ATA
    //   let ata = await getAssociatedTokenAddress(
    //     mintPubkey, // mint
    //     alice.publicKey, // owner
    //   );
    //   console.log(`ATA: ${ata.toBase58()}`);
  
    //   // if your wallet is off-curve, you should use
    //   // let ata = await getAssociatedTokenAddress(
    //   //   mintPubkey, // mint
    //   //   alice.publicKey // owner
    //   //   true, // allowOwnerOffCurve
    //   // );
  
    //   let transaction = new Transaction().add(
    //     createAssociatedTokenAccountInstruction(
    //       feePayer.publicKey, // payer
    //       ata, // ata
    //       alice.publicKey, // owner
    //       mintPubkey, // mint
    //     ),
    //   );
  
    //   const signature = await sendAndConfirmTransaction(
    //     connection,
    //     transaction,
    //     [feePayer], // Signers
    //   );
  
    //   console.log(`txhash: ${await signature}`);
    // }
  })();