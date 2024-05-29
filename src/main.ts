/**
 * Determines whether the current environment is Node.js.
 */
const isNode = typeof process !== 'undefined' && !!process.versions && !!process.versions.node;

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

/**
 * The default log level.
 */
let logLevel: LogLevel = 'error';

/**
 * The default log format for the browser.
 */
let browserStyle: LogLevelStyles = {
  severe: "background-color: red; color:white; font-weight:bold; text-transform: uppercase;",
  error: "color:green; font-weight:bold; text-transform: uppercase;",
  warning: "color:orange; font-weight:bold; text-transform: uppercase;",
  info: "color:blue; font-weight:bold; text-transform: uppercase;",
  debug: "color:green; font-weight:bold; text-transform: uppercase;",
  trace: "color:grey; font-weight:bold; text-transform: uppercase;"
};

/**
 * The default log format for the terminal.
 */
let terminalStyle: LogLevelStyles = {
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
export const getBrowserStyle = () => browserStyle;

/**
 * Sets the style format for a specific log level.
 *
 * @param level - The log level to set the style format for.
 * @param newFormat - The new style format to apply e.g.: `color: red; font-weight: bold;`.
 */
export const setBrowserStyle = (newFormat: string, level: LogLevel) => {
  browserStyle[level] = newFormat;
};

/**
 * Retrieves the style format for the terminal.
 *
 * @returns The style format for the terminal.
 */
export const getTerminalStyle = () => terminalStyle;

/**
 * Sets the style format for a specific log level.
 *
 * @param level - The log level to set the style format for.
 * @param newFormat - The new style format to apply. e.g: `\x1b[31m`.
 */
export const setTerminalStyle = (level: LogLevel, newFormat: string) => {
  terminalStyle[level] = newFormat;
}

/**
 * Retrieves the current log level.
 *
 * @returns The current log level.
 */
export const getLogLevel = () => logLevel;

/**
 * Sets the log level.
 *
 * @param level - The log level to set.
 */
export const setLogLevel = (level: LogLevel) => {
  logLevel = level;
};

/**
 * Logs a message with the specified log level.
 *
 * @param level - The log level.
 * @param message - The message to be logged.
 */
export const log = (level: LogLevel, message: string) => {
  if (shouldLog(level)) {
    if (isNode) {
      console.log(terminalStyle[level], `[${level.toUpperCase()}]`, '\x1b[0m', message);
    } else {
      console.log(`%c[${level}]`, browserStyle[level], message)
    }
  }
};

/**
 * Logs a severe message.
 *
 * @param message - The message to log.
 */
export const severe = (message: string) => log('severe', message);

/**
 * Logs an error message.
 *
 * @param message - The error message to log.
 */
export const error = (message: string) => log('error', message);

/**
 * Logs an informational message.
 *
 * @param message - The message to log.
 */
export const info = (message: string) => log('info', message);

/**
 * Logs a warning message.
 *
 * @param message - The warning message to log.
 */
export const warning = (message: string) => log('warning', message);

/**
 * Logs a debug message.
 *
 * @param message - The message to be logged.
 */
export const debug = (message: string) => log('debug', message);

/**
 * Logs a trace message.
 *
 * @param message - The message to be logged.
 */
export const trace = (message: string) => log('trace', message);

/**
 * Determines whether a log message with the given level should be logged.
 *
 * @param level - The log level to check.
 * @returns A boolean indicating whether the log message should be logged.
 */
function shouldLog(level: LogLevel) {
  return LogLevels.indexOf(level) <= LogLevels.indexOf(logLevel);
};

export default {
  setBrowserStyle,
  setTerminalStyle,
  getLogLevel,
  setLogLevel,
  log,
  severe,
  error,
  info,
  warning,
  debug,
  trace
};
