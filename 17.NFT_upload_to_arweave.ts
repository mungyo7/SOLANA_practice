import * as fs from "fs";
import Arweave from "arweave";

(async () => {
  const arweave = Arweave.init({
    host: "localhost",
    port: 1984,
    protocol: "http",
    timeout: 20000,
    logging: false,
  });

  const host = arweave.getConfig().api.host;
  const port = arweave.getConfig().api.port;
  const protocol = arweave.getConfig().api.protocol;

  // Upload image to Arweave
  const data = fs.readFileSync("./pengu.png");

  const transaction = await arweave.createTransaction({
    data: data,
  });
  
  transaction.addTag("Content-Type", "image/png");

  // Instead of generating a new wallet, you can use an existing one from your file system
  // useful in production environments
  // const wallet = JSON.parse(fs.readFileSync("./code/nfts/upload-arweave/wallet.json", "utf-8"))
  const wallet = await arweave.wallets.generate();
  const address = await arweave.wallets.getAddress(wallet);
  console.log("address:", address);

  await arweave.api.get(`/mint/${encodeURI(address)}/10000000000000000`);
  await arweave.transactions.sign(transaction, wallet);

  const response = await arweave.transactions.post(transaction);
  console.log(response);

  const id = transaction.id;
  const imageUrl = id ? `${protocol}://${host}:${port}/${id}` : null;
  console.log("imageUrl", imageUrl);

  // Upload metadata to Arweave

  const metadata = {
    name: "Custom NFT #1",
    symbol: "CNFT",
    description: "A description about my custom NFT #1",
    seller_fee_basis_points: 500,
    external_url: "https://www.customnft.com/",
    attributes: [
      {
        trait_type: "NFT type",
        value: "Custom",
      },
    ],
    collection: {
      name: "Test Collection",
      family: "Custom NFTs",
    },
    properties: {
      files: [
        {
          uri: imageUrl,
          type: "image/png",
        },
      ],
      category: "image",
      maxSupply: 0,
      creators: [
        {
          address: "CBBUMHRmbVUck99mTCip5sHP16kzGj3QTYB8K3XxwmQx",
          share: 100,
        },
      ],
    },
    image: imageUrl,
  };

  const metadataString = JSON.stringify(metadata);

  const metadataTransaction = await arweave.createTransaction({
    data: metadataString,
  });

  metadataTransaction.addTag("Content-Type", "application/json");

  await arweave.transactions.sign(metadataTransaction, wallet);

  console.log("metadata txid", metadataTransaction.id);

  const txnResult = await arweave.transactions.post(metadataTransaction);

  console.log(txnResult);
})();