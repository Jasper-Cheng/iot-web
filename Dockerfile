# 多阶段构建：Node 构建 + Nginx 托管
# 更新后运行：docker-compose up -d --build

# 构建阶段
FROM node:22-alpine AS build

WORKDIR /app

# 前端构建时注入的变量（Vite 仅读取 VITE_ 前缀）
ARG VITE_MQTT_WS_URL=ws://localhost:8884/mqtt
ARG VITE_API_BASE_URL=
ENV VITE_MQTT_WS_URL=$VITE_MQTT_WS_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# 运行阶段（nginx托管）
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
