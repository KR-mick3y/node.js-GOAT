FROM node:20-alpine
WORKDIR /app
RUN echo "flag{n3v3r_us3_exec_w1th_us3r_1nput}" > /root/flag.txt
COPY package.json .
RUN npm install --production
COPY . .
EXPOSE 4002
CMD ["node", "server.js"]
