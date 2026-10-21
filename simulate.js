// ============================================================================
// PREDIKOVERKSTADEN – Headless Simulerings- och Balanseringssvit (simulate.js)
// Kör hundratals spelomgångar med olika strategier för att verifiera svårighetsgrad
// ============================================================================

const GAME_DATA = require("./data.js");
const { SermonGame } = require("./game.js");

// Hjälpfunktion för att välja predikoakt-alternativ enligt en viss strategi
function pickActOptionByFocus(game, preferredFocus, allowCard = true) {
  const options = game.getSundayActOptions(game.sundayActIndex);
  if (allowCard) {
    const cardOptIdx = options.findIndex((o) => o.id === "card_focus" && o.statFocus === preferredFocus);
    if (cardOptIdx !== -1) return cardOptIdx;
  }
  const focusIdx = options.findIndex((o) => o.statFocus === preferredFocus && o.id !== "card_focus");
  if (focusIdx !== -1) return focusIdx;
  return 0;
}

// ============================================================================
// DEFINIERA OLIKA SPELSTRATEGIER (Från helt naiva till mästerliga)
// ============================================================================
const STRATEGIES = [
  {
    id: "dumb_exegesis_spam",
    name: "1. Bara Närläsa & Predika Text (Användarens dumma strategi)",
    description: "Närläser bara bibeltexten hela veckan (med tvångsvila vid utmattning) och väljer enbart Logos i alla 4 predikoakter.",
    decideTurn(game) {
      if (game.energy < 15) return "rest_incubation";
      return "exegesis";
    },
    decideDisruption() {
      return 1; // Avfärdar allt för att bara plugga text
    },
    decideSundayAct(game) {
      return pickActOptionByFocus(game, "logos", false);
    }
  },
  {
    id: "social_butterfly_no_bible",
    name: "2. Bara Kyrkkaffe & Tidning (Ingen Bibel / Inget Manus)",
    description: "Fikar i församlingshemmet, läser tidningen och går på hembesök hela veckan men glömmer helt bort bibeltexten och manuset.",
    decideTurn(game) {
      if (game.energy < 20) return "rest_incubation";
      const cycle = ["parish_coffee", "read_newspapers", "pastoral_visit", "prayer_silence"];
      return cycle[game.turnNumber % cycle.length];
    },
    decideDisruption() {
      return 0;
    },
    decideSundayAct(game) {
      return pickActOptionByFocus(game, "pathos", false);
    }
  },
  {
    id: "random_clicker",
    name: "3. Slumpmässigt Klickande (Planlös)",
    description: "Väljer helt slumpmässiga aktiviteter och slumpmässiga val i predikstolen.",
    decideTurn(game) {
      if (game.energy < 18) return "rest_incubation";
      const acts = GAME_DATA.activities;
      return acts[Math.floor(Math.random() * acts.length)].id;
    },
    decideDisruption(game, d) {
      return Math.floor(Math.random() * d.choices.length);
    },
    decideSundayAct(game) {
      const opts = game.getSundayActOptions(game.sundayActIndex);
      return Math.floor(Math.random() * opts.length);
    }
  },
  {
    id: "wrong_order_chaotic",
    name: "4. Bakvänd Rutin (Skriver manus Tisdag, Exeges Lördag)",
    description: "Börjar veckan med att råskriva manus och fila på retorik på tisdagen, och läser bibeltexten först på lördagen.",
    Schedule: [
      "write_draft", "polish_rhetoric", "practice_pulpit", // Tis
      "write_draft", "parish_coffee", "rest_incubation",   // Ons
      "read_newspapers", "pastoral_visit", "prayer_silence", // Tor
      "structure_sketch", "theology_study", "rest_incubation", // Fre
      "exegesis", "exegesis", "write_draft" // Lör (Nattpanik!)
    ],
    decideTurn(game) {
      if (game.energy < 16) return "rest_incubation";
      return this.Schedule[game.turnNumber - 1] || "exegesis";
    },
    decideDisruption() {
      return 1;
    },
    decideSundayAct(game) {
      const order = ["logos", "logos", "kairos", "pathos"];
      return pickActOptionByFocus(game, order[game.sundayActIndex], false);
    }
  },
  {
    id: "workaholic_burnout",
    name: "5. Utbränd Arbetsnarkoman (Ingen vila/bön, Lördagsnatt-panik)",
    description: "Jobbar varje kväll, struntar i bön och återhämtning, sitter uppe lördag natt.",
    Schedule: [
      "exegesis", "theology_study", "read_newspapers",
      "pastoral_visit", "parish_coffee", "structure_sketch",
      "write_draft", "theology_study", "write_draft",
      "polish_rhetoric", "practice_pulpit", "read_newspapers",
      "pastoral_visit", "polish_rhetoric", "write_draft"
    ],
    decideTurn(game) {
      const actId = this.Schedule[game.turnNumber - 1];
      const act = GAME_DATA.activities.find((a) => a.id === actId);
      if (act && act.energyCost > 0 && game.energy < 14) return "prayer_silence";
      return actId;
    },
    decideDisruption() {
      return 0;
    },
    decideSundayAct(game) {
      const order = ["kairos", "logos", "pathos", "kairos"];
      return pickActOptionByFocus(game, order[game.sundayActIndex], true);
    }
  },
  {
    id: "good_prep_monotonous_delivery",
    name: "6. God Förberedelse, men Monoton Predikstol",
    description: "Gör en riktigt bra vecka med alla moment, men väljer envist bara Logos i alla 4 akter på söndagen.",
    Schedule: [
      "exegesis", "read_newspapers", "prayer_silence",      // Tis
      "theology_study", "pastoral_visit", "rest_incubation",// Ons
      "parish_coffee", "structure_sketch", "prayer_silence",// Tor
      "write_draft", "write_draft", "rest_incubation",      // Fre
      "polish_rhetoric", "practice_pulpit", "rest_incubation" // Lör
    ],
    decideTurn(game) {
      if (game.energy < 16) return "rest_incubation";
      return this.Schedule[game.turnNumber - 1];
    },
    decideDisruption() {
      return 0;
    },
    decideSundayAct(game) {
      return pickActOptionByFocus(game, "logos", false);
    }
  },
  {
    id: "solid_pastor",
    name: "7. Kompetent Standardpastor (God rutin & vettig leverans)",
    description: "Följer en sund veckoplanering och varierar leveransen, men optimerar inte alla kort/energival fullt ut.",
    Schedule: [
      "exegesis", "parish_coffee", "rest_incubation",       // Tis
      "read_newspapers", "theology_study", "prayer_silence",// Ons
      "pastoral_visit", "structure_sketch", "rest_incubation", // Tor
      "write_draft", "write_draft", "prayer_silence",       // Fre
      "polish_rhetoric", "practice_pulpit", "rest_incubation" // Lör
    ],
    decideTurn(game) {
      if (game.energy < 18) return "rest_incubation";
      return this.Schedule[game.turnNumber - 1];
    },
    decideDisruption(game) {
      return game.energy > 45 ? 0 : 1;
    },
    decideSundayAct(game) {
      const order = ["kairos", "logos", "pathos", "kairos"];
      return pickActOptionByFocus(game, order[game.sundayActIndex], true);
    }
  },
  {
    id: "master_homiletician",
    name: "8. Mästerpredikanten (Optimal homiletisk rutin + dynamisk anpassning)",
    description: "Anpassar veckan efter söndagens målprofil, låser upp alla nyckelsynergier, placerar insiktskort rätt och håller en perfekt retorisk båge.",
    decideTurn(game) {
      const t = game.turnNumber;
      const slot = game.getCurrentSlot();
      const target = game.sunday.targetProfile;

      // Sista passet (Lördag kväll): Om manus >= 80%, gå till Lördagsfrid!
      if (t === 15) {
        if (game.process.draftProgress >= 80 && game.process.structureDone) return "rest_incubation";
        return "write_draft";
      }

      // Kvällspass (pass 3, 6, 9, 12): Använd alltid Bön eller Vila för att slippa kvällsstraff (-6 energi) och bygga synergier!
      if (slot.isEvening) {
        const todayActs = game.process.dailyActivities[game.dayIndex];
        if ((todayActs.includes("exegesis") || todayActs.includes("theology_study")) && !game.hasSynergy("lectio_divina")) {
          return "prayer_silence";
        }
        if (game.energy <= 62) {
          return "rest_incubation";
        }
        if (game.spirit < 68) {
          return "prayer_silence";
        }
        return "rest_incubation";
      }

      // Dag 1 (Tisdag FM & EM): Välj söndagens rekommenderade predikoform direkt så veckans arbete anpassas efter formen!
      if (t === 1) {
        game.selectSermonForm(game.sunday.recommendedForm);
        return "exegesis";
      }
      if (t === 2) return "read_newspapers";

      // Dag 2 (Onsdag FM & EM): Teologisk fördjupning + Själavård
      if (t === 4) return "theology_study";
      if (t === 5) return "pastoral_visit";

      // Dag 3 (Torsdag FM & EM): Kyrkkaffe + Brobygge (Skissa struktur)
      if (t === 7) {
        if (game.stats.pathos < 16 || game.stats.kairos < 16) return "parish_coffee";
        return "read_newspapers";
      }
      if (t === 8) return "structure_sketch";

      // Dag 4 (Fredag FM & EM): Skriva predikomanus (2 pass -> 92% manus!)
      if (t === 10) return "write_draft";
      if (t === 11) return "write_draft";

      // Dag 5 (Lördag FM & EM): Finslipa retorik & Öva i predikstolen (eller täck upp svagaste pelaren)
      if (t === 13) {
        if (game.stats.kairos < target.kairos - 3 && (game.process.activityCounts["read_newspapers"] || 0) < 2) {
          return "read_newspapers";
        }
        if (game.stats.pathos < target.pathos - 3 && (game.process.activityCounts["parish_coffee"] || 0) < 2) {
          return "parish_coffee";
        }
        return "polish_rhetoric";
      }
      if (t === 14) {
        return "practice_pulpit";
      }

      return "rest_incubation";
    },
    decideDisruption(game, d) {
      // Välj det alternativ som ger insiktskort eller stärker svag pelare om energin räcker
      const c0 = d.choices[0];
      const eCost = Math.abs((c0.effects && c0.effects.energy) || 0);
      if (game.energy - eCost >= 32 && (c0.insightCard || (c0.effects && (c0.effects.pathos > 0 || c0.effects.kairos > 0 || c0.effects.logos > 0)))) {
        if (d.id === "budget_meeting") return 0; // Säg nej till kopiatoravtalet!
        return 0;
      }
      if (d.id === "budget_meeting") return 0;
      return 1;
    },
    beforeSunday(game) {
      game.selectSermonForm(game.sunday.recommendedForm);
    },
    decideSundayAct(game) {
      // Dramaturgisk 4-aktskombo: Akt 1 Kairos -> Akt 2 Logos -> Akt 3 Pathos -> Akt 4 Retorik
      const idealOrder = ["kairos", "logos", "pathos", "rhetoric"];
      const targetFocus = idealOrder[game.sundayActIndex];
      return pickActOptionByFocus(game, targetFocus, true);
    }
  }
];

