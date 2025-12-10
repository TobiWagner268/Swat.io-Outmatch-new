import { AnalysisData, CompetitorId, SectionType } from './types';

const HOOTSUITE_CONTEXT = `
Kurzurteil: Hootsuite ist ein globaler Platzhirsch mit sehr breitem Funktionsumfang und etabliertem Ruf — für viele SMBs & Agenturen ein “Standard-Tool”. Für unsere DACH-/EU-Zielgruppen mit hohen Compliance-, Skalierungs- und Governance-Ansprüchen passt Hootsuite jedoch nur bedingt optimal.
Top 3 Schwächen / Pain-Points: Einstiegspreis & Kostenstruktur (ab 99 USD), Skalierbarkeit ist teuer und unflexibel, Stabilitätsprobleme bei hoher Last.
Swat.io’s wichtigste Vorteile: Unbegrenzte Nutzer & Channels, DSGVO / EU-Compliance & Datenresidenz, Schlankheit & Usability.
Hootsuite Features: Publishing (gut aber komplex bei Scale), Inbox (Ausfälle bei Last), Analytics (Basis ok, granular schwierig).
Preise: 99 USD/Monat Start, kein Free Plan. Teure Skalierung.
Red Flags Swat.io: Hootsuite hat riesige Nutzerbasis und ist Standard für kleine Setups.
Kill Shots:
1. Hootsuite wird bei >15 Channels extrem teuer.
2. Performance Probleme bei Hootsuite (laut Reviews).
3. Datenresidenz bei Hootsuite unscharf (Swat.io ist EU-Hosting).
`;

const SPROUT_CONTEXT = `
Kurzurteil: Sprout Social ist der "Premium"-Wettbewerber. Extrem starkes UI, sehr gute Social Listening Tools, aber extrem teuer durch das "Per-User"-Pricing Modell.
Top Schwächen: Kosten explodieren bei großen Teams (jeder User zahlt voll), Support oft US-zentrisch.
Swat.io Vorteile: Flat-Pricing bei Usern (Unlimited Users), besserer lokaler Support, dedizierte Workflows für Redaktionsplanung.
Features: Analytics ist bei Sprout sehr stark (besser als Hootsuite), aber Reporting ist oft starr.
Preise: Startet bei $249/user/mo (Standard Plan). Ein Team mit 10 Leuten zahlt $2500+/Monat.
Kill Shots:
1. Pricing-Falle: "Wollen Sie wirklich $250 pro Praktikant zahlen?"
2. Governance: Sprout ist gut für Social Media Manager, aber schwach bei komplexen Freigabe-Prozessen mit externen Stakeholdern.
`;

const BUFFER_CONTEXT = `
Kurzurteil: Buffer ist das Einsteiger-Tool. Sehr günstig, sehr einfach, "Clean". Aber: Es fehlt Tiefe. Kein echtes Community Management, kaum Enterprise Features.
Top Schwächen: Getrennte Tools für Analytics/Publishing (historisch), sehr rudimentäre Inbox, keine komplexen Genehmigungsworkflows.
Swat.io Vorteile: All-in-One Lösung. Bei Buffer muss man oft "basteln". Swat.io bietet Enterprise-Governance.
Preise: Startet sehr günstig (Freemium oder $6/channel).
Kill Shots:
1. "Buffer ist ein Publishing-Tool, Swat.io ist ein Social Media Management OS."
2. Fehlende Inbox-Power: Wer viel Community Management macht, geht bei Buffer unter.
`;

const AGORAPULSE_CONTEXT = `
Kurzurteil: Agorapulse ist ein starker Challenger im SMB-Bereich. Sehr user-freundlich, gutes Preis-Leistungs-Verhältnis. Aber: Schwächen im Enterprise-Segment (komplexe Rechte, Audit Logs).
Top Schwächen: Reporting ist oft zu basic für große Brands. Rechte-Management nicht granular genug für komplexe Agentur-Setups.
Swat.io Vorteile: Enterprise-Grade Governance, DACH-Support & Hosting, bessere Skalierung bei sehr vielen Kanälen.
Preise: Günstiger Einstieg, aber "Add-ons" können lästig sein.
Kill Shots:
1. "Agorapulse ist super für Teams bis 3 Leute. Swat.io ist für Organisationen."
2. "Datenschutz: Swat.io ist 'Made in Austria' mit Servern in DE/AT. Agorapulse ist global/US-fokussiert (trotz FR-Wurzeln)."
`;

