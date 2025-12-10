FROM node:18-alpine

#Specify a working directory
WORKDIR /usr/app

#Copy the dependencies file
COPY ./package.json ./
COPY ./package-lock.json* ./

#Install dependencies
RUN npm install

#Copy remaining files
COPY ./ ./

EXPOSE 8082

#Default command
CMD ["npm","start"]