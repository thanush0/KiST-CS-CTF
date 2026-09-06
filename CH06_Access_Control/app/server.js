const express = require("express");
const cookieParser = require("cookie-parser");
const { ethers } = require("ethers");
const solc = require("solc");
const crypto = require("crypto");
const fs = require("fs");


// ============================================================
// CONFIGURATION
// ============================================================

const CHAIN_URL =
  process.env.CHAIN_URL || "http://anvil:8545";

const ADMIN_KEY =
  process.env.ADMIN_PRIVATE_KEY;

const UI_PORT =
  Number(process.env.UI_PORT || 54836);

const RPC_PORT =
  Number(process.env.RPC_PORT || 8545);

// Instance lifetime = 10 minutes
const INSTANCE_SECONDS = 600;

// Every player receives 5 ETH
const PLAYER_ETH = "5.0";

// CTF flag
const FLAG =
  process.env.CTF_FLAG ||
  "KiTS_CS_CTF{4cc3ss_c0ntr0l_1s_n0t_s3cur3}";


// ============================================================
// VALIDATION
// ============================================================

if (!ADMIN_KEY) {
  console.error(
    "ERROR: ADMIN_PRIVATE_KEY is not configured."
  );

  process.exit(1);
}


// ============================================================
// PROVIDER / ADMIN WALLET
// ============================================================

const provider =
  new ethers.JsonRpcProvider(CHAIN_URL);

const admin =
  new ethers.Wallet(
    ADMIN_KEY,
    provider
  );


// ============================================================
// INSTANCE STORAGE
// ============================================================

const instances = new Map();


// ============================================================
// INSTANCE CREATION LOCK
// ============================================================
//
// IMPORTANT:
//
// Browser requests can arrive simultaneously:
//
// Request #1 -> create instance
// Request #2 -> create instance
// Request #3 -> create instance
//
// Without a lock, multiple deployments can race
// and reuse the same nonce.
//
// creatingInstance makes all simultaneous requests
// wait for the SAME instance creation.
// ============================================================

let creatingInstance = null;


// ============================================================
// COMPILE CONTRACT
// ============================================================

function compileContract() {

  console.log(
    "Compiling AccessControl.sol..."
  );

  const source =
    fs.readFileSync(
      "/app/contracts/AccessControl.sol",
      "utf8"
    );

  const input = {

    language: "Solidity",

    sources: {

      "AccessControl.sol": {

        content: source

      }

    },

    settings: {

      optimizer: {

        enabled: true,

        runs: 200

      },

      outputSelection: {

        "*": {

          "*": [

            "abi",

            "evm.bytecode.object"

          ]

        }

      }

    }

  };


  const output =
    JSON.parse(
      solc.compile(
        JSON.stringify(input)
      )
    );


  // ----------------------------------------------------------
  // Compilation errors
  // ----------------------------------------------------------

  if (output.errors) {

    const errors =
      output.errors.filter(
        error =>
          error.severity === "error"
      );


    if (errors.length > 0) {

      console.error(
        errors
          .map(
            error =>
              error.formattedMessage
          )
          .join("\n")
      );

      throw new Error(
        "Solidity compilation failed"
      );
    }
  }


  // ----------------------------------------------------------
  // Verify contract
  // ----------------------------------------------------------

  if (
    !output.contracts ||
    !output.contracts["AccessControl.sol"] ||
    !output.contracts["AccessControl.sol"]["AccessControl"]
  ) {

    throw new Error(
      "AccessControl contract was not found after compilation"
    );
  }


  const contract =
    output.contracts[
      "AccessControl.sol"
    ]["AccessControl"];


  console.log(
    "AccessControl.sol compiled successfully."
  );


  return {

    abi:
      contract.abi,

    bytecode:
      "0x" +
      contract.evm.bytecode.object

  };
}


const artifact =
  compileContract();


// ============================================================
// WAIT FOR ANVIL
// ============================================================