const SOCIALHUB_CONTEXT = `
Kurzurteil: SocialHub ist der direkte Konkurrent im Public Sector & Government (DACH). Sehr starker Fokus auf Inbox/Ticket-Handling. Schwächer im Bereich Content-Planung/Visualisierung im Vergleich zu Swat.io.
Top Schwächen: UI wirkt oft etwas altbacken ("E-Mail-Client Feeling"). Content-Planung/Redaktionskalender nicht so visuell und intuitiv wie bei Swat.io.
Swat.io Vorteile: Moderneres UI, besserer integrierter Redaktionskalender, stärkere AI-Integration im Publishing.
Preise: Oft intransparentes Enterprise-Pricing, ähnlich wie Swat.io.
Kill Shots:
1. "SocialHub ist ein Ticket-System. Swat.io ist eine Content- & Community-Plattform."
2. "Die Content-Planung bei Swat.io ist visueller und kollaborativer für Marketing-Teams."
`;

const FACELIFT_CONTEXT = `
Kurzurteil: Facelift ist der klassische Enterprise-Konkurrent in DACH. Sehr mächtig, aber oft als "behäbig", "teuer" und "komplex" wahrgenommen.
Top Schwächen: Usability (UX) oft kritisiert ("Click-Intensive"). Setup dauert lange. Support manchmal langsam.
Swat.io Vorteile: Schnelleres Onboarding, intuitivere UX (weniger Schulungsaufwand), agilerer Support.
Preise: Hohe Setup-Fees, teure Lizenzen.
Kill Shots:
1. "Facelift brauchen Sie, wenn Sie 5 Jahre Zeit für die Einführung haben. Swat.io läuft nächste Woche."
2. "Warum für Komplexität zahlen, die niemand nutzt? Swat.io bietet Enterprise-Power mit Consumer-UX."
`;

const CURRENT_TIMESTAMP = Date.now();

