import { relations } from "drizzle-orm"
import {
  users, authTokens, sessions, hunts, participant, map, cache, dig, artefact, userArtefact, exchange, userStep, step
} from "./schemas"

// Utilisateurs
export const usersRelations = relations(users, ({ many }) => ({
  authTokens: many(authTokens),
  sessions: many(sessions),

  participant: many(participant),
  exchange: many(exchange),
  userArtefact: many(userArtefact),
  userStep: many(userStep),
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
  participant: many(participant),
  map: many(map),
  cache: many(cache),
  userArtefact: many(userArtefact),
}))

// Participants à une chasse
export const participantRelations = relations(participant, ({ one }) => ({
  hunt: one(hunts, {
    fields: [participant.huntId],
    references: [hunts.id],
  }),
  user: one(users, {
    fields: [participant.userId],
    references: [users.id],
  }),
}))

// Cartes de chasse
export const mapRelations = relations(map, ({ one, many }) => ({
  hunt: one(hunts, {
    fields: [map.huntId],
    references: [hunts.id],
  }),
  step: many(step),
}))

// step
export const stepRelations = relations(step, ({ one, many }) => ({
  map: one(map, {
    fields: [step.mapId],
    references: [map.id],
  }),
  cache: many(cache),
  userStep: many(userStep),
}))

// cache
export const cacheRelations = relations(cache, ({ one }) => ({
  step: one(step, {
    fields: [cache.stepId],
    references: [step.id],
  }),
}))

// Actions de creusage
export const digRelations = relations(dig, ({ one }) => ({
  cache: one(cache, {
    fields: [dig.cacheId],
    references: [cache.id],
  }),
  user: one(users, {
    fields: [dig.userId],
    references: [users.id],
  }),
}))

// exchange
export const exchangeRelations = relations(exchange, ({ one }) => ({
  userSender: one(users, {
    fields: [exchange.userSender],
    references: [users.id],
  }),
  userReceiver: one(users, {
    fields: [exchange.userReceiver],
    references: [users.id],
  }),
  Artefact: one(artefact, {
    fields: [exchange.artefactId],
    references: [artefact.id],
  }),
}))

// Artefact
export const artefactRelations = relations(artefact, ({ many }) => ({
  exchange: many(exchange),
  userArtefact: many(userArtefact),
}))

// UserArtefact
export const userArtefactRelations = relations(userArtefact, ({ one }) => ({
  user: one(users, {
    fields: [userArtefact.userId],
    references: [users.id],
  }),
  Artefact: one(artefact, {
    fields: [userArtefact.artefactId],
    references: [artefact.id],
  }),
  hunt: one(hunts, {
    fields: [userArtefact.huntId],
    references: [hunts.id],
  }),
}))

// UserStep
export const userStepRelations = relations(userStep, ({ one }) => ({
  user: one(users, {
    fields: [userStep.userId],
    references: [users.id],
  }),
  step: one(step, {
    fields: [userStep.stepId],
    references: [step.id],
  }),
}))