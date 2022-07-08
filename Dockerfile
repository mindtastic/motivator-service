FROM node:18-alpine3.16 as ts-builder

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json .
COPY ./src ./src
RUN npm ci
RUN npx tsc

FROM node:18-alpine3.16
WORKDIR /app
COPY package*.json ./
COPY --from=ts-builder ./app/dist ./
RUN npm ci --production

CMD [ "node", "--experimental-specifier-resolution=node", "index.js"]