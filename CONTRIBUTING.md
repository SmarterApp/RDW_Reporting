## RDW_Reporting for Developers

This document targets developers contributing to the RDW_Reporting project. It includes conventions 
and guidelines (please read before contributing), and detailed instructions for running the services
in various development-friendly configurations.

Table of Contents:
* [Coding Conventions](#coding-conventions)
* [Version Control Conventions](#version-control-conventions)
* [Documentation Conventions](#documentation-conventions)
* [Developer Setup](#developer-setup)
* [Running](#running)
* Misc Bits
    * [Tenant/Sandbox](#tenantsandbox-admin)
    * [Posterity](#posterity)


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

#### Logging Level
When selecting the level to log a message consider the following:
* TRACE.
* DEBUG. 
* INFO. Assume this is the log level in production, so don't be too chatty with it. It should be used to confirm 
proper configuration and code paths that are not business-as-usual but also aren't problematic.
* WARN. This is the level to use for a problem the application has handled but still needs attention.
* ERROR. Assume that messages logged at this level will cause a person to be called in the middle of the night.

#### PII Data
This system is designed to ingest student test results which includes sensitive Personally Identifiable Information.
Although the system will be run in a secure environment, separation of duties dictates that system admins, devops, etc.
should never see PII. For developers this means that no PII or secrets (e.g. credentials) should ever be logged or
made available through unsecured interfaces. Put simply: do not log student information or client/user credentials, nor
include that information in any system status/monitoring end-points.


### Version Control Conventions
Repo: https://github.com/SmarterApp/RDW_Reporting

This project follows the common convention of having two main branches with infinite lifetime: `master` is the main
branch where HEAD contains the production-ready state, while `develop` is the main branch where HEAD contains the 
latest changes for the next release.
 
Use feature branches off of `develop` for all new features. Use a prefix of `feature/` to highlight those branches.
For example, the new shoesize feature work would be in `feature/shoesize`. Create pull requests from the feature
branch to `develop` to solicit code reviews and feedback. Once approved use `squash and merge` into `develop`.


### Documentation Conventions
As changes are made to the project, please maintain the documentation. Within this project `README.md` is
intended as an introduction with sufficient information for building and deploying the project.
`CONTRIBUTING.md` is targeted at developers and has more detailed information on building, testing, and
debugging the applications. Please update `CHANGELOG.md` as work is completed so we don't have to mine 
the vcs log to glean the high level changes.  

##### Resource Requirements Documentation
As changes are made to the code, the resulting services will change their resource requirements. Since these are
documented for the users, e.g. https://github.com/SmarterApp/RDW/blob/develop/docs/Runbook.md#report-processor, it 
is important to keep them current. This isn't too hard to do using Native Memory Tracking (NMT). Please refer to
https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/tooldescr007.html to calculate the off-heap
memory utilization.


### Developer Setup
Developers should start with the [basic build instructions](./README.md#building). And, of course, developers
should have their favorite Java IDE installed, IntelliJ is a good choice. Pull down the repository and load
the project from its gradle configuration.

Additionally, developers should:
* Pull down [RDW](https://github.com/SmarterApp/RDW)
* Pull down [RDW_Common](https://github.com/SmarterApp/RDW_Common)
* Pull down [RDW_Schema](https://github.com/SmarterApp/RDW_Schema) 
* Pull down [SBAC-Global-UI-Kit](https://github.com/SmarterApp/SBAC-Global-UI-Kit)
* Get access to the git repository backing the configuration service, ask the project lead.
* Get access to the Redshift and Aurora databases, ask the project lead.
* Load the test data mentioned in [loading data](./README.md#loading-data), ask the project lead for the file.
```bash
mysql -u root < ~/mysqltestdata.dmp
gw migrateAll
```
* Install node and angular
```bash
# Install node.js
# Download the most current from https://nodejs.org/en/
 
# Install angular-cli
npm install @angular/cli
```
* Install wkhtmltopdf (required for integration tests) 
```bash
brew install Caskroom/cask/wkhtmltopdf
```

##### Developing with RDW_Schema
If you are developing RDW_Schema and would like to test your local changes in this project, you can build 
RDW_Schema locally, install your changes to the local repository, and specify the SNAPSHOT version of 
RDW_Schema when building RDW_Reporting:
```bash
cd ../RDW_Schema
# make local changes
gw install

cd ../RDW_Reporting
gw build it -Pschema=2.4.0-SNAPSHOT
```

##### Developing with RDW_Common
If you are developing RDW_Common and would like to test your local changes in this project, you can build 
RDW_Common locally, install your changes to the local repository, and specify the SNAPSHOT version of 
RDW_Common when building RDW_Reporting:
```bash
cd ../RDW_Common
# make local changes
gw install

cd ../RDW_Reporting
gw build it -Pcommon=1.1.0-SNAPSHOT
```

### Running

#### SAML
The application uses a SAML IDP so, when running the application locally, you must configure it to connect to the 
staging OpenAM server. The location of the keystore file and the credentials to read it must be provided in the 
spring configuration file, `application.yml`. To make things easier, there are placeholders that can be set using
environment variables or VM options. You'll need to set the keystore path and credentials, and AWS access/secret keys 
(for credentials that can access the S3 resource root). 
For environment variables, edit the appropriate shell file (.bashrc, .zshrc, .bash_profile):
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
gw bootRun 
open http://localhost:8080
```
#### Running Standalone
The artifact is a Spring Boot executable jar so you can just run it. Once the environment variables are set up you 
should be able to (you can also change the port if desired):
```bash
java -jar build/libs/rdw-reporting*.jar --server.port=8088
open http://localhost:8088
```

#### Running From IDE
If you want to run a particular service in your IDE, you'll need to tweak a couple things:
1. Modify the `docker-compose.yml` file and comment out the service you'll be running, and look at the comments
in the webapp configuration section about changing the zuul routes
1. Modify the `application.yml` for the service to have tenant information. For example, for the data in the dev
mysql dump, we want CA and TS to be defined:
```
tenantProperties:
  tenants:
    CA:
      id: CA
      key: CA
      name: California
    TS:
      id: TS
      key: TS
      name: Test Tenant
```


#### Misc
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


### Tenant/Sandbox Admin
The tenant/sandbox feature supports multi-tenancy. It is tricky to setup for testing and debugging
non-trivial configurations. This section is a stream-of-consciousness dump of stuff learned ...

**TODO** - clean up this section, so it is more useful

For SandboxCreation, a list of datasets is required. Locally they won't exist.
so if you add the following to your application.yml to list 'available' datasets.
# Only here for local Dev for Sandbox creation, not real dataSets
sandbox-properties:
  sandboxDatasets:
    - label: Demo Dataset
      id: demo-dataset
    - label: SBAC Dataset
      id: sbac-dataset
**NOTE: do NOT check in this change to the file!**


In production tenant administration is dependent upon

- [Spring Cloud Config](https://spring.io/projects/spring-cloud-config) 
  - backed by a git repository to hold all the application configurations
- S3 to store Datasets
- Aurora and Redshift to have new schemas created and to load datasets from S3.

#### Caveats

- It is not possible to run the entire process locally, Redshift resources must be remote.
- It isn't possible to run config-server off of a local git repo without some manual intervention
- There is no automated way to remove missing sandbox or tenant databases from you local mysql, you will need to clean them up by hand.

#### Datasets

Datasets are used during Sandbox creation to pre-populate a sandbox with generated data.

Datasets resolve within the application via the `archive.uri-root` configuration.  When running remotely the application will be using Aurora / Redshift calls directly to S3.  For local development they can be simulated with the local filesystems instead of S3 and mysql instead of Aurora.  In local mode no Redshift / OLAP schema creation or population will occur. 

*Local Mode* is derived form the `archive.uri-root` being set to a `file://` prefix instead of `s3://`.

By default for local development that is 

```yaml
archive:
  uri-root: "file:///tmp/"
```

The root of the datasets are in a directory `sandbox-datasets` and the sub directory names must
agree with the configured properties defined in `sandbox-properties.sandboxDatasets`.

An expedient way of populating the simulated archive root directory populated with datasets is to copy the ones in use in the QA S3 archive. 

```bash
aws s3 sync s3://<archiveBucketName>/sandbox-datasets/ /tmp/sandbox-datasets
```

#### Git - Private Remote Fork (recommended)

This is a sample for reference, depending on the git setup for your private fork the exact commands may vary.

clone a base configuration

`git clone https://gitlab.com/<baseRepoOwner>/rdw_config.git ~/projects/RDW/rdw_config`

setup a private repository (Github, Bitbucket, Gitlab, etc) then set repo as a remote

`git remote add fork https://github.com/<mygithubusername>/rdw_config.git`

push the local clone to the fork

`git push -f fork  master`

At times it is worth resetting your fork to match base (origin) exactly

```
$ cd ~/projects/RDW/rdw_config
$ git fetch origin
$ git reset --hard origin/master
$ git push -f fork master
```

It is probable that you will want to make changes to your fork that you do not want to make to the original rdw_config. I recommend an additional working copy for that purpose.

`git clone https://github.com/<mygithubusername>/rdw_config.git ~/projects/RDW/rdw_config_fork`

It is necessary to set the configuration for `tenant-configuration-persistence` in `~/projects/RDW/rdw_config_fork/rdw-reporting-admin-service.yml`, but before that you will need to encrypt your git user account (the one used for the fork) with the locally running config-server in docker.

```
$ curl localhost:8888/encrypt -d mygitpassword
44b5d831427388b6d24751619a6cebd8392ac8d97f23a332700ed83e203b8288
```

then edit `~/projects/RDW/rdw_config_fork/rdw-reporting-admin-service.yml` make sure to set the  remote-repository-uri, git-username, and git-password.  remote-repository-uri needs to be https.

```
tenant-configuration-persistence:
  local-repository-path: /tmp/rdw_config_local
  remote-repository-uri: https://github.com/<mygithubusername>/rdw_config.git
  git-username: <mygithubusername>
  git-password: '{cipher}44b5d831427388b6d24751619a6cebd8392ac8d97f23a332700ed83e203b8288'
  author: "RDW Admin System"
  author-email: "rdwadmin@example.com"
```

After editing it may be worth saving a copy of  `~/projects/RDW/rdw_config_fork/rdw-reporting-admin-service.yml` so that you can easily update it again after resting your fork to the latest from the shared repository.

The last thing to do is to make sure `$CONFIG_SERVICE_REPO` environment variable is set to your fork `https://github.com/<mygithubusername>/rdw_config.git` instead of the shared repo.  `$GIT_PASSWORD` and`$GIT_USER` also need to be set to your username and password.  The `$GIT_PASSWORD` environment variable is unencrypted unlike the one stored in the yml file.

#### Git - Private Local Fork (requires manual intervention)

set up your local fork

```
rm -rf  /tmp/rdw_config_remote
git clone https://gitlab.com/<baseRepoOwner>/rdw_config.git /tmp/rdw_config_remote
```

The config-server will try and fetch remotes you have defined, disconnect them

```
cd /tmp/rdw_config_remote
git remote rm origin
```

This would [theoretically](https://stackoverflow.com/questions/1764380/how-to-push-to-a-non-bare-git-repository) work, but it is currently unsupported by JGit.

```
git config --local receive.denyCurrentBranch updateInstead
```

The last thing to do is to make sure `$CONFIG_SERVICE_REPO` environment variable is set to your fork `file:///tmp/rdw_config_remote` instead of the shared repo. `$GIT_PASSWORD` and `$GIT_USER` are not used.

The downside of this setup is that pushes to the simulated git repo are not reflected in the working copy, and need to be manually synced in order for the config server to pick them up (creating or updating a tenant or sandbox)

```
$ cd /tmp/rdw_config_remote
$ git reset --hard HEAD 
$ curl -d "path=*" http://localhost:8888/monitor
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
