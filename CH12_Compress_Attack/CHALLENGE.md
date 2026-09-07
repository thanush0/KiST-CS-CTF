# Compress and Attack

## Cryptography — Hard

Can you recover the secret hidden inside this encryption service?

The service lets you submit text and returns encrypted data together with its
length.

### Hints

1. The flag contains uppercase/lowercase letters, numbers, underscores, and
   curly brackets.
2. Think about what happens when data is compressed before it is encrypted.
3. The encryption hides the data, but does it hide the length?

### Intended solve

```text
your input + secret flag
        |
        v
      zlib
        |
        v
  compressed data
        |
        v
      Salsa20
        |
        v
ciphertext + length
```

Use the returned length as a compression oracle. Guess the next character and
compare the resulting compressed lengths until the complete
`KiTS_CS_CTF{...}` flag is recovered.
