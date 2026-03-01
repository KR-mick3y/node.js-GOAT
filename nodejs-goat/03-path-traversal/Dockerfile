FROM node:20-alpine
WORKDIR /app
RUN echo "flag{p4th_j01n_w1th0ut_r34lp4th_ch3ck}" > /root/flag.txt
COPY package.json .
RUN npm install --production
COPY . .
EXPOSE 4003
CMD ["node", "server.js"]
