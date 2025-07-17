import { describe, expect, test, spyOn, beforeEach } from "bun:test";

import { logger, getTerminalStyle, getLogLevel, setLogLevel } from "./main";

const consoleSpy = spyOn(console, "log");

describe("loglevel handling", () => {

  test("getLoglevel returns the current loglevel", () => {
    expect(getLogLevel()).toBe('error');
  });

  test("setLogLevel changes the loglevel", () => {
    setLogLevel('info');
    expect(getLogLevel()).toBe('info');
  });

});

describe("logging", () => {

  beforeEach(() => {
    setLogLevel('trace');
  });


  test("severe logs a message with level severe", () => {
    logger.severe('severe message');
    expect(consoleSpy).toHaveBeenCalledWith(expect.any(String), getTerminalStyle()['severe'], `[SEVERE]`, '\x1b[0m', 'severe message');
  });

  test("error logs a message with level error", () => {
    logger.error('error message');
    expect(consoleSpy).toHaveBeenCalledWith(expect.any(String), getTerminalStyle()['error'], `[ERROR]`, '\x1b[0m', 'error message');
  });

  test("warning logs a message with level warning", () => {
    logger.warning('warning message');
    expect(consoleSpy).toHaveBeenCalledWith(expect.any(String), getTerminalStyle()['warning'], `[WARNING]`, '\x1b[0m', 'warning message');
  });

  test("info logs a message with level info", () => {
    logger.info('info message');
    expect(consoleSpy).toHaveBeenCalledWith(expect.any(String), getTerminalStyle()['info'], `[INFO]`, '\x1b[0m', 'info message');
  });

  test("debug logs a message with level debug", () => {
    logger.debug('debug message');
    expect(consoleSpy).toHaveBeenCalledWith(expect.any(String), getTerminalStyle()['debug'], `[DEBUG]`, '\x1b[0m', 'debug message');
  });

  test("trace logs a message with level trace", () => {
    logger.trace('trace message');
    expect(consoleSpy).toHaveBeenCalledWith(expect.any(String), getTerminalStyle()['trace'], `[TRACE]`, '\x1b[0m', 'trace message');
  });

});
