# Pokélympics Draft Arena

Open `index.html` in a browser. No installation, network connection, or web server is required. Keep the supplied artwork folder next to the HTML file.

Choose 1–12 players, optionally name them, and draft 12 Pokémon each in repeating player order. Each turn rolls a random eligible generation/type pair. Both types count. Players each get two rerolls for the entire draft. Teams are limited to 3 Sub-Legendary, 1 Legendary, and 1 Mythical entries. Already selected entries leave the shared pool; mechanically distinct forms are separate entries. Mega, Gigantamax, and cosmetic-only alternate forms are excluded. Regional forms use their regional generation. Stats display only as the requested half-star ratings.

Progress is saved in the current browser when local storage is available. Completed teams can be downloaded as JSON with star ratings. New draft clears the saved draft after confirmation.

## Data maintenance

`PokemonDB.csv` is the source of truth. After changing the CSV or artwork, run:

```
python scripts/build_data.py
```

This regenerates `pokemon-data.js` so the app works even when opened directly from disk. Artwork resolves by Pokédex number, name, and form. If exact form art is unavailable, the same species' available artwork is used.

Run the rules checks with:

```
node scripts/test-draft.cjs
```

After drafting, admins start a tournament of **10 distinct events randomly selected from a pool of 18**. The selected order is saved once with the room. Every stat is important in exactly 8 events in the full pool; every type is favored in exactly 3. Individual draws are unconstrained random samples and may have uneven stat/type coverage. Events favor 2, 3, or 4 types. See `EVENT_REPORT.md` for the full lineup.

Internal scoring uses the sum of the event's star ratings, one non-stacking 12% bonus if either type is favored, and a random performance multiplier from 0.9 to 1.1. All event definitions are in `olympics.js`. Bonus types and stats are part of the event definition, so the interface and scoring stay consistent.

Players lock one of their own Pokémon into each event. During selection, other players see only whether each entrant is ready, not which Pokémon they chose; entrants are revealed when the event begins. Each Pokémon may enter only one event per tournament. Used entrants remain visibly disabled on selection screens; saved results enforce this across refreshes and devices. All results are drawn once and saved before a synchronized animation starts. Races use lanes (with water lanes for swimming); individual events show throws, arrows, runway jumps, tumbling, barbell lifts, fencing strikes, and beam routines. After every animation, a Pokémon podium and full ranked results show time, distance, weight, or judged points for every player, plus the relevant star ratings and any type advantage. Lower times win races; higher marks win other events. After the animation, admins advance to the next event and eventually the final podium. Most gold medals wins; a tie shares the championship. Local play passes the screen for entry selection. Hover or focus any stat label for its Olympic meaning.

Games checks: `node scripts/test-games.cjs`. An isolated in-memory animation preview is available at `/scripts/browser-preview.html` on a development server. This preview does not save fixture data.

## Firebase Realtime Database multiplayer

Open the game through HTTP/HTTPS (for example `python -m http.server 8000`, then `http://localhost:8000`). Leave the room code blank to play locally; local mode also works by opening `index.html` directly.

Online mode uses only the Firebase Realtime Database SDK, pointed at:

`https://genstuff-a15ca-default-rtdb.firebaseio.com`

No Firebase Authentication, Cloud Firestore, Cloud Functions, backend install, or Blaze plan is required by this implementation. Existing read/write rules must permit access to `pokelympics/rooms`. The old `functions/` and `firestore.rules` files are unused; `firebase.json` now configures only optional static Hosting.

Enter a room code and your name. Enter `Sethupathi` as the admin code to create a room or gain admin controls. Other players join that code with the admin field blank. Every joining player, including admins, gets one team. The admin starts the draft from the lobby. Join order is draft order.

Rooms, player names, admin roles, draft turn, current generation/type, team picks, and remaining rerolls are saved together under `pokelympics/rooms/ROOM-CODE`. Live listeners update all screens. Transactions prevent conflicting picks and reject stale actions. Only the active player can pick or reroll through the UI. Admin reset returns the room to the lobby with empty teams.

Player identity is saved in browser local storage. Rejoin the same room from the same browser profile to reclaim a team. Different people should use different devices or browser profiles; tabs within one browser profile share identity. Clearing browser storage loses that identity. Rooms are not auto-deleted and absent players are not automatically removed; use a new code for a different roster.

This is a trusted-friends setup: the admin code and validation run in browser JavaScript. Public read/write rules permit direct database edits outside the app, so the admin code is not a security boundary.

For static Firebase Hosting, upload the updated files or use `npx firebase-tools deploy --project genstuff-a15ca --only hosting`. No function or Firestore rules deployment is needed.

Checks: `node scripts/test-draft.cjs` and `node scripts/test-rooms.cjs`. These verify game and room logic, including normalization of empty arrays omitted by Realtime Database. They do not verify live multi-device browser connectivity.

## Fully evolved mode

Before starting the draft, the local setup screen or online admin lobby can enable **Fully evolved Pokémon only**. The setting applies to the entire room and locks once drafting starts. Only final-stage or single-stage Pokémon appear in rolls. Eligibility comes from the CSV's pre-evolution links; regional forms follow their own evolution lines. The generated data carries this flag, and both draft and event-entry validation enforce it. Changing this setting requires a new draft.

Additional checks: `node scripts/test-evolution.cjs` verifies representative evolution lines, regional exceptions, settings permissions, and a fully evolved draft.

## Random draft

Local setup and the online admin lobby both offer **Random draft**. It skips all turns and rerolls and deals each player exactly 12 fully evolved Pokémon: **3 Sub-Legendary, 1 Legendary, 1 Mythical, and 7 regular**. Random mode always uses fully evolved Pokémon regardless of the separate fully-evolved checkbox. Both settings are independently saved for the room and only admins can change them before starting. Players review their dealt teams before the admin starts the Olympics.

Deals use the shared pool without repeating Pokémon entries across players. Paradox Pokémon (identified by CSV classification, except Koraidon and Miraidon, which remain Legendary) and all Ultra Beasts count as Sub-Legendary in both regular and random drafts. The same classification is used on cards, in quotas, and in all rules checks.

Run `node scripts/test-random-draft.cjs` to check quotas, uniqueness, evolution eligibility, settings permissions, and the transition to the games.
