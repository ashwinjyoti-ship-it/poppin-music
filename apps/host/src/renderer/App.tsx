import { useState } from "react";
import { type SessionRecord } from "./lib/api";
import { Audition } from "./screens/Audition";
import { NewSession } from "./screens/NewSession";

export function App() {
  const [session, setSession] = useState<SessionRecord | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!session) {
    return (
      <NewSession
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
