FROM node

WORKDIR /NodeSample

COPY . .

EXPOSE 3050

CMD ["node","index.js"]
