import type { Context } from "hono";
import { ArtefactService } from "../services/artefactService";
import { UserArtefactService } from "../services/userArtefactService";
import { ExchangeService } from "../services/exchangeService";
import { UploadService } from "../services/uploadService";

export class ArtefactController {
  static async getAllArtefacts(c: Context) {
    try {
      const artefacts = await ArtefactService.findAll();

      return c.json({ success: true, data: artefacts });
    } catch (error) {
      return ArtefactController.handleError(c, error, "Failed to fetch artefacts");
    }
  }

  static async getArtefactById(c: Context) {
    try {
      const id = c.req.param("id");
      const artefact = await ArtefactService.findById(id);

      return c.json({ success: true, data: artefact });
    } catch (error) {
      return ArtefactController.handleError(c, error, "Failed to fetch artefact by ID");
    }
  }

  static async createArtefact(c: Context) {
    try {
      // On vérifie si c'est un form-data (upload d'image)
      if (c.req.header("content-type")?.includes("multipart/form-data")) {
        const body = await c.req.parseBody();
        const file = body.file;

        if (!file || !(file instanceof File)) {
          return c.json({ success: false, message: "No file uploaded" }, 400);
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const imageUrl = await UploadService.uploadFile(buffer, file.name, file.type);

        const artefactData = {
          name: typeof body.name === "string" ? body.name : "",
          description: typeof body.description === "string" ? body.description : "",
          rarity: typeof body.rarity === "string" ? body.rarity as "common" | "rare" | "epic" | "legendary" : "common",
          imageUrl,
        };

        const artefact = await ArtefactService.create(artefactData);

        return c.json({ success: true, data: artefact }, 201);
      } else {
        // JSON classique (imageUrl déjà fourni)
        const body = await c.req.json();
        const artefact = await ArtefactService.create(body);

        return c.json({ success: true, data: artefact }, 201);
      }
    } catch (err) {
      return ArtefactController.handleError(c, err, "Failed to create artefact");
    }
  }

  static async updateArtefact(c: Context) {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      const updatedArtefact = await ArtefactService.update(id, body);

      return c.json({ success: true, data: updatedArtefact });
    } catch (error) {
      return ArtefactController.handleError(c, error, "Failed to update artefact");
    }
  }

  static async deleteArtefact(c: Context) {
    try {
      const id = c.req.param("id");
      const deletedArtefact = await ArtefactService.delete(id);

      return c.json({ success: true, data: deletedArtefact });
    } catch (error) {
      return ArtefactController.handleError(c, error, "Failed to delete artefact");
    }
  }

  static async getUserArtefacts(c: Context) {
    try {
      const userId = c.req.param("userId");
      const userArtefacts = await UserArtefactService.findByUserId(userId);

      return c.json({ success: true, data: userArtefacts });
    } catch (error) {
      return ArtefactController.handleError(c, error, "Failed to fetch user artefacts");
    }
  }

  static async createUserArtefact(c: Context) {
    try {
      const body = await c.req.json();
      const userArtefact = await UserArtefactService.create(body);

      return c.json({ success: true, data: userArtefact }, 201);
    } catch (error) {
      return ArtefactController.handleError(c, error, "Failed to create user artefact");
    }
  }

  static async deleteUserArtefact(c: Context) {
    try {
      const id = c.req.param("id");
      const deletedUserArtefact = await UserArtefactService.delete(id);

      return c.json({ success: true, data: deletedUserArtefact });
    } catch (error) {
      return ArtefactController.handleError(c, error, "Failed to delete user artefact");
    }
  }

  static async getArtefactSend(c: Context) {
    try {
      const userId = c.req.param("userId");
      const exchanges = await ExchangeService.findByUserSender(userId);

      return c.json({ success: true, data: exchanges });
    } catch (error) {
      return ArtefactController.handleError(c, error, "Failed to fetch artefact exchanges");
    }
  }

  static async getArtefactReceive(c: Context) {
    try {
      const userId = c.req.param("userId");
      const exchanges = await ExchangeService.findByUserReceiver(userId);

      return c.json({ success: true, data: exchanges });
    } catch (error) {
      return ArtefactController.handleError(c, error, "Failed to fetch artefact exchanges");
    }
  }

  static async createExchange(c: Context) {
    try {
      const body = await c.req.json();
      const exchange = await ExchangeService.create(body);

      return c.json({ success: true, data: exchange }, 201);
    } catch (error) {
      return ArtefactController.handleError(c, error, "Failed to create exchange");
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