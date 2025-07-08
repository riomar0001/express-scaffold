import { NextFunction, Request, Response } from "express";

export const cacheControl = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  res.setHeader("X-API-Version", "1.0");
  res.setHeader("X-Request-ID", req.headers["x-request-id"] || "unknown");

  next();
};
