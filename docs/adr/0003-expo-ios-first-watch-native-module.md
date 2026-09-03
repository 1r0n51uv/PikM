# ADR-0003: Expo (prebuild/bare) + modulo nativo custom per Apple Watch

## Status
**Superseded da [ADR-0010](0010-swift-native-ios-watch.md).** Contenuto lasciato per storico della decisione.

## Contesto
Prodotto iOS-first, con app companion su Apple Watch che deve poter avviare e loggare un allenamento in autonomia, sincronizzando con l'app iPhone. **Expo/React Native non ha un target watchOS ufficiale**: un'app Watch reale richiede un target SwiftUI/WatchKit nativo dentro il progetto Xcode.

## Opzioni valutate
1. **Tutto nativo Swift/SwiftUI** (iOS+Watch), web separato — massima integrazione, ma abbandona la condivisione di codice/tipi con il web e rialza il costo di ogni feature (va scritta due volte: RN + Swift).
2. **Expo ora, Watch in fase 2** — riduce rischio iniziale ma rimanda un requisito esplicito del prodotto ("iOS first... con Apple Watch").
3. **Expo con prebuild + target watchOS nativo aggiunto via config plugin** — *scelta originale*: si resta su Expo/RN per iOS e per la logica condivisa, si aggiunge un target Watch nativo (SwiftUI) dentro `apps/mobile/ios` generato da `expo prebuild`, comunicazione via `WatchConnectivity` (framework nativo, esposto a RN con un modulo nativo custom).

## Decisione (originale, ora superata)
Opzione 3, con i rischi noti: prebuild obbligatorio (niente Expo Go), target Watch separato in Swift, modulo nativo Expo per `WatchConnectivity`, EAS Build multi-target.

## Perché è stata superata
Con la disponibilità di una VM macOS per lo sviluppo locale, il rischio più grosso di questa opzione — il bridge RN↔modulo-nativo↔Watch, che andava validato con uno spike prima di costruirci sopra — non ha più senso di essere accettato: l'alternativa nativa pura lo elimina alla radice, al costo di una curva di apprendimento Swift (accettata, vedi ADR-0010) e della perdita di condivisione codice con il web (accettato: il web resta un dashboard marginale).
