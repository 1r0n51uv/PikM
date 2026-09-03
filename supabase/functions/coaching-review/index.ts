// Supabase Edge Function (Deno): revisione periodica di una routine via
// Claude, sulla base dello storico di allenamento. Vedi
// docs/adr/0011-progressione-automatica-coaching-ai.md.
//
// Non scrive mai direttamente su `routines`/`routine_exercises`: propone
// una `coaching_suggestions` row con status 'pending', che il client
// mostra all'utente per conferma esplicita.

interface ReviewRequest {
  routineId: string;
  userId: string;
  // Riassunto storico già aggregato lato client/DB (volume, PR, aderenza)
  // per non spedire a Claude l'intero storico grezzo.
  historySummary: string;
}

interface ProposedChanges {
  summary: string;
  changes: Record<string, unknown>;
}

Deno.serve(async (req: Request) => {
  const { routineId, userId, historySummary } =
    (await req.json()) as ReviewRequest;

  if (!routineId || !userId || !historySummary) {
    return new Response(JSON.stringify({ error: "parametri mancanti" }), {
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
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content:
            `Sei un coach di powerlifting/bodybuilding. Storico allenamento ` +
            `(riassunto): ${historySummary}\n\n` +
            `Proponi eventuali modifiche alla scheda (nuovi target di ` +
            `serie/reps, sostituzione esercizi, o consiglio di deload). ` +
            `Rispondi SOLO con JSON: {"summary": string, "changes": object}.`,
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
  const proposed = JSON.parse(text) as ProposedChanges;

  // Il caller (client autenticato) inserisce la riga in coaching_suggestions
  // con questi dati — questa funzione resta stateless, non scrive a DB
  // direttamente per restare semplice da testare/deployare.
  return new Response(
    JSON.stringify({ routineId, userId, ...proposed }),
    { headers: { "content-type": "application/json" } },
  );
});
