'use strict';

/* jshint node:true */

var packetBuilder = require('../packet-builder').spheroCommandPacketBuilder;
var _createPacket = require('../toolbelt').createPacket;

var DID = 0x02;

var createPacket = function (cid, options) {
  return _createPacket(DID, cid, options);
};

exports.setHeading = function (heading, options) {
  var packet = createPacket(0x01, options);
  packet.DATA = new Buffer(2);
  packet.DATA.writeUInt16BE(heading, 0);
  return packetBuilder(packet);
};

exports.setStabilization = function (enable, options) {
  var packet = createPacket(0x02, options);
  packet.DATA = new Buffer(1);
  packet.DATA.writeUInt8(enable ? 0x01 : 0x00, 0);
  return packetBuilder(packet);
};

exports.setRotationRate = function (rate, options) {
  var packet = createPacket(0x03, options);
  packet.DATA = new Buffer(1);
  packet.DATA.writeUInt8(rate, 0);
  return packetBuilder(packet);
};

exports.setApplicationConfigurationBlock = function (data, options) {
  var packet = createPacket(0x04, options);
  packet.DATA = new Buffer(0x20);
  data.copy(packet.DATA);
  return packetBuilder(packet);
};

exports.getApplicationConfigurationBlock = function (options) {
  var packet = createPacket(0x05, options);
  return packetBuilder(packet);
};

exports.getChassisID = function (options) {
  var packet = createPacket(0x07, options);
  return packetBuilder(packet);
};

exports._setChassisID = function (chassisId, options) {
  console.warn('commands.api#_setChassisID() only works in the factory');
  var packet = createPacket(0x08, options);
  packet.DATA = new Buffer(2);
  packet.DATA.writeUInt16BE(chassisId, 0);
  return packetBuilder(packet);
};

exports.selfLevel = function (angleLimit, timeout, trueTime, levelOptions, options) {
  /*
   levelOptions = {
   start: {Boolean}          // true=start, false=abort
   rotate: {Boolean}         // Rotate to start heading after leveling
   sleep: {Boolean}          // true=Sleep after leveling, false=stay awake
   controlSystem: {Boolean}  // true=leave control system on after leveling, false=turn it off
   }
   */
  if (typeof(levelOptions) === 'undefined') {
    /* I think this is sane:
     bit 0 = 1 ; Start the routine
     bit 1 = 1 ; Rotate to start heading
     bit 2 = 0 ; Stay awake
     bit 3 = 1 ; Leave control system on after levelling
     */
    levelOptions = {
      start: true,
      rotate: true,
      sleep: false,
      controlSystem: true
    };
  }
  angleLimit = angleLimit || 0;
  timeout = timeout || 0;
  trueTime = trueTime || 0;
  var _levelOptions = (levelOptions && 0x01) | (levelOptions.rotate && 0x02) | (levelOptions.sleep && 0x04) | (levelOptions.controlSystem && 0x08);
  var packet = createPacket(0x09, options);
  packet.DATA = new Buffer(4);
  packet.DATA.writeUInt8(_levelOptions, 0);
  packet.DATA.writeUInt8(angleLimit, 1);
  packet.DATA.writeUInt8(timeout, 2);
  packet.DATA.writeUInt8(trueTime, 3);
  return packetBuilder(packet);
};

exports.setDataStreaming = function (sensorRateDivisor, frames, mask, packetCount, mask2, options) {
  //TODO : Create a mask object somewhere for ease of use
  var packet = createPacket(0x11, options);
  packet.DATA = new Buffer(mask2 ? 0x0D : 0x09);
  packet.DATA.writeUInt16BE(sensorRateDivisor, 0);
  packet.DATA.writeUInt16BE(frames, 2);
  packet.DATA.writeUInt32BE(mask, 4);
  packet.DATA.writeUInt8(packetCount, 8);
  if (mask2) {
    packet.DATA.writeUInt32BE(mask2, 9);
  }
  return packetBuilder(packet);
};

