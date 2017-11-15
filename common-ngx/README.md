# Common NGX

### Developing with the library
When developing this library with dependent libraries or apps, make sure that this library is built before building the dependent app.
When developing both at the same time make sure that you run `npm run build:watch`
And that the dependent library has dependency ```"@sbac/rdw-reporting-common-ngx": "file: [relative path to module root dir]"``` in its `package.json`

### Build
```bash
npm run build
```

### Test
```bash
npm run test
```

### Posterity
This library package structure is based on the [Angular Library Seed](https://github.com/trekhleb/angular-library-seed) project.
Note: this project does not use Angular CLI as the tool is currently made only for developing Angular app distributables and not shared libraries.
