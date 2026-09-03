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
     App/                  entry point, DI, configurazione Supabase client
     Modules/
       Gym/
         Views/
         ViewModels/
         Models/            SwiftData models: Routine, WorkoutSession, SetLog, Exercise
         Sync/              outbox pattern verso Supabase (ADR-0006)
     Shared/
       HealthKit/
       Supabase/            client Swift (supabase-swift), auth
   1r0 Watch App/
     Modules/Gym/           avvio/log sessione da Watch, SwiftData locale
   ```

5. Dipendenze via Swift Package Manager: `supabase-swift`
   (github.com/supabase-community/supabase-swift).
6. `.env`/secrets: URL e anon key dell'istanza Supabase self-hosted
   (ADR-0009) in un file di config non committato (es. `Config.xcconfig`
   ignorato da git, o `Secrets.swift` generato a build time).

## Stato

Solo placeholder — nessun codice Swift ancora scritto in questo repo.
Il modulo Palestra (schema in `supabase/migrations/0001_gym_schema.sql`,
tipi di riferimento in `packages/shared/src/types/gym.ts` — utile come
riferimento anche se non importabile da Swift) è il primo da implementare.
