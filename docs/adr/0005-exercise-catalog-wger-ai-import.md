# ADR-0005: Catalogo esercizi — wger API + import assistito da AI

## Status
Accettata

## Contesto
Serve un catalogo esercizi ricco senza doverlo scrivere a mano, ma anche la possibilità di aggiungere esercizi non presenti nel catalogo standard.

## Decisione
- **wger API** (open, gratuita) come fonte primaria: import iniziale in `exercises` con `source = 'wger'` e `external_id` per re-sync futuro.
- **Import assistito da AI**: l'utente cerca un esercizio non trovato, Claude (via API) propone dati strutturati (nome, gruppo muscolare, istruzioni, eventuale link video), l'utente conferma/modifica prima del salvataggio (`source = 'ai'`). Nessun salvataggio automatico non supervisionato.
- Esercizi creati a mano restano possibili (`source = 'custom'`).

## Conseguenze
- Tre "fonti di verità" per un `Exercise`: va gestita la dedup (matching per nome simile) per evitare doppioni tra wger/AI/custom.
- La chiamata a Claude per l'import richiede una API key server-side (non esposta al client mobile) — quindi un piccolo endpoint/Edge Function Supabase che fa da proxy.
