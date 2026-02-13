/**
 * Determines whether the current environment is Node.js.
 * @private
 */
const _isNode = () => typeof process !== 'undefined' && !!process.versions && !!process.versions.node;

/**
 * Represents the log level type.
 */
export type LogLevel = typeof LogLevels[number];

/**
 * Defines the styles for each log level.
 */
export type LogLevelStyles = {
  [key in LogLevel]: string;
};

/**
 * The log levels.
 */
export const LogLevels = [
  'severe',
  'error',
  'warning',
  'info',
  'debug',
  'trace'
] as const;

/*
 * The default log level.
 * @private
 */
let _logLevel: LogLevel = 'error';

/**
 * The default log format for the browser.
 * @private
 */
let _browserStyle: LogLevelStyles = {
  severe: "background-color: red; color:white; font-weight:bold; text-transform: uppercase;",
  error: "color:red; font-weight:bold; text-transform: uppercase;",
  warning: "color:orange; font-weight:bold; text-transform: uppercase;",
  info: "color:blue; font-weight:bold; text-transform: uppercase;",
  debug: "color:green; font-weight:bold; text-transform: uppercase;",
  trace: "color:grey; font-weight:bold; text-transform: uppercase;"
};

/**
 * The default log format for the terminal.
 * @private
 */
let _terminalStyle: LogLevelStyles = {
  severe: "\x1b[37m\x1b[41m",
  error: "\x1b[31m",
  warning: "\x1b[33m",
  info: "\x1b[34m",
  debug: "\x1b[32m",
  trace: "\x1b[90m"
};

/**
 * Retrieves the style format for the browser.
 *
 * @returns The style format for the browser.
 */
export const getBrowserStyle = () => _browserStyle;

/**
 * Sets the style format for a specific log level.
 *
 * @param level - The log level to set the style format for.
 * @param newFormat - The new style format to apply e.g.: `color: red; font-weight: bold;`.
 */
export const setBrowserStyle = (newFormat: string, level: LogLevel) => {
  _browserStyle[level] = newFormat;
};

/**
 * Retrieves the style format for the terminal.
 *
 * @returns The style format for the terminal.
 */
export const getTerminalStyle = () => _terminalStyle;

/**
 * Sets the style format for a specific log level.
 *
 * @param level - The log level to set the style format for.
 * @param newFormat - The new style format to apply. e.g: `\x1b[31m`.
 */
export const setTerminalStyle = (level: LogLevel, newFormat: string) => {
  _terminalStyle[level] = newFormat;
}

/**
 * Retrieves the current log level.
 *
 * @returns The current log level.
 */
export const getLogLevel = () => _logLevel;

/**
 * Sets the log level.
 *
 * @param level - The log level to set.
 */
export const setLogLevel = (level: LogLevel) => {
  _logLevel = level;
};

/**
 * Safely formats a value for logging.
 *
 * Handles primitives, errors, functions, circular objects, and objects with custom `toString` methods.
 *
 * @param value - The value to format.
 * @returns A formatted string or the original value if it's already loggable.
 * @private
 */
const _formatValue = (value: any): any => {
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }

  try {
    return JSON.stringify(value, _getCircularReplacer(), 2);
  } catch {
    if (value instanceof Error) return value.stack || value.message;
    if (typeof value === 'function') return '[Function]';
    if (value?.toString) return value.toString();
    return '[Unloggable]';
  }
};

/**
 * Creates a replacer function to safely stringify circular structures.
 *
 * Used with JSON.stringify to avoid TypeErrors on circular references.
 *
 * @returns A replacer function for use in JSON.stringify.
 * @private
 */
const _getCircularReplacer = (): ((key: string, value: any) => any) => {
  const seen = new WeakSet();
  return (_key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) return '[Circular]';
      seen.add(value);
    }
    return value;
  };
};

/**
 * Retrieves the current timestamp.
 *
 * @returns A timestamp string in the format "YYYY-MM-DDTHH:MM:SS±HH:MM".
 * The timestamp includes the local timezone offset.
 * @private
 */
const _getTimeStamp = (): string => {
  const now = new Date();

  // Get offset like "+02:00"
  const offsetMinutes = now.getTimezoneOffset();
  const absOffset = Math.abs(offsetMinutes);
  const sign = offsetMinutes <= 0 ? '+' : '-';
  const pad = (n: number) => String(n).padStart(2, '0');
  const tzOffset = `${sign}${pad(Math.floor(absOffset / 60))}:${pad(absOffset % 60)}`;

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T` +
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}${tzOffset}`;
};

/**
 * Determines whether a log message with the given level should be logged.
 *
 * @param level - The log level to check.
 * @returns A boolean indicating whether the log message should be logged.
 * @private
 */
function _shouldLog(level: LogLevel) {
  return LogLevels.indexOf(level) <= LogLevels.indexOf(_logLevel);
};

/**
 * Logs a message with the specified log level.
 *
 * @param level - The log level.
 * @param messages - The messages to be logged.
 * @private
 */
const _log = (level: LogLevel, ...messages: any) => {
  if (_shouldLog(level)) {

    const formattedMessages = messages.map(_formatValue);

    if (_isNode()) {
      console.log(
        _getTimeStamp(),
        _terminalStyle[level],
        `[${level.toUpperCase()}]`,
        '\x1b[0m',
        ...formattedMessages
      );
    } else {
      console.log(
        `${_getTimeStamp()} %c[${level}]%c ${formattedMessages.join(' ')}`,
        _browserStyle[level],
        ""
      );
    }
  }
};

/**
 * Logs a severe message.
 *
 * @param messages - The messages to be logged.
 */
const severe = (...messages: any) => _log('severe', ...messages);

/**
 * Logs an error message.
 *
 * @param messages - The messages to be logged.
 */
const error = (...messages: any) => _log('error', ...messages);

/**
 * Logs an informational message.
 *
 * @param messages - The messages to be logged.
 */
const info = (...messages: any) => _log('info', ...messages);

/**
 * Logs a warning message.
 *
 * @param messages - The messages to be logged.
 */
const warning = (...messages: any) => _log('warning', ...messages);

/**
 * Logs a debug message.
 *
 * @param messages - The messages to be logged.
 */
const debug = (...messages: any) => _log('debug', ...messages);

/**
 * Logs a trace message.
 *
 * @param messages - The messages to be logged.
 */
const trace = (...messages: any) => _log('trace', ...messages);

export const logger = {
  severe,
  error,
  info,
  warning,
  debug,
  trace
};
