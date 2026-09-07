# ASCII FTW — KiTS CS CTF

## Challenge
This program has constructed the flag using hexadecimal ASCII values. Identify the flag text by disassembling the program.

## Participant procedure
1. Download `asciiftw`.
2. Make it executable: `chmod +x asciiftw`.
3. Identify it with `file asciiftw`.
4. Disassemble it using `objdump -d -M intel asciiftw` or open it in Ghidra.
5. Inspect `main` and identify the hexadecimal byte values used to construct the flag.
6. Convert the hexadecimal values to ASCII.
7. Submit the resulting `KiTS_CS_CTF{...}` flag to CTFd.

## Example tools
```bash
file asciiftw
objdump -d -M intel asciiftw | less
strings asciiftw
```

The intended solution is static reverse engineering; no network service is required.
