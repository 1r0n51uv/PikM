# ADR-0010: Swift/SwiftUI nativo per iOS + watchOS (supersede Expo)

## Status
Accettata — supersede [ADR-0003](0003-expo-ios-first-watch-native-module.md).

## Contesto
ADR-0003 accettava il rischio di un bridge Expo/RN + modulo nativo custom per il target Watch, da validare con uno spike prima di costruire feature sopra. Diventando disponibile una VM macOS per lo sviluppo locale, si è rivalutata l'opzione "tutto nativo" scartata inizialmente solo per il costo di doppia implementazione con il web.

## Decisione
- App iOS e app Watch scritte **interamente in Swift/SwiftUI**, un solo progetto Xcode (`apps/ios/`) con due target (iOS + watchOS) nello stesso workspace.
- `WatchConnectivity` usato nativamente (framework Apple diretto, nessun bridge/modulo custom da mantenere).
- Il web (`apps/web`, Next.js) resta come dashboard secondaria, **senza condivisione di codice** con l'app nativa: comunicano solo tramite il backend (Supabase self-hosted, vedi ADR-0009).
- `packages/shared` (TypeScript) resta utile solo per codice condiviso lato JS/TS: `apps/web` e le Supabase Edge Functions (`supabase/functions/`), non per il mobile.
- Persistenza locale: **SwiftData** (vedi anche ADR-0006 aggiornata).
- Gestione dipendenze: Swift Package Manager (niente CocoaPods se evitabile).

## Alternative scartate
- **Expo + modulo nativo custom (ADR-0003)**: scartata per il rischio di integrazione bridge↔Watch, non più necessario ora che la doppia implementazione Swift/React è accettata esplicitamente.
- **Expo ora, Watch dopo**: scartata, il requisito Watch è day-1.

## Conseguenze
- **Costo**: ogni feature del modulo Palestra (e futuri PKM/Dieta) va scritta due volte se serve anche sul web — accettato perché il web è dashboard marginale, non l'esperienza primaria.
- **Learning curve**: Swift/SwiftUI da imparare da zero — rischio noto e accettato, mitigato costruendo il modulo Palestra come primo terreno di apprendimento pratico.
- **Toolchain**: serve macOS (VM o hardware) per build/dev/test, non solo per il target Watch come in ADR-0003 — è ora vero per il 100% dello sviluppo mobile.
- Nessuna dipendenza da versioni Expo SDK/RN da tenere allineate al codice nativo: un solo ecosistema (Apple) da seguire.
