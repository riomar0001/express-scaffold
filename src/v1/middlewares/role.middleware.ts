import { Request, Response, NextFunction } from "express";
import { errorResponse } from "@/utils/responseHandler";

export const checkRole =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !allowedRoles.includes(user.role)) {
      return errorResponse(
        res,
        403,
        "You do not have permission to access this resource"
      );
    }

    next();
  };
