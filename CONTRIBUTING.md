## RDW_Reporting for Developers

This document is targeted at developers contributing to the RDW_Reporting project.

### Coding Conventions

#### Application Configuration
The reporting application relies on a centralized configuration server that pulls property files from a git repo. 
Therefore there are two property files: the embedded application.yml file and the config-repo application.yml file.
Properties fall into three broad categories: 
* Code-like properties should be specified only in the embedded file. Examples: jaxb settings, local cache settings.
* Configuration properties should have a reasonable default in the embedded file and profile-specific variations in 
the config-repo file. These are properties that vary depending on the environment and profile, for example: host 
names for external services.
* Secrets should be specified only in the config-repo file, and they should be encrypted using the config server.

### Version Control Conventions
Repo: https://github.com/SmarterApp/RDW_Reporting
Config Repo: https://gitlab.com/fairwaytech/sbac-config-repo

This project follows the common convention of having two main branches with infinite lifetime: `master` is the main
branch where HEAD contains the production-ready state, while `develop` is the main branch where HEAD contains the 
latest changes for the next release.
 
Use feature branches off of `develop` for all new features. Use a prefix of `feature/` to highlight those branches.
For example, the new shoesize feature work would be in `feature/shoesize`. Create pull requests from the feature
branch to `develop` to solicit code reviews and feedback. Once approved use `squash and merge` into `develop`.

##### Developing with RDW_Schema
If you are making changes within a standalone clone of RDW_Schema and want to test RDW_Ingest with the local changes to
the schema, then all you have to do is install the changes to RDW_Schema that you have made, and tell ingest to use the 
SNAPSHOT version of the RDW_Schema:
```bash
//under the RDW_Schema directory...
./gradlew install
```
and then run the integration tests as usual, but using the local SNAPSHOT version of RDW_Schema:
```bash
//under the RDW_Ingest directory...
 ./gradlew build it -Pschema=1.0.0-SNAPSHOT
```


### Running

#### SAML
The application uses a SAML IDP so, when running the application locally, you must configure it to connect to the 
staging OpenAM server. The location of the keystore file and the credentials to read it must be provided in the 
spring configuration file, `application.yml`. It will contain entries similar to:
```text
saml:
  key-store-file: file:/opt/rdw-reporting/config/saml.jks
  key-store-password: [redacted]
  private-key-entry-alias: rdw-reporting-ui-sp
  private-key-entry-password: [redacted]
  idp-metadata-url: https://sso-deployment.sbtds.org/auth/saml2/jsp/exportmetadata.jsp?realm=/sbac
  sp-entity-id: rdw-reporting-ui-local
```
For developers with access to internal resources there is a keystore and yml file available to download:
```bash
# create a local application data folder
mkdir -p /opt/rdw-reporting/config

# download the application.yml and saml.jks made for your local environment into this directory
curl <application_properties_url> > /opt/rdw-reporting/config/application.yml
curl <saml_jks_url> > /opt/rdw-reporting/config/saml.jks
```
_There is nothing magical about the location and names of the files, but being consistent will make things easier._ 

#### Running From IntelliJ
The README outlines how to run the applications using docker. As a developer you will want to run an application 
locally from the IDE. To start, have IDEA open the root `build.gradle` file. You'll probably want to create a run/debug
configuration, either:
* In the Run/Debug Configurations dialog, hit ^N (ctrl-n) and select Spring Boot
	* For the new configuration, name it as you wish
	* Main class: org.opentestsystem.rdw.reporting.Application
	* Program arguments: --spring.config.location=/opt/rdw-reporting/config/application.yml
	* Use classpath of module: rdw-reporting-service_main
	
OR
* Create a new run/debug configuration:  (Menu)[Run->Edit Configurations...]
* In the Run/Debug Configurations dialog, hit ^N (ctrl-n) and select Gradle
	* For the new configuration, name it as you wish
	* In Gradle Project: Select RDW_Reporting
	* In Tasks: Enter bootRun as the Task
	* In Script Parameters: -PjvmArgs="-Dspring.config.location=/opt/rdw-reporting/config/application.yml"

#### Running Using Gradle
```bash
gradle bootRun -PjvmArgs="-Dspring.config.location=/opt/rdw-reporting/config/application.yml"
open http://localhost:8080
```
#### Running Standalone
The artifact is a Spring Boot executable jar so you can just run it. Just as when running from the IDE the default
is to run without a configuration server so the configuration must be specified on the command line. You can also
change the port if desired, e.g.:
```bash
java -jar build/libs/rdw-reporting*.jar --spring.config.location=/opt/rdw-reporting/config/application.yml --server.port=8088
open http://localhost:8088
```

### Posterity
This project was created on Mac OS with the below instructions:
```
#!bash
#install brew
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# install java
brew tap caskroom/cask
brew install caskroom/cask/java

# install springboot cli
brew tap pivotal/tap
brew install springboot

# create spring boot app in directory called "api"
spring init --dependencies=web,security,aop,devtools --groupId=rdw.reporting.web --artifactId=rdw-reporting-ui api
```