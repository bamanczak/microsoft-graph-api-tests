![Continuous Integration tests](https://github.com/bamanczak/microsoft-graph-api-tests/workflows/Continuous%20Integration%20tests/badge.svg?branch=master)

# Microsoft Graph API Tests
This is a Proof of Concept for Microsoft 365 test automation using Graph


## Mocha, Chai, and Typescript 
Test Automation framework designed using Mocha, Chai, and Typescript.
It is based on [framework developed by qaloop](https://github.com/qaloop/mocha-chai-typescript)

## Framework Structure
```
├───images
├───page-objects
├───test-suites
├───.gitignore
├───package.json
├───README.md
└───tslint.json
```

## To Get Started

### Pre-requisites
* Download and install Chrome or Firefox browser.
* Download and install Node.js:
  * [Install Node.JS](https://nodejs.org/en/download/ "Install Node.JS")
* Optional - Download and install any Text Editor like Visual Code/Sublime/Brackets
  * [Install Visual Studio Code](https://qaloop.tk/blog/install-visual-studio-code/ "Install Visual Studio Code")


### Setup Scripts 
* Clone the repository into a folder
* Go to Project root directory and install Dependency: `npm install`
* All the dependencies from package.json and ambient typings would be installed in node_modules folder.

### Setup Test Accounts and App
* Create an office developer account
  * [Office Developer Registration](https://developer.microsoft.com/en-us/microsoft-365/dev-program)
* Register and setup OAuth App in [Azure Portal](https://portal.azure.com/)
  * [OAuth App Setup guide](https://dzone.com/articles/getting-access-token-for-microsoft-graph-using-oau)
  * For your app grant at least the following permission: `Mail.ReadWrite`
* Create at least 2 test users on your [Azure Active Directory](https://azure.microsoft.com/en-us/services/active-directory/)
  * This can be done e.g. using [Sample data packs](https://developer.microsoft.com/en-us/microsoft-365/dev-program#Sample)

### Setup Environment Variables
For security reasons, the data required to authenticate to the Microsoft Graph are stored as environment variables (and github secrets for CI). The following Environment variables are needed for tests to run correctly:
* `CLIENT_ID` - ID of your OAuth App
* `CLIENT_SECRET` - Secret key for your OAuth App
* `USER1_EMAIL` - email (and login) for 1st test user
* `USER1_PASSWORD`- password for 1st test user
* `USER2_EMAIL` - email (and login) for 2nd test user
* `USER2_PASSWORD`- password for 2nd test user

### How to Run Test
* Run complete Test Suite: `npm test`

![Test results in Console](./images/test-results-console.png?raw=true "Test results in Console")

### How to Update local npm packages
* Go to Project root directory and run command: `npm update`

### Sample HTML Report With Test Results
![Mocha, Chai, and Typescript Test Result](./images/test-results-html.png?raw=true "Mocha, Chai, and Typescript Test Result")

## Continuous Integration
CI was configured using GitHub Actions. The configuration file is stored in `.github/workflows/ci.yml`. CI job is triggered after each commit. CI stores test artifacts in GitHub, which can be accessed in the [Actions tab](https://github.com/bamanczak/microsoft-graph-api-tests/actions) for individual test runs.
