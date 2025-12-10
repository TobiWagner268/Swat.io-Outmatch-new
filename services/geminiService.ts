import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAnswer = async (question: string, context: string): Promise<string> => {
  try {
    const model = "gemini-2.5-flash";
    const systemInstruction = `
      Du bist ein erfahrener Sales Engineer bei Swat.io.
      Deine Aufgabe ist es, Vertriebsmitarbeiter im Kampf gegen einen spezifischen Wettbewerber zu unterstützen.
      Nutze NUR den folgenden Kontext, um Fragen zu beantworten.
      Sei präzise, überzeugend und professionell.
      
      KONTEXT DATEN (Aktueller Wettbewerber):
      ${context}
      
      Wenn die Antwort nicht im Kontext steht, sage das ehrlich, aber versuche eine Brücke zu den Stärken von Swat.io zu schlagen.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: question,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "Ich konnte keine Antwort generieren.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Entschuldigung, es gab einen Fehler bei der Anfrage.";
  }
};

export const generateCompetitorProfile = async (competitorName: string, url: string, existingId?: string): Promise<AnalysisData> => {
  const prompt = `
    Rolle: Senior Product Marketing Manager bei Swat.io.
    Aufgabe: Erstelle eine detaillierte Battle Card Analyse für den Vertrieb gegen "${competitorName}" (${url}).
    
    Swat.io Profil (Deine Basis):
    - Positionierung: Enterprise Social Media Management für DACH (Deutschland, Österreich, Schweiz).
    - USP: Stabile Governance, DSGVO-Konformität (EU-Hosting), Exzellenter persönlicher Support, All-in-One (Inbox + Publishing).
    - Zielgruppe: Mittelstand bis Enterprise, Public Sector, Agenturen.

    Analysiere ${competitorName} basierend auf diesen Dimensionen und fülle das JSON Schema auf DEUTSCH aus:

    1. EXECUTIVE SUMMARY:
       - Verdict: Strategisches Urteil. Warum ist Swat.io für Enterprise/DACH besser geeignet als ${competitorName}?
       - Pain Points: Identifiziere die Top 3 Schwächen von ${competitorName} (z.B. Preismodell, Support-Qualität, Komplexität, Datenschutz).
       - Advantages: Nenne 3 Swat.io Vorteile, die diese Schwächen direkt adressieren.

    2. MOMENTUM:
       - Market Position: Wie wird ${competitorName} aktuell am Markt wahrgenommen? (z.B. "Legacy Giant", "Günstiger Einsteiger").
       - Recent Updates: Gibt es aktuelle Entwicklungen, Preiserhöhungen oder Strategiewechsel?

    3. PLATFORM COVERAGE:
       - Zusammenfassung der Netzabdeckung. Wo sind sie stark? Wo fehlen Tiefen-Integrationen?

    4. RED FLAGS & WIN SIGNALS:
       - Warnings: Risiken für den Käufer bei ${competitorName} (z.B. US-Hosting, versteckte Kosten, langsame Weiterentwicklung).
       - Win Signals: Anzeichen beim Prospect, die für Swat.io sprechen (z.B. Betriebsrat involviert, komplexe Freigabeprozesse notwendig).

    5. FEATURE CHECK (Vergleich):
       - Wähle 3-4 relevante Kategorien (z.B. Inbox, Publishing, Compliance, Reporting).
       - Competitor Promise: Was verspricht das Marketing von ${competitorName}?
       - Reality: Wie sieht die Realität aus? (Kritisch hinterfragt).
       - Swat.io Advantage: Wie lösen wir das besser?

    6. PRICING:
       - Entry: Geschätzter Einstiegspreis.
       - Cons: Nachteile der Preisstruktur (z.B. Per-User-Pricing, teure Add-ons).

    7. REVIEW INTELLIGENCE:
       - Competitor Consensus: Zusammenfassung der allgemeinen Stimmung auf Review-Plattformen (G2, Capterra).
       - Swat.io Comparison: Warum wechseln Nutzer typischerweise zu Swat.io?
       - Critical Reviews: Finde oder simuliere 4-6 realistische negative Bewertungen (1-3 Sterne).
         - Priorität: Aktuelle Themen (2024/2025).
         - Themen: Bugs, Support, Preis, Usability.
         - Gib Titel, Kommentar, Quelle (z.B. G2, Capterra), Datum und Rating an.

    8. KILL SHOTS:
       - Formuliere 2-3 "tödliche" Argumente, um den Deal zu gewinnen.
       - Statement: Ein provokanter Satz.
       - Talk Track: Wie der Sales-Mitarbeiter das Argument ausführt.

    WICHTIG: Sei kritisch, aber faktisch fundiert. Die Analyse dient dazu, Deals zu gewinnen.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          url: { type: Type.STRING },
          title: { type: Type.STRING },
          summary: {
            type: Type.OBJECT,
            properties: {
              verdict: { type: Type.STRING },
              painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
              advantages: { type: Type.ARRAY, items: { type: Type.STRING } },
            }
          },
          momentum: {
            type: Type.OBJECT,
            properties: {
              market_position: { type: Type.STRING, description: "Current market status (e.g. Leader, Niche, Legacy)" },
              recent_updates: { type: Type.STRING, description: "Recent product changes or strategic shifts" }
            }
          },
          platform_coverage: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of well-supported platforms" }
            }
          },
          red_flags: {
             type: Type.OBJECT,
            properties: {
              warnings: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Negative signs for the buyer" },
              win_signals: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Signs that Swat.io is the better fit" }
            }
          },
          featureComparison: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                hootsuite: { type: Type.STRING, description: "Description of the competitor's feature" },
                reality: { type: Type.STRING, description: "The weakness or reality check" },
                swatio_advantage: { type: Type.STRING },
              }
            }
          },
          reviewAnalysis: {
            type: Type.OBJECT,
            properties: {
              competitor_consensus: { type: Type.STRING, description: "Summary of general user sentiment from G2/Capterra/etc." },
              swatio_comparison: { type: Type.STRING, description: "Direct comparison of user satisfaction vs Swat.io" }
            }
          },
          reviews: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                platform: { type: Type.STRING },
                count: { type: Type.NUMBER },
              }
            }
          },
          criticalReviews: {
            type: Type.ARRAY,
            items: {
               type: Type.OBJECT,
               properties: {
                 title: { type: Type.STRING, description: "Short title of the complaint (e.g. 'Poor Support')"},
                 comment: { type: Type.STRING, description: "Summary of the 1-star review content" },
                 source: { type: Type.STRING, description: "Source platform (e.g. G2, Capterra)" },
                 date: { type: Type.STRING, description: "Date of review, e.g. 'Jan 2024'" },
                 rating: { type: Type.NUMBER, description: "Star rating (1, 2, or 3)" }
               }
            }
          },
          killShots: {
             type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                statement: { type: Type.STRING },
                talkTrack: { type: Type.STRING },
              }
            }
          },
          pricing: {
            type: Type.OBJECT,
            properties: {
              entry: { type: Type.STRING },
              cons: { type: Type.ARRAY, items: { type: Type.STRING } },
            }
          },
          aiContext: { type: Type.STRING, description: "A summarized text block of all the above info for the AI chat bot to use as context." }
        }
      }
    }
  });

  if (!response.text) {
    throw new Error("No data returned");
  }

  const data = JSON.parse(response.text) as AnalysisData;
  // Ensure ID is safe or preserved
  data.id = existingId || (competitorName.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now());
  data.name = competitorName;
  data.url = url;
  // Always update the timestamp to now when generating new data
  data.lastUpdated = Date.now();
  return data;
};