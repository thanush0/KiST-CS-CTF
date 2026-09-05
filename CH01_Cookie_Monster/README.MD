# 🍪 Cookie Monster's Secret Recipe

**Category:** Web Exploitation
**Difficulty:** Easy
**Challenge Type:** Cookie / Web Storage
**Flag Format:** `KiST_CS_CTF{...}`

---

## 📖 Challenge Description

Cookie Monster has hidden his top-secret cookie recipe somewhere on his website.

He claims that a password is not necessary and that he only needs his cookies.

Can you inspect the website carefully and uncover the secret recipe?

---

## 🎯 Objective

Find the hidden flag stored in the website's cookies.

The flag follows this format:

```text
KiST_CS_CTF{...}
```

---

## 💡 Hints

### Hint 1

Sometimes the most important information is hidden in plain sight.

Have you checked all parts of the webpage?

### Hint 2

Cookies aren't just for eating — they're also used in web technologies.

### Hint 3

Web browsers provide developer tools that allow you to inspect cookies and other information stored by websites.

---

## 🧑‍💻 Intended Solution

Open the challenge website.

The initial page contains a login form:

```text
Cookie Monster's Secret Recipe

Username
Password

[ Login ]
```

The username and password are not the actual solution.

Submit any credentials.

The application displays:

```text
Access Denied

Cookie Monster says:

"Me no need password. Me just need cookies!"

Hint: Have you checked your cookies lately?
```

This indicates that the important information is stored in a cookie.

---

## 🔍 Step 1 — Open Developer Tools

In the browser, press:

```text
F12
```

Alternatively:

```text
Right Click → Inspect
```

---

## 🍪 Step 2 — Inspect Cookies

In Chrome/Chromium:

```text
Developer Tools
    ↓
Application
    ↓
Storage
    ↓
Cookies
    ↓
Challenge Website
```

Look for a cookie named:

```text
cookie_recipe
```

The value will look similar to:

```text
S2lTVF9DU19DVEZ7YzAwa2...
```

The exact value will be different for each session.

---

## 🔐 Step 3 — Identify the Encoding

The cookie value looks like Base64.

Base64 commonly contains characters such as:

```text
A-Z
a-z
0-9
+
/
=
```

The trailing `=` is also a common indication of Base64 padding.

---

## 🧪 Step 4 — Decode the Cookie

Copy the value of:

```text
cookie_recipe
```

Then decode it.

### Linux

```bash
echo 'COOKIE_VALUE' | base64 -d
```

### Example

```bash
echo 'S2lTVF9DU19DVEZ7YzAwa2llX21vbnN0ZXJfYWJjMTIzfQ==' | base64 -d
```

The decoded result will be:

```text
KiST_CS_CTF{c00kie_monster_abc123}
```

Submit the decoded value as the flag.

---

# 🏁 Flag Format

The challenge uses:

```text
KiST_CS_CTF{...}
```

For example:

```text
KiST_CS_CTF{c00kie_monster_abc123}
```

**Do not submit the example above unless it is actually the value obtained from your session.**

---

# 🔄 Session Isolation

This challenge supports multiple students accessing the challenge simultaneously.

Each browser receives its own Flask session.

For example:

```text
Student A
    ↓
Session A
    ↓
cookie_recipe = FLAG_A


Student B
    ↓
Session B
    ↓
cookie_recipe = FLAG_B


Student C
    ↓
Session C
    ↓
cookie_recipe = FLAG_C
```

Therefore, different students receive different flags.

Example:

```text
Student A:
KiST_CS_CTF{c00kie_monster_91a2b4c8}

Student B:
KiST_CS_CTF{c00kie_monster_7f31d902}

Student C:
KiST_CS_CTF{c00kie_monster_e81264aa}
```

This prevents all participants from receiving one globally hard-coded flag.

---

# 🐳 Deployment

## Requirements

Install:

* Docker
* Docker Compose

Check Docker:

```bash
docker --version
```

Check Docker Compose:

```bash
docker compose version
```

---

## Build

From the challenge directory:

```bash
docker compose build
```

---

## Start

```bash
docker compose up -d
```

Check the container:

```bash
docker compose ps
```

The expected state is:

```text
cookie-monster    Up (healthy)
```

---

## Access

The default configuration exposes the challenge on port `5000`.

Open:

```text
http://localhost:5000
```