exports.configureCollisionDetection = function (method, thresholdX, thresholdY, speedX, speedY, deadTime, options) {
  var packet = createPacket(0x12, options);
  packet.DATA = new Buffer(0x06);
  packet.DATA.writeUInt8(method, 0);
  packet.DATA.writeUInt8(thresholdX, 1);
  packet.DATA.writeUInt8(thresholdY, 2);
  packet.DATA.writeUInt8(speedX, 3);
  packet.DATA.writeUInt8(speedY, 4);
  packet.DATA.writeUInt8(deadTime, 5);
  return packetBuilder(packet);
};

exports.configureLocator = function (flags, x, y, yawTare, options) {
  var packet = createPacket(0x13, options);
  packet.DATA = new Buffer(7);
  packet.DATA.writeUInt8(flags, 0);
  packet.DATA.writeUInt16BE(x, 1);
  packet.DATA.writeUInt16BE(y, 3);
  packet.DATA.writeUInt16BE(yawTare, 5);
  return packetBuilder(packet);
};

exports.setAccelerometerRange = function (rangeIndex, options) {
  var packet = createPacket(0x14, options);
  packet.DATA = new Buffer(0x01);
  packet.DATA.writeUInt8(rangeIndex, 0);
  return packetBuilder(packet);
};

exports.readLocator = function (options) {
  var packet = createPacket(0x15, options);
  return packetBuilder(packet);
};

exports.setRGB = function (color, persist, options) {
  var packet = createPacket(0x20, options);
  packet.DATA = new Buffer([
      (color >> 16) & 0xFF,
      (color >> 8) & 0xFF,
      color & 0xFF,
    persist ? 0x01 : 0x00
  ]);
  return packetBuilder(packet);
};

exports.setBackLED = function (intensity, options) {
  var packet = createPacket(0x21, options);
  packet.DATA = new Buffer(1);
  packet.DATA.writeUInt8(intensity, 0);
  return packetBuilder(packet);
};

exports.getRGB = function (options) {
  var packet = createPacket(0x22, options);
  return packetBuilder(packet);
};

exports.roll = function (speed, heading, state, options) {
  var packet = createPacket(0x30, options);
  packet.DATA = new Buffer(4);
  packet.DATA.writeUInt8(speed, 0);
  packet.DATA.writeUInt16BE(heading, 1);
  packet.DATA.writeUInt8(state, 3);
  return packetBuilder(packet);
};

exports.setBoostWithTime = function (time, heading, options) {
  console.warn('commands.api#setBoostWithTime() not currently supported in the Sphero firmware');
  var packet = createPacket(0x31, options);
  packet.DATA = new Buffer(3);
  packet.DATA.writeUInt8(time, 0);
  packet.DATA.writeUInt16BE(heading, 1);
  return packetBuilder(packet);
};

exports.setRawMotorValues = function (leftMode, leftPower, rightMode, rightPower, options) {
  var packet = createPacket(0x33, options);
  packet.DATA = new Buffer(4);
  packet.DATA.writeUInt8(leftMode, 0);
  packet.DATA.writeUInt8(leftPower, 1);
  packet.DATA.writeUInt8(rightMode, 2);
  packet.DATA.writeUInt8(rightPower, 3);
  return packetBuilder(packet);
};

exports.setMotionTimeout = function (time, options) {
  var packet = createPacket(0x34, options);
  packet.DATA = new Buffer(2);
  packet.DATA.writeUInt16BE(time, 0);
  return packetBuilder(packet);
};

exports.setPermanentOptionFlags = function (flags, options) {
  var packet = createPacket(0x35, options);
  packet.DATA = new Buffer(4);
  packet.DATA.writeUInt32BE(flags, 0);
  return packetBuilder(packet);
};

exports.getPermanentOptionFlags = function (options) {
  var packet = createPacket(0x36, options);
  return packetBuilder(packet);
};

exports.setTemporaryOptionFlags = function (flags, options) {
  var packet = createPacket(0x37, options);
  packet.DATA = new Buffer(4);
  packet.DATA.writeUInt32BE(flags, 0);
  return packetBuilder(packet);
};

exports.getTemporaryOptionFlags = function (options) {
  var packet = createPacket(0x38, options);
  return packetBuilder(packet);
};

