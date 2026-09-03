# ADR-0018: Fonte dati alimenti — OpenFoodFacts + USDA, barcode scan

## Status
Accettata

## Contesto
Serve un catalogo alimenti per la ricerca e per lo scan barcode, senza doverlo popolare a mano (stesso ragionamento di ADR-0005 per gli esercizi).

## Decisione
- **OpenFoodFacts** come fonte primaria: gratuita, open, ottimo supporto barcode (`foods.barcode`), buona copertura di prodotti confezionati EU/IT.
- **USDA FoodData Central** come fallback per alimenti generici/freschi (es. "petto di pollo crudo") dove OpenFoodFacts è più debole.
- **Barcode scan**: nativo iOS (`VisionKit`/`AVFoundation`), il codice letto cerca prima in `foods.barcode` locale (cache), poi via API OpenFoodFacts se non trovato.
- Alimenti creati a mano restano possibili (`source = 'custom'`), stesso pattern di `Exercise` (ADR-0005).
- Niente riconoscimento foto/AI in questo giro (scartato esplicitamente, vedi ADR-0017) — se reintrodotto in futuro, seguirebbe lo stesso pattern "proposta da confermare" di ADR-0005/0011, mai salvataggio automatico.

## Conseguenze
- Due fonti esterne da integrare invece di una: due client/parser diversi, e serve una euristica su quando usare l'una o l'altra (barcode → OpenFoodFacts sempre; ricerca testuale senza barcode → prova entrambe, con OpenFoodFacts prioritario se il risultato ha anche il barcode).
- `foods.barcode` con indice unico parziale (solo dove non null) evita duplicati per lo stesso prodotto confezionato.
