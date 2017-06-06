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

#### Developing with Dependent Submodules
This section covers the development scenario of working on RDW_Schema and RDW_Reporting together.

This project utilizes git submodules (independent git repo, but checked out at a desired commit)for the RDW_Schema that 
it depends on. This means the project's RDW_Schema submodule is "pointing" to a commit in the RDW_Schema git repo that 
is the correct version of that project that is known to be working correctly with Reporting. During development, you may 
want to develop in RDW_Schema and make changes, test with Reporting, etc. Since RDW_Schema is in a "detached head" status, 
you will need to do the following to get RDW_Schema in a good state:
```bash
cd RDW_Schema
git pull
git checkout develop
git checkout -b feature/<your feature>
```
While you are making changes to the schema, you can be making corresponding changes in Reporting and running integration 
tests against your new RDW_Schema changes. When you are done with changes in RDW_Schema, you can commit and push the 
RDW_Schema repo as you would normally do, but from the RDW_Schema subdirectory.
```bash
git add -u
git commit -m "<message>"
git push -u origin <your branch name>
```
  
When you are done, the Reporting project's "version" of RDW_Schema will be at the commit hash of your new code changes, 
and will be under "Changes not staged for commit" section of 
```bash
//under the RDW_Reporting parent directory...
git status 
```
At this point, your current RDW_Schema submodule is out of sync with what your RDW_Reporting project is expecting. And, 
your RDW_Schema submodule is also on a branch, which will need to be merged in to the develop branch via normal procedures. 
RDW_Schema should be merged to develop and then resynced with the RDW_Reporting project before your commit and push your
changes because you don't want to be moving the submodule pointer to a feature branch. To move the submodule pointer to 
the new develop branch tip, do the following:
```bash
git reset HEAD RDW_Schema
git submodule update --remote
```
This pulls the latest from the RDW_Schema develop branch in to your submodule. If you run "git status", you will also now
see RDW_Schema under the "Changes not staged for commit" section. You can now add any other remaining changes, commit
your changes, and push them to the server. The RDW_Schema submodule pointer is now pointing at the version that matches
your Reporting changes.

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