FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update &&     apt-get install -y --no-install-recommends samba cron &&     rm -rf /var/lib/apt/lists/*

COPY smb.conf /etc/samba/smb.conf
COPY entrypoint.sh /entrypoint.sh
COPY flag.txt script.sh /opt/challenge/

RUN chmod +x /entrypoint.sh /opt/challenge/script.sh

EXPOSE 445

CMD ["/entrypoint.sh"]
