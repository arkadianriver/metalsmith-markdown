/* eslint-env mocha */

var assert = require('assert');
var equal = require('assert-dir-equal');
var Metalsmith = require('metalsmith');
var markdown = require('..');

describe('metalsmith-markdown', function() {
  it('should convert markdown files (with header/footer options)', function(done) {
    Metalsmith('test/fixtures/basic')
      .use(
        markdown({
          header: '<html>\n  <body>\n',
          footer: '\n  </body>\n</html>'
        })
      )
      .build(function(err) {
        if (err) return done(err);
        equal('test/fixtures/basic/expected', 'test/fixtures/basic/build');
        done();
      });
  });

  it('should allow a "keys" option', function(done) {
    Metalsmith('test/fixtures/keys')
      .use(
        markdown({
          keys: ['custom']
        })
      )
      .build(function(err, files) {
        if (err) return done(err);
        assert.equal('<p><em>a</em></p>\n', files['index.html'].custom);
        done();
      });
  });
});
