# Target Watch nativo — placeholder

Vedi `docs/adr/0003-expo-ios-first-watch-native-module.md`.

Questa cartella non contiene ancora un progetto Xcode: il target watchOS va
generato al primo `expo prebuild` (che crea `apps/mobile/ios/`), poi
aggiunto **manualmente in Xcode** come nuovo target "Watch App" dentro quel
progetto — non è automatizzabile da Expo CLI.

## Passi previsti (spike, prima del modulo Palestra completo)

1. `pnpm --filter @pikm/mobile prebuild` per generare `ios/`.
2. In Xcode: File → New → Target → Watch App, target minimo iOS/watchOS da
   allineare a quanto supportato da Expo SDK in uso.
3. Modulo nativo Expo (`expo-modules-core`, Swift) che espone
   `WatchConnectivity` a JS: invio/ricezione messaggi tra iPhone app e Watch
   app.
4. "Hello World": il Watch invia un messaggio, l'app iOS lo mostra a schermo
   — valida la toolchain prima di costruirci sopra avvio/log allenamento.
5. Aggiornare lo scheme EAS Build per includere il target Watch nel build
   iOS (vedi `eas.json`, da creare in questo step).

Il codice Swift del target Watch vivrà qui una volta generato da Xcode.