exports.getConfigurationBlock = function (configurationBlockId, options) {
  var packet = createPacket(0x40, options);
  packet.DATA = new Buffer(1);
  packet.DATA.writeUInt8(configurationBlockId, 0);
  return packetBuilder(packet);
};


exports.setDeviceMode = function (mode, options) {
  var packet = createPacket(0x42, options);
  packet.DATA = new Buffer(1);
  packet.DATA.writeUInt8(mode, 0);
  return packetBuilder(packet);
};

exports.setConfigurationBlock = function (data, options) {
  var packet = createPacket(0x43, options);
  packet.DATA = new Buffer(0xFE);
  data.copy(packet.DATA);
  return packetBuilder(packet);
};

exports.getDeviceMode = function (options) {
  var packet = createPacket(0x44, options);
  return packetBuilder(packet);
};

exports.runMacro = function (macroId, options) {
  var packet = createPacket(0x50, options);
  packet.DATA = new Buffer(1);
  packet.DATA.writeUInt8(macroId, 0);
  return packetBuilder(packet);
};

exports.saveTemporaryMacro = function (macro, options) {
  if (macro.length > 254) {
    throw new Error('Macro length is greater than 254 bytes');
  }
  var packet = createPacket(0x51, options);
  packet.DATA = new Buffer(macro.length);
  macro.copy(packet.DATA);
  return packetBuilder(packet);
};

exports.saveMacro = function (macro, options) {
  if (macro.length > 254) {
    throw new Error('Macro length is greater than 254 bytes');
  }
  var packet = createPacket(0x52, options);
  packet.DATA = new Buffer(macro.length);
  macro.copy(packet.DATA);
  return packetBuilder(packet);
};

exports.reInitializeMacroExecutive = function (options) {
  var packet = createPacket(0x54, options);
  return packetBuilder(packet);
};

exports.abortMacro = function (options) {
  var packet = createPacket(0x55, options);
  return packetBuilder(packet);
};

exports.getMacroStatus = function (options) {
  var packet = createPacket(0x56, options);
  return packetBuilder(packet);
};

exports.setMacroParameter = function (parameter, value, options) {
  var packet = createPacket(0x57, options);
  packet.DATA = new Buffer(3);
  packet.DATA.writeUInt8(parameter, 0);
  if (parameter > 0x01) {
    packet.DATA.writeUInt8(value, 1);
    packet.DATA.writeUInt8(0, 2);
  } else {
    packet.DATA.writeUInt16BE(value, 1);
  }
  return packetBuilder(packet);
};

exports.appendMacroChunck = function (macro, options) {
  if (macro.length > 254) {
    throw new Error('Macro length is greater than 254 bytes');
  }
  var packet = createPacket(0x58, options);
  packet.DATA = new Buffer(macro.length);
  macro.copy(packet.DATA);
  return packetBuilder(packet);
};

exports.eraseOrbBasicStorage = function (area, options) {
  var packet = createPacket(0x60, options);
  packet.DATA = new Buffer(1);
  packet.DATA.writeUInt8(area, 0);
  return packetBuilder(packet);
};

exports.appendOrbBasicFragment = function (area, fragment, options) {
  if (fragment.length > 253) {
    throw new Error('ORB Basic fragment length is greater than 253 bytes');
  }
  var packet = createPacket(0x61, options);
  packet.DATA = new Buffer(fragment.length + 1);
  packet.DATA.writeUInt8(area, 0);
  fragment.copy(packet.DATA, 1);
  return packetBuilder(packet);
};

exports.executeOrbBasicProgram = function (area, startLine, options) {
  var packet = createPacket(0x62, options);
  packet.DATA = new Buffer(3);
  packet.DATA.writeUInt8(area, 0);
  packet.DATA.writeUInt16BE(startLine, 1);
  return packetBuilder(packet);
};

exports.abortOrbBasicProgram = function (options) {
  var packet = createPacket(0x63, options);
  return packetBuilder(packet);
};

exports.submitValueToInputStatement = function (value, options) {
  var packet = createPacket(0x64, options);
  packet.DATA = new Buffer(4);
  packet.DATA.writeInt32BE(value, 0);
  return packetBuilder(packet);
};
