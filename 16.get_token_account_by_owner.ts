import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

(async () => {
  // connection
  const connection = new Connection("https://restless-floral-snow.solana-mainnet.quiknode.pro/b6bb6a0c6f46c517ae3f6b50c8e486c0b04f729d", "confirmed");

  const owner = new PublicKey("8NBMkfRKNjpSfwp7TbEzCu7ugW25b95mrEKqRLL6Tsrr");
  let response = await connection.getParsedTokenAccountsByOwner(owner, {
    programId: TOKEN_PROGRAM_ID,
  });

  response.value.forEach(accountInfo => {
    // console.log(accountInfo);
    console.log(`pubkey: ${accountInfo.pubkey.toBase58()}`);
    console.log(`mint: ${accountInfo.account.data["parsed"]["info"]["mint"]}`);
    console.log(
      `owner: ${accountInfo.account.data["parsed"]["info"]["owner"]}`,
    );
    console.log(
      `decimals: ${accountInfo.account.data["parsed"]["info"]["tokenAmount"]["decimals"]}`,
    );
    console.log(
      `amount: ${accountInfo.account.data["parsed"]["info"]["tokenAmount"]["amount"]}`,
    );
    console.log("====================");
  });
})();