import type { Context } from "hono";
import { MapService } from "../services/mapService";
import { HuntMapModel } from "../models/maps";

export class MapController {
  static async create(c: Context) {
    try {
      const body = await c.req.json();
      const validatedData = HuntMapModel.validate(body);
      const map = await MapService.create(validatedData);

      return c.json({ success: true, data: map }, 201);
    } catch (error) {
      return MapController.handleError(c, error, "Failed to create map");
    }
  }

  static async getByHuntId(c: Context) {
    try {
      const huntId = c.req.param("huntId");
      const maps = await MapService.findByHuntId(huntId);

      return c.json({ success: true, data: maps });
    } catch (error) {
      return MapController.handleError(c, error, "Failed to fetch maps by hunt ID");
    }
  }

  static async getById(c: Context) {
    try {
      const mapId = c.req.param("id");
      const map = await MapService.findById(mapId);

      if (!map) {
        return c.json({ success: false, message: "Map not found" }, 404);
      }

      return c.json({ success: true, data: map });
    } catch (error) {
      return MapController.handleError(c, error, "Failed to fetch map details");
    }
  }

  static async update(c: Context) {
    try {
      const mapId = c.req.param("id");
      const body = await c.req.json();
      const validatedData = HuntMapModel.validate(body);

      const updatedMap = await MapService.update(mapId, validatedData);

      if (!updatedMap) {
        return c.json({ success: false, message: "Map not found" }, 404);
      }

      return c.json({ success: true, data: updatedMap });
    } catch (error) {
      return MapController.handleError(c, error, "Failed to update map");
    }
  }

  static async delete(c: Context) {
    try {
      const mapId = c.req.param("id");
      const deletedMap = await MapService.delete(mapId);

      if (!deletedMap) {
        return c.json({ success: false, message: "Map not found" }, 404);
      }

      return c.json({ success: true, data: deletedMap });
    } catch (error) {
      return MapController.handleError(c, error, "Failed to delete map");
    }
  }

  private static handleError(c: Context, error: unknown, message: string) {
    console.error(message + ":", error);
    
    return c.json({ success: false, message }, 500);
  }
}