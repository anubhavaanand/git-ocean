import { sqliteTable, text, integer, real, uniqueIndex, index } from 'drizzle-orm/sqlite-core'
import { user } from '@/server/modules/auth/db/schema'

export const repositories = sqliteTable('git_ocean_repositories', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  githubRepoId: integer('github_repo_id').notNull(),
  fullName: text('full_name').notNull(),
  description: text('description'),
  language: text('language'),
  stars: integer('stars').notNull().default(0),
  forks: integer('forks').notNull().default(0),
  issues: integer('issues').notNull().default(0),
  prs: integer('prs').notNull().default(0),
  lastPushedAt: integer('last_pushed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  userGithubIdx: uniqueIndex('repositories_user_github_idx').on(table.userId, table.githubRepoId),
}))

export const oceanStates = sqliteTable('git_ocean_states', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().unique().references(() => user.id, { onDelete: 'cascade' }),
  whaleSize: integer('whale_size').notNull().default(1),
  whaleColor: text('whale_color').notNull().default('#06B6D4'),
  oceanDepth: integer('ocean_depth').notNull().default(0),
  coralCount: integer('coral_count').notNull().default(0),
  totalCreatures: integer('total_creatures').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  userIdIdx: uniqueIndex('ocean_states_user_id_idx').on(table.userId),
}))

export const creatures = sqliteTable('git_ocean_creatures', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  repoId: text('repo_id').notNull().references(() => repositories.id, { onDelete: 'cascade' }),
  creatureType: text('creature_type', {
    enum: ['jellyfish', 'seahorse', 'turtle', 'dolphin', 'shark', 'whale', 'octopus', 'ray', 'crab', 'anglerfish'],
  }).notNull(),
  creatureName: text('creature_name').notNull(),
  positionX: real('position_x').notNull().default(0),
  positionY: real('position_y').notNull().default(0),
  positionZ: real('position_z').notNull().default(0),
  scaleX: real('scale_x').notNull().default(1),
  scaleY: real('scale_y').notNull().default(1),
  scaleZ: real('scale_z').notNull().default(1),
  health: integer('health').notNull().default(100),
  level: integer('level').notNull().default(1),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  userIdIdx: index('creatures_user_id_idx').on(table.userId),
  repoIdIdx: index('creatures_repo_id_idx').on(table.repoId),
}))

export const worldMapData = sqliteTable('git_ocean_world_map', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  country: text('country').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  repoCount: integer('repo_count').notNull().default(0),
  contributionCount: integer('contribution_count').notNull().default(0),
  unlocked: integer('unlocked', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  userIdCountryIdx: uniqueIndex('world_map_user_country_idx').on(table.userId, table.country),
}))

export const gitHubConnections = sqliteTable('git_ocean_github_connections', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().unique().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token').notNull(),
  githubUsername: text('github_username').notNull(),
  githubAvatarUrl: text('github_avatar_url'),
  scope: text('scope'),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  userIdIdx: uniqueIndex('github_connections_user_id_idx').on(table.userId),
}))
