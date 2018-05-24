## RDW_Reporting

Additional documentation:
1. RDW_Reporting is part of the RDW suite of projects and applications. For all things RDW please refer to 
[RDW repo](https://github.com/SmarterApp/RDW)
1. [Change log](CHANGELOG.md)
1. [Contributing developer notes](CONTRIBUTING.md)
1. [License](LICENSE)

### Prerequisites
```bash
# Install node.js
# Download the most current from https://nodejs.org/en/
 
# Install angular-cli
npm install @angular/cli
```

#### MySQL
MySQL is required for building (integration tests) and running this application. To better match production, MySQL
should be run as a native app outside the container framework . There are various ways to install it; please be sure 
to install version 5.6 which is older and not the default! Here are the basic brew instructions:
```bash
brew update
brew install mysql@5.6
```
At the end of the install, there is a suggestion to add the mysql location to the path:
```bash
echo 'export PATH="/usr/local/opt/mysql@5.6/bin:$PATH"' >> ~/.bash_profile
```

Because brew isn't cool and directly sets the bind address you must modify `/usr/local/Cellar/mysql@5.6/5.6.34/homebrew.mxcl.mysql@5.6.plist` 
(make sure to use your minor version of the installation) and set `--bind-address=*`. 
You'll need to restart mysql after that, `brew services restart mysql@5.6`. You may need to fully stop and start
the service if you get a `mysql.sock` error at this point:
```bash
brew services stop mysql@5.6
brew services start mysql@5.6 
```

You may need to grant permissions to 'root'@'%':
```bash
mysql -uroot
mysql> GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';
mysql> exit
```

You should load your timezone info, because we'll be forcing the timezone to 'UTC' in the next step. You may see 
some warnings of skipped files but no errors when you do this:
```bash
mysql_tzinfo_to_sql /usr/share/zoneinfo | sed -e "s/Local time zone must be set--see zic manual page/local/" | mysql -u root mysql
```

Finally, you need to configure MySQL settings in `my.cnf` file. Locate the file (for a brew install it will be
`/usr/local/Cellar/mysql@5.6/5.6.34/my.cnf` but if you can't find it try `sudo find -name my.cnf -print`) 
and add the following lines:
```
[mysqld]
explicit_defaults_for_timestamp=1
default-time-zone='UTC'
secure_file_priv=/tmp/
```

Restart MySQL:
```bash
brew services restart mysql@5.6
```

To verify the settings, run a mysql client:
```bash
mysql> SELECT @@explicit_defaults_for_timestamp;
+-----------------------------------+
| @@explicit_defaults_for_timestamp |
+-----------------------------------+
|                                 1 |
+-----------------------------------+

mysql> SELECT @@system_time_zone, @@global.time_zone, @@session.time_zone;
+--------------------+--------------------+---------------------+
| @@system_time_zone | @@global.time_zone | @@session.time_zone |
+--------------------+--------------------+---------------------+
| PDT                | UTC                | UTC                 |
+--------------------+--------------------+---------------------+
```

The service depends on the database being configured properly. See instructions below under [Running](#running) 

#### wkhtmltopdf
wkhtmltopdf is required for building (integration tests) the applications. To install:
```bash
brew install Caskroom/cask/wkhtmltopdf
```
For running the application, wkhtmltopdf is bundled as a service and is run in a docker container.

### Building
After cloning the repository run:
```bash
./gradlew build it
```
The `it` task will trigger the integration tests.

If you want to run the integration tests against Aurora (instead of the local MySQL) you should set environment
variable with the required credentials for the CI (or other appropriate) database instance. Note that the way things
work for this, all the schemas must live in the same database server (so reporting and warehouse can't be separate
servers). The users may be different (but for CI they are the same). The `ORG_GRADLE_PROJECT_*` variables are passed
into the gradle environment so the RDW_Schema commands are applied to the correct database. The `SPRING_*_*` are used
by the Spring Boot ITs. And the temporary variables are just to avoid some duplication.
```bash
(SERVER=rdw-aurora-ci.cugsexobhx8t.us-west-2.rds.amazonaws.com:3306; USER=sbac; PSWD=password; \
 export ORG_GRADLE_PROJECT_database_url=jdbc:mysql://$SERVER/; \
 export ORG_GRADLE_PROJECT_database_user=$USER; export ORG_GRADLE_PROJECT_database_password=$PSWD; \
 export SPRING_DATASOURCE_URL_SERVER=$SERVER; \
 export SPRING_DATASOURCE_USERNAME=$USER; export SPRING_DATASOURCE_PASSWORD=$PSWD; \
 export SPRING_REPORTING_DATASOURCE_URL_SERVER=$SERVER; \
 export SPRING_REPORTING_DATASOURCE_USERNAME=$USER; export SPRING_REPORTING_DATASOURCE_PASSWORD=$PSWD; \
 export SPRING_WAREHOUSE_DATASOURCE_URL_SERVER=$SERVER; \
 export SPRING_WAREHOUSE_DATASOURCE_USERNAME=$USER; export SPRING_WAREHOUSE_DATASOURCE_PASSWORD=$PSWD; \
 export SPRING_WRITABLE_DATASOURCE_URL_SERVER=$SERVER; \
 export SPRING_WRITABLE_DATASOURCE_USERNAME=$USER; export SPRING_WRITABLE_DATASOURCE_PASSWORD=$PSWD; \
 export TEST_AURORA=true
 ./gradlew it)
```

The integration tests dealing with Redshift have been separated out because they require remote AWS resources
and they take a while to run. To run these tests you must set credentials -- please see the comment in 
aggregate-service/build.gradle. By default it uses the CI database instances:
```bash
(export SPRING_OLAP_DATASOURCE_PASSWORD=password; \
 ./gradlew rst)
```

#### Building with locally modified RDW_Common
RDW_Reporting makes use of RDW_Common modules. If you are developing RDW_Common and would like to test changes in this 
project, you can build RDW_Common locally and install your changes to the local repository:
```bash
git clone https://github.com/SmarterApp/RDW_Common
cd RDW_Common
# make code changes
./gradlew install
```
Then to use those new changes, you can specify the SNAPSHOT version of RDW_Common
```bash
./gradlew build it -Pcommon=1.1.0-SNAPSHOT
```

#### Docker Images
To build the docker images run:
```bash
./gradlew buildImage
```

### Coverage Reports
Code coverage reports can be found under each project in `./build/reports/coverage/index.html` after explicitly 
generating them using:
```bash
./gradlew coverage
``` 

### Running
Running the application locally depends on the local database being configured properly.
```bash
# To completely clean out any existing data you might have and start fresh:
./gradlew cleanallprod migrateallprod
# or, if you want to use a different version of the schema, say version 1.1.0-68 of RDW_Schema
./gradlew -Pschema=1.1.0-68 cleannallprod migrateallprod
# or, SNAPSHOT version of RDW_Schema if you are doing simultaneous development with RDW_Schema
./gradlew -Pschema=SNAPSHOT cleanallprod migriateallprod
```

The apps are wrapped in docker containers and should be built and run that way. There is a docker-compose spec for each webapp
to make it easier: it runs the configuration server, webapps and other service dependencies service with the correct profile. Please 
read the comments in the docker-compose script for setting required environment variables. 

To use docker-compose to run the reporting or admin webapp. Go to the module directory and run:
```bash
docker-compose up -d
```

To test the app navigate to `http://localhost:8080` in a browser. You'll need ART credentials to login.
The status end-point should be available without credentials at `http://localhost:8081/status?level=5`

To shut down:
```bash
docker-compose down
```