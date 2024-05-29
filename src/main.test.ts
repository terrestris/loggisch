import { describe, expect, test, spyOn, afterEach } from "bun:test";

import { getLogLevel, setLogLevel, log } from "./main";

const consoleSpy = spyOn(global.console, 'log');

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

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test("log only logs if the loglevel is high enough", () => {
    setLogLevel('info');
    log('warning', 'test');
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  test("log logs if the loglevel is high enough", () => {
    setLogLevel('info');
    log('info', 'test');
    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('waefwefwewef');
  });

});
