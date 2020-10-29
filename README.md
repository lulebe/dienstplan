# Dienstplan

Simple (German) Node.js App for work shift scheduling.

##Requirements
1. NodeJS >= v12 & npm/yarn
2. mariadb (or similar db compatible with sequelize) server
3. sendgrid account & api tokens


to start docker mariadb:

    docker run --name mdb-dienstplan -e MYSQL_ROOT_PASSWORD=testpw -d mariadb:10 -p 3306:3306

to set up database:

    npm run dbinit

then adjust config.js to your liking and start app via:

    npm start