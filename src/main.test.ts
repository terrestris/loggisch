import { describe, expect, test, spyOn, beforeEach } from "bun:test";

import loggisch from "./main";

const logSpy = spyOn(loggisch, "log");
const consoleSpy = spyOn(console, "log");

describe("loglevel handling", () => {

  test("getLoglevel returns the current loglevel", () => {
    expect(loggisch.getLogLevel()).toBe('error');
  });

  test("setLogLevel changes the loglevel", () => {
    loggisch.setLogLevel('info');
    expect(loggisch.getLogLevel()).toBe('info');
  });

});

describe("logging", () => {

  beforeEach(() => {
    logSpy.mockClear();
    consoleSpy.mockClear();
  });

  test("log logs a message with the specified level", () => {
    loggisch.log('info', 'info message');
    expect(consoleSpy).toHaveBeenCalled();
  });

  test("severe logs a message with level severe", () => {
    loggisch.severe('severe message');
    expect(logSpy).toHaveBeenCalledWith('severe', 'severe message');
  });

  test("error logs a message with level error", () => {
    loggisch.error('error message');
    expect(logSpy).toHaveBeenCalledWith('error', 'error message');
  });

  test("warning logs a message with level warning", () => {
    loggisch.warning('warning message');
    expect(logSpy).toHaveBeenCalledWith('warning', 'warning message');
  });

  test("info logs a message with level info", () => {
    loggisch.info('info message');
    expect(logSpy).toHaveBeenCalledWith('info', 'info message');
  });

  test("debug logs a message with level debug", () => {
    loggisch.debug('debug message');
    expect(logSpy).toHaveBeenCalledWith('debug', 'debug message');
  });

  test("trace logs a message with level trace", () => {
    loggisch.trace('trace message');
    expect(logSpy).toHaveBeenCalledWith('trace', 'trace message');
  });

});
