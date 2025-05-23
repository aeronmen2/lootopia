import { api } from "./client"
import { Artefact } from "@/lib/types"

export const artefactApi = {
  // Créer un nouvel artefact
  create: async (data: Artefact & { file: File }): Promise<Artefact> => {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("rarity", data.rarity);

    return api("/api/artefacts", {
      method: "POST",
      body: formData,
      // Do NOT set Content-Type, the browser will set it automatically for FormData
    });
  }
}