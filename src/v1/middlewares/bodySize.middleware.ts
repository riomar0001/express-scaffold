import { Request, Response, NextFunction } from "express";

/**
 * This middleware checks the size of the request body and limits it to a specified maximum size.
 * If the request body exceeds the limit, it responds with a 413 Request Entity Too Large status code.
 * @example app.use(bodySizeLimit("5mb")); // Set maximum body size to 5MB
 */
export const bodySizeLimit = (maxSize: string = "10mb") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = req.headers["content-length"];

    if (contentLength) {
      const sizeInBytes = parseInt(contentLength, 10);
      const maxSizeInBytes = parseSize(maxSize);

      if (sizeInBytes > maxSizeInBytes) {
        return res.status(413).json({
          status: 413,
          success: false,
          message: "Request entity too large",
          maxSize: maxSize,
        });
      }
    }

    next();
  };
};

const parseSize = (size: string): number => {
  const units = { b: 1, kb: 1024, mb: 1024 * 1024, gb: 1024 * 1024 * 1024 };
  const match = size.toLowerCase().match(/^(\d+)([a-z]+)$/);

  if (!match) return parseInt(size, 10);

  const [, amount, unit] = match;
  return parseInt(amount, 10) * (units[unit as keyof typeof units] || 1);
};
