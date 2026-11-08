FROM node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl unzip && rm -rf /var/lib/apt/lists/*
WORKDIR /build
COPY . /build/custom
RUN curl -fL --retry 3 https://github.com/sti-technical/shopnest-ecommerce/archive/refs/heads/main.zip -o original.zip \
 && unzip -q original.zip \
 && mv shopnest-ecommerce-main /app \
 && cd /app && npm ci --omit=dev \
 && node /build/custom/customize.js
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node","server.js"]
