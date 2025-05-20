// api/hunts.ts

import { api } from "./client"
import { Hunt } from "@/lib/types"

export interface HuntsListResponse {
  status: string
    ok: boolean
  data: Hunt[]
  message?: string
}

export interface ParticipantListResponse {
    status: string
    ok: boolean
    data: {
            id: string
            name: string
            email: string
        }[]
    message?: string
}

export interface HuntResponse {
  status: string
  ok: boolean
  data: Hunt
  message?: string
}

export interface CreateHuntResponse {
  status: string
    ok: boolean
  data: Hunt
  message?: string
}

export const huntsApi = {
  // Créer une nouvelle chasse
  create: async (data: Hunt): Promise<CreateHuntResponse> => {
    return api("/api/hunts", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Récupérer la liste des chasses (avec filtres éventuels)
  list: async (): Promise<HuntsListResponse> => {
    return api("/api/hunts", {
      method: "GET",
    })
  },

  // Récupérer une chasse par son ID
  get: async (id: string): Promise<HuntResponse> => {
    return api(`/api/hunts/${id}`, {
      method: "GET",
    })
  },

    // Récupérer les chasses d'un utilisateur
    getByUserId: async (userId: string): Promise<HuntsListResponse> => {
        return api(`/api/hunts/organizer/${userId}`, {
            method: "GET",
        })
    },

    // Récupérer les chasses d'un participant
    getByParticipantId: async (participantId: string): Promise<HuntsListResponse> => {
        return api(`/api/hunts/participant/${participantId}`, {
            method: "GET",
        })
    },

    // ajouter un participant
    addParticipant: async (huntId: string, userId: string): Promise<HuntResponse> => {
        return api(`/api/hunts/${huntId}/participant/${userId}`, {
            method: "POST",
        })
    },

    // récupérer les participants d'une chasse
    getParticipants: async (huntId: string): Promise<ParticipantListResponse> => {
        return api(`/api/hunts/${huntId}/participant`, {
            method: "GET",
        })
    },

    // supprimer un participant
    deleteParticipant: async (huntId: string, participantId: string): Promise<HuntResponse> => {
        return api(`/api/hunts/${huntId}/participant/${participantId}`, {
            method: "DELETE",
        })
    },

  // Mettre à jour une chasse
  update: async (id: string, data: Partial<Hunt>): Promise<HuntResponse> => {
    return api(`/api/hunts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  // Supprimer une chasse
  delete: async (id: string): Promise<{ status: string; message: string }> => {
    return api(`/api/hunts/${id}`, {
      method: "DELETE",
    })
  },
}
