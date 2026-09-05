# StegoRSA

**Category:** Cryptography  
**Difficulty:** Easy

## Description

A message has been encrypted using RSA.

The public key is gone... but someone might have been careless with
the private key.

Can you recover the key and decrypt the message?

## Files

You are given the following files:

- `flag.enc` — encrypted message
- `image.jpg` — an image that may contain useful information

## Objective

Recover the hidden RSA private key and use it to decrypt the encrypted
message.

The final answer is the flag.

## Hints

### Hint 1

Metadata can tell you more than you expect.

### Hint 2

Hex can be turned back into a key file.

## Tools

You may find the following tools useful:

- `exiftool`
- `xxd`
- `openssl`

## Flag Format

```text
KiST_CS_CTF{...}