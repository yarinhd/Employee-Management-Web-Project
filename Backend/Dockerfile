FROM node:latest
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
CMD npm run build_and_start
EXPOSE 5000
