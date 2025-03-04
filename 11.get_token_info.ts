import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { getMint } from "@solana/spl-token";

(async () => {
  const connection = new Connection("https://restless-floral-snow.solana-mainnet.quiknode.pro/b6bb6a0c6f46c517ae3f6b50c8e486c0b04f729d", "confirmed");

  const mintAccountPublicKey = new PublicKey(
    "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN", //trump
  );

  let mintAccount = await getMint(connection, mintAccountPublicKey);

  console.log(mintAccount);
  /*
  {
    address: PublicKey {
      _bn: <BN: 7351e5e067cc7cfefef42e78915d3c513edbb8adeeab4d9092e814fe68c39fec>
    },
    mintAuthority: PublicKey {
      _bn: <BN: df30e6ca0981c1a677eed6f7cb46b2aa442ca9b7a10a10e494badea4b9b6944f>
    },
    supply: 0n,
    decimals: 8,
    isInitialized: true,
    freezeAuthority: PublicKey {
      _bn: <BN: df30e6ca0981c1a677eed6f7cb46b2aa442ca9b7a10a10e494badea4b9b6944f>
    }
  }
  */
})();