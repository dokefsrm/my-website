# Stage 1: 构建前端
FROM node:20-alpine AS client-build

WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

# Stage 2: 运行后端（含前端静态文件）
FROM node:20-alpine AS server

WORKDIR /app/server

COPY server/package*.json ./
RUN npm ci --production

COPY server/ ./

# 从 Stage 1 复制前端构建产物
COPY --from=client-build /app/client/dist /app/client/dist

# 创建上传目录（如果不存在）
RUN mkdir -p /app/server/uploads

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "src/index.js"]
