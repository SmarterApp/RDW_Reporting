### Build ###
```
#!bash
ng build
```
### Test ###
```
#!bash
ng test
```
### Run ###
```
#!bash
ng serve --proxy-config /opt/rdw-reporting/config/proxy.conf.json
```
### Integration Test ###
```
#!bash
# application must be running
ng e2e
```
### Development ###
#### Adding Components ####
To a new component (view/controller) start with the following command:
```
#!bash
ng g component <ComponentName>
```
This will create the following boilerplate and placeholders for you:
```
src/app/<component-name>/<component-name>.component.css (view style)
src/app/<component-name>/<component-name>.component.html (view template)
src/app/<component-name>/<component-name>.component.spec.ts (unit tests)
src/app/<component-name>/<component-name>.component.ts (controller)
```
#### Adding Routes ###
See examples in src/app.module.ts
### Background ###
This project was created on Mac OS with the below instructions:
```
#!bash
#install brew
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# install node js
brew install node

# install angular cli
npm install -g angular-cli

# create angular app in directory called "client"
ng new client
```
