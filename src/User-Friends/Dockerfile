FROM node

WORKDIR /app

# build tools
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

#dependencies
COPY package.json .

RUN npm install

RUN npm install jsonwebtoken

# trying to fix an issue i think related to bind volume
#RUN npm install bcrypt

EXPOSE 8080

CMD ["npm", "run", "start"]