async function waitForChain() {

  console.log(
    `Waiting for Ethereum node: ${CHAIN_URL}`
  );


  const MAX_ATTEMPTS = 60;


  for (
    let attempt = 1;
    attempt <= MAX_ATTEMPTS;
    attempt++
  ) {

    try {

      const network =
        await provider.getNetwork();


      const chainId =
        Number(network.chainId);


      if (chainId === 31337) {

        console.log(
          `Connected to Anvil. Chain ID: ${chainId}`
        );

        return;

      }


      console.log(
        `Wrong chain ID: ${chainId}`
      );

    } catch (error) {

      console.log(
        `Waiting for Anvil... ${attempt}/${MAX_ATTEMPTS}`
      );

    }


    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          1000
        )
    );
  }


  throw new Error(
    "Anvil did not become ready within 60 seconds."
  );
}


// ============================================================
// CREATE PLAYER INSTANCE
// ============================================================

async function makeInstance() {

  // ----------------------------------------------------------
  // Prevent concurrent deployments
  // ----------------------------------------------------------

  if (creatingInstance) {

    console.log(
      "Another instance is currently being created. Waiting..."
    );

    return await creatingInstance;
  }


  creatingInstance =
    (async () => {

      try {

        console.log(
          "Creating new challenge instance..."
        );


        // ====================================================
        // CREATE RANDOM PLAYER WALLET
        // ====================================================

        const player =
          ethers.Wallet
            .createRandom()
            .connect(provider);


        console.log(
          `Player address: ${player.address}`
        );


        // ====================================================
        // FUND PLAYER
        // ====================================================

        console.log(
          `Funding player with ${PLAYER_ETH} ETH...`
        );


        const fundTx =
          await admin.sendTransaction({

            to:
              player.address,

            value:
              ethers.parseEther(
                PLAYER_ETH
              )

          });


        console.log(
          `Funding transaction: ${fundTx.hash}`
        );


        await fundTx.wait();


        console.log(
          "Player funding confirmed."
        );


        // ====================================================
        // GET CURRENT ADMIN NONCE
        // ====================================================
        //
        // We explicitly ask the blockchain for the latest
        // confirmed nonce AFTER the funding transaction.
        //
        // This avoids ethers using an old cached nonce.
        // ====================================================

        const deploymentNonce =
          await provider.getTransactionCount(
            admin.address,
            "latest"
          );


        console.log(
          `Deployment nonce: ${deploymentNonce}`
        );


        // ====================================================
        // DEPLOY CONTRACT
        // ====================================================

        console.log(
          "Deploying AccessControl contract..."
        );


        const factory =
          new ethers.ContractFactory(
            artifact.abi,
            artifact.bytecode,
            admin
          );


        const contract =
          await factory.deploy(

            FLAG,

            {

              nonce:
                deploymentNonce

            }

          );


        const deploymentTx =
          contract.deploymentTransaction();


        if (deploymentTx) {

          console.log(
            `Deployment transaction: ${deploymentTx.hash}`
          );

        }


        await contract.waitForDeployment();


        const contractAddress =
          await contract.getAddress();


        console.log(
          `Contract deployed: ${contractAddress}`
        );


        // ====================================================
        // INSTANCE ID
        // ====================================================

        const id =
          crypto
            .randomBytes(18)
            .toString("hex");


        const createdAt =
          Date.now();


        const expiresAt =
          createdAt +
          INSTANCE_SECONDS * 1000;


        // ====================================================
        // STORE INSTANCE
        // ====================================================

        const instance = {

          id,

          player,

          contract:
            contractAddress,

          createdAt,

          expiresAt

        };


        instances.set(
          id,
          instance
        );


        console.log(
          `Instance created: ${id}`
        );


        console.log(
          `Player address: ${player.address}`
        );


        console.log(
          `Contract: ${contractAddress}`
        );


        console.log(
          `Expires: ${new Date(
            expiresAt
          ).toISOString()}`
        );


        return instance;

      } catch (error) {

        console.error(
          "INSTANCE CREATION FAILED:"
        );

        console.error(
          error
        );

        throw error;

      } finally {

        // Allow the next instance to be created
        creatingInstance = null;

      }

    })();


  return await creatingInstance;
}


