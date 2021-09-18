import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, label, printf, json, errors, splat, colorize } =
  format;

const simpleFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  level: process.env.LOGGING_LEVEL,
  format: combine(
    label({ label: "recart-logs" }),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    json(),
    errors({ stack: true }),
    splat(),
    simpleFormat
  ),
  transports: [
    new transports.Console({
      format: colorize(),
    }),
    /*
      AWS doenst allow file/folder write.
      So only using console logging.
    */
    // new transports.File({ filename: "logs/error.log", level: "error" }),
    // new transports.File({ filename: "logs/combined.log" }),
    // new transports.DailyRotateFile({
    //   filename: "recart-combined-%DATE%.log",
    //   datePattern: "YYYY-MM-DD",
    //   maxSize: "20m",
    //   maxFiles: "30d",
    //   dirname: "logs",
    //   level: process.env.LOGGING_LEVEL,
    // }),
    // new transports.DailyRotateFile({
    //   filename: "recart-error-%DATE%.log",
    //   datePattern: "YYYY-MM-DD",
    //   maxSize: "20m",
    //   maxFiles: "30d",
    //   dirname: "logs",
    //   level: "error",
    // }),
  ],
});

export default logger;
