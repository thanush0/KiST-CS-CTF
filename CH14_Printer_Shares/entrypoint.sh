#!/bin/bash
set -e

mkdir -p /srv/shares /challenge/secure-shares /run/samba
cp /opt/challenge/flag.txt /challenge/secure-shares/flag.txt
cp /opt/challenge/script.sh /srv/shares/script.sh

touch /srv/shares/cron.log
chmod 666 /srv/shares/script.sh /srv/shares/cron.log
chmod 755 /srv/shares

# Keep the private directory inaccessible to the guest account.
chmod 700 /challenge/secure-shares
chown root:root /challenge/secure-shares /challenge/secure-shares/flag.txt

# Run the public-share script every minute as root and append its output.
cat >/etc/cron.d/printer-debug <<'EOF'
* * * * * root /srv/shares/script.sh >> /srv/shares/cron.log 2>&1
EOF
chmod 644 /etc/cron.d/printer-debug

# Samba needs a valid local account for the private share. It is not exposed
# to guests, but the participant does not need these credentials.
if ! id admin >/dev/null 2>&1; then
    useradd -M -s /usr/sbin/nologin admin
fi
(echo 'AdminOnly-Local-DoNotShare'; echo 'AdminOnly-Local-DoNotShare') | smbpasswd -s -a admin >/dev/null

service cron start
exec smbd --foreground --no-process-group --configfile=/etc/samba/smb.conf
