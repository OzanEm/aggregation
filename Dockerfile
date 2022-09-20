FROM node as agg

WORKDIR /usr/src/app

COPY . .

RUN npm install glob rimraf

RUN npm install --only=development


