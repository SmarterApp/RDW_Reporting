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

#### PII Data
This system is designed to ingest student test results which includes sensitive Personally Identifiable Information.
Although the system will be run in a secure environment, separation of duties dictates that system admins, devops, etc.
should never see PII. For developers this means that no PII or secrets (e.g. credentials) should ever be logged or
made available through unsecured interfaces. Put simply: do not log student information or client/user credentials, nor
include that information in any system status/monitoring end-points.


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
 ./gradlew build it -Pschema=1.1.0-SNAPSHOT
```


### Running

#### SAML
The application uses a SAML IDP so, when running the application locally, you must configure it to connect to the 
staging OpenAM server. The location of the keystore file and the credentials to read it must be provided in the 
spring configuration file, `application.yml`. To make things easier, there are placeholders that can be set using
environment variables or VM options. You'll need to set the keystore path and credentials, and AWS access/secret keys 
(for credentials that can access the S3 resource root). For environment variables, edit ~/.bash_profile and add:
```bash
# RDW environment settings
export RDW_REPORTING_KEYSTORE_PATH=file:~/Downloads/rdw-reporting-saml.jks
export RDW_REPORTING_KEYSTORE_PASSWORD=mypassword
export RDW_REPORTING_KEYSTORE_ALIAS=rdw-reporting-ui-sp
export RDW_REPORTING_KEYSTORE_ENTRY_PASSWORD=mypassword
export RDW_REPORTING_IDP=https://sso-deployment.sbtds.org/auth/saml2/jsp/exportmetadata.jsp?realm=/sbac
export RDW_REPORTING_ENTITYID=rdw-reporting-ui-local
export RDW_AWS_ACCESS_KEY=myAccessKey
export RDW_AWS_SECRET_KEY=mySecretKey
export RDW_RESOURCE_ROOT=s3://rdw-resources/
export RDW_PERMISSION_SERVICE=http://perm-web-deployment.sbtds.org:8080/rest
export RDW_REPORTING_IRIS_VENDORID=2B3C34BF-064C-462A-93EA-41E9E3EB8333
export RDW_REPORTING_IRIS_URL=http://iris-dev.sbacdw.org:8080/iris/
export RDW_REPORTING_ARTIFACTS_EXAM_ITEM_DIRECTORY=item-content/bank/items/Item-{0}/
```
For IntelliJ, create a new Spring Boot configuration and add the following to VM Options:
```text
-Drdw.reporting.keystore.path=file:~/Downloads/rdw-reporting-saml.jks
-Drdw.reporting.keystore.password=mypassword
-Drdw.reporting.keystore.alias=rdw-reporting-ui-sp
-Drdw.reporting.keystore.entry.password=mypassword
-Drdw.reporting.idp=https://sso-deployment.sbtds.org/auth/saml2/jsp/exportmetadata.jsp?realm=/sbac
-Drdw.reporting.entityId=rdw-reporting-ui-local
-Drdw.aws.access.key=myAccessKey
-Drdw.aws.secret.key=mySecretKey
-Drdw.resource.root=s3://rdw-resources/
-Drdw.permission.service=http://perm-web-deployment.sbtds.org:8080/rest
-Drdw.reporting.iris.vendorId=2B3C34BF-064C-462A-93EA-41E9E3EB8333
-Drdw.reporting.iris.url=http://iris-dev.sbacdw.org:8080/iris/
-Drdw.reporting.artifacts.exam.item.directory=item-content/bank/items/Item-{0}/
```
_NOTE: there is nothing magical about the location and names of the files, but being consistent will make things easier._ 


#### Running Using Gradle
Once the environment variables are set up you should be able to:
```bash
gradle bootRun 
open http://localhost:8080
```
#### Running Standalone
The artifact is a Spring Boot executable jar so you can just run it. Once the environment variables are set up you 
should be able to (you can also change the port if desired):
```bash
java -jar build/libs/rdw-reporting*.jar --server.port=8088
open http://localhost:8088
```

It would be great if somebody could provide instructions for running the micro-services without the fronting webapp.
One big issue is security and getting a proper test user in context. For now, here are some crude instructions for
running admin-service well enough to test one controller end-point:
1. Create a Spring Boot configuration (i'm using IntelliJ)
    * Set main class to `org.opentestsystem.rdw.admin.Application`
    * Set program arguments to `--app.test-mode=true --security.user.name=user --security.user.password=pass`
1. Run it and set your breakpoint
1. Hit the endpoint
```bash
curl -u user:pass -X POST  http://localhost:8080/studentGroups -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' --data-binary $'------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="file"; filename="demo 演示.csv"\r\nContent-Type: text/csv\r\n\r\n\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--\r\n'
```
1. Note: there isn't a User for the security context so stuff will probably fail quickly.

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