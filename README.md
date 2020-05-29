## RDW_Reporting

Table of Contents:
* [Project Summary](#project-summary)
* [Building](#building)
* [Running](#running)


### Project Summary
Additional documentation:
* RDW_Reporting is part of the RDW suite of projects and applications. For all things RDW please refer to [RDW repo](https://github.com/SmarterApp/RDW)
* [Change log](CHANGELOG.md)
* [Contributing developer notes](CONTRIBUTING.md)
* [License](LICENSE)

RDW Reporting applications:
* Admin Service - Spring Boot application backing webapp admin functionality
* Aggregate Service - Spring Boot application backing webapp aggregate report functionality
* Report Processor - Spring Boot application for creating reports
* Reporting Service - Spring Boot application backing most webapp functionality
* Webapp - Angular / Spring Boot web application

RDW Reporting uses other processes:
* MySQL/Aurora - warehouse and reporting databases
* Redshift - aggregate reporting OLAP databse
* RabbitMQ - message queue
* Configuration Server - centralized Spring configuration server
* OpenAM - centralized auth server
* ART - Administration and Registration Tools

RDW Reporting uses other projects. These are published to publicly available repositories but having a local
copy may be convenient for reference or troubleshooting:
* [RDW_Common](https://github.com/SmarterApp/RDW_Common)
* [RDW_Schema](https://github.com/SmarterApp/RDW_Schema)
* [SBAC-Global-UI-Kit](https://github.com/SmarterApp/SBAC-Global-UI-Kit)


### Building
The following tools are need to build and test:
* Java 8.
* Gradle. The project uses bundled gradle so no explicit installation is required. However, it is highly 
recommended to install gdub (https://github.com/dougborg/gdub) because it handles some shortcomings of 
gradle's commandline behavior. The instructions assume this, using `gw` instead of `./gradlew` or `gradle`.
* Docker. The applications are distributed as docker images.
* MySQL 5.6/5.7. Required for running integration tests. Please refer to the [RDW Schema](https://github.com/SmarterApp/RDW_Schema) 
project for instructions on setting up MySQL.

After cloning the repository run (the `it` task triggers the integration tests):
```bash
gw build it
```

Code coverage reports can be found under each project in `./build/reports/coverage/index.html` after explicitly 
generating them using:
```bash
gw coverage
``` 

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
 export DATASOURCES_REPORTING_RO_URL_SERVER=$SERVER; \
 export DATASOURCES_REPORTING_RO_USERNAME=$USER; export DATASOURCES_REPORTING_RO_PASSWORD=$PSWD; \
 export DATASOURCES_WAREHOUSE_RW_URL_SERVER=$SERVER; \
 export DATASOURCES_WAREHOUSE_RW_USERNAME=$USER; export DATASOURCES_WAREHOUSE_RW_PASSWORD=$PSWD; \
 export DATASOURCES_REPORTING_RW_URL_SERVER=$SERVER; \
 export DATASOURCES_REPORTING_RW_USERNAME=$USER; export DATASOURCES_REPORTING_RW_PASSWORD=$PSWD; \
 export TEST_AURORA=true
 gw it)
```

The integration tests dealing with Redshift have been separated out because they require remote AWS resources
and they take a while to run. To run these tests you must set credentials -- please see the comment in 
aggregate-service/build.gradle. By default it uses the CI database instances:
```bash
(export DATASOURCES_OLAP_RO_PASSWORD=password; \
 gw rst)
```

You must explicitly build the docker images:
```bash
$ gw dockerBuildImage
$ docker images
REPOSITORY                              TAG                 IMAGE ID            CREATED             SIZE
smarterbalanced/rdw-ingest-import-service        latest              fc700c6e8518        14 minutes ago      131 MB
smarterbalanced/rdw-ingest-exam-processor        latest              cf83654e781f        9 seconds ago       130 MB
rabbitmq                                3-management        cda8025c010b        3 weeks ago         179 MB
java                                    8-jre-alpine        d85b17c6762e        6 weeks ago         108 MB
```
To publish the docker images you must provide docker hub credentials, either on the commandline or
as settings in `grade.properties`:
```bash
$ gw dockerPushImage
```

After cycling through some builds you will end up with a number of dangling images, e.g.:
```bash
docker images
REPOSITORY                          TAG                 IMAGE ID            CREATED             SIZE
smarterbalanced/rdw-ingest-import-service    latest              ad78b95ae39f        2 minutes ago       140 MB
<none>                              <none>              13b96a973d59        About an hour ago   140 MB
<none>                              <none>              cb5063cbcc56        2 hours ago         140 MB
<none>                              <none>              2236259b73f0        3 hours ago         140 MB
smarterbalanced/rdw-ingest-exam-processor    latest              293d8744377d        3 hours ago         132 MB
<none>                              <none>              bdae5c1151d5        24 hours ago        140 MB
<none>                              <none>              233d2f87c185        24 hours ago        132 MB
```
These can be quickly cleaned up with standard Docker hygiene:
```bash
docker container prune -f
docker image prune -f
```

### Running
These are instructions for running the RDW_Reporting applications locally. To deploy these applications
as part of the full Smarter Balanced RDW ecosystem, please refer to [RDW](https://github.com/SmarterApp/RDW).

Running the application locally depends on the local database being configured properly.
Please refer to the [RDW Schema](https://github.com/SmarterApp/RDW_Schema) project for that.
There is also a dev mysql dump file available with preloaded data. Ask for the latest version and then load, e.g.:
```
mysql -u root < mysql.20170707.68.dmp
```

The OLAP applications require remote AWS data stores being configured properly. Care should be taken because these
remote resources are often shared; also misconfiguration could result in actions being taken on the wrong database.

**NOTE** - The configuration server requires a backing git repository with proper configuration files,
including configuration settings for the `local-docker` profile. Without that, the system will not
run properly. (It is beyond the scope of this document to describe how to set that up.)   

**TODO** - change the project so it can run without a configuration server; see TIMS  

The apps are wrapped in docker containers and should be built and run that way. There is a docker-compose spec 
to make it easier: it runs RabbitMQ, the configuration server, and all the RDW_Reporting applications. Please 
read the comments in the docker-compose script for setting required environment variables. Then invoke it:
```bash
docker-compose up -d
# to see the log of a running app
docker logs -f rdw_reporting_webapp_1
```

To test the app navigate to `http://localhost:8080` in a browser. You'll need ART credentials to login.
The status end-point should be available without credentials at `http://localhost:8081/status?level=5`

To stop a single service, use regular docker commands; to stop them all use docker-compose, e.g.:
```bash
docker stop rdw_reporting_admin_service_1
docker-compose down
```
