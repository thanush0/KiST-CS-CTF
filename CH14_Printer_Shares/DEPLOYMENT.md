# Organizer Deployment

From this directory:

```bash
cd challenge
docker compose build
docker compose up -d
docker compose ps
```

The SMB service is exposed on TCP 51283.

Test from the host:

```bash
smbclient -L //127.0.0.1 -p 51283 -N
smbclient //127.0.0.1/shares -p 51283 -N
```

Inside the public share:

```text
ls
get script.sh
get cron.log
```

To stop:

```bash
docker compose down
```

The participant should receive only the challenge description and instance
connection details. Keep `flag.txt` and `SOLUTION.md` organizer-only.