// ============================================================
// COOKIE OPTIONS
// ============================================================

function instanceCookieOptions() {

  return {

    httpOnly: true,

    sameSite: "lax",

    secure: false,

    maxAge:
      INSTANCE_SECONDS * 1000

  };
}


// ============================================================
// GET / CREATE BROWSER INSTANCE
// ============================================================

async function getInstance(req, res) {

  let id =
    req.cookies.instance_id;


  let instance =
    id
      ? instances.get(id)
      : null;


  // ----------------------------------------------------------
  // Check expiration
  // ----------------------------------------------------------

  if (
    instance &&
    Date.now() >= instance.expiresAt
  ) {

    console.log(
      `Instance expired: ${instance.id}`
    );


    instances.delete(
      instance.id
    );


    instance = null;

  }


  // ----------------------------------------------------------
  // Create new instance
  // ----------------------------------------------------------

  if (!instance) {

    instance =
      await makeInstance();


    res.cookie(
      "instance_id",

      instance.id,

      instanceCookieOptions()
    );

  }


  return instance;
}


// ============================================================
// PUBLIC INSTANCE DATA
// ============================================================

async function publicInstance(instance) {

  const contract =
    new ethers.Contract(
      instance.contract,
      artifact.abi,
      provider
    );


  // ----------------------------------------------------------
  // Owner
  // ----------------------------------------------------------

  let owner =
    "0x0000000000000000000000000000000000000000";


  try {

    owner =
      await contract.owner();

  } catch (error) {

    console.error(
      "Could not read owner:",
      error.message
    );

  }


  // ----------------------------------------------------------
  // Revealed
  // ----------------------------------------------------------

  let revealed = false;


  try {

    revealed =
      await contract.revealed();

  } catch (error) {

    console.error(
      "Could not read revealed:",
      error.message
    );

  }


  // ----------------------------------------------------------
  // Flag
  // ----------------------------------------------------------

  let flag = null;


  if (revealed) {

    try {

      flag =
        await contract.getFlag();

    } catch (error) {

      console.error(
        "Could not read flag:",
        error.message
      );

    }

  }


  // ----------------------------------------------------------
  // Player balance
  // ----------------------------------------------------------

  let balance =
    "0";


  try {

    balance =
      ethers.formatEther(

        await provider.getBalance(
          instance.player.address
        )

      );

  } catch (error) {

    console.error(
      "Could not read player balance:",
      error.message
    );

  }


  // ----------------------------------------------------------
  // RETURN DATA
  // ----------------------------------------------------------

  return {

    contract:
      instance.contract,

    playerAddress:
      instance.player.address,

    // IMPORTANT:
    // This is the RANDOM PLAYER private key.
    // It is NOT the admin private key.
    playerPrivateKey:
      instance.player.privateKey,

    // Students should use the public proxy.
    rpcUrl:
      "/rpc",

    chainId:
      31337,

    gasBalance:
      balance,

    owner,

    revealed,

    flag,

    expiresAt:
      instance.expiresAt

  };
}


// ============================================================
// EXPRESS UI SERVER
// ============================================================

const ui =
  express();


ui.use(
  cookieParser()
);


ui.use(
  express.json()
);


ui.use(
  express.static(
    "/app/public"
  )
);


// ============================================================
// HEALTH CHECK
// ============================================================

