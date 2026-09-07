# Compress and Attack — KiTS CS CTF

Category: Cryptography
Difficulty: Hard

Recover the hidden flag using the compression-length oracle.

The service compresses `flag + user_input`, encrypts the compressed result with
Salsa20, and reveals the encrypted-data length.

The participant flag format is `KiTS_CS_CTF{...}`.

## Organizer setup

```bash
pip3 install pycryptodome
python3 compress_and_attack.py
```

For a network deployment, expose the process through your CTF service wrapper.
Do not distribute the `flag` file.

## Intended vulnerability

Compression happens before encryption:

`compress(flag + user_input) -> Salsa20 -> ciphertext`

Salsa20 does not hide the length of the compressed plaintext. Matching guesses
can therefore produce different compressed lengths, creating a compression
oracle that can reveal the flag character-by-character.
