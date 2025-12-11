FROM node:18-alpine

# Configure npm for better performance and reliability
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

RUN npm i -g @nestjs/cli typescript ts-node

COPY package*.json /tmp/app/
# Install with retry logic and better error handling
RUN cd /tmp/app && \
    npm install --legacy-peer-deps --prefer-offline --no-audit || \
    (sleep 5 && npm install --legacy-peer-deps --prefer-offline --no-audit) || \
    (sleep 10 && npm install --legacy-peer-deps --prefer-offline --no-audit)

COPY . /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app
COPY ./wait-for-it.sh /opt/wait-for-it.sh
COPY ./startup.dev.sh /opt/startup.dev.sh
RUN sed -i 's/\r//g' /opt/wait-for-it.sh
RUN sed -i 's/\r//g' /opt/startup.dev.sh

WORKDIR /usr/src/app
RUN rm -rf .env && cp env-example .env
RUN npm run build
RUN ["chmod", "+x", "/opt/wait-for-it.sh"]

CMD ["/bin/bash", "/opt/startup.dev.sh"]

