# Password Profiler

**Category:** General Skills
**Difficulty:** Easy
**Flag Format:** `KiTS_CS_CTF{...}`

---

## Challenge

We intercepted a suspicious password hash from a system.

Unfortunately, the original password was not recovered.

However, we discovered some personal information about the account owner.

Your task is to use this information to generate a custom password list and determine which password produces the intercepted SHA-1 hash.

Can you recover the password?

---

## Files

You are provided with three files:

```text
userinfo.txt
hash.txt
check_password.py
```

### `userinfo.txt`

Contains personal information about the target.

### `hash.txt`

Contains the SHA-1 hash of the target's password.

### `check_password.py`

A Python script that checks candidate passwords against the SHA-1 hash.

---

## Objective

Recover the original password and submit it using the required flag format:

```text
KiTS_CS_CTF{password}
```

---

## Hints

### Hint 1

People often create passwords using information that is easy for them to remember.

### Hint 2

Try generating a custom wordlist from the information provided about the target.

### Hint 3

CUPP can generate password lists based on personal information.

### Hint 4

The supplied Python program reveals which hashing algorithm is being used.

---

## Useful Tools

You may find the following useful:

* CUPP
* Python
* `sha1sum`
* `openssl`
* Linux command-line utilities

---

## Suggested Approach

Start by examining all three files:

```bash
cat userinfo.txt
cat hash.txt
cat check_password.py
```

Determine:

1. What personal information is available?
2. What hashing algorithm is being used?
3. What format does the password wordlist need?
4. How can you generate likely passwords from the available information?

---

## SHA-1

The supplied checker uses SHA-1 to calculate the hash of each candidate password.

A SHA-1 hash looks similar to:

```text
40 hexadecimal characters
```

For example:

```text
0123456789abcdef0123456789abcdef01234567
```

You can calculate a SHA-1 hash on Linux with:

```bash
echo -n "password" | sha1sum
```

---

## Password Wordlist

The checker expects one candidate password per line.

Example:

```text
alice
Alice
Alice1990
alice1990
Alice_1990
...
```

Your goal is to generate candidates based on the personal information supplied in `userinfo.txt`.

---

## Goal

Find the password whose SHA-1 hash matches the hash contained in:

```text
hash.txt
```

Then submit:

```text
KiTS_CS_CTF{<password>}
```

---

## Important

Do not modify the target hash.

Do not assume that the password is simply one of the personal details.

Consider combinations involving:

* names
* nicknames
* dates
* years
* numbers
* separators
* capitalization
* common password patterns

---

## Good Luck

Can you profile the target well enough to recover the password?

```text
Personal Information
        ↓
Custom Wordlist
        ↓
SHA-1
        ↓
Hash Match
        ↓
Password
        ↓
KiTS_CS_CTF{...}
```
