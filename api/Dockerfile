FROM oven/bun:1.2-alpine

WORKDIR /app

COPY package.json .

RUN bun install

COPY . .

EXPOSE 3000

# Use the npm script directly which already has the --hot flag
CMD [ "bun", "dev" ]