import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { errorResponse, successResponse } from "@utils/responseHandler";
import { updatePassService } from "@services/authentication/updatePass.service";
import { AccountUpdateError } from "@utils/customErrors";

export const updatePass = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return errorResponse(res, 400, errors.array());
  }

  const data = matchedData(req);

  try {
    const { user_id, password, confirmPassword } = data as {
      user_id: string;
      password: string;
      confirmPassword: string;
    };

    await updatePassService(user_id, password, confirmPassword);

    return successResponse(res, 200, "Password updated successfully");
  } catch (error: any) {
    if (error instanceof AccountUpdateError) {
      return errorResponse(res, 400, error.message);
    }
    return errorResponse(res, 500, "Internal Server Error");
  }
};
