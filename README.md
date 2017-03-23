### Prerequisites ###
```
# Install node.js
Download the most current from https://nodejs.org/en/
 
# Install angular-cli
npm install @angular/cli

# create a local application data folder
mkdir -p /opt/rdw-reporting-ui/config

# download the application.properties and saml.jks made for your local environment into this directory
# URLs will be circulated internally
curl <application_properties_url> > /opt/rdw-reporting-ui/config/application.yaml
curl <saml_jks_url> > /opt/rdw-reporting-ui/config/saml.jks
```
### Setup IntelliJ
If you are opening this for the first time, have IDEA open the build.gradle file as a new project

* Create a new run/debug configuration:  (Menu)[Run->Edit Configurations...]
* In the Run/Debug Configurations dialog, hit ^N (ctrl-n) and select Gradle
	* For the new configuration, name it as you wish
	* In Gradle Project: Select RDW_Reporting
	* In Tasks: Enter bootRun as the Task
	* In Script Parameters: -PjvmArgs="-Dspring.config.location=/opt/rdw-reporting-ui/config/application.yaml"
	* Leave VM Options blank

OR
* In the Run/Debug Configurations dialog, hit ^N (ctrl-n) and select Spring Boot
	* For the new configuration, name it as you wish
	* Main class: org.opentestsystem.rdw.reporting.Application
	* Program arguments: --spring.config.location=/opt/rdw-reporting-ui/config/application.properties
	* Use classpath of module: rdw-reporting-service_main
	* all others options are blank

You can now run or debug in IntelliJ IDEA

### To run in Development Mode
```
gradle bootRun -PjvmArgs="-Dspring.config.location=/opt/rdw-reporting-ui/config/application.yaml"
open http://localhost:8080
```
### To just build an executable jar file
```
./gradlew bootRepackage
```
### To run the executable jar
```
java -jar build/libs/rdw-reporting-ui*.jar --spring.config.location=/opt/rdw-reporting-ui/config/application.yaml
open http://localhost:8080
```
### Background ###
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
