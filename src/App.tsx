import { FormEvent, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";

export default function App() {
  const tracks = useQuery(api.tracks.list);
  const addTrack = useMutation(api.tracks.add);
  const upvote = useMutation(api.tracks.upvote);
  const remove = useMutation(api.tracks.remove);

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !artist.trim()) return;
    setSubmitting(true);
    try {
      await addTrack({ title, artist });
      setTitle("");
      setArtist("");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpvote(trackId: Id<"tracks">) {
    await upvote({ trackId });
  }

  async function handleRemove(trackId: Id<"tracks">) {
    await remove({ trackId });
  }

  return (
    <div className="app">
      <header className="hero">
        <h1>
          <span className="emoji" aria-hidden>
            🎵
          </span>{" "}
          poppin-music
        </h1>
        <p className="tagline">
          Add tracks and upvote them — the crowd decides what's poppin'.
        </p>
      </header>

      <form className="add-form" onSubmit={handleSubmit}>
        <input
          aria-label="Track title"
          placeholder="Track title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          aria-label="Artist"
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Adding…" : "Add track"}
        </button>
      </form>

      <main>
        {tracks === undefined ? (
          <p className="muted">Loading the leaderboard…</p>
        ) : tracks.length === 0 ? (
          <p className="muted">No tracks yet. Add the first one above!</p>
        ) : (
          <ol className="leaderboard">
            {tracks.map((track, index) => (
              <li key={track._id} className="track">
                <span className="rank">#{index + 1}</span>
                <span className="meta">
                  <span className="title">{track.title}</span>
                  <span className="artist">{track.artist}</span>
                </span>
                <span className="votes" aria-label={`${track.votes} votes`}>
                  {track.votes} 🔥
                </span>
                <button
                  className="upvote"
                  onClick={() => handleUpvote(track._id)}
                >
                  Upvote
                </button>
                <button
                  className="remove"
                  aria-label="Remove track"
                  onClick={() => handleRemove(track._id)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ol>
        )}
      </main>

      <footer className="footer">
        <span className="muted">Powered by Convex · real-time updates</span>
      </footer>
    </div>
  );
}
