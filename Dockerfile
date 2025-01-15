FROM node:16.15.1-slim AS build-stage
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

FROM nginx:1.27.3 AS production-stage
RUN mkdir /usr/src/app
COPY --from=build-stage /usr/src/app/dist /usr/src/app
COPY nginx.conf /etc/nginx/nginx.conf