## RDW_Reporting

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
RDW_Reporting makes use of RDW_Common modules. If you are developing RDW_Common and would like to test changes in this 
project, you can build RDW_Common locally and install your changes to the local repository:
```bash
git clone https://github.com/SmarterApp/RDW_Common
cd RDW_Common
git checkout develop
//make code changes
./gradlew install
```
Then to use those new changes, you can specify the SNAPSHOT version of RDW_Common
```bash
//In RDW_Reporting
./gradlew build it -Pcommon=1.0.0-SNAPSHOT
```

Now you should be able to build and test the reporting app from where you cloned this project:
```bash
cd RDW_Reporting
git checkout develop
./gradlew build
or to also run Integration Tests
./gradlew build it 

Code coverage reports can be found under `./build/reports/jacoco/test/html/index.html` 

You must explicitly build the docker images:
```bash
$ gradle buildImage
$ docker images
REPOSITORY                              TAG                 IMAGE ID            CREATED             SIZE
smarterbalanced/rdw-reporting-service            latest              da5207b421c0        30 seconds ago      150 MB
smarterbalanced/configuration-service            latest              1b41406534c7        2 weeks ago         221 MB
java                                    8-jre-alpine        d85b17c6762e        6 weeks ago         108 MB
```

After cycling through some builds you will end up with a number of dangling images, e.g.:
```bash
$ docker images
REPOSITORY                          TAG                 IMAGE ID            CREATED             SIZE
smarterbalanced/rdw-reporting-service        latest              da5207b421c0        30 seconds ago      150 MB
<none>                              <none>              13b96a973d59        About an hour ago   140 MB
<none>                              <none>              cb5063cbcc56        2 hours ago         140 MB
<none>                              <none>              2236259b73f0        3 hours ago         140 MB
```
These can be quickly cleaned up:
```bash
$ docker rmi $(docker images --filter "dangling=true" -q --no-trunc)
$ docker images
REPOSITORY                          TAG                 IMAGE ID            CREATED             SIZE
smarterbalanced/rdw-reporting-service        latest              da5207b421c0        30 seconds ago      150 MB
```

### Running
Running the application locally depends on the local database being configured properly.
```bash
To completely clean out any existing data you might have and start fresh:
./gradlew cleanallprod migrateallprod
or, if you want to use a different version of the schema, say version 1.0.0-68 of RDW_Schema
./gradlew -Pschema=1.0.0-68 cleannallprod migrateallprod
or, SNAPSHOT version of RDW_Schema if you are doing simultaneous development with RDW_Schema
./gradlew -Pschema=SNAPSHOT cleanallprod migriateallprod
```

The apps are wrapped in docker containers and should be built and run that way. There is a docker-compose spec
to make it easier: it runs the configuration server and the reporting service with the correct profile. Please 
read the comments in the docker-compose script for setting required environment variables. Use docker-compose
to run the services:
```bash
cd docker
docker-compose up -d
docker logs -f docker_reporting-service_1
```
You may now navigate to `http://localhost:8080` in a browser. You'll need ART credentials to login.
The status end-point should be available without credentials at `http://localhost:8081/status?level=5`

To shut down:
```bash
docker-compose down
```