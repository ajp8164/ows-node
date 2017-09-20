'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var EventEmitter = require('events').EventEmitter;
var P2PService = require('../../../lib/services/p2p');

describe('P2P Service', function() {
  var p2p;
  var testEmitter;

  before(function(done) {
    p2p = new P2PService({
      nodeKind: 'btccore',
      node: {
        name: 'p2p',
        on: sinon.stub()
      }
    });
    sinon.stub(p2p, '_initPool');
    p2p._pool = new EventEmitter();

    expect(p2p.p2p).to.exist;
    expect(p2p.Networks).to.exist;

    done();
  });

  it('should get the mempool from the network', function() {
    var sendMessage = sinon.stub();
    var peer = { sendMessage: sendMessage };
    var getPeer = sinon.stub(p2p, '_getPeer').returns(peer);
    p2p.getMempool();
    expect(getPeer.calledOnce).to.be.true;
    expect(sendMessage.calledOnce).to.be.true;
  });
});

