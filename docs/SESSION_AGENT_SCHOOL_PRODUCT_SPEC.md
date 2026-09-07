# Session Agent School - Product Spec

**Purpose:** Session Agent School is a separate product/module that creates, evaluates, improves and packages Session Agents. Poppin Music consumes trained Session Agents, but normal composition does not require School to be running.

**Product sentence:** Session Agent School is the training room where musical Session Agents are educated through skills, knowledge, Musical Engine capabilities, automated validation, human audition selection, human reasons, versioning and promotion.

## 1. Why School is separate

Poppin Music is the studio. Session Agent School is the music school.

Poppin Music should stay focused on making music: prompt, generate, audition, commit, edit in Reaper. School should handle the slower process of making a better Harmony Session Agent, Bass Session Agent, Drum Session Agent and future musicians.

Separation protects both products:
- Poppin stays light, creative and reliable.
- School can run research loops, tests, versioning and experiments without polluting live composition.
- Session Agents become portable packages, not hidden app code.

## 2. The Session Agent anatomy School improves

Every Session Agent has:

```text
SESSION AGENT
   ├── Judgement LLM
   ├── Skills
   ├── Knowledge
   └── Musical Engine access
          ├── deterministic tools
          └── music-native models
```

The Session Agent produces A/B/C candidates. The human auditions them and selects, rejects, splices or edits. School records not only the selection, but the reason.

## 3. The School loop

```text
Student Session Agent
   ↓
Generates A / B / C
   ↓
Audition in Reaper or test renderer
   ↓
Human selects + explains why
   ↓
Evaluation Record
   ↓
Teacher LLM analyses pattern
   ↓
Proposes improvement
   ↓
Improve Skills / Knowledge / Musical Engine / Prompt
   ↓
Run deterministic tests
   ↓
Old vs New audition
   ↓
Promote / rollback
```

The Teacher LLM reasons. Deterministic systems verify. The human ear decides musical quality.

## 4. Teacher LLM responsibilities

The Teacher LLM does not simply encode "the user liked B". It asks what general musical capability was missing.

Examples:
- User says: "A resolves too obviously. B is clever for the sake of it. C keeps me hanging but feels natural."
- Teacher may infer: Harmony Agent lacks skill in unobtrusive unresolved tension.
- Teacher proposes an improvement to the tension/release skill and creates targeted tests.

Teacher responsibilities:
- classify failure type;
- distinguish personal taste from general musicianship;
- inspect evaluation history;
- propose skill changes;
- propose new tests;
- identify missing deterministic tools;
- suggest when a music-native model might help;
- compare old vs new versions;
- prepare promotion notes.

## 5. Failure classes

School should diagnose failures by layer.

| Failure type | Meaning | Fix |
|---|---|---|
| Judgement failure | Technically valid but musically weak | improve role instructions, examples, skills |
| Skill failure | Missing craft knowledge | add/rewrite skill material |
| Knowledge failure | Weak reference/domain material | add curated references or distilled notes |
| Engine failure | Correct idea rendered badly | improve tools, MIDI rendering, voicing, validation |
| Representation failure | PMR cannot express the idea | extend PMR schema |
| Model failure | Model unreliable for role | test another model through gateway |
| Evaluation failure | Automated test rewards wrong thing | fix evaluation design |

## 6. Evaluation records

Each evaluation record should store:

```json
{
  "agent": "harmony",
  "agentVersion": "1.0.3",
  "scenarioId": "harmony_delayed_resolution_012",
  "prompt": "8 bars, peaceful but unresolved",
  "pmrContext": {},
  "candidates": ["A", "B", "C"],
  "auditionOrder": ["B", "A", "C"],
  "selected": "C",
  "rejected": ["A", "B"],
  "humanReason": "C keeps tension without sounding clever",
  "manualEditsAfterCommit": {},
  "teacherDiagnosis": "needs stronger tension-with-simplicity skill",
  "hardValidation": "pass",
  "musicalValidation": "human-selected"
}
```

The reason is precious. It turns selection into education.

## 7. Evidence threshold

One human preference should not rewrite an agent.

