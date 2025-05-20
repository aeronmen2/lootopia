import type { Context } from "hono"
import { DigActionModel } from "../models/dig_actions"
import { CacheService } from "../services/cacheService"
import { DigActionService } from "../services/digActionService"
import { CacheModel } from "../models/caches"

export class CacheController {
    static async create(c: Context) {
        try {
            const body = await c.req.json()
            const validatedData = CacheModel.validate(body)
            const cache = await CacheService.create(validatedData)

            return c.json({ success: true, data: cache }, 201)
        } catch (error) {
            return CacheController.handleError(c, error, "Failed to create cache")
        }
    }

    static async update(c: Context) {
        try {
            const cacheId = c.req.param("id")
            const body = await c.req.json()
            const validatedData = CacheModel.validate(body)

            const updatedCache = await CacheService.update(cacheId, validatedData)

            if (!updatedCache) {
                return c.json({ success: false, message: "Cache not found" }, 404)
            }

            return c.json({ success: true, data: updatedCache })
        } catch (error) {
            return CacheController.handleError(c, error, "Failed to update cache")
        }
    }

    static async delete(c: Context) {
        try {
            const cacheId = c.req.param("id")
            const deletedCache = await CacheService.delete(cacheId)

            if (!deletedCache) {
                return c.json({ success: false, message: "Cache not found" }, 404)
            }

            return c.json({ success: true, data: deletedCache })
        } catch (error) {
            return CacheController.handleError(c, error, "Failed to delete cache")
        }
    }

    static async getAll(c: Context) {
        try {
            const caches = await CacheService.findAll()
            const formattedCaches = caches.map(CacheModel.formatResponse)

            return c.json({ success: true, data: formattedCaches })
        } catch (error) {
            return CacheController.handleError(c, error, "Failed to fetch caches")
        }
    }

    static async getCacheDetails(c: Context) {
        try {
        const cacheId = c.req.param("id")
        const cache = await CacheService.findById(cacheId)
        
        if (!cache) {
            return c.json({ success: false, message: "Cache not found" }, 404)
        }
    
        return c.json({ success: true, data: cache })
        } catch (error) {
        return CacheController.handleError(c, error, "Failed to fetch cache details")
        }
    }

  static async logDig(c: Context) {
    try {
      const body = await c.req.json()
      const validatedData = DigActionModel.validate(body)
      
      const dig = await DigActionService.logDig(validatedData)

      
        return c.json({ success: true, data: dig }, 201)
    } catch (error) {
      return CacheController.handleError(c, error, "Failed to log dig action")
    }
  }

  static async getCacheDigs(c: Context) {
    try {
      const cacheId = c.req.param("id")
      const digs = await DigActionService.getByCache(cacheId)
      
      return c.json({ success: true, data: digs })
    } catch (error) {
      return CacheController.handleError(c, error, "Failed to fetch dig actions")
    }
  }

  private static handleError(c: Context, error: unknown, message: string) {
    console.error(message + ":", error)

    
    return c.json({ success: false, message }, 500)
  }
}