ui.get(
  "/health",

  async (req, res) => {

    try {

      const network =
        await provider.getNetwork();


      res.json({

        status:
          "ok",

        chainId:
          Number(
            network.chainId
          ),

        instances:
          instances.size

      });

    } catch (error) {

      res.status(503).json({

        status:
          "error",

        message:
          "Blockchain unavailable"

      });

    }

  }
);


// ============================================================
// GET INSTANCE
// ============================================================

ui.get(
  "/api/instance",

  async (req, res) => {

    try {

      const instance =
        await getInstance(
          req,
          res
        );


      const data =
        await publicInstance(
          instance
        );


      res.json(
        data
      );

    } catch (error) {

      console.error(
        "INSTANCE ERROR:"
      );


      console.error(
        error
      );


      res.status(500).json({

        error:
          "Could not create instance",

        message:
          error.shortMessage ||
          error.message ||
          "Unknown error"

      });

    }

  }
);


// ============================================================
// RESET INSTANCE
// ============================================================

ui.post(
  "/api/reset",

  async (req, res) => {

    try {

      const oldId =
        req.cookies.instance_id;


      if (oldId) {

        console.log(
          `Deleting old instance: ${oldId}`
        );


        instances.delete(
          oldId
        );

      }


      res.clearCookie(
        "instance_id"
      );


      const instance =
        await makeInstance();


      res.cookie(

        "instance_id",

        instance.id,

        instanceCookieOptions()

      );


      const data =
        await publicInstance(
          instance
        );


      res.json(
        data
      );

    } catch (error) {

      console.error(
        "RESET ERROR:"
      );


      console.error(
        error
      );


      res.status(500).json({

        error:
          "Could not reset instance",

        message:
          error.shortMessage ||
          error.message ||
          "Unknown error"

      });

    }

  }
);


// ============================================================
// RPC PROXY
// ============================================================
//
// Students use:
//
// http://SERVER:54836/rpc
//
// They do NOT directly access:
//
// anvil:8545
//
// ============================================================

const BLOCKED =
  new Set([

    // --------------------------------------------------------
    // Storage inspection
    // --------------------------------------------------------

    "eth_getStorageAt",

    "eth_getProof",


    // --------------------------------------------------------
    // Debug
    // --------------------------------------------------------

    "debug_traceTransaction",

    "debug_traceCall",


    // --------------------------------------------------------
    // Trace
    // --------------------------------------------------------

    "trace_call",

    "trace_transaction",

    "trace_replayTransaction",


    // --------------------------------------------------------
    // Anvil administration
    // --------------------------------------------------------

    "anvil_impersonateAccount",

    "anvil_stopImpersonatingAccount",

    "anvil_setBalance",

    "anvil_setStorageAt",

    "anvil_setCode",

    "anvil_setNonce",

    "anvil_mine",

    "anvil_dropTransaction",


    // --------------------------------------------------------
    // Hardhat administration
    // --------------------------------------------------------

    "hardhat_impersonateAccount",

    "hardhat_setBalance",

    "hardhat_setStorageAt",

    "hardhat_setCode",

    "hardhat_mine",


    // --------------------------------------------------------
    // EVM administration
    // --------------------------------------------------------

    "evm_setAccountBalance",

    "evm_setAccountCode",

    "evm_setAccountNonce",

    "evm_mine",

    "evm_revert",

    "evm_snapshot"

  ]);


// ============================================================
// RPC EXPRESS SERVER
// ============================================================

const rpc =
  express();


rpc.use(
  express.json({

    limit:
      "2mb"

  })
);


// ============================================================
// RPC ENDPOINT
// ============================================================

