# 使用包含Node.js的官方基础镜像
FROM node:current-slim

RUN apt-get update && apt-get install -y vim

# 创建并设置容器内应用的工作目录
WORKDIR /usr/app

# 首先复制package.json和package-lock.json
COPY package*.json ./

# 安装项目依赖项
RUN npm install

# 复制项目源码
COPY . .

# 暴露你的应用将要监听的端口，比如Koa默认3000
EXPOSE 7654

# 定义容器启动时执行的命令
CMD [ "npm", "run", "start" ]
