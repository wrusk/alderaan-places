# Command line app to retrieve Star Wars API data

Retrieve the planet and people data, then correlate them into a queryable list.

## Installation

**Install Node js.**

**configure application**

run 'npm install' in the root directory  to creat a runnable app

## Usage

node app.js --planet {planetname}

Notes:

There are issues with the asynchronous calls currently causing problems with this application. After several refactoring attempts the final processing is still firing before the data has returned from the API.