FROM node:22-bookworm-slim
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY server.js ./
COPY contracts ./contracts
COPY public ./public
RUN useradd -r -u 10001 ctf && chown -R ctf:ctf /app
USER ctf
EXPOSE 54836 8545
CMD ["node", "server.js"]
