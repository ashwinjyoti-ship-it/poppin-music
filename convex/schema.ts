import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tracks: defineTable({
    title: v.string(),
    artist: v.string(),
    // Optional audio preview URL (HTML5 <audio> src).
    audioUrl: v.optional(v.string()),
    votes: v.number(),
    createdAt: v.number(),
  })
    // Leaderboard ordering: most "poppin" tracks first.
    .index("by_votes", ["votes"]),
});
