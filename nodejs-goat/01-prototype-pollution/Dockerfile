FROM node:20-alpine
WORKDIR /app
RUN echo "flag{f1lt3r_und3rscor3_pr0t0_k3y}" > /root/flag.txt
COPY package.json .
RUN npm install --production
COPY . .
EXPOSE 4001
CMD ["node", "server.js"]
