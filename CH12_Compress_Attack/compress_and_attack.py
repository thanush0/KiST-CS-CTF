#!/usr/bin/python3 -u
import zlib
import os
from Crypto.Cipher import Salsa20

flag = open("./flag").read().strip()

def compress(text):
    return zlib.compress(text.encode("utf-8"))

def encrypt(plaintext):
    secret = os.urandom(32)
    cipher = Salsa20.new(key=secret)
    return cipher.nonce + cipher.encrypt(plaintext)

def main():
    print("KiTS CS CTF - Compress and Attack")
    print("Recover the secret flag using the compression-length oracle.")
    while True:
        usr_input = input("Enter your text to be encrypted: ")
        compressed_text = compress(flag + usr_input)
        encrypted = encrypt(compressed_text)
        nonce = encrypted[:8]
        encrypted_text = encrypted[8:]
        print(nonce)
        print(encrypted_text)
        print(len(encrypted_text))

if __name__ == '__main__':
    main()
