# ADR-0002: Supabase come backend (Postgres + Auth + Storage)

## Status
Accettata

## Contesto
App single-user ma multi-device (iOS, Watch, web): serve comunque un account per sincronizzare gli stessi dati tra i client. Niente budget/team per gestire infrastruttura custom.

## Decisione
- Postgres gestito da Supabase come unico DB.
- Supabase Auth con login minimo (magic link via email) — un solo utente reale, ma l'auth abilita RLS e la sync multi-device.
- Row Level Security su tutte le tabelle, filtrate per `auth.uid()`.
- Storage Supabase per eventuali immagini/video esercizi custom.
- Backup: affidato al backup automatico gestito da Supabase, nessun export dedicato nell'MVP.

## Alternative considerate
- **Self-hosted Postgres/Docker**: scartato per l'MVP, più operatività (backup, TLS, uptime) senza benefici concreti per un singolo utente.
- **Nessun login / DB locale puro**: scartato perché serve sincronizzare iOS ↔ Watch ↔ web (vedi discussione in grilling, superata: "login minimo" scelto esplicitamente).

## Conseguenze
- Dipendenza da un vendor (Supabase); accettabile per MVP personale, migrabile in futuro perché è Postgres puro sotto il cofano.
- RLS va scritta fin dalla prima migration (vedi `supabase/migrations/0001_gym_schema.sql`).
