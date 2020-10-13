### Build

```
#!bash
ng build
```

### Test

```
#!bash
ng test

# or, disable watching to run them once
ng test --watch=false
```

To run a single set of tests, i modify the test.ts file. Change the regex for the context
from the checked-in value to the test suite you want to focus on, e.g.:

```
// const context = require.context('./', true, /\.spec\.ts$/);
const context = require.context('./', true, /organization-grouping\.tenantService\.spec\.ts$/);
```

Then run tests as usual.

### Run

```
#!bash
ng start
```

There are many ways to set up for development of the UI. One way that eliminates some set up
complexity is to use docker-compose to run all the applications, including the webapp on port
8080, then use npm to run the app "beside" it:

1. Run all applications: `docker-compose up -d`
1. Log in to the app at `http://localhost:8080`
1. Run the webapp separately: `npm start`
1. Connect to the npm-backed app by navigating to `http://localhost:4200`
   Any changes made to the angular code will be reflected in the localhost:4200 session.

### Integration Test

```
#!bash
# application must be running
ng e2e
```

### Development

#### Adding Components

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

#### Adding Routes

See examples in src/app.module.ts

### Background

This project was created on Mac OS with the below instructions:

```
#!bash
#install brew
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# install node js
brew install node

# install angular cli
npm install -g @angular/cli

# create angular app in directory called "client"
ng new client
```
