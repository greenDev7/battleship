# 1 build

# FROM node:16.15.1-slim
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm install
# RUN npm install -g serve
# COPY ./ .
# RUN npm run build
# EXPOSE 3000
# CMD ["serve", "-s", "dist"]



# 2 copying dist folder

# FROM node:16.15.1-slim
# WORKDIR /usr/src/app
# RUN npm install -g serve
# EXPOSE 3000
# CMD ["serve", "-s", "dist"]


# 3 Using Nginx

FROM nginx:1.27.3
WORKDIR /usr/src/app
COPY ./dist /usr/src/app
COPY nginx.conf /etc/nginx/nginx.conf