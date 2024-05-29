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
 * The default log format.
 */
let format: LogLevelStyles = {
  severe: "color:dark-red; font-weight:bold; text-transform: uppercase;",
  error: "color:red; font-weight:bold; text-transform: uppercase;",
  warning: "color:orange; font-weight:bold; text-transform: uppercase;",
  info: "color:blue; font-weight:bold; text-transform: uppercase;",
  debug: "color:green; font-weight:bold; text-transform: uppercase;",
  trace: "color:grey; font-weight:bold; text-transform: uppercase;"
};

/**
 * Sets the style format for a specific log level.
 * @param level - The log level to set the style format for.
 * @param newFormat - The new style format to apply.
 */
export const setStyle = (level: LogLevel, newFormat: string) => {
  format[level] = newFormat;
};

/**
 * Retrieves the current log level.
 * @returns The current log level.
 */
export const getLogLevel = () => {
  return logLevel;
};

/**
 * Sets the log level.
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
    console.log(`%c[${level}]`, format[level], message)
  }
};

/**
 * Logs a severe message.
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
 * @param level - The log level to check.
 * @returns A boolean indicating whether the log message should be logged.
 */
function shouldLog(level: LogLevel) {
  return LogLevels.indexOf(level) <= LogLevels.indexOf(logLevel);
};

export default {
  setStyle,
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
