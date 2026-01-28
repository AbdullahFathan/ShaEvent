

FROM node:22-alpine


WORKDIR /usr/src/app


RUN apk add --no-cache openssl


COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE ${PORT}

CMD ["npm", "run", "dev"]