# ADR-0009: Supabase self-hosted su AWS EC2 (invece di Supabase Cloud)

## Status
Superata da [ADR-0022](0022-custom-backend-node-fastify.md) per lo *stack software* (niente più Docker Compose Supabase: un singolo servizio Node.js/Fastify). La scelta di **istanza AWS EC2 + Caddy come reverse proxy/TLS** sotto resta valida — è l'unica parte di questa ADR ancora in vigore.

## Contesto
Preferenza per tenere i dati sotto controllo diretto invece che su Supabase Cloud managed, mantenendo comunque Supabase come software (Docker Compose ufficiale) per non perdere Auth/RLS/Storage/Realtime/Edge Functions già decisi in ADR-0002.

## Decisione
- Supabase self-hosted via il Docker Compose ufficiale (`supabase/docker`), deployato su **un'istanza AWS EC2** (non NAS domestico: risolve nativamente il problema di raggiungibilità da fuori rete casa, es. in palestra).
- Istanza consigliata: **t3.small / t4g.small** (2GB RAM) — sufficiente per Postgres+Auth+Storage+Realtime a carico single-user; margine di upgrade a t3.medium se le Edge Functions (import AI esercizi, vedi ADR-0005) diventano pesanti.
- **Dominio proprio già disponibile**, puntato con un sottodominio (es. `api.<dominio>`) all'istanza.
- **Reverse proxy + TLS**: Caddy davanti allo stack Docker Compose, per HTTPS automatico (Let's Encrypt) senza gestione manuale dei certificati — più semplice da mantenere in solitaria rispetto a Nginx+Certbot.
- **Backup: nessuno per l'MVP** — rischio esplicitamente accettato. Da rivedere non appena i dati (allenamenti, poi note/dieta) diventano preziosi da perdere; opzione più semplice quando si deciderà di aggiungerlo: `pg_dump` schedulato su un bucket S3.

## Conseguenze
- Operatività a carico dell'utente: aggiornamenti Docker/Supabase, monitoraggio uptime, gestione certificati (mitigata da Caddy), sicurezza della VM (firewall, SSH key-only, aggiornamenti OS) — tutta responsabilità non delegabile a un vendor.
- Nessun backup automatico: un fallimento del volume EBS prima di introdurre un backup significa perdita dati totale. Rischio accettato consapevolmente per l'MVP, da non dimenticare di rivedere.
- Costo prevedibile e sotto controllo diretto (~10-20$/mese per l'istanza) invece del pricing a consumo di Supabase Cloud.
- La struttura di `supabase/migrations/` (già scritta, vedi ADR-0002) non cambia: si applica identica sia a Supabase Cloud che self-hosted.
