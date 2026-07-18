FROM node:22-bookworm-slim AS base

WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ pkg-config \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run generate:schemas && npm run build
RUN npm prune --omit=dev

EXPOSE 1337

CMD ["npm", "run", "start"]
