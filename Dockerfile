FROM nginx:1.27.3
RUN mkdir /usr/src/app
COPY ./dist /usr/src/app
COPY nginx.conf /etc/nginx/nginx.conf