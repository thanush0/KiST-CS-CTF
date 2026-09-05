#!/usr/bin/env python3

import hashlib

HASH_FILE = "hash.txt"
WORDLIST_FILE = "passwords.txt"


def load_hash():
    with open(HASH_FILE, "r", encoding="utf-8") as f:
        return f.read().strip()


def crack_password(target_hash):
    with open(
        WORDLIST_FILE,
        "r",
        encoding="utf-8",
        errors="ignore"
    ) as f:

        for password in f:
            password = password.strip()

            if not password:
                continue

            password_hash = hashlib.sha1(
                password.encode()
            ).hexdigest()

            if password_hash == target_hash:
                return password

    return None


if __name__ == "__main__":

    target_hash = load_hash()

    result = crack_password(target_hash)

    if result:
        print(f"Password found: KiST_CS_CTF{{{result}}}")
    else:
        print("No match found.")