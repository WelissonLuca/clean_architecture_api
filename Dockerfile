FROM node:16-alpine
WORKDIR /usr/src/clean-node-api
COPY ./package.json .
RUN yarn install --only=prod --frozen-lockfile
COPY ./dist ./dist
EXPOSE 5000
CMD ["yarn", "start"]