import type { Context } from "hono"
import { HuntModel } from "../models/hunts"
import { HuntService } from "../services/huntService"
import { HuntParticipantModel } from "../models/participants"
import { HuntParticipantService } from "../services/huntParticipantService"

export class HuntController {
  // Chasses
  static async create(c: Context) {
    try {
      const body = await c.req.json()
      const validatedData = HuntModel.validate(body)
      const hunt = await HuntService.create(validatedData)
      
      return c.json({ success: true, data: hunt }, 201)
    } catch (error) {
      return HuntController.handleError(c, error, "Failed to create hunt")
    }
  }

  static async getAll(c: Context) {
    try {
      const hunts = await HuntService.findAll()
      
      return c.json({ success: true, data: hunts })
    } catch (error) {
      return HuntController.handleError(c, error, "Failed to fetch hunts")
    }
  }

  static async getHuntDetails(c: Context) {
    try {
      const id = c.req.param("id")
      const huntWithDetails = await HuntService.findById(id)
      
      return c.json({ success: true, data: huntWithDetails })
    } catch (error) {
      return HuntController.handleError(c, error, "Failed to fetch hunt details")
    }
  }
  
  static async getHuntByOrganizer(c: Context) {
    try {
      const organizerId = c.req.param("organizerId")
      const hunts = await HuntService.findByOrganizerId(organizerId)
      
      return c.json({ success: true, data: hunts })
    } catch (error) {
      return HuntController.handleError(c, error, "Failed to fetch hunts by organizer")
    }
  }

  static async getHuntByParticipantId(c: Context) {
    try {
      const participantId = c.req.param("participantId")
      const hunts = await HuntParticipantService.findByUserId(participantId)
      
      return c.json({ success: true, data: hunts })
    } catch (error) {
      return HuntController.handleError(c, error, "Failed to fetch hunts by participant")
    }
  }

  static async update(c: Context) {
    try {
      const id = c.req.param("id")
      const body = await c.req.json()
      const validatedData = HuntModel.validate(body)
      const updatedHunt = await HuntService.update(id, validatedData)
      
      return c.json({ success: true, data: updatedHunt })
    } catch (error) {
      return HuntController.handleError(c, error, "Failed to update hunt")
    }
  }

  static async delete(c: Context) {
    try {
      const id = c.req.param("id")
      const deletedHunt = await HuntService.delete(id)
      
      return c.json({ success: true, data: deletedHunt })
    } catch (error) {
      return HuntController.handleError(c, error, "Failed to delete hunt")
    }
  }

  static async addUserToHunt(c: Context) {
    try {
      const huntId = c.req.param("id")
      const userId = c.req.param("userId")
      const validatedData = HuntParticipantModel.validate({huntId, userId})
      const step = await HuntParticipantService.create(validatedData)

      
        return c.json({ success: true, data: step }, 201)
    } catch (error) {
      return HuntController.handleError(c, error, "Failed to add user to hunt")
    }
  }

  static async getHuntParticipants(c: Context) {
    try {
      const huntId = c.req.param("id")
      const participants = await HuntParticipantService.findByHuntId(huntId)
      
      return c.json({ success: true, data: participants })
    } catch (error) {
      return HuntController.handleError(c, error, "Failed to fetch hunt participants")
    }
  }

  static async removeUserFromHunt(c: Context) {
    try {
      const huntId = c.req.param("id")
      const userId = c.req.param("userId")
      const result = await HuntParticipantService.deleteByHuntIdAndUserId(huntId, userId)
      
      return c.json({ success: true, data: result })
    } catch (error) {
      return HuntController.handleError(c, error, "Failed to remove user from hunt")
    }
  }

  private static handleError(c: Context, error: unknown, message: string) {
    console.error(message + ":", error)

    
        return c.json(
      { 
        success: false, 
        message,
        error: error instanceof Error ? error.message : "Unknown error" 
      }, 
      500
    )
  }
}
