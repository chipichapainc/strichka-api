FROM node:18 as builder
WORKDIR /build

COPY . .

RUN npm i -g @nestjs/cli
RUN npm ci
RUN npm run build

# Second stage: create the final image
FROM node:18-alpine
ENV NODE_ENV production
USER node
WORKDIR /usr/src/app

COPY --chown=node:node --from=builder /build/dist ./dist
COPY --chown=node:node --from=builder /build/node_modules ./node_modules
COPY --chown=node:node --from=builder /build/package.json /build/.en[v] ./

CMD ["npm", "run", "start:prod"]