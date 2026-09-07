# Investigative Reversing 3

**Forensics — Hard**

We recovered a mysterious binary and an image. Something has been hidden inside the image. Can you reverse the binary and recover the secret?

## Files

- `mystery`
- `encoded.bmp`

## Hints

1. You will want to reverse how the LSB encoding works on this problem.
2. The binary knows how the image was encoded. Find the function that handles a character.
3. One hidden character is reconstructed from several image bytes.

## Flag format

`KiTS_CS_CTF{...}`
