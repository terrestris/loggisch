import { describe, expect, test, spyOn, beforeEach } from "bun:test";

import loggisch, { getTerminalStyle } from "./main";

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
    loggisch.setLogLevel('trace');
    consoleSpy.mockClear();
  });

  test("log logs a message with the specified level", () => {
    loggisch.log('info', 'info message');
    expect(consoleSpy).toHaveBeenCalled();
  });

  test("severe logs a message with level severe", () => {
    loggisch.severe('severe message');
    expect(consoleSpy).toHaveBeenCalledWith(getTerminalStyle()['severe'], `[SEVERE]`, '\x1b[0m', 'severe message');
  });

  test("error logs a message with level error", () => {
    loggisch.error('error message');
    expect(consoleSpy).toHaveBeenCalledWith(getTerminalStyle()['error'], `[ERROR]`, '\x1b[0m', 'error message');
  });

  test("warning logs a message with level warning", () => {
    loggisch.warning('warning message');
    expect(consoleSpy).toHaveBeenCalledWith(getTerminalStyle()['warning'], `[WARNING]`, '\x1b[0m', 'warning message');
  });

  test("info logs a message with level info", () => {
    loggisch.info('info message');
    expect(consoleSpy).toHaveBeenCalledWith(getTerminalStyle()['info'], `[INFO]`, '\x1b[0m', 'info message');
  });

  test("debug logs a message with level debug", () => {
    loggisch.debug('debug message');
    expect(consoleSpy).toHaveBeenCalledWith(getTerminalStyle()['debug'], `[DEBUG]`, '\x1b[0m', 'debug message');
  });

  test("trace logs a message with level trace", () => {
    loggisch.trace('trace message');
    expect(consoleSpy).toHaveBeenCalledWith(getTerminalStyle()['trace'], `[TRACE]`, '\x1b[0m', 'trace message');
  });

});
