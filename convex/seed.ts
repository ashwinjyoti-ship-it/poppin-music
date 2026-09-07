import { mutation } from "./_generated/server";
import { v } from "convex/values";

const SEED_TRACKS = [
  { title: "Pop It Up", artist: "The Fizz", votes: 7 },
  { title: "Midnight Bloom", artist: "Aria Lune", votes: 4 },
  { title: "Neon Sidewalk", artist: "Rex Vega", votes: 2 },
];

/**
 * Populate a fresh deployment with a few demo tracks.
 * Idempotent: does nothing if any tracks already exist.
 */
export const run = mutation({
  args: {},
  returns: v.object({ inserted: v.number() }),
  handler: async (ctx) => {
    const existing = await ctx.db.query("tracks").take(1);
    if (existing.length > 0) {
      return { inserted: 0 };
    }
    let inserted = 0;
    for (const t of SEED_TRACKS) {
      await ctx.db.insert("tracks", {
        title: t.title,
        artist: t.artist,
        votes: t.votes,
        createdAt: Date.now(),
      });
      inserted += 1;
    }
    return { inserted };
  },
});
