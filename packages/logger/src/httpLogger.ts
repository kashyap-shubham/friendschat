import pinoHttp from "pino-http";
import { logger } from "./logger";

export const httpLogger = pinoHttp({logger,

  // only log important request data
  serializers: {

    req(req) {
      return {
        method: req.method,
        url: req.url,
      };
    },

    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },


  // success log format
  customSuccessMessage(req, res) {

    return `${req.method} ${req.url} ${res.statusCode}`;

  },


  // error log format
  customErrorMessage(req, res) {

    return `${req.method} ${req.url} ${res.statusCode}`;

  },

  // remove noisy logs
  quietReqLogger: true,

});