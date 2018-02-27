import util from "util";
import BaseCommand from "../../base-mobile-command";
import settings from "../../settings";

const MAX_TIMEOUT = settings.COMMAND_MAX_TIMEOUT;
const WAIT_INTERVAL = settings.WAIT_INTERVAL;

const ResetApp = function (nightwatch = null) {
  BaseCommand.call(this, nightwatch);
  this.cmd = "resetapp";
};

util.inherits(ResetApp, BaseCommand);

ResetApp.prototype.do = function (value) {
  this.pass({ actual: value });
};

ResetApp.prototype.checkConditions = function () {
  const self = this;

  const options = {
    path: `/session/${this.client.sessionId}/appium/app/reset`,
    method: "POST",
    data: {}
  };

  self.protocol(options, (result) => {
    if (result.status === 0) {
      // sucessful
      self.seenCount += 1;
    }

    const elapsed = (new Date()).getTime() - self.startTime;
    if (self.seenCount >= 1 || elapsed > MAX_TIMEOUT) {
      if (self.seenCount >= 1) {
        const elapse = (new Date()).getTime();
        self.time.executeAsyncTime = elapse - self.startTime;
        self.time.seleniumCallTime = 0;
        self.do({ actual: result.value });
      } else {
        self.fail({
          code: settings.FAILURE_REASONS.BUILTIN_COMMAND_TIMEOUT,
          message: self.failureMessage
        });
      }
    } else {
      setTimeout(self.checkConditions, WAIT_INTERVAL);
    }
  });
};

ResetApp.prototype.command = function (cb) {
  this.cb = cb;

  this.successMessage = "App was reset after %d milliseconds.";
  this.failureMessage = "App wasn't reset after %d milliseconds.";

  this.startTime = (new Date()).getTime();

  // Track how many times selector is successfully checked by /element protocol
  this.seenCount = 0;
  this.checkConditions();

  return this;
};

module.exports = ResetApp;
