"use strict";

import Promise from "bluebird";
import chai from "chai";
import _ from "lodash";

import GetEl from "../../../lib/commands/getEl";

const expect = chai.expect;
const assert = chai.assert;

const immutableClientMock = {
  options: {
    desiredCapabilities: {
      "browserName": "chrome",
      "javascriptEnabled": true,
      "acceptSslCerts": true,
      "platform": "Windows 10",
      "id": "chrome_latest_Windows_10_Desktop",
      "version": "55",
      "name": "Google"
    }
  },
  desiredCapabilities: {
    "browserName": "chrome",
    "javascriptEnabled": true,
    "acceptSslCerts": true,
    "platform": "Windows 10",
    "id": "chrome_latest_Windows_10_Desktop",
    "version": "55",
    "name": "Google"
  },
  locateStrategy: "css",
  api: {
    executeAsync: function (fn, args, callback) {
      callback({
        state: 'success',
        sessionId: '60c692d2-7b53-4d43-a340-8d6133af13a8',
        hCode: 1895546026,
        value:
        {
          isSync: false,
          selectorLength: 1,
          isVisible: true,
          isVisibleStrict: true,
          seens: 3,
          value: { value: 'magellan_selector_2f38e1cf', sel: '[name=\'q\']' },
          selectorVisibleLength: 1
        },
        class: 'org.openqa.selenium.remote.Response',
        status: 0
      });
    },
    execute: function (fn, args, callback) {
      callback({
        state: 'success',
        sessionId: '60c692d2-7b53-4d43-a340-8d6133af13a8',
        hCode: 1895546026,
        value:
        {
          isSync: true,
          selectorLength: 1,
          isVisible: true,
          isVisibleStrict: true,
          seens: 3,
          value: { value: 'magellan_selector_2f38e1cf', sel: '[name=\'q\']' },
          selectorVisibleLength: 1
        },
        class: 'org.openqa.selenium.remote.Response',
        status: 0
      });
    }
  },
  assertion: function (result, actual, expected, message, abortonfail) { }
};


describe("GetEl", () => {
  let getEl = null;
  let clientMock = null;

  beforeEach(() => {
    clientMock = _.cloneDeep(immutableClientMock);
    getEl = new GetEl(clientMock);
  });

  it("Initialization", () => {
    expect(getEl.cmd).to.equal("getel");
  });

  describe("Pass", () => {
    it("Sync", () => {
      clientMock.assertion = function (result, actual, expected, message, abortonfail) {
        expect(result).to.equal(true);
        expect(actual).to.equal("magellan_selector_2f38e1cf");
        expect(expected).to.equal("magellan_selector_2f38e1cf");
      };

      getEl = new GetEl(clientMock, {
        syncModeBrowserList: ["chrome:55", "iphone"]
      });
      getEl.command("[name='q']");
    });

    it("Async", () => {
      clientMock.assertion = function (result, actual, expected, message, abortonfail) {
        expect(result).to.equal(true);
        expect(actual).to.equal("magellan_selector_2f38e1cf");
        expect(expected).to.equal("magellan_selector_2f38e1cf");
      };

      getEl = new GetEl(clientMock);
      getEl.command("[name='q']");
    });
  });

  describe("Fail", () => {
    it("Sync", () => {
      clientMock.api.execute = function (fn, args, callback) {
        callback({
          state: 'failed',
          sessionId: '60c692d2-7b53-4d43-a340-8d6133af13a8',
          hCode: 1895546026,
          value:
          {
            isSync: false,
            message: "fail on puspose"
          },
          class: 'org.openqa.selenium.remote.Response',
          errorStatus: 100,
          status: -1
        });
      };

      clientMock.assertion = function (result, actual, expected, message, abortonfail) {
        expect(result).to.equal(false);
        expect(actual).to.equal("not visible");
        expect(expected).to.equal("visible");
      };

      getEl = new GetEl(clientMock, {
        syncModeBrowserList: ["chrome:55", "iphone"]
      });
      getEl.command("[name='q']");
    });

    it("Async", () => {
      clientMock.api.executeAsync = function (fn, args, callback) {
        callback({
          state: 'failed',
          sessionId: '60c692d2-7b53-4d43-a340-8d6133af13a8',
          hCode: 1895546026,
          value:
          {
            isSync: false,
            message: "fail on puspose"
          },
          class: 'org.openqa.selenium.remote.Response',
          errorStatus: 100,
          status: -1
        });
      };

      clientMock.assertion = function (result, actual, expected, message, abortonfail) {
        expect(result).to.equal(false);
        expect(actual).to.equal("not visible");
        expect(expected).to.equal("visible");
      };

      getEl = new GetEl(clientMock);
      getEl.command("[name='q']");
    });
  });
});