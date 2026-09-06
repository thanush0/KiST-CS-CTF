# 🏴‍☠️ KiST CS CTF

<p align="center">
  <b>KiST CS CTF — Cyber Security Capture The Flag Challenges</b>
</p>

<p align="center">
  Learn • Break • Analyze • Capture the Flag
</p>

---

## 📖 About

**KiST CS CTF** is a collection of cybersecurity Capture The Flag (CTF) challenges designed for students, beginners, and security enthusiasts.

The challenges cover multiple areas of cybersecurity, including:

* 🔐 Cryptography
* 🔎 Forensics
* 🔬 Reverse Engineering
* 🌐 Web Security
* ⛓️ Blockchain / Smart Contracts
* 🧩 Miscellaneous Security Concepts

The challenges are designed to encourage practical security analysis rather than simply memorizing techniques.

---

## 🎯 Flag Format

All KiST CS CTF flags follow this format:

```text
KiTS_CS_CTF{...}
```

Example:

```text
KiTS_CS_CTF{example_flag}
```

---

## 📂 Repository Structure

Challenges are organized into individual challenge directories.

```text
KiST-CS-CTF/
│
├── CH01_*/
│   └── challenge/
│
├── CH02_*/
│   └── challenge/
│
├── CH03_*/
│   └── challenge/
│
├── ...
│
├── CH09_*/
│   └── challenge/
│
└── CH10_*/
    └── challenge/
```

Each challenge normally contains:

```text
challenge/
├── README.md
└── <challenge-files>
```

The `README.md` inside each challenge contains the challenge description, hints, objective, and information about the files provided to participants.

---

## 🧩 Challenge Categories

### 🔐 Cryptography

Challenges involving:

* RSA
* Weak cryptographic implementations
* Key recovery
* Mathematical attacks
* Encodings and transformations

Example techniques include:

```text
RSA factorization
Prime recovery
Modular arithmetic
Cryptographic key extraction
```

---

### 🔎 Forensics

Challenges involving:

* Packet captures
* Metadata
* Steganography
* Encoded files
* Binary data
* Network traffic analysis

Common tools include:

```text
Wireshark
tshark
exiftool
strings
xxd
binwalk
```

---

### 🔬 Reverse Engineering

Challenges involving:

* ELF binaries
* Program analysis
* Debugging
* Assembly
* Obfuscated data
* Custom hashing algorithms

Common tools include:

```text
GDB
objdump
strings
ltrace
strace
Ghidra
radare2
```

---

### 🌐 Web Security

Challenges involving:

* HTTP
* Cookies
* Sessions
* Web application behavior
* Client/server communication
* Information disclosure

Common tools include:

```text
Burp Suite
curl
Browser Developer Tools
Wireshark
```

---

### ⛓️ Blockchain

Challenges involving:

* Solidity
* Smart contracts
* Transaction analysis
* Access control
* Ethereum-compatible networks

Common tools include:

```text
Foundry
cast
Anvil
Solidity
Web3 tooling
```

---

## 🛠️ Recommended Tools

A Kali Linux environment is recommended.

Useful tools include:

| Tool       | Purpose                       |
| ---------- | ----------------------------- |
| Wireshark  | Network analysis              |
| GDB        | Binary debugging              |
| Ghidra     | Reverse engineering           |
| strings    | Extract strings from binaries |
| objdump    | Disassembly                   |
| ltrace     | Library-call tracing          |
| strace     | System-call tracing           |
| exiftool   | Metadata analysis             |
| binwalk    | File analysis                 |
| xxd        | Hex/binary analysis           |
| Python 3   | Scripting and automation      |
| OpenSSL    | Cryptography                  |
| Foundry    | Blockchain challenges         |
| Burp Suite | Web security testing          |

---

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/thanush0/KiST-CS-CTF.git
```

Enter the repository:

```bash
cd KiST-CS-CTF
```

List the available challenges:

```bash
find . -maxdepth 2 -type d | sort
```

Enter a challenge:

```bash
cd <challenge-directory>/challenge
```

Read the challenge instructions:

```bash
cat README.md
```

---

## 🧪 Challenge Workflow

A typical challenge workflow is:

```text
        ┌─────────────────┐
        │ Read Challenge  │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Analyze Files   │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Identify Weakness│
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Exploit / Solve │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Recover Flag    │
        └────────┬────────┘
                 │
                 ▼
       KiTS_CS_CTF{...}
