var token	= require('./../index.js'),
	chai	= require('chai'),
	expect	= chai.expect,
	_		= require('lodash');

describe('token', function() {
	describe('.create()', function() {
		it('should fail because no envs are set', function() {
			clearEnvironement();
			expect(function() {
				token.create('xy');
			}).to.throw(Error);
		});
		it('should create a token', function() {
			setUpEnvironement();
			expect(function() {
				token.create('xy');
			}).not.to.throw(Error);
		});
	});
	describe('Token', function() {
		setUpEnvironement();
		describe('.init()', function() {
			it('should throw an error if string malformed', function() {
				expect(function() {
					new token.Token('fooooo');
				}).to.throw(Error);
			});
			it('should not throw an error if string not malformed', function() {
				expect(function() {
					new token.Token('$name$1251345134$hash$');
				}).not.to.throw(Error);
			});
		});
		{
			var createdToken = new token.Token('$identifier$1251345134$hash$');

			describe('.identifier', function() {
				it('should have an identifier property', function() {
					expect(createdToken.identifier).to.be.eql('identifier');
				});
			});
			describe('.time', function() {
				it('should have a time property', function() {
					expect(createdToken.time).to.be.eql(1251345134);
				});
			});
			describe('.hash', function() {
				it('should have a hash property', function() {
					expect(createdToken.hash).to.be.eql('hash');
				});
			});
		}
		describe('.valid()', function() {
			it('should be false if too old', function() {
				createdToken = token.create('xy', _.now() - 3600);
				expect(createdToken.valid()).to.be.eql(false);
			});
			it('should be false if hash mismatches', function() {
				var createdToken = new token.Token('$identifier$' + _.now() + '$hash$');
				expect(createdToken.valid()).to.be.eql(false);
			});
			it('should be valid normally', function() {
				createdToken = token.create('xy');
				expect(createdToken.valid()).to.be.eql(true);
			});
		});
		describe('.toString()', function() {
			it('should create a string in the right format', function() {
				var createdToken = new token.Token('identifier', 12345, 'hash');
				expect(createdToken.toString()).to.be.eql('$identifier$12345$hash$');
			});
		});
	});
});

/**
 * Set Up Environement
 * @return {void}
 */
function setUpEnvironement() {
	process.env.MEDIAHEAD_TOKEN_SECRET = 'secret';
}

/**
 * Clear Environement
 * @return {void}
 */
function clearEnvironement() {
	delete process.env.MEDIAHEAD_TOKEN_SECRET;
}