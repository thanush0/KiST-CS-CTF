# Access Control

**Category:** Blockchain  
**Difficulty:** Medium

We've created a simple contract to store a secret flag. But you
currently are not the owner of the contract...

Only the owner of the contract should be able to access it.

We're sure we've made it secure this time.

## Instance

Open the challenge instance page in your browser.

Each browser session receives:

- A unique player Ethereum address
- A unique private key
- A unique contract address
- 5 ETH for transaction fees
- A 10-minute instance lifetime

When the instance expires, a new player key and contract are issued.

## Objective

Exploit the contract's access-control vulnerability to become the owner
and retrieve the flag.

## Hints

1. Wait, maybe you can be the owner?

## Useful Tools

- `cast`
- `curl`
- `web3.py`
- `ethers.js`
- MetaMask or another development wallet

## Flag Format

```text
KiST_CS_CTF{...}
```

## Important

The private key shown on the instance page is a disposable CTF key.
Never use a real wallet private key.

Good luck!
