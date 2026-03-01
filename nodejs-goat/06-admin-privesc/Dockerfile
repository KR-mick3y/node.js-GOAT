FROM node:20-alpine
WORKDIR /app
RUN echo "JWT_SECRET=s3cr3t_k3y_d0_n0t_sh4r3" > /app/.env
RUN mkdir -p sessions
COPY package.json .
RUN npm install --production
COPY . .
EXPOSE 4007
CMD ["node", "server.js"]
