# Mediahead Token
Mediahead Token is meant to create Authorization between our own Applications.

With this Library we can generate a Token on Server 1 and verify it on Server 2.

## Configuration
There are three Environement Variables, which can be set:

 * `MEDIAHEAD_TOKEN_SECRET` - Set the Secret. It has to be the same on every Application, otherwise this won't validate.
 * `MEDIAHEAD_TOKEN_MAXAGE` - Set the Max Age of a Token in seconds. Defaults to 60 seconds.
 * `MEDIAHEAD_TOKEN_IDENTIFIER` - Default Identifier for Token generation.

## Instalation
### Install the Package
```bash
$ npm install git@bitbucket.org:mediahed/mediahead-token.git --save
```

### In your Code
```javascript
var token = require('mediahead-token');
```

## Usage

### Generate a new Token
```javascript
// If you don't have MEDIAHEAD_TOKEN_IDENTIFIER set
var generatedToken = token.createToken('identifier');
// else
var generatedToken = token.createToken();
```

### Validate a Token
```javascript
var tokenToValidate = new Token('$token$4123412$dfahdafhgdafg$');
var valid = tokenToValidate.validate();
```