OWS Node
============

[![NPM Package](https://img.shields.io/npm/v/ows-node.svg?style=flat-square)](https://www.npmjs.org/package/ows-node)
[![Build Status](https://img.shields.io/travis/owstack/ows-node.svg?branch=master&style=flat-square)](https://travis-ci.org/owstack/ows-node)
[![Coverage Status](https://img.shields.io/coveralls/owstack/ows-node.svg?style=flat-square)](https://coveralls.io/r/owstack/ows-node)

A Bitcoin blockchain indexing and query service. Intended to be used with as a Bitcoin full node or in conjunction with a Bitcoin full node.

## Attribution

This repository was created by copy forking [bitcore-node 3a86782](https://github.com/bitpay/bitcore-node/commit/3a867824d66a96ab26af37fa3b3da2cd16e62f4a).

## Install

```bash
npm install
./bin/owsnode start
```

Note: A default configuration file is placed in the ows user's home directory (~/.ows/ows-node.json). Or, alternatively, you can copy the provided "btcore-node.json.sample" file to the project's root directory as ows-node.json and edit it for your preferences. If you don't have a preferred block source (trusted peer), [Bcoin](https://github.com/bcoin-org/bcoin) will be started automatically and synchronized with the mainnet chain.

## Prerequisites

- Node.js v8.2.0+
- ~500GB of disk storage
- ~4GB of RAM

## Configuration

The main configuration file is called "ows-node.json". This file instructs ows-node for the following options:

- location of database files (datadir)
- tcp port for web services, if configured (port)
- bitcoin network type (e.g. mainnet, testnet3, regtest), (network)
- what services to include (services)
- the services' configuration (servicesConfig)

## Add-on Services

There are several add-on services available to extend the functionality of OWS Node:

- [Explorer](https://github.com/owstack/ows-explorer)

### Bitcoin add-on Services

- [Explorer API](https://github.com/owstack/btccore-explorer-api)
- [Btccore Wallet Service](https://github.com/owstack/btccore-wallet-service)

### Bitcoin Cash add-on Services

- [Explorer API](https://github.com/owstack/bcccore-explorer-api)
- [Btccore Wallet Service](https://github.com/owstack/bcccore-wallet-service)

## Documentation

- [Services](docs/services.md)
  - [Fee](docs/services/fee.md) - Creates a service to handle fee queries
  - [Header](docs/services/header.md) - Creates a service to handle block headers
  - [Block](docs/services/block.md) - Creates a service to handle blocks
  - [Transaction](docs/services/transaction.md) - Creates a service to handle transactions
  - [Address](docs/services/address.md) - Creates a service to handle addresses
  - [Mempool](docs/services/mempool.md) - Creates a service to handle mempool
  - [Timestamp](docs/services/timestamp.md) - Creates a service to handle timestamp
  - [Db](docs/services/db.md) - Creates a service to handle the database
  - [p2p](docs/services/p2p.md) - Creates a service to handle the peer-to-peer network
  - [Web](docs/services/web.md) - Creates an express application over which services can expose their web/API content
- [Development Environment](docs/development.md) - Guide for setting up a development environment
- [Node](docs/node.md) - Details on the node constructor
- [Bus](docs/bus.md) - Overview of the event bus constructor
- [Release Process](docs/release.md) - Information about verifying a release and the release process.

## Contributing

Please send pull requests for bug fixes, code optimization, and ideas for improvement. For more information on how to contribute, please refer to our [CONTRIBUTING](https://github.com/owstack/ows/blob/master/CONTRIBUTING.md) file.

## License

Code released under [the MIT license](https://github.com/owstack/ows-node/blob/master/LICENSE).

Copyright 2017 Open Wallet Stack.
