# ADR-0006: Offline-first per il log allenamento

## Status
Accettata

## Contesto
In palestra spesso non c'è rete. Il log di una Workout Session (Set Log) deve funzionare comunque e sincronizzarsi quando torna la connessione.

## Decisione
- SQLite locale su mobile (`expo-sqlite` o `op-sqlite`) come sorgente di verità immediata per `Workout Session` e `Set Log` in corso.
- Sync verso Supabase con coda di scrittura (outbox pattern): ogni mutazione locale viene accodata e ritentata alla riconnessione.
- Conflitti risolti "last write wins" su `updated_at`, accettabile per un solo utente reale multi-device (non c'è concorrenza vera tra scritture simultanee).
- Routine/Exercise (dati meno volatili) possono restare cache-then-network senza outbox dedicato.

## Conseguenze
- Introduce uno strato di sync client-side non banale (outbox + retry) da costruire prima di poter dire "il modulo Palestra è affidabile".
- Il Watch companion (ADR-0003) deve anch'esso poter loggare offline e sincronizzare via `WatchConnectivity` verso l'iPhone, che poi sincronizza verso Supabase — l'iPhone è quindi l'hub, il Watch non parla direttamente con Supabase nell'MVP.
