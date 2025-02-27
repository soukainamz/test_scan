const { Connection, PublicKey } = require("@solana/web3.js");

const RAYDIUM_PUBLIC_KEY = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";

const SESSION_HASH = 'QNDEMO' + Math.ceil(Math.random() * 1e9); // Random unique identifier for your session
let credits = 0;

const raydium = new PublicKey(RAYDIUM_PUBLIC_KEY);
// Replace HTTP_URL & WSS_URL with QuickNode HTTPS and WSS Solana Mainnet endpoint
const connection = new Connection(`https://mainnet.helius-rpc.com/?api-key=ee0a621f-6ae3-48c4-b7e1-b5c31000cb0a`, {
    wsEndpoint: `wss://mainnet.helius-rpc.com/?api-key=ee0a621f-6ae3-48c4-b7e1-b5c31000cb0a&fast-retries=true&timeout=150`,
    httpHeaders: {"x-session-hash": SESSION_HASH}
});

// Monitor logs
async function main(connection, programAddress) {
    console.log("Monitoring logs for program:", programAddress.toString());
    connection.onLogs(
        programAddress,
        ({ logs, err, signature }) => {
            if (err) return;
            // console.log("this is logs:  "+logs);
            // createAccountWithSeed
            // if (logs && logs.some(log => log.includes("createAccountWithSeed"))) {
            if (logs && logs.some(log => log.includes("initialize2"))) {

                const now3 = new Date();
                const timestamp = new Date(now3.getTime() + 60 * 60 * 1000).toISOString();
                console.log(timestamp);
                console.log("Signature for 'Create':", signature);
                console.log("this is logs:  "+logs);
                // fetchRaydiumAccounts(signature, connection);
                return
            }

            // if (logs && logs.some(log => log.includes("initialize"))) {
            //     console.log("Signature for 'initialize':", signature);
            //     // fetchRaydiumAccounts(signature, connection);
            // }
        },
        "processed"
    );
}


// Parse transaction and filter data
async function fetchRaydiumAccounts(txId, connection) {
    const tx = await connection.getParsedTransaction(
        txId,
        {
            maxSupportedTransactionVersion: 0,
            commitment: 'confirmed'
        });
    
    credits += 100;
    
    const accounts = tx?.transaction.message.instructions.find(ix => ix.programId.toBase58() === RAYDIUM_PUBLIC_KEY).accounts;

    if (!accounts) {
        console.log("No accounts found in the transaction.");
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
    console.log("Total QuickNode Credits Used in this session:", credits);
}

function generateExplorerUrl(txId) {
    return `https://solscan.io/tx/${txId}`;
}

main(connection, raydium).catch(console.error);




  