rpc.post(
  "/",

  async (req, res) => {

    const isBatch =
      Array.isArray(
        req.body
      );


    const requests =
      isBatch
        ? req.body
        : [req.body];


    try {

      const replies = [];


      for (
        const request
        of requests
      ) {

        // ----------------------------------------------------
        // Validate request
        // ----------------------------------------------------

        if (

          !request ||

          typeof request.method !==
            "string"

        ) {

          replies.push({

            jsonrpc:
              "2.0",

            id:
              request?.id ??
              null,

            error: {

              code:
                -32600,

              message:
                "Invalid Request"

            }

          });


          continue;

        }


        const method =
          request.method;


        // ----------------------------------------------------
        // Block dangerous methods
        // ----------------------------------------------------

        if (
          BLOCKED.has(
            method
          )
        ) {

          replies.push({

            jsonrpc:
              "2.0",

            id:
              request.id,

            error: {

              code:
                -32601,

              message:
                "Method not available"

            }

          });


          continue;

        }


        // ----------------------------------------------------
        // Block dangerous namespaces
        // ----------------------------------------------------

        if (

          method.startsWith(
            "anvil_"
          ) ||

          method.startsWith(
            "hardhat_"
          ) ||

          method.startsWith(
            "debug_"
          ) ||

          method.startsWith(
            "trace_"
          ) ||

          method.startsWith(
            "evm_"
          )

        ) {

          replies.push({

            jsonrpc:
              "2.0",

            id:
              request.id,

            error: {

              code:
                -32601,

              message:
                "Method not available"

            }

          });


          continue;

        }


        // ----------------------------------------------------
        // Forward Ethereum RPC
        // ----------------------------------------------------

        try {

          const result =
            await provider.send(

              method,

              request.params || []

            );


          replies.push({

            jsonrpc:
              "2.0",

            id:
              request.id,

            result

          });


        } catch (error) {

          replies.push({

            jsonrpc:
              "2.0",

            id:
              request.id,

            error: {

              code:
                -32000,

              message:
                error.shortMessage ||
                error.message ||
                "RPC error"

            }

          });

        }

      }


      // ------------------------------------------------------
      // Preserve batch format
      // ------------------------------------------------------

      res.json(

        isBatch
          ? replies
          : replies[0]

      );


    } catch (error) {

      console.error(
        "RPC ERROR:",
        error
      );


      res.status(500).json({

        jsonrpc:
          "2.0",

        id:
          null,

        error: {

          code:
            -32603,

          message:
            "Internal error"

        }

      });

    }

  }
);


// ============================================================
// START SERVER
// ============================================================

async function start() {

  // ----------------------------------------------------------
  // Wait for Anvil
  // ----------------------------------------------------------

  await waitForChain();


  // ----------------------------------------------------------
  // Verify admin account
  // ----------------------------------------------------------

  console.log(
    `Admin address: ${admin.address}`
  );


  try {

    const balance =
      await provider.getBalance(
        admin.address
      );


    console.log(
      `Admin balance: ${
        ethers.formatEther(balance)
      } ETH`
    );


  } catch (error) {

    console.error(
      "Could not read admin balance:",
      error.message
    );

  }


  // ----------------------------------------------------------
  // Start UI
  // ----------------------------------------------------------

  ui.listen(

    UI_PORT,

    "0.0.0.0",

    () => {

      console.log(
        `UI listening on ${UI_PORT}`
      );

    }

  );


  // ----------------------------------------------------------
  // Start RPC proxy
  // ----------------------------------------------------------

  rpc.listen(

    RPC_PORT,

    "0.0.0.0",

    () => {

      console.log(
        `RPC proxy listening on ${RPC_PORT}`
      );

    }

  );

}


// ============================================================
// START APPLICATION
// ============================================================

start()
  .catch(error => {

    console.error(
      "STARTUP FAILED:"
    );


    console.error(
      error
    );


    process.exit(1);

  });


// ============================================================
// CLEANUP EXPIRED INSTANCES
// ============================================================

setInterval(

  () => {

    const now =
      Date.now();


    for (
      const [id, instance]
      of instances
    ) {

      if (
        now >= instance.expiresAt
      ) {

        console.log(
          `Removing expired instance: ${id}`
        );


        instances.delete(
          id
        );

      }

    }

  },

  30_000

);