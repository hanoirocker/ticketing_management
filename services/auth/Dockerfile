FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
COPY . /app

CMD ["npm", "start"]
