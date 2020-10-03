FROM node:12
WORKDIR /usr/src/frontend
COPY package*.json ./
COPY . ./
RUN npm install --save
RUN npm install -g serve
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]