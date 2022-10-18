import { ILogObject, Logger } from "tslog";
import { appendFileSync }  from "fs";

const logger: Logger = new Logger({
    name: "MainLogger"
    });

    logger.attachTransport(
        {
          silly: logToTransport,
          debug: logToTransport,
          trace: logToTransport,
          info: logToTransport,
          warn: logToTransport,
          error: logToTransport,
          fatal: logToTransport,
        },
        "debug"
      );

function logToTransport(LogObject: ILogObject) {
    appendFileSync("logFile.txt", JSON.stringify(LogObject)+ "\r\n")
}

  export { logger };
