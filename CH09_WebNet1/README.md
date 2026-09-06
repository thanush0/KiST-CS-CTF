# WebNet1

**Forensics — Hard**  
**KiST CS CTF**

## Challenge

We found a packet capture and an RSA private key. The network traffic contains an HTTPS session, but the useful information is hidden inside the encrypted traffic.

**Recover the flag.**

## Files

- `capture.pcap` — captured network traffic
- `picopico.key` — RSA private key used by the TLS server

## Hints

1. Try using a tool like Wireshark.
2. How can you decrypt the TLS stream?
3. After decrypting HTTPS, don't stop at the first flag-looking string.
4. Look at the HTTP objects transferred by the server.

## Objective

Decrypt the TLS traffic, inspect the recovered HTTP data, and find the real CTF flag.

## Suggested tools

- Wireshark
- tshark
- strings
- file
- OpenSSL

## Flag format

`KiTS_CS_CTF{...}`
