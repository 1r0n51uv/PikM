# apps/ios — placeholder

Vedi `docs/adr/0010-swift-native-ios-watch.md`.

Non c'è ancora un progetto Xcode reale: un `.xcodeproj`/`.xcworkspace` è
binario/generato da Xcode e non ha senso scriverlo a mano da qui. Va creato
sulla VM macOS.

## Passi per crearlo

1. Xcode → New Project → **App**, interfaccia SwiftUI, nome `1r0`,
   bundle id `dev.1r0.app`, salvato dentro `apps/ios/`.
2. Aggiungi un secondo target: File → New → Target → **Watch App**
   (associato all'app iOS), stesso bundle id prefix.
3. Capability da abilitare su entrambi i target dove serve: **HealthKit**
   (vedi `docs/adr/0004-healthkit-integration.md`).
4. Struttura cartelle attesa dentro il progetto (vedi
   `docs/adr/0008-single-app-module-architecture.md`):

   ```
   1r0/
     App/                  entry point, DI, configurazione client API
     Modules/
       Gym/
         Views/
         ViewModels/
         Models/            SwiftData models: Routine, WorkoutSession, SetLog, Exercise
         Sync/              outbox pattern verso il backend custom (ADR-0006)
     Shared/
       HealthKit/
       API/                 client REST minimale (URLSession), auth via API key statica (ADR-0022)
   1r0 Watch App/
     Modules/Gym/           avvio/log sessione da Watch, SwiftData locale
   ```

5. Dipendenze via Swift Package Manager: nessuna libreria di rete esterna
   necessaria per ora — `URLSession` nativo basta per un client REST con
   API key statica (ADR-0022, niente più `supabase-swift`).
6. `.env`/secrets: URL del servizio backend e API key statica (ADR-0022)
   in un file di config non committato (es. `Config.xcconfig`
   ignorato da git, o `Secrets.swift` generato a build time).

## Stato

Solo placeholder — nessun codice Swift ancora scritto in questo repo.
Il modulo Palestra (schema in `supabase/migrations/0001_gym_schema.sql`,
tipi di riferimento in `packages/shared/src/types/gym.ts` — utile come
riferimento anche se non importabile da Swift) è il primo da implementare,
ma resta bloccato dagli spike #1 (Watch↔iPhone) e #2 (backend
raggiungibile) finché non sono validati — vedi ADR-0021.
