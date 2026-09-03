// Supabase Edge Function (Deno): proxy verso Claude API per l'import
// assistito di un esercizio non presente nel catalogo wger.
// Vedi docs/adr/0005-exercise-catalog-wger-ai-import.md.
//
// La API key di Claude vive solo qui (env della Edge Function), mai nel
// client iOS. L'utente conferma/modifica il risultato prima del salvataggio
// — questa funzione propone dati strutturati, non scrive mai a DB.

interface ImportRequest {
  query: string; // nome/descrizione libera dell'esercizio cercato dall'utente
}

interface ProposedExercise {
  name: string;
  muscleGroups: string[];
  equipment: string | null;
  instructions: string;
}

Deno.serve(async (req: Request) => {
  const { query } = (await req.json()) as ImportRequest;

  if (!query || query.trim().length === 0) {
    return new Response(JSON.stringify({ error: "query mancante" }), {
      status: 400,
    });
  }

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY non configurata" }),
      { status: 500 },
    );
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content:
            `Trova/struttura l'esercizio da palestra "${query}". Rispondi ` +
            `SOLO con JSON: {"name": string, "muscleGroups": string[], ` +
            `"equipment": string | null, "instructions": string}.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    return new Response(
      JSON.stringify({ error: "chiamata a Claude fallita" }),
      { status: 502 },
    );
  }

  const data = await response.json();
  const text = data.content?.[0]?.text ?? "{}";
  const proposed = JSON.parse(text) as ProposedExercise;

  return new Response(JSON.stringify(proposed), {
    headers: { "content-type": "application/json" },
  });
});
