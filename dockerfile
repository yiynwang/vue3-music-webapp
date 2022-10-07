
# 选择node版本为14-14-alpine
# as builder 为下一个阶段构建的COPY使用
FROM node:14-alpine

# ARG 参数通过docker-compose传递进来
ARG ACCESS_KEY_ID
ARG ACCESS_KEY_SECRET
ARG ENDPOINT
# 配置构建镜像中的环境变量
# ENV BASE_URL https://vue-music-app.oss-cn-hangzhou.aliyuncs.com/ 


# 指定工作目录
WORKDIR /code

# 为了更好的缓存，把它放在前边
RUN wget http://gosspublic.alicdn.com/ossutil/1.7.14/ossutil64 -O /usr/local/bin/ossutil \
    && chmod 755 /usr/local/bin/ossutil \
    && ossutil config -i $ACCESS_KEY_ID -k $ACCESS_KEY_SECRET -e $ENDPOINT

# 单独分离 package.json，是为了安装依赖可最大限度利用缓存
# 添加依赖文件到工作目录
ADD package.json /code/

# 安装全部依赖
RUN yarn

ADD . /code

RUN npm run build && npm run oss:script

# COPY --from=builder code/dist code/backend 容器启动时执行的命令
CMD yarn prod:server
