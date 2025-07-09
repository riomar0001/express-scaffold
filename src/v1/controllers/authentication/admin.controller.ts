import { Request, Response } from "express";
import { adminService } from "@/v1/services/authentication/admin.service";
import { errorResponse, successResponse } from "@/utils/responseHandler";
import { NotFoundError } from "@/utils/customErrors";

export const admin = async (req: Request, res: Response) => {
  try {
    const { id } = req.user as { id: string };

    const user = await adminService(id);

    return successResponse(res, 200, "Welcome Admin", { user });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return errorResponse(res, 404, error.message);
    }

    return errorResponse(res, 500, "Internal server error");
  }
};
