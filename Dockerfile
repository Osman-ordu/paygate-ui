FROM node:20.11.0-alpine  as build
ARG VITE_API_BASE_URL
ARG VITE_SOCKET_TICKERS_URL
ARG VITE_SOCKET_MARKET_DATA_URL

WORKDIR /app
COPY . ./
RUN npm install
RUN npm run build

FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /etc/nginx/nginx.conf
COPY nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]