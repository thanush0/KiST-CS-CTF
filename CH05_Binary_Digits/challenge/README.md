# Binary Digits

**Category:** Forensics  
**Difficulty:** Easy

This file doesn't look like much... just a bunch of `1`s and `0`s.

But maybe it's not just random noise.

Can you recover anything meaningful from this?

## Files

- `digits.bin` — a file containing only binary digits

## Objective

Recover the hidden message from the provided file.

The final answer is the flag.

## Hints

1. It's not necessarily text just because the file contains `1`s and `0`s.
2. Eight bits make a byte.
3. File signatures can help you identify what you recovered.

## Flag Format

```text
KiTS_CS_CTF{...}
```

## Suggested Tools

- `file`
- `xxd`
- Python
- `strings`
- `binwalk`
- an image viewer

## Learning Objectives

- Binary-to-byte conversion
- File signatures / magic bytes
- Recovering files from raw binary data
- Basic forensic analysis

Good luck!
