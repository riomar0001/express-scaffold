import { Request, Response, NextFunction } from "express";

/**
 * This middleware sets a timeout for requests. If the request takes longer than the specified timeout,
 * it responds with a 408 Request Timeout status code.
 * @example app.use(requestTimeout(30000)); // Set timeout to 30 seconds
 */
export const requestTimeout = (timeout: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).json({
          status: 408,
          success: false,
          message: "Request timeout",
        });
      }
    }, timeout);

    const originalEnd = res.end;
    res.end = function (...args: any[]) {
      clearTimeout(timer);
      return originalEnd.apply(res, args as any);
    };

    next();
  };
};
