# ADR-0008: Architettura a moduli dentro un'unica app

## Status
Accettata

## Contesto
PikM copre più domini (Palestra, PKM, Dieta, ...). Vanno organizzati senza trasformare ogni dominio in un'app separata da mantenere.

## Decisione
- Una sola app iOS (Expo) con navigazione a tab, una tab per modulo. Stessa cosa lato web (sezioni, non sotto-app separate).
- Ogni modulo vive come cartella isolata dentro `apps/mobile/src/modules/<modulo>` e `apps/web/app/<modulo>` (routing Next.js), con i soli tipi/domain condivisi in `packages/shared/src/types/<modulo>.ts`.
- Il modulo **Palestra** è il primo implementato (MVP); PKM e Dieta seguiranno la stessa struttura di cartelle quando verranno grillati e modellati a loro volta.
- Auth e schema DB (Supabase) sono condivisi trasversalmente a tutti i moduli fin dall'inizio (una tabella `profiles`, RLS per `user_id` su ogni tabella di modulo).

## Conseguenze
- Nessun overhead di deploy/routing tra moduli (un solo build per piattaforma).
- Richiede disciplina nel non far "trapelare" dipendenze dirette tra cartelle di moduli diversi (comunicano solo tramite `packages/shared` o Supabase, mai import diretti cross-modulo).
