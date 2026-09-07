import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";

const trackObject = v.object({
  _id: v.id("tracks"),
  _creationTime: v.number(),
  title: v.string(),
  artist: v.string(),
  audioUrl: v.optional(v.string()),
  votes: v.number(),
  createdAt: v.number(),
});

/**
 * Live leaderboard of tracks, ranked by votes (most "poppin" first).
 * Ties are broken by creation time so newer entries surface above older ones.
 */
export const list = query({
  args: {},
  returns: v.array(trackObject),
  handler: async (ctx): Promise<Doc<"tracks">[]> => {
    const tracks = await ctx.db
      .query("tracks")
      .withIndex("by_votes")
      .order("desc")
      .collect();
    return tracks;
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    artist: v.string(),
    audioUrl: v.optional(v.string()),
  },
  returns: v.id("tracks"),
  handler: async (ctx, args) => {
    const title = args.title.trim();
    const artist = args.artist.trim();
    if (title.length === 0) {
      throw new Error("Track title is required");
    }
    if (artist.length === 0) {
      throw new Error("Artist name is required");
    }
    return await ctx.db.insert("tracks", {
      title,
      artist,
      audioUrl: args.audioUrl?.trim() || undefined,
      votes: 0,
      createdAt: Date.now(),
    });
  },
});

export const upvote = mutation({
  args: { trackId: v.id("tracks") },
  returns: v.number(),
  handler: async (ctx, args) => {
    const track = await ctx.db.get(args.trackId);
    if (!track) {
      throw new Error("Track not found");
    }
    const votes = track.votes + 1;
    await ctx.db.patch(args.trackId, { votes });
    return votes;
  },
});

export const remove = mutation({
  args: { trackId: v.id("tracks") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const track = await ctx.db.get(args.trackId);
    if (!track) {
      throw new Error("Track not found");
    }
    await ctx.db.delete(args.trackId);
    return null;
  },
});
