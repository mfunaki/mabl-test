FROM nginx:alpine

COPY index.html /usr/share/nginx/html/
COPY 001/ /usr/share/nginx/html/001/
COPY 002/ /usr/share/nginx/html/002/
COPY 003/ /usr/share/nginx/html/003/
COPY 004/ /usr/share/nginx/html/004/
COPY 005/ /usr/share/nginx/html/005/
COPY 006/ /usr/share/nginx/html/006/
COPY 007/ /usr/share/nginx/html/007/
COPY 008/ /usr/share/nginx/html/008/
COPY 009/ /usr/share/nginx/html/009/
COPY 010/ /usr/share/nginx/html/010/
COPY 011/ /usr/share/nginx/html/011/

EXPOSE 80