export const INITIAL_COMPETITORS: Record<CompetitorId, AnalysisData> = {
  hootsuite: {
    id: 'hootsuite',
    name: 'Hootsuite',
    url: 'https://www.hootsuite.com',
    lastUpdated: CURRENT_TIMESTAMP,
    title: "Analyse: Hootsuite",
    aiContext: HOOTSUITE_CONTEXT,
    summary: {
      verdict: "Globaler Platzhirsch, aber für DACH/Enterprise oft zu unflexibel und teuer bei Skalierung.",
      painPoints: [
        "Einstiegspreis & Kostenstruktur (ab 99 USD).",
        "Teure Skalierung bei mehr Usern/Channels.",
        "Stabilitätsprobleme bei hoher Last."
      ],
      advantages: [
        "Unbegrenzte Nutzer & Channels.",
        "DSGVO-Native & EU-Hosting.",
        "Bessere Performance bei High-Volume."
      ]
    },
    momentum: {
      market_position: "Globaler Marktführer, aber sinkende Beliebtheit bei KMUs durch Preiserhöhungen.",
      recent_updates: "Fokus auf AI-Content-Creation und Integrationen, allerdings wenig Innovation in der Kern-UX."
    },
    platform_coverage: {
      summary: "Sehr breite Abdeckung aller gängigen Netzwerke, inklusive Nischen.",
      strengths: ["LinkedIn", "Instagram", "TikTok", "Pinterest", "YouTube"]
    },
    red_flags: {
      warnings: [
        "Teure Add-ons für Reporting & Listening",
        "Support oft nur auf Englisch/US-Zeiten",
        "Veraltetes UI bei einigen Modulen"
      ],
      win_signals: [
        "Kunde hat > 15 Kanäle",
        "Kunde benötigt deutsche Datenhaltung",
        "Kunde ist unzufrieden mit Support"
      ]
    },
    featureComparison: [
      {
        category: "Publishing",
        hootsuite: "Multi-Network, AI-Support",
        reality: "Komplex bei Scale, Bugs möglich.",
        swatio_advantage: "Stabil, Performant, User-Friendly."
      },
      {
        category: "Inbox",
        hootsuite: "Unified Inbox",
        reality: "Ausfälle bei Last berichtet.",
        swatio_advantage: "Dedizierte Service-Inbox."
      },
      {
        category: "Compliance",
        hootsuite: "DSGVO-Hinweise",
        reality: "Hosting oft unklar.",
        swatio_advantage: "Server in EU (AWS Frankfurt)."
      }
    ],
    pricing: {
      entry: "99 USD/mo",
      cons: ["Kein Free Plan", "Teure Add-ons", "Preiserhöhungen"]
    },
    reviewAnalysis: {
      competitor_consensus: "Nutzer schätzen die breite Funktionsvielfalt, klagen aber zunehmend über das Preis-Leistungs-Verhältnis. Viele berichten von Bugs im Planner und einem schwer erreichbaren Support. Die allgemeine Stimmung kippt aufgrund der Zwangsumstellung auf teurere Pläne.",
      swatio_comparison: "Während Hootsuite oft als 'anonym' und 'teuer' empfunden wird, loben Nutzer bei Swat.io den persönlichen Support und die Stabilität. Swat.io wird als die 'sichere' und 'transparente' Alternative wahrgenommen, besonders bei Teams mit hohen Compliance-Anforderungen."
    },
    reviews: [
      { platform: "G2", count: 6600 },
      { platform: "Capterra", count: 3783 },
      { platform: "OMR Reviews", count: 250 }
    ],
    criticalReviews: [
      { title: "Buggy & Teuer", comment: "Seit dem Update funktionierte die Verknüpfung zu LinkedIn nicht mehr zuverlässig. Support hat 4 Tage nicht reagiert.", source: "Capterra", date: "Januar 2025", rating: 1 },
      { title: "Versteckte Kosten", comment: "Wir dachten, Reporting wäre dabei. Jetzt sollen wir 200€ extra zahlen für Basic Stats.", source: "Trustpilot", date: "Dezember 2024", rating: 1 },
      { title: "Unübersichtlich", comment: "Das Dashboard ist völlig überladen. Man findet nichts wieder.", source: "G2", date: "Oktober 2024", rating: 2 },
      { title: "Support unerreichbar", comment: "Wir hatten ein kritisches Problem mit dem Account, aber nur Chatbots als Antwort erhalten.", source: "Capterra", date: "September 2024", rating: 1 },
      { title: "Zwangsupgrade", comment: "Der Legacy Plan wurde gestrichen, der neue kostet das Dreifache.", source: "OMR Reviews", date: "August 2024", rating: 1 },
      { title: "Instabil bei Videos", comment: "Video-Uploads zu Instagram brechen ständig ab.", source: "G2", date: "Juli 2024", rating: 2 }
    ],
    killShots: [
      { title: "Skalierungs-Falle", statement: "Hootsuite wird ab 15 Kanälen extrem teuer.", talkTrack: "Swat.io skaliert flat mit." },
      { title: "Datenschutz", statement: "Wo liegen Ihre Daten bei Hootsuite?", talkTrack: "Bei Swat.io: Garantiert in der EU." }
    ]
  },
  sprout_social: {
    id: 'sprout_social',
    name: 'Sprout Social',
    url: 'https://sproutsocial.com',
    lastUpdated: CURRENT_TIMESTAMP,
    title: "Analyse: Sprout Social",
    aiContext: SPROUT_CONTEXT,
    summary: {
      verdict: "Gold-Standard für UX, aber durch 'Per-User'-Pricing für Teams oft unbezahlbar.",
      painPoints: ["Extrem hohe Kosten pro User.", "US-Fokus bei Support.", "Starre Workflows."],
      advantages: ["Unlimited Users inklusive.", "Lokaler DACH-Support.", "Flexible Workflows."]
    },
    momentum: {
      market_position: "Premium-Segment Marktführer in USA, wächst im Enterprise Bereich.",
      recent_updates: "Starke Investitionen in Social Listening und AI-Analytics (durch Akquisitionen)."
    },
    platform_coverage: {
      summary: "Exzellente Tiefe bei den Hauptnetzwerken, sehr starke Analytics-Integration.",
      strengths: ["Twitter/X", "LinkedIn", "Facebook", "Instagram", "Pinterest"]
    },
    red_flags: {
      warnings: [
        "Kostenexplosion bei Team-Wachstum",
        "US-basiertes Hosting (oft KO für Public Sector)",
        "Wenig Flexibilität bei Custom-Workflows"
      ],
      win_signals: [
        "Großes Content-Team (> 5 User)",
        "Bedarf an komplexen Freigabe-Workflows",
        "Budget-Sensibilität"
      ]
    },
    featureComparison: [
      { category: "Pricing", hootsuite: "$249/User", reality: "Kosten explodieren.", swatio_advantage: "Flat Pricing." },
      { category: "Inbox", hootsuite: "Smart Inbox", reality: "Top, aber teuer.", swatio_advantage: "Inklusive Ticket-Routing." }
    ],
    pricing: {
      entry: "$249/user/mo",
      cons: ["Per-User Modell", "Add-ons für Listening"]
    },
    reviewAnalysis: {
      competitor_consensus: "Sprout Social wird fast universell für seine hervorragende Benutzeroberfläche (UI) und die leistungsstarken Social-Listening-Tools gelobt. Die größte Kritik betrifft fast immer die Kosten: Nutzer fühlen sich durch das 'Per-User'-Pricing bestraft, wenn ihr Team wächst.",
      swatio_comparison: "Swat.io gewinnt immer dann, wenn das Budget eine Rolle spielt. Nutzer wechseln zu Swat.io, um Kostensicherheit zu haben, ohne bei der Funktionalität große Abstriche machen zu müssen. Zudem wird Swat.io's Support oft als nahbarer und schneller empfunden als der US-Support von Sprout."
    },
    reviews: [
      { platform: "G2", count: 4200 },
      { platform: "Capterra", count: 1200 },
      { platform: "OMR Reviews", count: 150 }
    ],
    criticalReviews: [
      { title: "Preisschock", comment: "Eine Preiserhöhung von 300% ohne wirkliche Vorwarnung. Für Agenturen kaum tragbar.", source: "G2", date: "Februar 2025", rating: 1 },
      { title: "Support nur Englisch", comment: "Schwierig für unsere deutschen Kollegen, technische Probleme zu erklären.", source: "Capterra", date: "Januar 2025", rating: 2 },
      { title: "Limitierte Historie", comment: "Reports gehen nur 6 Monate zurück im Standard-Plan. Lächerlich für den Preis.", source: "OMR Reviews", date: "Dezember 2024", rating: 1 },
      { title: "Knebelverträge", comment: "Automatische Verlängerung um ein Jahr, wenn man die Frist um einen Tag verpasst.", source: "Trustpilot", date: "November 2024", rating: 1 },
      { title: "Listening extra teuer", comment: "Das Listening Tool ist gut, kostet aber mehr als die ganze Lizenz.", source: "G2", date: "Oktober 2024", rating: 2 },
      { title: "Zu viel US-Fokus", comment: "Feiertagskalender und Trends sind sehr US-zentriert.", source: "Capterra", date: "August 2024", rating: 3 }
    ],
    killShots: [
      { title: "Kostenfalle", statement: "$250 für einen Praktikanten-Account?", talkTrack: "Swat.io fördert Kollaboration, Sprout bestraft sie." }
    ]
  },
  buffer: {
    id: 'buffer',
    name: 'Buffer',
    url: 'https://buffer.com',
    lastUpdated: CURRENT_TIMESTAMP,
    title: "Analyse: Buffer",
    aiContext: BUFFER_CONTEXT,
    summary: {
      verdict: "Günstiges Einstiegs-Tool, aber funktional für Enterprise/Teams zu limitiert.",
      painPoints: ["Kein echtes Community Mgmt.", "Rechte-Mgmt fehlt.", "Reporting basic."],
      advantages: ["All-in-One OS statt Insel-Lösung.", "Enterprise Governance.", "Integrierte Inbox."]
    },
    momentum: {
      market_position: "Einstiegs-Lösung für Solopreneurs und kleine Brands.",
      recent_updates: "Versuch, mehr 'All-in-One' zu werden, aber immer noch modular zersplittert."
    },
    platform_coverage: {
      summary: "Basis-Abdeckung, Fokus auf einfaches Publishing.",
      strengths: ["Mastodon", "LinkedIn", "Instagram", "Twitter"]
    },
    red_flags: {
      warnings: [
        "Keine echte Unified Inbox für Service",
        "Reporting muss separat bezahlt/genutzt werden",
        "Keine komplexen Approval-Workflows"
      ],
      win_signals: [
        "Wunsch nach Community Management",
        "Mehrere Stakeholder im Prozess",
        "Bedarf an Audit-Logs"
      ]
    },
    featureComparison: [
      { category: "Scope", hootsuite: "Publishing Only", reality: "Man braucht extra Tools.", swatio_advantage: "Full Suite." },
      { category: "Inbox", hootsuite: "Basic/Separate", reality: "Community Mgmt schwer.", swatio_advantage: "Profi-Inbox." }
    ],
    pricing: {
      entry: "Free / $6 per Channel",
      cons: ["Funktionsarm", "Teurer bei vielen Kanälen"]
    },
    reviewAnalysis: {
      competitor_consensus: "Buffer wird für seine Einfachheit, den 'Clean Look' und das faire Einstiegsmodell geliebt. Kritik gibt es für die mangelnde Tiefe: Es fehlt an robusten Inbox-Funktionen und granularen Analytics. Für reine Publisher top, für Community Management Flop.",
      swatio_comparison: "Der Vergleich ist oft 'Apfel mit Birnen'. Wer von Buffer zu Swat.io wechselt, sucht meist 'Erwachsenen-Features': Genehmigungsworkflows, Ticket-Zuweisung und Audit-Logs. Swat.io wird als die professionelle Weiterentwicklung gesehen."
    },
    reviews: [
      { platform: "G2", count: 1000 },
      { platform: "Capterra", count: 2500 },
      { platform: "OMR Reviews", count: 50 }
    ],
    criticalReviews: [
      { title: "Nicht Enterprise Ready", comment: "Es fehlen einfachste Rechte-Rollen-Konzepte. Jeder darf alles löschen.", source: "Capterra", date: "Januar 2025", rating: 2 },
      { title: "Inbox fehlt", comment: "Wir mussten ein extra Tool für Kommentare kaufen. Buffer kann nur senden.", source: "G2", date: "Dezember 2024", rating: 1 },
      { title: "Bugs bei Instagram", comment: "Stories werden oft nicht gepostet, man kriegt nur eine Fehlermeldung aufs Handy.", source: "Trustpilot", date: "November 2024", rating: 2 },
      { title: "Analytics kostet extra", comment: "Früher war alles drin, jetzt muss man für simple Stats zahlen.", source: "G2", date: "Oktober 2024", rating: 2 },
      { title: "LinkedIn Tagging", comment: "Tagging von Privatprofilen funktioniert fast nie.", source: "Capterra", date: "September 2024", rating: 3 },
      { title: "Zu simpel", comment: "Für eine Person okay, für unser Team mit 5 Leuten Chaos.", source: "OMR Reviews", date: "August 2024", rating: 2 }
    ],
    killShots: [
      { title: "Kein Management-OS", statement: "Buffer postet nur. Swat.io managed.", talkTrack: "Für Service & Krisen brauchen Sie mehr als Buffer." }
    ]
  },
  agorapulse: {
    id: 'agorapulse',
    name: 'Agorapulse',
    url: 'https://www.agorapulse.com',
    lastUpdated: CURRENT_TIMESTAMP,
    title: "Analyse: Agorapulse",
    aiContext: AGORAPULSE_CONTEXT,
    summary: {
      verdict: "Starker SMB-Challenger mit gutem Preis/Leistung, aber Schwächen in Enterprise-Tiefe.",
      painPoints: ["Reporting zu basic für Konzerne.", "Rechte-Rollen-Konzept limitiert.", "Weniger Skalierbarkeit."],
      advantages: ["Enterprise Governance & Audit Logs.", "Besseres Handling hunderter Kanäle.", "DACH-Focus."]
    },
    momentum: {
      market_position: "Beliebt bei Agenturen im mittleren Segment.",
      recent_updates: "Starke Community-Features, aber langsame Enterprise-Entwicklung."
    },
    platform_coverage: {
      summary: "Solide Abdeckung der 'Big 5'.",
      strengths: ["Facebook", "Instagram", "LinkedIn", "TikTok"]
    },
    red_flags: {
      warnings: [
        "Reporting oft nicht granular genug",
        "Rollen & Rechte System stößt an Grenzen",
        "Datenhaltung primär US (AWS US East)"
      ],
      win_signals: [
        "Konzern-Struktur mit vielen Teams",
        "Strikte DSGVO-Anforderungen",
        "Bedarf an individuellen Reports"
      ]
    },
    featureComparison: [
      { category: "Target", hootsuite: "SMB / Mid-Market", reality: "Gut für kleine Teams.", swatio_advantage: "Enterprise Ready." },
      { category: "Reporting", hootsuite: "Standard Reports", reality: "Wenig Customizing.", swatio_advantage: "Granulares Reporting." }
    ],
    pricing: {
      entry: "€49/user/mo",
      cons: ["User-basiertes Pricing (teilw.)", "Add-ons"]
    },
    reviewAnalysis: {
      competitor_consensus: "Agorapulse hat sehr treue Fans im Agentur-Umfeld. Das Tool gilt als intuitiv und preislich fair. Negative Stimmen beziehen sich meist auf fehlende Enterprise-Features (komplexe Rechte, individuelle Reports) oder Instabilitäten bei der Mobile App.",
      swatio_comparison: "Swat.io punktet dort, wo Agorapulse aufhört: Bei komplexen Organisationsstrukturen. Nutzer, die wechseln, tun dies oft wegen der besseren Governance-Features und der Garantie, dass Daten in der EU bleiben (Agorapulse nutzt oft US-Server)."
    },
    reviews: [
      { platform: "G2", count: 900 },
      { platform: "Capterra", count: 700 },
      { platform: "OMR Reviews", count: 120 }
    ],
    criticalReviews: [
      { title: "Video Upload Probleme", comment: "Videos brechen oft beim Upload ab. Sehr frustrierend.", source: "Capterra", date: "Januar 2025", rating: 1 },
      { title: "Reporting zu flach", comment: "Kunden wollen detaillierte Breakdowns, Agorapulse liefert nur High-Level Zahlen.", source: "G2", date: "Dezember 2024", rating: 2 },
      { title: "App instabil", comment: "Die Mobile App stürzt beim Wechseln der Teams oft ab.", source: "App Store", date: "November 2024", rating: 1 },
      { title: "Rechteverwaltung", comment: "Ich kann Praktikanten nicht einschränken, nur Beiträge zu 'entwerfen'.", source: "OMR Reviews", date: "Oktober 2024", rating: 2 },
      { title: "Add-Ons läppern sich", comment: "Jedes Extra-Feature kostet mittlerweile Aufpreis.", source: "Trustpilot", date: "August 2024", rating: 2 },
      { title: "LinkedIn API", comment: "Erwähnungen werden oft nicht angezeigt.", source: "G2", date: "Juli 2024", rating: 3 }
    ],
    killShots: [
      { title: "Team-Größe", statement: "Agorapulse ist top für 3 Leute. Swat.io für 30.", talkTrack: "Wenn Governance wichtig wird, stößt Agorapulse an Grenzen." }
    ]
  },
  socialhub: {
    id: 'socialhub',
    name: 'SocialHub',
    url: 'https://socialhub.io',
    lastUpdated: CURRENT_TIMESTAMP,
    title: "Analyse: SocialHub",
    aiContext: SOCIALHUB_CONTEXT,
    summary: {
      verdict: "Stark im Behörden-Umfeld (Inbox-Fokus), aber schwächer im Marketing/Publishing.",
      painPoints: ["UI wirkt veraltet (E-Mail Style).", "Publishing weniger visuell.", "Wenig AI-Innovation."],
      advantages: ["Moderneres UI/UX.", "Visueller Redaktionsplan.", "Innovationsgeschwindigkeit."]
    },
    momentum: {
      market_position: "Nischen-Player im deutschen Public Sector / Government.",
      recent_updates: "Fokus auf Behörden-Features, wenig Innovation im Creative/Publishing Bereich."
    },
    platform_coverage: {
      summary: "Fokus auf Text-basierte Kommunikation und Krisenmanagement.",
      strengths: ["Facebook", "Twitter", "Email-Ticket Integration"]
    },
    red_flags: {
      warnings: [
        "Look & Feel wie Outlook 2010",
        "Marketing-Teams finden es oft 'unsexy'",
        "Weniger visuelle Planungstools"
      ],
      win_signals: [
        "Marketing-Team soll mitarbeiten",
        "Wunsch nach Kalender-Visualisierung",
        "Moderne UX Erwartung"
      ]
    },
    featureComparison: [
      { category: "Focus", hootsuite: "Ticket-System", reality: "Fühlt sich an wie Outlook.", swatio_advantage: "Social Media Suite." },
      { category: "Publishing", hootsuite: "Listen-basiert", reality: "Wenig Übersicht.", swatio_advantage: "Visueller Kalender." }
    ],
    pricing: {
      entry: "Auf Anfrage",
      cons: ["Intransparent", "Oft teuer für Funktionsumfang"]
    },
    reviewAnalysis: {
      competitor_consensus: "SocialHub wird in Behörden für seine Zuverlässigkeit und den deutschen Datenschutz geschätzt. Die Kritik ist jedoch deutlich: Das Design wirkt altbacken, und kreative Marketing-Teams fühlen sich in der 'Outlook-artigen' Oberfläche oft nicht wohl.",
      swatio_comparison: "Swat.io wird als der 'moderne Bruder' wahrgenommen. Gleiche Compliance-Sicherheit, aber mit einem UI, das Spaß macht. Nutzer wechseln oft, weil sie eine visuelle Planung (Redaktionskalender) wollen, die SocialHub so nicht bietet."
    },
    reviews: [
      { platform: "OMR Reviews", count: 200 },
      { platform: "Capterra", count: 100 },
      { platform: "G2", count: 20 }
    ],
    criticalReviews: [
      { title: "UI veraltet", comment: "Fühlt sich an wie Software aus 2010. Funktional, aber macht keinen Spaß.", source: "OMR Reviews", date: "Januar 2025", rating: 2 },
      { title: "Publishing schwach", comment: "Für Community Management super, aber Kampagnen planen ist mühsam.", source: "Capterra", date: "Dezember 2024", rating: 2 },
      { title: "Preis/Leistung", comment: "Für den Funktionsumfang im Vergleich zu modernen Suiten zu teuer.", source: "Direct Feedback", date: "Oktober 2024", rating: 2 },
      { title: "Kein TikTok", comment: "Die Integration neuer Kanäle dauert ewig.", source: "G2", date: "September 2024", rating: 3 },
      { title: "Mobile App", comment: "Die App ist sehr rudimentär und stürzt oft ab.", source: "App Store", date: "August 2024", rating: 1 },
      { title: "Kalenderansicht", comment: "Es fehlt eine gute Monatsübersicht für den Content.", source: "OMR Reviews", date: "Juli 2024", rating: 3 }
    ],
    killShots: [
      { title: "Look & Feel", statement: "Wollen Sie in einer Excel-Liste arbeiten oder visuell?", talkTrack: "Swat.io holt auch das Marketing-Team ab, nicht nur den Support." }
    ]
  },
  facelift: {
    id: 'facelift',
    name: 'Facelift',
    url: 'https://facelift-bbt.com',
    lastUpdated: CURRENT_TIMESTAMP,
    title: "Analyse: Facelift",
    aiContext: FACELIFT_CONTEXT,
    summary: {
      verdict: "Der 'große Bruder' im DACH-Raum. Mächtig, aber oft überkomplex, langsam und teuer.",
      painPoints: ["UX ist click-intensiv & komplex.", "Setup & Onboarding dauert lange.", "Support oft träge."],
      advantages: ["Time-to-Value (schneller Start).", "Intuitivere Bedienung (weniger Schulung).", "Agilerer Support."]
    },
    momentum: {
      market_position: "Etablierter Enterprise Player, aber oft als 'Legacy' wahrgenommen.",
      recent_updates: "Konsolidierung der Cloud-Produkte, Migrationen oft schmerzhaft."
    },
    platform_coverage: {
      summary: "Extrem tief, aber oft umständlich zu konfigurieren.",
      strengths: ["Alle Netzwerke", "Custom Integrations", "Whitelabeling"]
    },
    red_flags: {
      warnings: [
        "Lange Vertragslaufzeiten & Setup-Phasen",
        "Hoher Schulungsaufwand für neue Mitarbeiter",
        "Träger Support bei Problemen"
      ],
      win_signals: [
        "Wunsch nach schnellem Go-Live",
        "Hohe Fluktuation im Team (Usability wichtig)",
        "Agile Arbeitsweise"
      ]
    },
    featureComparison: [
      { category: "UX", hootsuite: "Enterprise (Komplex)", reality: "Lange Klickwege.", swatio_advantage: "Modern & Intuitiv." },
      { category: "Speed", hootsuite: "Feature-Monster", reality: "Fühlt sich schwer an.", swatio_advantage: "Leichtgewichtig & Schnell." }
    ],
    pricing: {
      entry: "High Enterprise",
      cons: ["Setup Fees", "Teure Lizenzen", "Lange Verträge"]
    },
    reviewAnalysis: {
      competitor_consensus: "Facelift gilt als mächtiges 'Schlachtschiff', das alles kann – wenn man weiß, wie. Reviews bemängeln häufig die steile Lernkurve, die langsame Performance und die Bürokratie beim Support. Es ist ein Tool für Experten, nicht für 'Nebenbei-Nutzer'.",
      swatio_comparison: "Swat.io wird als die agile Alternative gesehen. Nutzer berichten oft von einem 'Aufatmen' nach dem Wechsel, weil Aufgaben, die in Facelift 10 Klicks brauchten, in Swat.io mit 2 Klicks erledigt sind. Time-to-Value ist bei Swat.io deutlich schneller."
    },
    reviews: [
      { platform: "G2", count: 150 },
      { platform: "Capterra", count: 100 },
      { platform: "OMR Reviews", count: 350 }
    ],
    criticalReviews: [
      { title: "Zu Komplex", comment: "Man braucht einen Doktortitel, um das Tool zu bedienen. Das Team nutzt es kaum.", source: "OMR Reviews", date: "Januar 2025", rating: 2 },
      { title: "Support langsam", comment: "Auf Tickets wartet man oft Tage. Bei kritischen Bugs ein No-Go.", source: "Capterra", date: "Dezember 2024", rating: 1 },
      { title: "Teuer & Träge", comment: "Wir zahlen Premium-Preise, aber die Software fühlt sich langsam und alt an.", source: "G2", date: "November 2024", rating: 2 },
      { title: "Onboarding Alptraum", comment: "Die Einführung hat 4 Monate gedauert. Viel zu lang.", source: "Trustpilot", date: "September 2024", rating: 1 },
      { title: "Reporting unflexibel", comment: "Trotz der vielen Daten kriege ich nicht den einfachen Report, den ich brauche.", source: "OMR Reviews", date: "August 2024", rating: 3 },
      { title: "Klick-Wahnsinn", comment: "Für einen Post muss ich mich durch 5 Menüs klicken.", source: "Capterra", date: "Juli 2024", rating: 2 }
    ],
    killShots: [
      { title: "Komplexität", statement: "Facelift braucht Experten. Swat.io kann jeder nutzen.", talkTrack: "Sparen Sie sich teure Schulungen und lange Onboardings." }
    ]
  }
};

export const SECTION_TITLES: Record<SectionType, string> = {
  [SectionType.EXECUTIVE_SUMMARY]: "Executive Summary",
  [SectionType.FEATURE_CHECK]: "Feature Reality Check",
  [SectionType.PLATFORM_COVERAGE]: "Plattform Coverage",
  [SectionType.PRICING]: "Preis & Skalierung",
  [SectionType.MOMENTUM]: "Entwicklung & Momentum",
  [SectionType.REVIEWS]: "Review Intelligenz",
  [SectionType.RED_FLAGS]: "Red Flags & Win Signals",
  [SectionType.SALES_ARGUMENTS]: "Sales 'Kill Shots'",
};