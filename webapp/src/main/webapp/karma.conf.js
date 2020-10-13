// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const puppeteer = require("puppeteer");
process.env.CHROME_BIN = puppeteer.executablePath();
process.env.CHROMIUM_BIN = puppeteer.executablePath();

module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-remap-istanbul"),
      require("karma-teamcity-reporter"),
      require("@angular-devkit/build-angular/plugins/karma")
    ],
    client: {
      jasmine: {
        random: false
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require("path").join(__dirname, "coverage"),
      reports: ["html", "lcovonly"],
      fixWebpackSourcePaths: true
    },

    reporters:
      config.angularCli && config.angularCli.codeCoverage
        ? ["progress", "karma-remap-istanbul", "teamcity"]
        : ["progress"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["ChromiumHeadless"],
    singleRun: false,
    //Quick fix for PhantomJS OOM issues
    browserNoActivityTimeout: 60000,
    browserDisconnectTimeout: 30000,
    captureTimeout: 60000
  });
};
