# Transformation

**Category:** Reverse Engineering
**Difficulty:** Easy
**Flag Format:** `KiTS_CS_CTF{...}`

---

## Challenge

I wonder what this really is...

Something has happened to the flag, but the result doesn't look like a normal text file.

Can you figure out the transformation and recover the original flag?

You are given the following transformation:

```python
''.join([
    chr((ord(flag[i]) << 8) + ord(flag[i + 1]))
    for i in range(0, len(flag), 2)
])
```

Your task is to reverse the transformation and recover the original flag.

---

## Files

You are provided with:

```text
enc
```

The `enc` file contains the transformed flag.

---

## Hints

### Hint 1

You may find some decoders online.

### Hint 2

Look carefully at what happens to every **two characters**.

### Hint 3

What does the `<< 8` operation do?

### Hint 4

The transformed output contains Unicode characters. Don't assume that each character corresponds to one byte.

---

## Objective

Recover the original flag from the provided `enc` file.

The flag follows this format:

```text
KiTS_CS_CTF{...}
```

---

## Useful Concepts

You may want to investigate:

* Python `ord()`
* Python `chr()`
* Bit shifting
* The `<<` operator
* Unicode
* Base conversions
* Reversing mathematical transformations
* Reading Unicode files correctly

---

## Important

The `enc` file is **not necessarily intended to be read as ordinary ASCII text**.

If you use a hex editor or `xxd`, remember that the file may contain a UTF-8 representation of Unicode characters.

Consider working with the file as Unicode characters rather than attempting to split the raw file bytes into pairs.

---

## Goal

Find the original flag:

```text
KiTS_CS_CTF{...}
```

and submit it to the CTF platform.

Good luck! 🔍
