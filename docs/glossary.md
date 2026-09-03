# Glossario — PikM

Termini di dominio usati nel codice, nello schema DB e nella UI. Fonte di verità per naming coerente tra moduli.

## Generali

- **Modulo** — sezione funzionale dell'app (Palestra, PKM, Dieta, ...) vissuta come tab dentro un'unica app, non come app separate.
- **Utente / Profile** — singolo utente autenticato (`auth.users` di Supabase + riga `profiles`). L'app è single-user ma richiede login minimo per sincronizzare iOS ↔ Watch ↔ web.

## Modulo Palestra

- **Exercise** — un esercizio del catalogo (es. "Panca piana"). Può avere `source`: `wger` (importato dall'API wger), `ai` (importato/strutturato via Claude), `custom` (inserito manualmente).
- **Routine** — una scheda di allenamento, composta da uno o più **Routine Day** (giorni: es. Push/Pull/Legs).
- **Routine Day** — un giorno della scheda, contiene una lista ordinata di **Routine Exercise**.
- **Routine Exercise** — un esercizio pianificato dentro un Routine Day, con target (serie, reps, riposo). Può appartenere a un **Superset Group**.
- **Superset Group** — raggruppamento di 2+ Routine Exercise eseguiti in sequenza senza riposo tra loro (es. A1/A2).
- **Workout Session** — un allenamento eseguito realmente, con `started_at`/`ended_at`. Può nascere dall'app o dal Watch (`source`).
- **Set Log** — una singola serie eseguita e loggata (peso in kg, reps, RPE opzionale), sempre modificabile/cancellabile anche a posteriori.
- **PR (Personal Record) / 1RM stimato** — massimale stimato per esercizio, calcolato dai Set Log (formula Epley), aggiornato ad ogni sessione.
- **Volume** — somma di (peso × reps) per esercizio/sessione/settimana, usato per i grafici di progresso.
- **Rest Timer** — cronometro di riposo tra serie, con notifica locale a fine countdown.

## Integrazioni

- **HealthKit sync** — scrittura di Workout Session verso Apple Health e lettura di peso corporeo/passi/calorie attive da Health verso il modulo Dieta/Palestra.
- **Watch companion** — target nativo watchOS (non Expo) che avvia/logga una Workout Session e sincronizza con l'app iOS via WatchConnectivity.
- **AI import** — ricerca di un esercizio via Claude API che propone dati strutturati (nome, gruppo muscolare, istruzioni) da confermare manualmente prima del salvataggio come `Exercise` con `source = 'ai'`.

## Infrastruttura

- **Self-hosted** — l'istanza Supabase (Postgres+Auth+Storage+Realtime+Functions) gira su un'istanza AWS EC2 di proprietà, non su Supabase Cloud (vedi ADR-0009).
- **Edge Function** — funzione server-side Deno/TS deployata insieme allo stack Supabase, usata per logica che non deve girare sul client (es. proxy Claude API per l'import esercizi).
- **Outbox** — coda locale (SwiftData) di mutazioni non ancora sincronizzate col backend, riprocessata quando torna la rete (vedi ADR-0006).

## Moduli futuri (non ancora modellati)

- **Note / PKM** — appunti collegabili (backlink), tag.
- **Dieta** — log pasti, contacalorie, macro, obiettivi.
