#!/bin/bash
# Organizer-provided debug script.
# It runs every minute. Participants are expected to discover that this
# file is writable through the public SMB share.
echo "printer debug: $(date)" >> /srv/shares/cron.log
