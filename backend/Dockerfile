FROM node:12
WORKDIR /use/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
RUN npm install -g nodemon
CMD [ "npm", "run", "start:prod" ]

