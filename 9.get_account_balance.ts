import {
    clusterApiUrl,
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    Keypair,
  } from "@solana/web3.js";
  import bs58 from "bs58";
  
  (async () => {
  const connection = new Connection("https://restless-floral-snow.solana-mainnet.quiknode.pro/b6bb6a0c6f46c517ae3f6b50c8e486c0b04f729d", "confirmed");

  const wallet = new PublicKey('8NBMkfRKNjpSfwp7TbEzCu7ugW25b95mrEKqRLL6Tsrr');
  console.log('wallet :', wallet.toString());
  
  const balance = await connection.getBalance(wallet);
  console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
})();