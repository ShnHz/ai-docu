
# 设置基础镜像 
FROM nginx:alpine
# 定义作者
MAINTAINER wb.sanghangning@mesg.corp.netease.com
# 将dist文件中的内容复制到 /etc/nginx/html/uzhihui/ 这个目录下面
COPY dist/  /etc/nginx/html/
# 将配置文件中的内容复制到 /etc/nginx 这个目录下面(增加自己的代理及一些配置)
RUN rm -rf /etc/nginx/nginx.conf 
COPY nginx.conf /etc/nginx/nginx.conf

ENV ENVIROMENT = ''
CMD ["/bin/sh", "-c", "sed -i \"s@<html@<html ENVIROMENT=\"$ENVIROMENT\"@\" /etc/nginx/html/index.html; nginx -g \"daemon off;\""]