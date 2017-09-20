'use strict';

var createError = require('errno').create;

var OWSNodeError = createError('OWSNodeError');

var RPCError = createError('RPCError', OWSNodeError);

module.exports = {
  Error: OWSNodeError,
  RPCError: RPCError
};