If deployed on a server:

```text
http://SERVER_IP:5000
```

---

# 🩺 Health Check

The challenge provides:

```text
/health
```

Example:

```bash
curl http://localhost:5000/health
```

Expected response:

```json
{
  "status": "healthy"
}
```

Docker uses this endpoint for the container health check.

---

# 📁 Project Structure

```text
cookie-monster/
│
├── app.py
│
├── requirements.txt
│
├── Dockerfile
│
├── docker-compose.yml
│
└── templates/
    │
    ├── index.html
    │
    └── denied.html
```

---

# 🔧 Challenge Architecture

The application uses:

```text
Browser
   │
   │ HTTP
   ▼
┌───────────────────────┐
│ Flask / Gunicorn      │
│                       │
│  Session Initialization
│          │            │
│          ▼            │
│  Random Session ID    │
│          │            │
│          ▼            │
│  Unique Flag          │
│          │            │
│          ▼            │
│  Base64 Encoding      │
│          │            │
│          ▼            │
│  cookie_recipe        │
└───────────────────────┘
```

The challenge deliberately places the encoded flag in a client-visible cookie.

---

# 🔐 Security / Isolation Features

The Docker configuration includes:

* Non-root application user
* `no-new-privileges`
* Dropped Linux capabilities
* Read-only container filesystem
* Temporary filesystem for `/tmp`
* CPU limit
* Memory limit
* Docker health check
* Gunicorn workers
* Independent browser sessions

These settings are intended to reduce the impact of a compromised challenge container.

---

# 🧪 Local Testing

Start the application:

```bash
docker compose up -d
```

Check:

```bash
docker compose ps
```

Then visit:

```text
http://localhost:5000
```

Submit:

```text
username: test
password: test
```

Open:

```text
F12
→ Application
→ Cookies
```

Find:

```text
cookie_recipe
```

Copy its value and decode:

```bash
echo 'COOKIE_VALUE' | base64 -d
```

You should receive:

```text
KiST_CS_CTF{c00kie_monster_RANDOM}
```

---

# 👥 Multi-User Testing

To verify session isolation:

1. Open the challenge in Chrome.
2. Obtain the `cookie_recipe` value.
3. Open an Incognito window.
4. Visit the challenge again.
5. Obtain the second cookie.
6. Decode both values.

The flags should be different.

Example:

```text
Browser 1:
KiST_CS_CTF{c00kie_monster_a1234567}

Browser 2:
KiST_CS_CTF{c00kie_monster_b7654321}
```

---

# 🛑 Stop the Challenge

```bash
docker compose down
```

---

# 🔄 Rebuild After Changes

If you modify the application:

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

View logs:

```bash
docker compose logs -f
```

---

# 🧹 Remove Everything

To remove the container and associated challenge resources:

```bash
docker compose down --rmi local
```

---

# 📝 Organizer Notes

The intended vulnerability is **information disclosure through a client-side cookie**.

The cookie is:

```text
cookie_recipe
```

Its value is:

```text
Base64(flag)
```

The challenge is intentionally designed so that:

```text
Password ≠ Solution
Cookie = Solution
```

The participant should discover this through the page message and browser developer tools.

---

## 🚩 Author Flag Pattern

```text
KiST_CS_CTF{c00kie_monster_<random_value>}
```

The `<random_value>` is generated independently for each session.

---

## ⚠️ Important Deployment Note

Do not expose Flask's development server directly for a production CTF.

This project uses Gunicorn:

```text
gunicorn
    ↓
Flask application
```

The provided Docker configuration runs:

```text
2 workers
4 threads per worker
```

which allows multiple participants to access the challenge concurrently.

---

## 🎓 Learning Objectives

After completing this challenge, participants should understand:

1. What HTTP cookies are.
2. How websites store client-side information.
3. How to inspect cookies using browser Developer Tools.
4. How to recognize Base64-encoded data.
5. How to decode Base64.
6. Why sensitive information should not be stored directly in client-controlled cookies.
7. The difference between encoding and encryption.

---

## 🏆 Challenge Summary

```text
Find the cookie
      ↓
cookie_recipe
      ↓
Copy value
      ↓
Recognize Base64
      ↓
Decode
      ↓
KiST_CS_CTF{...}
      ↓
Submit flag
```

**Good luck, cookie detective! 🍪**
