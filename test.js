const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');

// The SPL Token program id (for both token and token-2022, you might add the second one if needed)
// TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
const TOKEN_PROGRAM_ID = new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8");
const RAYDIUM_PUBLIC_KEY = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";
// Connect to the Solana cluster (use 'devnet' or 'mainnet-beta' as needed)
const connection = new Connection(clusterApiUrl('mainnet-beta'), 'processed');

console.log("Listening for new token creation events on Solana...");

const SESSION_HASH = 'QNDEMO' + Math.ceil(Math.random() * 1e9); // Random unique identifier for your session
let credits = 0;
const newconnection = new Connection(`https://mainnet.helius-rpc.com/?api-key=ee0a621f-6ae3-48c4-b7e1-b5c31000cb0a`, {
    wsEndpoint: `wss://mainnet.helius-rpc.com/?api-key=ee0a621f-6ae3-48c4-b7e1-b5c31000cb0a&fast-retries=true&timeout=150`,
    httpHeaders: {"x-session-hash": SESSION_HASH}
});
// Subscribe to logs for the Token Program.
// New token mints will usually emit logs that include "InitializeMint" or "InitializeMint2".
connection.onLogs(TOKEN_PROGRAM_ID, (logs, ctx) => {
  // Combine all log messages into one string for simple filtering.
  // console.log("Log Messages:", logs.signature);

//   combinedLogs.includes("createAccountWithSeed") || combinedLogs.includes("addLiquidity") ||
  const combinedLogs = logs.logs.join(" ");
  if (  combinedLogs.includes("InitializeMint2") ||  combinedLogs.includes("InitializeMint")) {
    const now3 = new Date();
                const timestamp = new Date(now3.getTime() + 60 * 60 * 1000).toISOString();
                console.log(timestamp);
    console.log("==========================================");
    console.log("New token mint detected!");
    console.log("Transaction Signature:", logs.signature);
    console.log("looogsssssssss:", logs);
    console.log("Log Messages:", logs.logs);
    fetchRaydiumAccounts(logs.signature, newconnection);
    console.log("==========================================\n");
  }
});


async function fetchRaydiumAccounts(txId, connection) {
  const tx = await connection.getParsedTransaction(
      txId,
      {
          maxSupportedTransactionVersion: 0,
          commitment: 'confirmed'
      });
  
  // credits += 100;
  
  // const accounts = tx?.transaction.message.instructions.find(ix => ix.programId.toBase58() === RAYDIUM_PUBLIC_KEY).accounts;

  // if (!accounts) {
  //     console.log("No accounts found in the transaction.");
  //     return;
  // }

  const accounts = tx?.transaction.message.instructions.find(
    ix => ix.programId.toBase58() === RAYDIUM_PUBLIC_KEY
  )?.accounts;
  
  if (!accounts) {
    console.log("No accounts found for the Raydium instruction.");
    return;
  }
  


  const now3 = new Date();
  const timestamp = new Date(now3.getTime() + 60 * 60 * 1000).toISOString();
  console.log(timestamp);

  const tokenAIndex = 8;
  const tokenBIndex = 9;

  const tokenAAccount = accounts[tokenAIndex];
  const tokenBAccount = accounts[tokenBIndex];

  const displayData = [
      { "Token": "A", "Account Public Key": tokenAAccount.toBase58() },
      { "Token": "B", "Account Public Key": tokenBAccount.toBase58() }
  ];
  console.log("New LP Found");
  
  console.log(generateExplorerUrl(txId));
  console.table(displayData);
  // console.log("Total QuickNode Credits Used in this session:", credits);
}




function generateExplorerUrl(txId) {
  return `https://solscan.io/tx/${txId}`;
}

// connection.onLogs(TOKEN_PROGRAM_ID, (logs, ctx) => {
//   console.log("New log event:");
//   console.log("Transaction Signature:", logs.signature);
//   // console.log("Log Messages:", logs.logs);

  
// });





// const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');

// // The SPL Token program id (for both token and token-2022, you might add the second one if needed)
// // TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
// const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
// const RAYDIUM_PUBLIC_KEY = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";
// // Connect to the Solana cluster (use 'devnet' or 'mainnet-beta' as needed)
// const connection = new Connection(clusterApiUrl('mainnet-beta'), 'processed');

// console.log("Listening for new token creation events on Solana...");

// connection.onLogs(TOKEN_PROGRAM_ID, async (logs, ctx) => {
//   // Combine logs for filtering.
//   const combinedLogs = logs.logs.join(" ");
//   if (combinedLogs.includes("InitializeMint2")) {
//     console.log("==========================================");
//     const now3 = new Date();
//                 const timestamp = new Date(now3.getTime() + 60 * 60 * 1000).toISOString();
//                 console.log(timestamp);
//     console.log("New token mint detected!");
//     console.log("Transaction Signature:", logs.signature);
//     console.log("Log Messages:", logs.logs);
//     console.log("==========================================\n");

//     // // Fetch the parsed transaction using the same commitment level.
//     // const tx = await connection.getParsedTransaction(logs.signature, {
//     //   maxSupportedTransactionVersion: 0,
//     //   commitment: "confirmed",
//     //   encoding: "jsonParsed"
//     // });
    
//     // if (tx && tx.transaction.message.instructions) {
//     //   // Look for the initializeMint instruction.
//     //   // Note: The parsed instruction should have a `parsed` field.
//     //   const initIx = tx.transaction.message.instructions.find(ix =>
//     //     ix.program === "spl-token" &&
//     //     ix.parsed &&
//     //     (ix.parsed.type === "initializeMint" || ix.parsed.type === "initializeMint2")
//     //   );
      
//     //   const now1 = new Date();
//     //   const timestamp1 = new Date(now1.getTime() + 60 * 60 * 1000).toISOString();
//     //   console.log(timestamp1);
//     //   if (initIx) {
//     //     // For initializeMint, the parsed info usually includes the mint address.
//     //     // Depending on the parser, it might be available as: 
//     //     //   initIx.parsed.info.mint
//     //     // or you might need to inspect the accounts array.
//     //     const mintAddress = initIx.parsed.info.mint;
//     //     console.log("Token Mint Address:", mintAddress);
//     //   } else {
//     //     console.log("No initializeMint instruction found in the transaction.");
//     //   }
//     // } else {
//     //   console.log("Transaction data not found.");
//     // }
//   }
// });
