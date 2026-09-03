// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      jasmine: {},
      clearContext: false,
    },
    jasmineHtmlReporter: {
      suppressAll: true,
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly', file: 'lcov.info' },
      ],
      exclude: [
        'src/main.ts',
        'src/environments/**',
        'src/**/*.module.ts',
        'src/**/*.routes.ts',
        'src/**/models/**',
        'src/**/interfaces/**',
      ],
      check: {
        global: {
          statements: 80,
          lines: 80,
          branches: 80,
          functions: 80,
        },
      },
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
    browsers: ['ChromeHeadlessCI'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--headless=new',
        ],
      },
    },
    restartOnFileChange: true,
    singleRun: false,
  });
};
