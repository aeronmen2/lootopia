import type { Context } from "hono"
import { DigModel } from "../models/dig"
import { CacheService } from "../services/cacheService"
import { DigService } from "../services/digService"
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

    static async getCachesByStepId(c: Context) {
        try {
            const stepId = c.req.param("stepId")
            const caches = await CacheService.findByStepId(stepId)

            if (!caches) {
                return c.json({ success: false, message: "Caches not found" }, 404)
            }

            return c.json({ success: true, data: caches })
        } catch (error) {
            return CacheController.handleError(c, error, "Failed to fetch caches by step ID")
        }
    }

  static async getCacheDigs(c: Context) {
    try {
      const cacheId = c.req.param("id")
      const digs = await DigService.getByCache(cacheId)
      
      return c.json({ success: true, data: digs })
    } catch (error) {
      return CacheController.handleError(c, error, "Failed to fetch dig actions")
    }
  }

static async createDig(c: Context) {
    try {
        const body = await c.req.json()
        const validatedData = DigModel.validate(body)

        const dig = await DigService.create(validatedData)

        return c.json({ success: true, data: dig }, 201)
    } catch (error) {
        return CacheController.handleError(c, error, "Failed to create dig action")
    }
}

    static async getDigsByUserId(c: Context) {
        try {
        const userId = c.req.param("userId")
        const digs = await DigService.findByUserId(userId)
    
        if (!digs) {
            return c.json({ success: false, message: "Digs not found" }, 404)
        }
    
        return c.json({ success: true, data: digs })
        } catch (error) {
        return CacheController.handleError(c, error, "Failed to fetch digs by user ID")
        }
    }

  private static handleError(c: Context, error: unknown, message: string) {
    console.error(message + ":", error)

    
    return c.json({ success: false, message }, 500)
  }
}
