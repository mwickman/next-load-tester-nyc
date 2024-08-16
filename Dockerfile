FROM node:20

RUN apt update && apt install -y apache2-utils

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json yarn.lock* package-lock.json* ./

RUN yarn

# add app to container and attempt build
COPY . ./
RUN yarn build || true

CMD ["yarn", "start"]
