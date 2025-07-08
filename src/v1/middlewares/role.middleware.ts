import { Request, Response, NextFunction } from "express";

export const checkRole = (...allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }

    next();
};
