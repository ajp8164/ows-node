# Setting up Development Environment

## Install Node.js

Install Node.js by your favorite method, or use Node Version Manager by following directions at https://github.com/creationix/nvm

```bash
nvm install v8
```

## Fork and Download Repositories

To develop ows-node for bitcoin follow these steps.  Substitute from the available kinds of node libraries for other networks (e.g., btccore-lib, bcccore-lib).

```bash
cd ~
git clone git@github.com:<yourusername>/ows-node.git
git clone git@github.com:<yourusername>/btccore-lib.git
```

## Install Development Dependencies

For Ubuntu:
```bash
sudo apt-get install libzmq3-dev
sudo apt-get install build-essential
```
**Note**: Make sure that libzmq-dev is not installed, it should be removed when installing libzmq3-dev.


For Mac OS X:
```bash
brew install zeromq
```

## Install and Symlink

```bash
cd btccore-lib
npm install
cd ../ows-node
npm install
```
**Note**: If you get a message about not being able to download bitcoin distribution, you'll need to compile bitcoind from source, and setup your configuration to use that version.


We now will setup symlinks in `ows-node` *(repeat this for any other modules you're planning on developing)*:
```bash
cd node_modules
rm -rf btccore-lib
ln -s ~/btccore-lib
rm -rf bitcoind-rpc
ln -s ~/bitcoind-rpc
```

And if you're compiling or developing bitcoin:
```bash
cd ../bin
ln -sf ~/bitcoin/src/bitcoind
```

## Run Tests

If you do not already have mocha installed:
```bash
npm install mocha -g
```

To run all test suites:
```bash
cd ows-node
npm run regtest
npm run test
```

To run a specific unit test in watch mode:
```bash
mocha -w -R spec test/services/bitcoind.unit.js
```

To run a specific regtest:
```bash
mocha -R spec regtest/bitcoind.js
```

## Running a Development Node

To test running the node, you can setup a configuration that will specify development versions of all of the services:

```bash
cd ~
mkdir devnode
cd devnode
mkdir node_modules
touch ows-node.json
touch package.json
```

Edit `ows-node.json` with something similar to:
```json
{
  "nodeKind": "btccore",
  "network": "livenet",
  "port": 3001,
  "services": [
    "bitcoind",
    "web",
    "explorer-api",
    "ows-explorer",
    "<additional_service>"
  ],
  "servicesConfig": {
    "bitcoind": {
      "spawn": {
        "datadir": "/home/<youruser>/.bitcoin",
        "exec": "/home/<youruser>/bitcoin/src/bitcoind"
      }
    }
  }
}
```

**Note**: To install services [btccore-explorer-api](https://github.com/owstack/btccore-explorer-api) and [ows-explorer](https://github.com/owstack/ows-explorer) you'll need to clone the repositories locally.

Setup symlinks for all of the services and dependencies:

```bash
cd node_modules
ln -s ~/btccore-lib
ln -s ~/btccore-explorer-api
ln -s ~/ows-node
ln -s ~/ows-explorer
```

Make sure that the `<datadir>/bitcoin.conf` has the necessary settings, for example:
```
server=1
whitelist=127.0.0.1
txindex=1
addressindex=1
timestampindex=1
spentindex=1
zmqpubrawtx=tcp://127.0.0.1:28332
zmqpubhashblock=tcp://127.0.0.1:28332
rpcallowip=127.0.0.1
rpcuser=bitcoin
rpcpassword=local321
```

From within the `devnode` directory with the configuration file, start the node:
```bash
../ows-node/bin/owsnode start
```