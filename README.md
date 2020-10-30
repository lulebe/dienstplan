# Dienstplan

Simple (German) Node.js App for work shift scheduling.

## Requirements
1. NodeJS >= v12 & npm/yarn
2. mariadb (currently using v 10.x) (or similar db compatible with sequelize) server
3. sendgrid account & api tokens

## running the App

to start docker mariadb:

    docker run --name mdb-dienstplan -e MYSQL_ROOT_PASSWORD=testpw -d mariadb:10 -p 3306:3306

to set up database:

    npm run dbinit

then adjust config.js to your liking and start app via:

    npm start


## Project overview

### Configuration
The `config.js` file should handle everything necessary to deploy the app with any accounts on any machine, given the requirements listed above are fulfilled. Usually the actual value should be passed in via env vars and a default for the dev environment is defined.

### recommended Environment
Using a reserve proxy like nginx to handle TLS is highly recommended. The node app and DB are fairly lightweight and can easily run on any VPS. Running multiple apps on the same VPS might not be recommended due to data privacy issues.

### Build
There are two steps to run before the app can start:
1. Via `npm build` the scss will be compiled to css using brunch.
2. Via `npm run dbinit` the database (as set up via configuration, see above) will be initialized with the correct tables and associations. This operation will currently overwrite any preexisting data, a migration strategy should be provided when the full release gets updated with changes to the DB.

### basic structure
A node.js `express` server will serve static files (`assets` directory), the HTML (via `twing` templating engine) and any API endpoints.

URLs are structured as follows:
All static assets are in `/assets/`, all publicly accessible pages in `/`, all pages requiring login in `/app/` and all pages requiring admin access in `/app/admin/`.

`twing` templates all reside in `./templates/`.

The `express` routes and middleware are all listed in `./routes.js` and all the handlers per-route are in `./routes/` with a one-route-per-file policy, the file names and folder structure should match `./templates/` and the URLs.

All templates should be passed `res.tmplOpts` as their data object and middleware should add any data to display to that.

Anything other than GET requests will have the type appended to the filename. If those routes should display the same as the GET route and only do some processing first, they should be implemented as `express` middleware with the GET handler being the final handler for that route. The GET handler or `twing` template then might need to implement handling output from the middleware to display status information to the user.

Data storage is handled completely via mariadb, though configuring any other RDBMS compatible with `sequelize` should be easy via some changes to `./db.js` and installing the DB driver from npm.

The frontend is mostly static with some handwritten javascript, mainly for the Shift selection page (url `/app/plan`).

### Reusable coding

Anything needed for more than one endpoint/route should be handled in an appropriately named file in `./` for now. Subfolders might be added later. When repeated operations on a DB model become apparent, an appriopriate method might be added to the model, directly inside `./db.js` for now but maybe in extra files later.

### Services and customization
_SendGrid_ is used for emails (forgot password etc) but can be replaced with other services or self-hosted options via changes to `./email.js`.

The only locale is German. Changing that would currently require changing a ton of hardcoded strings, an i18n lib might be implemented later though.

The shift creation (which days should have shifts and when) is currently handled via `./generateShiftList.js` and can be adjusted there. A web interface for this or the ability to have different schedules on different plans is not expected, the latter would be easy to implement though.

