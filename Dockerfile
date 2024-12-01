FROM node:20.13.1 AS builder

WORKDIR /app

COPY . .
COPY package.json yarn.lock ./

RUN yarn install
RUN npx prisma generate
RUN yarn build

# Runner
FROM node:20.13.1 AS runner

WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma ./prisma

RUN yarn install --production
RUN npx prisma generate

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env .

RUN echo '#!/bin/sh\nnpx prisma migrate deploy\nnode dist/server/index.js' > /app/start.sh

RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]