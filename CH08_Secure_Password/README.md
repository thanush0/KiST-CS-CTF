# Secure Password Database

**Category:** Reverse Engineering  
**Difficulty:** Medium

I made a new password authentication program that even shows you the password you entered saved in the database! Isn't that cool?

You are given the executable `secure_password_db`.

## Objective

Recover the hidden password/secret and use the program to retrieve the flag.

## Hints

1. How does the hashing algorithm work?
2. Look carefully at the functions that construct the secret.

## Suggested tools

- `file`
- `strings`
- `nm`
- `objdump`
- `gdb`
- Python

## Running

```bash
chmod +x secure_password_db
./secure_password_db
```

Flag format:

```text
KiTS_CS_CTF{...}
```
