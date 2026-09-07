FROM python:3.12-slim
WORKDIR /app
RUN pip install --no-cache-dir pycryptodome
COPY compress_and_attack.py flag /app/
CMD ["python3", "-u", "/app/compress_and_attack.py"]