// ============================================================================
// KÖR SIMULERINGAR
// ============================================================================
function runSimulation(runsPerStrategy = 240) {
  console.log("=====================================================================================");
  console.log(`PREDIKOVERKSTADEN – Headless Simulering (${runsPerStrategy} veckor per strategi över 4 söndagar)`);
  console.log("=====================================================================================\n");

  const summaryTable = [];

  for (const strat of STRATEGIES) {
    const scores = [];
    let lastEval = null;

    for (let i = 0; i < runsPerStrategy; i++) {
      const sunday = GAME_DATA.sundays[i % GAME_DATA.sundays.length];
      const game = new SermonGame({ headless: true, data: GAME_DATA });
      game.startNewGame(sunday.id);

      let safety = 0;
      while (game.phase === "prep" && safety < 50) {
        safety++;
        if (game.activeDisruption) {
          const choiceIdx = strat.decideDisruption(game, game.activeDisruption);
          game.resolveDisruptionChoice(choiceIdx);
        } else {
          const actId = strat.decideTurn(game);
          game.performActivity(actId);
        }
      }

      if (strat.beforeSunday) {
        strat.beforeSunday(game);
      }

      while (game.phase === "sunday_delivery" && safety < 70) {
        safety++;
        const optIdx = strat.decideSundayAct(game);
        game.chooseSundayActOption(optIdx);
      }

      if (game.evaluation) {
        scores.push(game.evaluation.totalScore);
        lastEval = game.evaluation;
      }
    }

    scores.sort((a, b) => a - b);
    const min = scores[0];
    const max = scores[scores.length - 1];
    const median = scores[Math.floor(scores.length * 0.5)];
    const p90 = scores[Math.floor(scores.length * 0.9)];
    const mean = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
    const over90Pct = ((scores.filter((s) => s >= 90).length / scores.length) * 100).toFixed(1);

    summaryTable.push({
      Strategi: strat.name,
      Snitt: `${mean}p`,
      Median: `${median}p`,
      Min: `${min}p`,
      P90: `${p90}p`,
      Max: `${max}p`,
      "Andel >=90%": `${over90Pct}%`
    });

    if (strat.id === "dumb_exegesis_spam" || strat.id === "solid_pastor" || strat.id === "master_homiletician") {
      console.log(`--- Exempel på Kyrkkaffe & Utvärdering för: ${strat.name} (Poäng: ${lastEval.totalScore}p) ---`);
      console.log("  Uppdelning:", JSON.stringify(lastEval.breakdown));
      console.log("  Kyrkkaffets röster:");
      lastEval.coffeeQuotes.slice(0, 3).forEach((q) => {
        console.log(`    [${q.tone.toUpperCase()}] ${q.name} (${q.role}): ${q.comment}`);
      });
      console.log("");
    }
  }

  console.table(summaryTable);
}

runSimulation(240);
