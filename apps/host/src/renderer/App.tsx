import { useEffect, useState } from "react";
import { getStatus, type ReaperStatus, type SessionRecord } from "./lib/api";
import { Audition } from "./screens/Audition";
import { NewSession } from "./screens/NewSession";

export function App() {
  const [reaper, setReaper] = useState<ReaperStatus | null>(null);
  const [session, setSession] = useState<SessionRecord | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getStatus()
      .then((result) => setReaper(result.reaper))
      .catch(() => {
        setReaper(null);
      });
  }, []);

  if (!session) {
    return (
      <NewSession
        reaper={reaper}
        onCreated={(next) => {
          setSession(next);
          setError(null);
        }}
      />
    );
  }

  return (
    <Audition
      session={session}
      reaper={reaper}
      busy={busy}
      error={error}
      onChange={setSession}
      onBusy={setBusy}
      onError={setError}
      onNewSession={() => {
        setSession(null);
        setError(null);
      }}
    />
  );
}
