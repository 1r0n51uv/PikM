# ADR-0007: NativeWind (Tailwind) per lo styling condiviso

## Status
Accettata

## Contesto
Web (Next.js) e mobile (Expo/RN) sono progetti separati (componenti non condivisi 1:1), ma si vuole coerenza visiva e velocità nello styling senza reinventare un design system da zero per l'MVP.

## Decisione
- Tailwind CSS su `apps/web` (standard Next.js).
- NativeWind su `apps/mobile` per usare le stesse classi utility in RN.
- Token condivisi (colori, spacing) centralizzati in `packages/shared` (es. `tailwind.config` base importata da entrambi i progetti) per evitare drift tra le due palette.

## Conseguenze
- I componenti restano scritti due volte (RN vs DOM), ma con lo stesso linguaggio di styling: riduce il costo cognitivo, non il codice duplicato.
- Se in futuro servisse condivisione reale dei componenti, valutare Tamagui come migrazione (non necessario ora).
