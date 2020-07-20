/* global chrome */

import channels from 'src/shared/channels';

const debug = process.env.DEBUG === 'true';
const portsByChannel = {};
const lastMessages = {};
const logs = [];

const ports = {
  startListening() {
    chrome.runtime.onConnect.addListener(port => {
      const channel = port.name;

      if (!portsByChannel[channel]) {
        portsByChannel[channel] = new Set();
      }

      portsByChannel[channel].add(port);

      if (lastMessages[channel]) {
        port.postMessage(lastMessages[channel]);
      }

      port.onDisconnect.addListener(port => {
        const channel = port.name;

        portsByChannel[channel].delete(port);
      });
    });
  },

  postMessage(channel, message) {
    lastMessages[channel] = message;

    if (portsByChannel[channel]) {
      portsByChannel[channel].forEach(port => port.postMessage(message));
    }
  },

  postMultiaddrs(multiaddrs) {
    ports.postMessage(channels.multiaddrs, multiaddrs);
  },

  postPeers(connectedPeers) {
    ports.postMessage(channels.peers, connectedPeers);
  },

  postLog(message) {
    if (!message.startsWith('DEBUG') || debug) {
      logs.push(message);
      ports.postMessage(channels.logs, logs);
    }
  },

  clearLogs() {
    logs.splice(0, logs.length);
    ports.postMessage(channels.logs, logs);
  },
};

export default ports;