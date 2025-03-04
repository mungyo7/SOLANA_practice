import {
    Connection,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    sendAndConfirmTransaction,
    PublicKey
} from "@solana/web3.js";
import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    createTransferInstruction,
} from "@solana/spl-token";
import * as anchor from "@project-serum/anchor";
import bs58 from "bs58";
import dotenv from 'dotenv';

require('dotenv').config();
(async () => {
    
    const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
    const secretKey = bs58.decode(process.env.PRIVATE_KEY || "");
    
    const fromWallet = anchor.web3.Keypair.fromSecretKey(secretKey);
    const toWallet = new PublicKey('DvW4tysMe4opWdqg63xGfwRJeWsTx736PNGA8j26mYhw');
    console.log(fromWallet);
    console.log(toWallet);
    // Create new token mint
    const mint = await createMint(
        connection,
        fromWallet,
        fromWallet.publicKey,
        null,
        9,
    );
    console.log(mint);
    // Get the token account of the fromWallet Solana address, if it does not exist, create it
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        fromWallet.publicKey,
    );
    console.log(fromTokenAccount);
    //get the token account of the toWallet Solana address, if it does not exist, create it
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        toWallet,
    );
    console.log(toTokenAccount);
    // Minting 1 new token to the "fromTokenAccount" account we just returned/created
    await mintTo(
        connection,
        fromWallet,
        mint,
        fromTokenAccount.address,
        fromWallet.publicKey,
        1000000000, // it's 1 token, but in lamports
        [],
    );
    console.log("mintTo");
    // Add token transfer instructions to transaction
    const transaction = new Transaction().add(
        createTransferInstruction(
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        1,
        ),
    );
    console.log("createTransferInstruction");
    // Sign transaction, broadcast, and confirm
    const tx = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
    console.log(tx);
})();