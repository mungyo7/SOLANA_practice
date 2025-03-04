import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

(async () => {
  const connection = new Connection("https://restless-floral-snow.solana-mainnet.quiknode.pro/b6bb6a0c6f46c517ae3f6b50c8e486c0b04f729d", "confirmed");

  const tokenAccount = new PublicKey(
    "7NWvm5QRtZmDjNwDbGWuyG4HkXz71CV4QHq4pvpdgXu4",
  );

  let tokenAmount = await connection.getTokenAccountBalance(tokenAccount);
  console.log(`amount: ${tokenAmount.value.amount}`);
  console.log(`decimals: ${tokenAmount.value.decimals}`);
  console.log(`uiAmount: ${tokenAmount.value.uiAmount}`);
})();