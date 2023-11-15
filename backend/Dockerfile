from node:latest
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

COPY src/insert.ts .

EXPOSE 3000
CMD ["npm", "run", "start"]