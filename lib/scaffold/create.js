'use strict';

var owsCommon = require('ows-common');
var $ = owsCommon.util.preconditions;
var _ = require('lodash');
var spawn = require('child_process').spawn;
var async = require('async');
var path = require('path');
var packageFile = require('../../package.json');
var mkdirp = require('mkdirp');
var fs = require('fs');
var defaultConfig = require('./default-config');

var version = '^' + packageFile.version;

var BASE_PACKAGE = {
  description: 'A full network full node build with OWS Node',
  repository: 'https://github.com/user/project',
  license: 'MIT',
  readme: 'README.md',
  dependencies: {
    'ows-node': version
  }
};

/**
 * Will create a directory for the full node network.
 * @param {String} dataDir - The absolute path
 * @param {Function} done - The callback function called when finished
 */
function createDataDirectory(datadir, done) {
  mkdirp(datadir, function(err) {
    if (err) {
      throw err;
    }

    done();
  });
}

/**
 * Will create a base OWS Node configuration directory and files.
 * @param {Object} options
 * @param {String} options.nodeKind - one of the available nodes (e.g., "btccore", "bcccore")
 * @param {String} options.network - "testnet" or "livenet"
 * @param {String} options.datadir - The network full node database directory
 * @param {String} configDir - The absolute path
 * @param {Boolean} isGlobal - If the configuration depends on globally installed node services.
 * @param {Function} done - The callback function called when finished
 */
function createConfigDirectory(options, configDir, isGlobal, done) {
  mkdirp(configDir, function(err) {
    if (err) {
      throw err;
    }
    var configInfo = defaultConfig(options);
    var config = configInfo.config;
    var configJSON = JSON.stringify(config, null, 2);

    var nodelib = require(options.nodeKind + '-lib');
    BASE_PACKAGE.dependencies[options.nodeKind + '-lib'] = '^' + nodelib.version;
    var packageJSON = JSON.stringify(BASE_PACKAGE, null, 2);

    try {
      fs.writeFileSync(configDir + '/ows-node.json', configJSON);
      if (!isGlobal) {
        fs.writeFileSync(configDir + '/package.json', packageJSON);
      }
    } catch(e) {
      done(e);
    }
    done();

  });
}

/**
 * Will setup a directory with a OWS Node directory, configuration file,
 * network full node configuration, and will install all necessary dependencies.
 *
 * @param {Object} options
 * @param {String} options.cwd - The current working directory
 * @param {String} options.dirname - The name of the ows-node configuration directory
 * @param {String} options.datadir - The path to the network full node datadir
 * @param {Function} done - A callback function called when finished
 */
function create(options, done) {
  /* jshint maxstatements:20 */
  $.checkArgument(_.isObject(options));
  $.checkArgument(_.isFunction(done));
  $.checkArgument(_.isString(options.cwd));
  $.checkArgument(_.isString(options.dirname));
  $.checkArgument(_.isBoolean(options.isGlobal));
  $.checkArgument(_.isString(options.datadir));
  $.checkArgument(_.isString(options.nodeKind));

  var cwd = options.cwd;
  var dirname = options.dirname;
  var datadir = options.datadir;
  var isGlobal = options.isGlobal;

  var absConfigDir = path.resolve(cwd, dirname);
  var absDataDir = path.resolve(absConfigDir, datadir);

  async.series([
    function(next) {
      // Setup the the ows-node directory and configuration
      if (!fs.existsSync(absConfigDir)) {
        var createOptions = {
          nodeKind: options.nodeKind,
          network: options.network,
          datadir: datadir
        };
        createConfigDirectory(createOptions, absConfigDir, isGlobal, next);
      } else {
        next(new Error('Directory "' + absConfigDir+ '" already exists.'));
      }
    },
    function(next) {
      // Setup the network full node data directory
      if (!fs.existsSync(absDataDir)) {
        createDataDirectory(absDataDir, next);
      } else {
        next();
      }
    },
    function(next) {
      // Install all of the necessary dependencies
      if (!isGlobal) {
        var npm = spawn('npm', ['install'], {cwd: absConfigDir});

        npm.stdout.on('data', function (data) {
          process.stdout.write(data);
        });

        npm.stderr.on('data', function (data) {
          process.stderr.write(data);
        });

        npm.on('close', function (code) {
          if (code !== 0) {
            return next(new Error('There was an error installing dependencies.'));
          } else {
            return next();
          }
        });

      } else {
        next();
      }
    }
  ], done);

}

module.exports = create;
