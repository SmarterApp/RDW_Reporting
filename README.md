## RDW_Reporting

### Prerequisites
```bash
# Install node.js
# Download the most current from https://nodejs.org/en/
 
# Install angular-cli
npm install @angular/cli
```

#### SAML
A SAML IDP is required for running this application. Currently, we rely on a staging OpenAM server.
You must provide credentials for the SAML client to be able to communicate to the server. The location of the key 
store file, and the credentials to read it must be provided in a spring configuration file, `application.yml`. It 
will contain entries similar to (passwords redacted):
```text
saml:
  key-store-file: file:/opt/rdw-reporting-ui/config/rdw-reporting-ui.jks
  key-store-password: [redacted]
  private-key-entry-alias: rdw-reporting-ui-sp
  private-key-entry-password: [redacted]
  idp-metadata-url: https://sso-deployment.sbtds.org/auth/saml2/jsp/exportmetadata.jsp?realm=/sbac
  sp-entity-id: rdw-reporting-ui-local
```
For developers with access to internal resources there is a keystore and yml file available to download:
```bash
# create a local application data folder
mkdir -p /opt/rdw-reporting-ui/config

# download the application.yml and saml.jks made for your local environment into this directory
curl <application_properties_url> > /opt/rdw-reporting-ui/config/application.yml
curl <saml_jks_url> > /opt/rdw-reporting-ui/config/rdw-reporting-ui.jks
```
_There is nothing magical about the location and names of the files, but being consistent will make things easier._ 

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

The service depends on the database being configured properly. This is done using RDW_Schema.
```bash
git clone https://github.com/SmarterApp/RDW_Schema
cd RDW_Schema
git checkout develop
cd reporting
../scripts/migrate
```

### Building
RDW_Reporting makes use of RDW_Common modules. Because there is no common artifact repository, you must do something
to make the artifacts available. You could make an uber project in your IDE. Or you could build common locally:
```bash
git clone https://github.com/SmarterApp/RDW_Common
cd RDW_Common
git checkout develop
./gradlew build install
```

Now you should be able to build and test the ingest apps:
```bash
git clone https://github.com/SmarterApp/RDW_Reporting
cd RDW_Reporting
git checkout develop
gradle build
```

Code coverage reports can be found under `./build/reports/jacoco/test/html/index.html` 

You must explicitly build the docker images:
```bash
$ gradle buildImage
$ docker images
REPOSITORY                              TAG                 IMAGE ID            CREATED             SIZE
fwsbac/rdw-reporting-service            latest              da5207b421c0        30 seconds ago      150 MB
fwsbac/configuration-service            latest              1b41406534c7        2 weeks ago         221 MB
java                                    8-jre-alpine        d85b17c6762e        6 weeks ago         108 MB
```

After cycling through some builds you will end up with a number of dangling images, e.g.:
```bash
$ docker images
REPOSITORY                          TAG                 IMAGE ID            CREATED             SIZE
fwsbac/rdw-reporting-service        latest              da5207b421c0        30 seconds ago      150 MB
<none>                              <none>              13b96a973d59        About an hour ago   140 MB
<none>                              <none>              cb5063cbcc56        2 hours ago         140 MB
<none>                              <none>              2236259b73f0        3 hours ago         140 MB
```
These can be quickly cleaned up:
```bash
$ docker rmi $(docker images --filter "dangling=true" -q --no-trunc)
$ docker images
REPOSITORY                          TAG                 IMAGE ID            CREATED             SIZE
fwsbac/rdw-reporting-service        latest              da5207b421c0        30 seconds ago      150 MB
```

### Running
The apps are wrapped in docker containers and should be built and run that way. There is a docker-compose spec
to make it easier: it runs the configuration server and the reporting service with the correct profile. Please 
read the comments in the docker-compose script for setting required environment variables. You must place the 
development SAML key store file in the config folder (as described above; note the localapplication.yml file is 
not needed), then invoke docker-compose, e.g.:
```bash
# copy development SAML key store file
mkdir -p /opt/rdw-reporting-ui/config
curl <saml_jks_url> > /opt/rdw-reporting-ui/config/rdw-reporting-ui.jks
# use docker-compose to launch service
cd docker
docker-compose up -d
docker logs -f docker_reporting-service_1
```
You may now navigate to `http://localhost:8080` in a browser. You'll need ART credentials.