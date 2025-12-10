/opt/wait-for-it.sh mysql:3306 -t 30 -- npm run migration:up && npm run seed:run
npm run start:prod
