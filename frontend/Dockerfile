FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Production stage ----------
FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]