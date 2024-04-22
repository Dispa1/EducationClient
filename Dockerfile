FROM node:14
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
COPY nginx.conf /etc/nginx/nginx.conf

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]