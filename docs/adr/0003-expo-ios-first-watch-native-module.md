# ADR-0003: Expo (prebuild/bare) + modulo nativo custom per Apple Watch

## Status
Accettata — rischio tecnico noto, da validare con uno spike prima di costruirci sopra il modulo Palestra.

## Contesto
Prodotto iOS-first, con app companion su Apple Watch che deve poter avviare e loggare un allenamento in autonomia, sincronizzando con l'app iPhone. **Expo/React Native non ha un target watchOS ufficiale**: un'app Watch reale richiede un target SwiftUI/WatchKit nativo dentro il progetto Xcode.

## Opzioni valutate
1. **Tutto nativo Swift/SwiftUI** (iOS+Watch), web separato — massima integrazione, ma abbandona la condivisione di codice/tipi con il web e rialza il costo di ogni feature (va scritta due volte: RN + Swift).
2. **Expo ora, Watch in fase 2** — riduce rischio iniziale ma rimanda un requisito esplicito del prodotto ("iOS first... con Apple Watch").
3. **Expo con prebuild + target watchOS nativo aggiunto via config plugin** — *scelta*: si resta su Expo/RN per iOS e per la logica condivisa, si aggiunge un target Watch nativo (SwiftUI) dentro `apps/mobile/ios` generato da `expo prebuild`, comunicazione via `WatchConnectivity` (framework nativo, esposto a RN con un modulo nativo custom).

## Decisione
Opzione 3. Implica:
- `apps/mobile` non può restare in **Expo Go** managed puro: serve **prebuild** (bare-ish) per poter aggiungere il target Watch in Xcode.
- Il target Watch è codice Swift/SwiftUI a parte, non React Native — vive in `apps/mobile/watch-native/` (placeholder in questo scaffold, target Xcode reale da creare al primo `expo prebuild`).
- Un modulo nativo Expo (Swift, `expo-modules-core`) espone `WatchConnectivity` a JS per far parlare iPhone app e Watch app.
- EAS Build deve essere configurato per includere lo scheme Watch nel build iOS.

## Conseguenze
- Complessità di build/CI più alta (Xcode multi-target, non solo `expo run:ios`).
- Ogni aggiornamento Expo SDK va verificato anche contro il codice nativo custom (rischio di breaking change maggiore che con Expo Go puro).
- Consigliato uno **spike separato** prima di investire nel modulo Palestra completo: progetto Expo minimo + prebuild + target Watch "Hello World" che scambia un messaggio con l'app, per validare la toolchain prima di costruirci sopra.
