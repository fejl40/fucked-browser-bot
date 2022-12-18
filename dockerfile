FROM node AS build

WORKDIR /app
RUN chmod 755 /app

COPY ./ ./

RUN npm install
RUN npm run lint
RUN npm run build
RUN rm -drf ./node_modules
RUN npm install --omit=dev

FROM alpine AS publish

WORKDIR /app

RUN apk update
RUN apk add --update nodejs
RUN apk add --update npm
RUN apk add --update chromium

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV CHROME_BIN=/usr/bin/chromium-browser

COPY --from=build /app/node_modules/ ./node_modules/
COPY --from=build /app/logs/ ./logs/
COPY --from=build /app/dist/ ./

EXPOSE 3000

ENTRYPOINT [ "node", "index.js" ]