import winston from "winston";

import DailyRotateFile from "winston-daily-rotate-file";

const fileRotateTransport = new DailyRotateFile({
  filename: "combined-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "5d",
});

const logger = winston.createLogger({
  level: "info", // 设置默认日志级别
  transports: [
    new winston.transports.Console(), // 在控制台输出日志
    // new winston.transports.File({
    //   filename: "combined.log",
    // }),
    fileRotateTransport,
  ],
});

export default logger;
