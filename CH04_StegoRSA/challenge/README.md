# StegoRSA

**Category:** Cryptography  
**Difficulty:** Easy

A message has been encrypted using RSA. The public key is gone...
but someone might have been careless with the private key.

Can you recover it and decrypt the message?

## Files

- `flag.enc` — RSA-encrypted flag
- `image.jpg` — an image containing a hidden clue

## Hints

1. Metadata can tell you more than you expect.
2. Hex can be turned back into a key file.

## Objective

Recover the RSA private key hidden in the image metadata and use it
to decrypt `flag.enc`.

Expected flag format:

```text
KiST_CS_CTF{...}
```

## Suggested tools

- `exiftool`
- `xxd`
- `openssl`

Good luck!
