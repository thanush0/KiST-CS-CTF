FLAG = "KiST_CS_CTF{tr4nsf0rm_m3!}"

if len(FLAG) % 2 != 0:
    raise ValueError(
        f"Flag must contain an even number of characters. "
        f"Current length: {len(FLAG)}"
    )

encoded = ''.join(
    chr((ord(FLAG[i]) << 8) + ord(FLAG[i + 1]))
    for i in range(0, len(FLAG), 2)
)

with open("enc", "w", encoding="utf-8") as f:
    f.write(encoded)

print("Generated enc successfully.")
print(f"Flag length: {len(FLAG)}")