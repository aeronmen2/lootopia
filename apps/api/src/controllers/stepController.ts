import type { Context } from "hono";
import { StepService } from "../services/stepService";
import { UserStepService } from "../services/userStepService";

export class StepController {
  static async getAllSteps(c: Context) {
    try {
      const steps = await StepService.findAll();
      
      return c.json({ success: true, data: steps });
    } catch (error) {
      return StepController.handleError(c, error, "Failed to fetch steps");
    }
  }

  static async getStepById(c: Context) {
    try {
      const id = c.req.param("id");
      const step = await StepService.findById(id);
      
      return c.json({ success: true, data: step });
    } catch (error) {
      return StepController.handleError(c, error, "Failed to fetch step by ID");
    }
  }

  static async getStepsByMapId(c: Context) {
    try {
      const mapId = c.req.param("mapId");
      const steps = await StepService.findByMapId(mapId);

      return c.json({ success: true, data: steps });
    } catch (error) {
      return StepController.handleError(c, error, "Failed to fetch steps by map ID");
    }
  }

  static async createStep(c: Context) {
    try {
      const body = await c.req.json();
      const step = await StepService.create(body);

      return c.json({ success: true, data: step }, 201);
    } catch (error) {
      return StepController.handleError(c, error, "Failed to create step");
    }
  }

  static async updateStep(c: Context) {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      const updatedStep = await StepService.update(id, body);
      
      return c.json({ success: true, data: updatedStep });
    } catch (error) {
      return StepController.handleError(c, error, "Failed to update step");
    }
  }

  static async deleteStep(c: Context) {
    try {
      const id = c.req.param("id");
      const deletedStep = await StepService.delete(id);

      return c.json({ success: true, data: deletedStep });
    } catch (error) {
      return StepController.handleError(c, error, "Failed to delete step");
    }
  }

  static async getUserSteps(c: Context) {
    try {
      const userId = c.req.param("userId");
      const userSteps = await UserStepService.findByUserId(userId);

      return c.json({ success: true, data: userSteps });
    } catch (error) {
      return StepController.handleError(c, error, "Failed to fetch user steps");
    }
  }

  static async getStepsByStepId(c: Context) {
    try {
      const stepId = c.req.param("stepId");
      const steps = await UserStepService.findByStepId(stepId);

      return c.json({ success: true, data: steps });
    } catch (error) {
      return StepController.handleError(c, error, "Failed to fetch steps by step ID");
    }
  }

  static async createUserStep(c: Context) {
    try {
      const body = await c.req.json();
      const userStep = await UserStepService.create(body);

      return c.json({ success: true, data: userStep }, 201);
    } catch (error) {
      return StepController.handleError(c, error, "Failed to create user step");
    }
  }

  static async updateUserStep(c: Context) {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      const updatedUserStep = await UserStepService.update(id, body);

      return c.json({ success: true, data: updatedUserStep });
    } catch (error) {
      return StepController.handleError(c, error, "Failed to update user step");
    }
  }

  static async deleteUserStep(c: Context) {
    try {
      const id = c.req.param("id");
      const deletedUserStep = await UserStepService.delete(id);

      return c.json({ success: true, data: deletedUserStep });
    } catch (error) {
      return StepController.handleError(c, error, "Failed to delete user step");
    }
  }

  private static handleError(c: Context, error: unknown, message: string) {
    console.error(message + ":", error);
    
    return c.json(
      {
        success: false,
        message,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
}