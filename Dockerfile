FROM node:22-alpine

WORKDIR /usr/src/app

# Update apk packages to reduce vulnerabilities
RUN apk update && apk upgrade

COPY package*.json ./

RUN npm install --frozen-lockfile

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]