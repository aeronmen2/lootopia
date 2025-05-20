import { relations } from "drizzle-orm"
import {
  users,
  authTokens,
  sessions,
  hunts,
  huntParticipants,
  huntMaps,
  huntMarkers,
  caches,
  digActions,
} from "./schemas"

// Utilisateurs
export const usersRelations = relations(users, ({ many }) => ({
  authTokens: many(authTokens),
  sessions: many(sessions),

  huntParticipants: many(huntParticipants),
}))

// AuthTokens (inchangé)
export const authTokensRelations = relations(authTokens, ({ one }) => ({
  user: one(users, {
    fields: [authTokens.userId],
    references: [users.id],
  }),
}))

// Sessions (inchangé)
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

// Chasses
export const huntsRelations = relations(hunts, ({ many, one }) => ({
  organizer: one(users, {
    fields: [hunts.organizerId],
    references: [users.id],
  }),
  huntParticipants: many(huntParticipants),
  huntMaps: many(huntMaps),
  caches: many(caches),
}))

// Participants à une chasse
export const huntParticipantsRelations = relations(huntParticipants, ({ one }) => ({
  hunt: one(hunts, {
    fields: [huntParticipants.huntId],
    references: [hunts.id],
  }),
  user: one(users, {
    fields: [huntParticipants.userId],
    references: [users.id],
  }),
}))

// Cartes de chasse
export const huntMapsRelations = relations(huntMaps, ({ one, many }) => ({
  hunt: one(hunts, {
    fields: [huntMaps.huntId],
    references: [hunts.id],
  }),
  huntMarkers: many(huntMarkers),
  caches: many(caches),
}))

// Repères sur carte
export const huntMarkersRelations = relations(huntMarkers, ({ one }) => ({
  map: one(huntMaps, {
    fields: [huntMarkers.mapId],
    references: [huntMaps.id],
  }),
}))

// Caches
export const cachesRelations = relations(caches, ({ one, many }) => ({
  hunt: one(hunts, {
    fields: [caches.huntId],
    references: [hunts.id],
  }),
  map: one(huntMaps, {
    fields: [caches.mapId],
    references: [huntMaps.id],
  }),
  digActions: many(digActions),
}))

// Actions de creusage
export const digActionsRelations = relations(digActions, ({ one }) => ({
  cache: one(caches, {
    fields: [digActions.cacheId],
    references: [caches.id],
  }),
  user: one(users, {
    fields: [digActions.userId],
    references: [users.id],
  }),
}))
