FROM node:12-alpine

ENV NODE_ENV=production

COPY . .
RUN yarn build

EXPOSE 3000

CMD ["yarn", "prod"]