```

---

## ⚠️ Important Security Notice

These challenges are intentionally vulnerable.

Only perform attacks against:

* Your own CTF environment
* Challenge instances provided by the CTF
* Systems where you have explicit authorization

Do **not** use techniques learned from these challenges against systems without permission.

---

## 🔒 Organizer Security

Private challenge material should **never** be exposed to participants.

Do not commit:

```text
flag.txt
SOLUTION.md
private keys
organizer/
private_values.txt
server credentials
API tokens
.env files
```

Before publishing the repository, check for accidentally exposed secrets:

```bash
grep -RniE \
'KiTS_CS_CTF\{|PRIVATE_KEY|BEGIN.*PRIVATE|password|secret|token|api_key' \
. --exclude-dir=.git
```

Review the results carefully before making the repository public.

---

## 🧑‍💻 For Challenge Authors

When adding a new challenge, use a structure similar to:

```text
CHXX_Challenge_Name/
└── challenge/
    ├── README.md
    └── challenge-files
```

The challenge README should contain:

```text
Name
Category
Difficulty
Description
Files
Hints
Objective
Flag Format
```

For example:

```markdown
# Challenge Name

## Category

Cryptography

## Difficulty

Medium

## Description

Challenge description goes here.

## Files

- challenge.txt

## Hints

1. Think about how the algorithm works.

## Objective

Recover the flag.

## Flag Format

KiTS_CS_CTF{...}
```

---

## 📊 Difficulty Levels

| Level     | Description                                                        |
| --------- | ------------------------------------------------------------------ |
| 🟢 Easy   | Basic security concepts and straightforward analysis               |
| 🟡 Medium | Requires multiple analysis steps                                   |
| 🔴 Hard   | Requires deeper technical understanding and/or multiple techniques |
| ⚫ Expert  | Advanced exploitation, research, or complex attack chains          |

---

## 🎓 Learning Objectives

KiST CS CTF focuses on practical cybersecurity skills:

* Understanding how vulnerable systems work
* Reading source code
* Analyzing binaries
* Debugging programs
* Understanding network protocols
* Analyzing packet captures
* Breaking weak cryptographic constructions
* Investigating file metadata
* Understanding smart-contract vulnerabilities
* Writing scripts to automate analysis
* Developing an attacker's mindset

---

## 🤝 Contributions

Contributions are welcome.

If you want to contribute a new challenge:

1. Fork the repository.
2. Create a new challenge directory.
3. Add the participant files.
4. Add a clear `README.md`.
5. Test the challenge from a clean environment.
6. Verify that the intended solution works.
7. Ensure that organizer secrets are not exposed.
8. Submit a pull request.

---

## 📝 Challenge Quality Checklist

Before adding a challenge:

* [ ] Challenge has a clear description
* [ ] Category is defined
* [ ] Difficulty is defined
* [ ] Participant files are included
* [ ] Hints are provided
* [ ] Flag uses `KiTS_CS_CTF{...}`
* [ ] Challenge works from a clean environment
* [ ] Intended solution has been tested
* [ ] No organizer flags are exposed
* [ ] No private keys are exposed unnecessarily
* [ ] No credentials or API tokens are committed

---

## 📜 License

This repository is intended for educational and cybersecurity training purposes.

Individual challenge files may have their own licensing or attribution requirements. Check the relevant challenge directory before redistributing individual challenge materials.

---

## 👤 Author

**KiST CS CTF**

GitHub:

https://github.com/thanush0/KiST-CS-CTF

---

## ⭐ Support

If you find this project useful for learning cybersecurity, consider giving the repository a ⭐ on GitHub.

Happy hacking! 🚩

```text
 _  ___ ____ _____   ____ ____    ____ _____ _____
| |/ / |_  |_   _|  / ___/ ___|  / ___|  ___|_   _|
| ' /    | |  | |   \___ \___ \  \___ \ |_    | |
| . \    | |  | |    ___) |__) |  ___) |  _|   | |
|_|\_\  |___| |_|   |____/____/  |____/|_|     |_|

              KiST CS CTF
```
