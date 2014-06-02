'use strict';

/* jshint node:true */

var packetBuilder = require('../packet-builder').spheroCommandPacketBuilder;
var _createPacket = require('../toolbelt').createPacket;

var DID = 0x00;

var createPacket = function (cid, options) {
  return _createPacket(DID, cid, options);
};

exports.ping = function (options) {
  var packet = createPacket(0x01, options);
  return packetBuilder(packet);
};

exports.getVersioning = function (options) {
  var packet = createPacket(0x02, options);
  return packetBuilder(packet);
};

exports._controlUARTTxLine = function (enable, options) {
  var packet = createPacket(0x03, options);
  packet.DATA = new Buffer([(enable ? 0x01 : 0x00)]);
  return packetBuilder(packet);
};

exports.setDeviceName = function (deviceName, options) {
  var packet = createPacket(0x10, options);
  packet.DATA = new Buffer(deviceName);
  return packetBuilder(packet);
};

exports.getBluetoothInfo = function (options) {
  var packet = createPacket(0x11, options);
  return packetBuilder(packet);
};

exports.setAutoReconnect = function (enable, time, options) {
  var packet = createPacket(0x12, options);
  packet.DATA = Buffer(2);
  packet.DATA.writeUInt8((enable ? 0x01 : 0x00), 0);
  packet.DATA.writeUInt8(time, 1);
  return packetBuilder(packet);
};

exports.getAutoReconnect = function (options) {
  var packet = createPacket(0x13, options);
  return packetBuilder(packet);
};

exports.getPowerState = function (options) {
  var packet = createPacket(0x20, options);
  return packetBuilder(packet);
};

exports.setPowerNotification = function (enable, options) {
  var packet = createPacket(0x21, options);
  packet.DATA = new Buffer(1);
  packet.DATA.writeUInt8(enable ? 0x01 : 0x00, 0);
  return packetBuilder(packet);
};

exports.sleep = function (wakeup, macro, orbBasic, options) {
  wakeup = wakeup || 0;
  macro = macro || 0;
  orbBasic = orbBasic || 0;
  var packet = createPacket(0x22, options);
  packet.DATA = Buffer(5);
  packet.DATA.writeUInt16BE(wakeup, 0);
  packet.DATA.writeUInt8(macro, 2);
  packet.DATA.writeUInt16BE(orbBasic, 3);
  return packetBuilder(packet);
};

exports.getVoltageTripPoints = function (options) {
  var packet = createPacket(0x23, options);
  return packetBuilder(packet);
};

exports._setVoltageTripPoints = function (lowVoltage, criticalVoltage, options) {
  var packet = createPacket(0x24, options);
  packet.DATA = new Buffer(4);
  packet.DATA.writeUInt16BE(lowVoltage, 0);
  packet.DATA.writeUInt16BE(criticalVoltage, 2);
  return packetBuilder(packet);
};

exports.setInactivityTimeout = function (time, options) {
  var packet = createPacket(0x25, options);
  packet.DATA = new Buffer(2);
  packet.DATA.writeUInt16BE(time, 0);
  return packetBuilder(packet);
};

exports._jumpToBootloader = function (options) {
  var packet = createPacket(0x30, options);
  return packetBuilder(packet);
};

exports.performLevel1Diagnostics = function (options) {
  var packet = createPacket(0x40, options);
  return packetBuilder(packet);
};

exports.performLevel2Diagnostics = function (options) {
  var packet = createPacket(0x41, options);
  return packetBuilder(packet);
};

exports._clearCounters = function (options) {
  var packet = createPacket(0x42, options);
  return packetBuilder(packet);
};

exports.assignTimeValue = function (time, options) {
  var packet = createPacket(0x23, options);
  packet.DATA = new Buffer(4);
  packet.DATA.writeUInt32BE(time, 0);
  return packetBuilder(packet);
};

exports.pollPacketTimes = function (time, options) {
  var packet = createPacket(0x51, options);
  packet.DATA = new Buffer(4);
  packet.DATA.writeUInt32BE(time, 0);
  return packetBuilder(packet);
};

exports._jumpToBootloader = function (options) {
  var packet = createPacket(0x30, options);
  return packetBuilder(packet);
};