School accumulates evidence:
- one-off issue: record only;
- repeated pattern: create targeted tests;
- repeated failure across contexts: propose skill/engine change;
- old-vs-new wins repeatedly: promote new agent version.

This prevents overfitting the agent to a single mood, day, song or cup of tea.

## 8. Validation types

Hard validation is automatic:
- schema valid;
- MIDI event valid;
- notes in playable range;
- timing sane;
- locked material untouched;
- no impossible voicings;
- required bars populated;
- bridge output generated.

Musical validation is human:
- Does it feel right?
- Is it boring?
- Is it too clever?
- Does the bass sound like it is listening?
- Does the drum fill have a reason?
- Does the harmony create the requested tension?

School must never let automated tests become the final judge of music.

## 9. Old vs new promotion

School should version agents.

```text
Harmony v1.0
   ↓ evaluations reveal weakness
Harmony v1.1 candidate
   ↓ old-vs-new blind auditions
Promote if v1.1 repeatedly wins
Rollback if it breaks other scenarios
```

Promotion should produce:
- new agent package;
- changelog;
- evaluation summary;
- known weaknesses;
- compatibility info with PMR/Musical Engine versions.

## 10. Agent package format

School outputs installable Session Agent packages.

```text
harmony-session-agent-v1.1/
  manifest.json
  README.md
  skills/
    harmony-foundations.md
    tension-release.md
    voice-leading.md
  prompts/
    system.md
    candidate-generation.md
    critique.md
  evaluations/
    suite.json
    results.json
  tools-required.json
  adapter.ts
```

Manifest example:

```json
{
  "id": "poppin.harmony",
  "name": "Harmony Session Agent",
  "version": "1.1.0",
  "capabilities": ["harmony.generate", "harmony.reharmonize", "harmony.voice"] ,
  "requiresPMR": ["tempo", "meter", "key", "sections", "harmony", "intent"],
  "requiresTools": ["constructChord", "voiceLead", "renderHarmonyMidi"],
  "outputSchema": "SessionAgentOutput.v1"
}
```

## 11. How Poppin Music consumes School output

Poppin Music should not know how the agent was trained. It only knows:
- the agent manifest;
- the input/output contract;
- required PMR context;
- required Musical Engine capabilities;
- compatible versions.

Install flow:

```text
School exports promoted agent package
   ↓
Poppin imports package into agents/
   ↓
Host validates manifest and compatibility
   ↓
Agent appears in Session Agent rail
   ↓
Host calls it through standard contract
```

Poppin can optionally export evaluation data back to School:

```text
prompt + PMR context + candidates + audition choice + reason + manual edits
```

But Poppin should not silently train or mutate live agents while the user is composing.

## 12. Relationship to Identity Memory

Session Agent Education and Identity Memory are separate.

Session Agent Education asks:
- What makes a generally competent and expressive bassist/drummer/harmony agent?
- What craft weakness caused repeated failures?

Identity Memory observes:
- What does this user repeatedly choose across their own music?

Identity Memory must not silently steer new generation. School may use human reasons to improve general musicianship, but should label personal taste separately when detected.

## 13. First School MVP

Do not build full School before one Session Agent exists.

Recommended path:
1. Manually build Harmony Session Agent v0.
2. Create 25 Harmony evaluation scenarios.
3. Generate A/B/C for each.
4. Human auditions and records selection + short reason.
5. Teacher LLM reviews records and proposes 3 skill improvements.
6. Apply one improvement manually.
7. Run old-vs-new blind comparison on 10 scenarios.
8. Promote only if clearly better.

## 14. Future School expansion

After Harmony:
- Bass School;
- Drum School;
- Guitar School;
- Producer School;
- DAW Agent School;
- Sound/Instrument Agent School;
- cross-agent ensemble tests.

The long-term dream: each Session Agent becomes a self-contained musical collaborator that can be called by Poppin Music or by another workflow entirely.

## 15. North star

School succeeds when a Session Agent becomes less like a prompt and more like a musician: it listens, restrains itself, responds to context, generates alternatives with meaningful differences, explains honestly, and improves through actual audition rather than pretending that valid JSON is music.
