var _			= require('lodash'),
	crypto	= require('crypto'),
	maxAge	= process.env.MEDIAHEAD_TOKEN_MAXAGE || 60;

/**
 * [Token description]
 * @param {String} tokenStringOrIdentifier [If time & hash are provided, it will
 *                                         use it as identifier. Else it will parse
 *                                         the argument]
 * @param {Integer} time                   [The time of creation]
 * @param {String} hash                    [The hash]
 */
function Token(tokenStringOrIdentifier, time, hash) {
	// Reference to itself
	var self = this;

	/**
	 * Construct the Token
	 * @constructor
	 * @return void
	 */
	(function init() {
		if(time && hash) {
			self = _.merge(self, {
				'identifier': tokenStringOrIdentifier,
				'time': time,
				'hash': hash
			});
		} else {
			self = _.merge(self, parseToken(tokenStringOrIdentifier));
		}
	})();

	/**
	 * Verify Token
	 * @param  {Integer} customMaxAge [Max Age in Seconds, default to MEDIAHEAD_TOKEN_MAXAGE or 60 seconds]
	 * @return {Boolean}        [Return if the Token passed]
	 */
	self.valid = function verify(customMaxAge) {
		customMaxAge = customMaxAge || maxAge;

		if(createHash(self.identifier, self.time) !== self.hash) {
			return false;
		}

		return _.now() <= (self.time + customMaxAge);
	};

	/**
	 * Convert Token to String
	 * @return {String} String representation of token
	 */
	self.toString = function toString() {
		return '$' + self.identifier + '$' + self.time + '$' + self.hash + '$';
	};
}

/**
 * Parse a Token String
 * @param  {String} tokenString
 * @return {Object}
 */
function parseToken(tokenString) {
	var parts = tokenString.split('$');

	if(parts.length !== 5) {
		throw new Error('Invalid Token Format. The Token has to be in the format $[name]$[time]$[hash]$');
	}

	return {
		'identifier': parts[1],
		'time': parseInt(parts[2]),
		'hash': parts[3]
	};
}

/**
 * Create a hash
 * @param  {String} identifier [Identifier]
 * @param  {Integer} time      [Creation Time]
 * @return {String}            [Hash]
 */
function createHash(identifier, time) {
	checkEnvironement();

	var cypherText	= '$' + identifier + '$' + time + '$' + process.env.MEDIAHEAD_TOKEN_SECRET + '$';

	return crypto.createHash('sha512').update(cypherText).digest('hex');
}

/**
 * Check if Environement is set up properly
 * @return {void}
 */
function checkEnvironement() {
	// Check if env MEDIAHEAD_SECRET is set
	if(process.env.MEDIAHEAD_TOKEN_SECRET === undefined || process.env.MEDIAHEAD_TOKEN_SECRET === null) {
		throw new Error('The env Variable MEDIAHEAD_TOKEN_SECRET has to been set.');
	}
}

// Export It
module.exports = _.extend(module.exports, {
	/**
	 * Create a Token
	 * @param {String} identifier [The Identifier from the Application which generates the token]
	 * @param {Integer} time [Time when the token is requested. Defaults to current time]
	 * @return {String} [Return a Mediahead Token]
	 */
	'create': function createToken(identifier, time) {
		time = time || _.now();
		identifier = identifier || process.env.MEDIAHEAD_TOKEN_IDENTIFIER;

		return new Token(identifier, time, createHash(identifier, time));
	},
	'Token': Token
});