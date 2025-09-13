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
RUN npm install -g typescript

EXPOSE 8084

CMD ["npm", "run" ,"start"]