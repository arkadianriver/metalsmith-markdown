var basename = require('path').basename;
var debug = require('debug')('metalsmith-markdown');
var dirname = require('path').dirname;
var extname = require('path').extname;
var join = require('path').join;
var markedIt = require('marked-it-core');

/**
 * Check if a `file` is markdown.
 *
 * @param {String} file
 * @return {Boolean}
 */
var markdown = function(file) {
  return /\.md$|\.markdown$/.test(extname(file));
};

/**
 * Metalsmith plugin to convert markdown files.
 *
 * @param {Object} options (optional)
 *   @property {Array} keys
 * @return {Function}
 */
var plugin = function(options) {
  options = options || {};
  var keys = options.keys || [];
  var header = options.header || '';
  var footer = options.footer || '';

  return function(files, metalsmith, done) {
    setImmediate(done);
    Object.keys(files).forEach(function(file) {
      debug('checking file: %s', file);
      if (!markdown(file)) return;
      var data = files[file];
      var dir = dirname(file);
      var html = basename(file, extname(file)) + '.html';
      if ('.' != dir) html = join(dir, html);

      debug('converting file: %s', file);
      var result = markedIt.generate(data.contents.toString(), options);
      var str = header + result.html.text + footer;
      try {
        // preferred
        data.contents = Buffer.from(str);
      } catch (err) {
        // node versions < (5.10 | 6)
        data.contents = new Buffer(str);
      }
      keys.forEach(function(key) {
        if (data[key]) {
          const result = markedIt.generate(data[key].toString(), options);
          data[key] = result.html.text + '\n';
        }
      });
      delete files[file];
      files[html] = data;
    });
  };
};

// Expose Plugin
module.exports = plugin;
