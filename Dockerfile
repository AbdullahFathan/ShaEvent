

FROM node:22-alpine


WORKDIR /usr/src/app


RUN apk add --no-cache openssl


COPY package*.json ./
RUN npm install

COPY . .

EXPOSE ${PORT}

CMD ["sh", "-c", "npx prisma generate && npm run dev"]