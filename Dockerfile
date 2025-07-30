FROM node:23.11.1-alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

ENV PORT=3000

EXPOSE $PORT

CMD ["npm", "run", "dev"]
