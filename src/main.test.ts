import { describe, expect, test, spyOn, afterEach, beforeEach } from "bun:test";
import { logger, getTerminalStyle, getLogLevel, setLogLevel, LogLevel } from "./main";

const consoleSpy = spyOn(console, "log");

describe("LogLevel matrix tests", () => {
  const levels: LogLevel[] = ['severe', 'error', 'warning', 'info', 'debug', 'trace'];
  const logMethods: { fn: (...args: any[]) => void; name: LogLevel }[] = [
    { fn: logger.severe, name: 'severe' },
    { fn: logger.error, name: 'error' },
    { fn: logger.warning, name: 'warning' },
    { fn: logger.info, name: 'info' },
    { fn: logger.debug, name: 'debug' },
    { fn: logger.trace, name: 'trace' },
  ];

  beforeEach(() => {
    setLogLevel('error');
    consoleSpy.mockReset();
  });

  afterEach(() => {
    setLogLevel('error');
  });

  for (const setLevel of levels) {
    test(`LogLevel '${setLevel}': prüft, welche Methoden loggen`, () => {
      setLogLevel(setLevel);
      for (let i = 0; i < logMethods.length; i++) {
        const { fn, name } = logMethods[i];
        fn(`msg-${name}`);
      }
      // Erwartung: Nur Methoden mit index <= setLevel loggen
      const setIdx = levels.indexOf(setLevel);
      for (let i = 0; i < logMethods.length; i++) {
        const { name } = logMethods[i];
        if (i <= setIdx) {
          expect(consoleSpy).toHaveBeenCalledWith(
            expect.any(String),
            getTerminalStyle()[name],
            `[${name.toUpperCase()}]`,
            '\x1b[0m',
            `msg-${name}`
          );
        } else {
          expect(consoleSpy).not.toHaveBeenCalledWith(
            expect.any(String),
            getTerminalStyle()[name],
            `[${name.toUpperCase()}]`,
            '\x1b[0m',
            `msg-${name}`
          );
        }
      }
    });
  }
});

describe("loglevel getter and setter", () => {
  beforeEach(() => {
    setLogLevel('error');
    consoleSpy.mockClear();
  });

  afterEach(() => {
    setLogLevel('error');
  });

  test("getLogLevel returns the current loglevel", () => {
    expect(getLogLevel()).toBe('error');
  });

  test("setLogLevel changes the loglevel", () => {
    setLogLevel('info');
    expect(getLogLevel()).toBe('info');
  });
});

describe("terminal logging format", () => {
  beforeEach(() => {
    setLogLevel('trace');
    consoleSpy.mockClear();
  });

  afterEach(() => {
    setLogLevel('error');
  });

  test("terminal format has correct structure for single message - error", () => {
    logger.error('peter');

    const call = consoleSpy.mock.calls[consoleSpy.mock.calls.length - 1];

    expect(call[0]).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
    expect(call[1]).toBe(getTerminalStyle()['error']);
    expect(call[2]).toBe('[ERROR]');
    expect(call[3]).toBe('\x1b[0m');
    expect(call[4]).toBe('peter');
  });

  test("terminal format has correct structure for multiple messages - error", () => {
    logger.error('peter', 'paul', 'mary');

    const call = consoleSpy.mock.calls[consoleSpy.mock.calls.length - 1];

    expect(call[0]).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
    expect(call[1]).toBe(getTerminalStyle()['error']);
    expect(call[2]).toBe('[ERROR]');
    expect(call[3]).toBe('\x1b[0m');
    expect(call[4]).toBe('peter');
    expect(call[5]).toBe('paul');
    expect(call[6]).toBe('mary');
  });

  test("terminal format works for all log levels", () => {
    const levels: LogLevel[] = ['severe', 'error', 'warning', 'info', 'debug', 'trace'];

    for (const level of levels) {
      consoleSpy.mockClear();
      logger[level]('test message');

      const call = consoleSpy.mock.calls[consoleSpy.mock.calls.length - 1];

      expect(call[0]).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
      expect(call[1]).toBe(getTerminalStyle()[level]);
      expect(call[2]).toBe(`[${level.toUpperCase()}]`);
      expect(call[3]).toBe('\x1b[0m');
      expect(call[4]).toBe('test message');
    }
  });
});

describe("browser logging format", () => {
  let originalProcess: any;

  beforeEach(() => {
    // Speichere das original process und entferne process.versions um Browser-Modus zu simulieren
    originalProcess = globalThis.process;
    delete (globalThis as any).process;
    setLogLevel('trace');
    consoleSpy.mockClear();
  });

  afterEach(() => {
    // Stelle process wieder her
    (globalThis as any).process = originalProcess;
    setLogLevel('error');
  });

  test("browser format uses correct %c pattern for single message - error", () => {
    logger.error('peter');

    const call = consoleSpy.mock.calls[consoleSpy.mock.calls.length - 1];

    expect(call[0]).toMatch(/%c\[error\]%c/);
    expect(call[0]).toContain('peter');
    expect(call[1]).toBe('color:red; font-weight:bold; text-transform: uppercase;');
    expect(call[2]).toBe('');
  });

  test("browser format uses correct %c pattern for multiple messages - error", () => {
    logger.error('peter', 'paul', 'mary');

    const call = consoleSpy.mock.calls[consoleSpy.mock.calls.length - 1];

    expect(call[0]).toMatch(/%c\[error\]%c/);
    expect(call[0]).toContain('peter paul mary');
    expect(call[1]).toBe('color:red; font-weight:bold; text-transform: uppercase;');
    expect(call[2]).toBe('');
  });

  test("browser format works for all log levels", () => {
    const levels = ['severe', 'error', 'warning', 'info', 'debug', 'trace'];
    const styles = {
      severe: "background-color: red; color:white; font-weight:bold; text-transform: uppercase;",
      error: "color:red; font-weight:bold; text-transform: uppercase;",
      warning: "color:orange; font-weight:bold; text-transform: uppercase;",
      info: "color:blue; font-weight:bold; text-transform: uppercase;",
      debug: "color:green; font-weight:bold; text-transform: uppercase;",
      trace: "color:grey; font-weight:bold; text-transform: uppercase;"
    };

    for (const level of levels) {
      consoleSpy.mockClear();
      logger[level as LogLevel]('test message');

      const call = consoleSpy.mock.calls[consoleSpy.mock.calls.length - 1];

      expect(call[0]).toMatch(new RegExp(`%c\\[${level}\\]%c`));
      expect(call[0]).toContain('test message');
      expect(call[1]).toBe(styles[level as LogLevel]);
      expect(call[2]).toBe('');
    }
  });
});
