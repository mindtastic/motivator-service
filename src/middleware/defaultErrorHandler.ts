import type { Response, ErrorRequestHandler } from 'express';
import log from 'loglevel';

const isDevEnvironment = () => process.env.NODE_ENV === 'development';
const logError = log.error;
const isErrorCode = (statusCode: Number) => (statusCode >= 400 && statusCode < 600);

const errorMessage = (error: Error): String => {
  if (error.stack) {
    return error.stack;
  }

  if (typeof error.toString === 'function') {
    return error.toString();
  }

  return '';
};

const errorStatusCode = ({ error, response } : { error: any, response: Response }) => {
  const statusCodeFromError = error.status || error.statusCode;
  if (statusCodeFromError && isErrorCode(statusCodeFromError)) {
    return statusCodeFromError;
  }

  // Is status code already set to an error
  if (isErrorCode(response.statusCode)) {
    return response.statusCode;
  }

  // Internal server error
  return 500;
};

export const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  logError(errorMessage(error));

  if (response.headersSent) {
    return next(error);
  }

  response.status(errorStatusCode(error));
  if (isDevEnvironment()) {
    response.send({ error: errorMessage(error) });
  }

  return next();
};

export default errorHandler;
