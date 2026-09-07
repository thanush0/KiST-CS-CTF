# KiTS CS CTF — Printer Shares 3

This is an isolated SMB/cron challenge.

Participant workflow:

1. Launch the challenge instance in CTFd.
2. Enumerate the SMB service on the supplied port.
3. Discover the public `shares` share.
4. Inspect `script.sh` and `cron.log`.
5. Determine that `script.sh` is executed periodically.
6. Abuse the writable share to replace the script.
7. Wait for the scheduled execution.
8. Read the resulting output from `cron.log`.
9. Submit the recovered `KiTS_CS_CTF{...}` flag.

Do not give participants `SOLUTION.md`, `flag.txt`, or organizer files.
