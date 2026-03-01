FROM node:20-alpine
WORKDIR /app
RUN echo "flag{us3r_1nput_4s_t3mpl4t3_n0t_d4t4}" > /root/flag.txt
COPY package.json .
RUN npm install --production
COPY . .
EXPOSE 4004
CMD ["node", "server.js"]
