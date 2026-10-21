// ============================================================================
// PREDIKOVERKSTADEN / THE HOMILETICS WORKSHOP
// Spelmotor, Homiletisk Synergimotor, Tvåspråkighetsstöd (SV/EN) & Gränssnitt
// Fungerar både i webbläsare (med 3D-scen) och Headless i Node.js (simulering)
// ============================================================================

const DAYS = [
  { index: 0, name: "Tisdag", theme: "Inlyssnandets dag", phase: "early" },
  { index: 1, name: "Onsdag", theme: "Fördjupningens dag", phase: "early_mid" },
  { index: 2, name: "Torsdag", theme: "Brobyggets dag", phase: "mid" },
  { index: 3, name: "Fredag", theme: "Gestaltningens dag", phase: "mid_late" },
  { index: 4, name: "Lördag", theme: "Mognadens dag", phase: "late" }
];

const SLOTS = [
  { index: 0, name: "Förmiddag", time: "08:30–12:00", icon: "🌅", isEvening: false },
  { index: 1, name: "Eftermiddag", time: "13:00–17:00", icon: "☀️", isEvening: false },
  { index: 2, name: "Kväll", time: "18:30–21:30", icon: "🌙", isEvening: true }
];

class SermonGame {
  constructor(options = {}) {
    this.headless = Boolean(options.headless) || typeof document === "undefined";
    this.lang = options.lang || (this.headless ? "sv" : this.detectInitialLanguage());

    const i18nMod =
      typeof window !== "undefined" && window.UI_STRINGS
        ? { GAME_DATA_EN: window.GAME_DATA_EN, UI_STRINGS: window.UI_STRINGS }
        : (() => {
            try {
              return require("./i18n.js");
            } catch (e) {
              return { GAME_DATA_EN: null, UI_STRINGS: null };
            }
          })();

    this.dataSv = options.data || (typeof window !== "undefined" ? window.GAME_DATA_SV || window.GAME_DATA : require("./data.js"));
    this.dataEn = i18nMod.GAME_DATA_EN || this.dataSv;
    this.uiStrings = i18nMod.UI_STRINGS || null;

    this.data = this.lang === "en" ? this.dataEn : this.dataSv;
    if (typeof window !== "undefined") {
      window.GAME_DATA = this.data;
    }
    this.rng = options.rng || Math.random;
    this.sunday = this.data.sundays[0];

    // Beständiga visningsinställningar över omgångar
    this.showHints = false; // Default: Inga ledtrådar (uppmuntrar eget utforskande!)
    this.avatarGender = "male"; // 'male' | 'female'
    this.mobileTab = "map"; // 'map' | 'desk' | 'log'
    this.tutorialStep = 0; // 0 = av, 1 = välj plats, 2 = välj aktivitet
    this._scrollAnimId = null;
    this._statAnimId = null;
    this.sharedData = null;
    this.scene3d = null;

    this.resetState();
  }

  detectInitialLanguage() {
    if (typeof window === "undefined") return "en";
    try {
      const path = (window.location.pathname || "").toLowerCase();
      const search = (window.location.search || "").toLowerCase();
      const hash = (window.location.hash || "").toLowerCase();

      // 1. Direktlänk via /se (/sv) eller /en (samt ?se, ?lang=se, #se, #en)
      if (
        /\/(se|sv)(\/|$)/.test(path) ||
        search.includes("lang=se") ||
        search.includes("lang=sv") ||
        search === "?se" ||
        search === "?sv" ||
        hash === "#se" ||
        hash === "#/se" ||
        hash === "#sv" ||
        hash === "#/sv"
      ) {
        localStorage.setItem("predikoverkstaden_lang", "sv");
        return "sv";
      }
      if (
        /\/en(\/|$)/.test(path) ||
        search.includes("lang=en") ||
        search === "?en" ||
        hash === "#en" ||
        hash === "#/en"
      ) {
        localStorage.setItem("predikoverkstaden_lang", "en");
        return "en";
      }

      // 2. Tidigare val i localStorage
      const saved = localStorage.getItem("predikoverkstaden_lang");
      if (saved === "sv" || saved === "en") return saved;
    } catch (e) {
      // Ignorera localStorage-fel
    }
    // 3. Default för förstagångsbesökare: Engelska
    return "en";
  }

  t() {
    if (this.uiStrings && this.uiStrings[this.lang]) {
      return this.uiStrings[this.lang];
    }
    return this.uiStrings ? this.uiStrings.sv : {};
  }

  isEn() {
    return this.lang === "en";
  }

  getDaysList() {
    const tr = this.t();
    return (tr && tr.days) || DAYS;
  }

  getSlotsList() {
    const tr = this.t();
    return (tr && tr.slots) || SLOTS;
  }

  toggleLanguage() {
    this.setLanguage(this.lang === "sv" ? "en" : "sv", true);
  }

  setLanguage(newLang, persistChoice = false) {
    this.lang = newLang === "en" ? "en" : "sv";
    this.data = this.lang === "en" ? this.dataEn : this.dataSv;
    if (typeof window !== "undefined") {
      window.GAME_DATA = this.data;
      if (persistChoice) {
        try {
          localStorage.setItem("predikoverkstaden_lang", this.lang);
        } catch (e) {}
      }
    }

    // 1. Översätt vald söndag med samma id
    if (this.sunday) {
      const foundSunday = this.data.sundays.find((s) => s.id === this.sunday.id);
      if (foundSunday) this.sunday = foundSunday;
    }

    // 2. Översätt redan upplåsta insiktskort i insightDeck
    const allCardsMap = {};
    this.data.sundays.forEach((s) => {
      Object.values(s.specificInsights || {}).forEach((arr) => {
        arr.forEach((c) => {
          allCardsMap[c.id] = c;
        });
      });
    });
    this.data.disruptions.forEach((d) => {
      (d.choices || []).forEach((ch) => {
        if (ch.insightCard) allCardsMap[ch.insightCard.id] = ch.insightCard;
      });
    });
    this.insightDeck = this.insightDeck.map((c) => allCardsMap[c.id] || c);

    // 3. Översätt redan upplåsta synergier
    const synDict = this.t().synergies || {};
    this.unlockedSynergies = this.unlockedSynergies.map((s) => {
      if (synDict[s.id]) {
        return {
          ...s,
          title: synDict[s.id].title,
          description: synDict[s.id].description
        };
      }
      return s;
    });

    // 4. Översätt aktivt störningsmoment om modalen är öppen
    if (this.activeDisruption) {
      const foundDis = this.data.disruptions.find((d) => d.id === this.activeDisruption.id);
      if (foundDis) this.activeDisruption = foundDis;
    }

    // 5. Om vi är på starttankens läge (turn 1 och ingen aktivitet gjord ännu), uppdatera starttanke & logg
    if (this.turnNumber === 1 && this.activityLog.length === 1 && this.activityLog[0].turn === 0) {
      const tr = this.t();
      this.pastorThought = tr.initialThought;
      this.activityLog[0] = {
        turn: 0,
        timeLabel: tr.initialLogTime,
        title: tr.initialLogTitle(this.sunday.title),
        detail: tr.initialLogDetail(this.sunday.scriptureRef),
        hintDetail: tr.initialLogHint,
        type: "info"
      };
    }

    // 6. Om vi är i slututvärderingen, räkna om utvärderingstexterna på det nya språket
    if (this.phase === "sunday_summary") {
      this.evaluation = this.calculateFinalEvaluation();
    }

    if (!this.headless) {
      if (this.scene3d) {
        this.scene3d.createDOMLabels(this.data);
      }
      this.populateSundaySelect();
      this.renderStaticTranslations();
      this.renderAll(false);
    }
  }

  populateSundaySelect() {
    if (this.headless) return;
    const sundaySelect = document.getElementById("scenario-select");
    if (sundaySelect) {
      const currentId = this.sunday ? this.sunday.id : this.data.sundays[0].id;
      sundaySelect.innerHTML = this.data.sundays
        .map((s) => `<option value="${s.id}" ${s.id === currentId ? "selected" : ""}>${s.title} — ${s.scriptureRef}</option>`)
        .join("");
    }
  }

  renderStaticTranslations() {
    if (this.headless) return;
    const tr = this.t();
    if (!tr || !tr.appTitle) return;

    document.documentElement.lang = this.lang;
    document.title = tr.pageTitle;

    const setTxt = (id, text) => {
      const el = document.getElementById(id);
      if (el && text !== undefined) el.textContent = text;
    };

    setTxt("app-title", tr.appTitle);
    setTxt("app-subtitle", tr.appSubtitle);
    setTxt("lbl-sunday-select", tr.lblSunday);
    setTxt("btn-new-week", tr.btnNewWeek);
    setTxt("lbl-hint-text", tr.hintLabel);

    const btnSv = document.getElementById("btn-lang-sv");
    const btnEn = document.getElementById("btn-lang-en");
    if (btnSv) btnSv.classList.toggle("active-flag", this.lang === "sv");
    if (btnEn) btnEn.classList.toggle("active-flag", this.lang === "en");

    const hintPill = document.getElementById("lbl-hint-pill");
    if (hintPill) hintPill.title = tr.hintTooltip;

    const btnAvatar = document.getElementById("btn-avatar");
    if (btnAvatar) {
      btnAvatar.textContent = this.avatarGender === "female" ? tr.avatarFemale : tr.avatarMale;
    }

    const btnSound = document.getElementById("btn-sound");
    if (btnSound && window.soundEngine) {
      btnSound.textContent = window.soundEngine.enabled ? tr.soundOn : tr.soundOff;
    }

    const setMeterLbl = (id, fullTxt, shortTxt) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = `<span class="m-full">${fullTxt}</span><span class="m-short">${shortTxt}</span>`;
    };
    const en = this.isEn();
    setMeterLbl("lbl-meter-energy", tr.meterEnergy, en ? "⚡ Energy" : "⚡ Energi");
    setMeterLbl("lbl-meter-spirit", tr.meterSpirit, "🕯️ Ethos");
    setMeterLbl("lbl-meter-relation", tr.meterRelation, en ? "🤝 Trust" : "🤝 Tillit");

    const eBox = document.getElementById("meter-energy-box");
    const sBox = document.getElementById("meter-spirit-box");
    const rBox = document.getElementById("meter-relation-box");
    if (eBox) eBox.title = tr.meterEnergyTip;
    if (sBox) sBox.title = tr.meterSpiritTip;
    if (rBox) rBox.title = tr.meterRelationTip;

    setTxt("map-heading", tr.mapTitle);
    setTxt("map-subheading", tr.mapSubtitle);
    setTxt("log-heading", tr.logTitle);
    setTxt("pews-heading", tr.pulpitPewsTitle);
    setTxt("act-step-badge", tr.pulpitBadgeNow);
    setTxt("score-points-label", tr.scorePointsLabel);
    setTxt("btn-play-again", tr.btnPlayAgain);
    setTxt("lbl-share-heading", tr.shareHeading);
    setTxt("btn-share-native", tr.btnShareNative);
    setTxt("btn-share-copy", tr.btnShareCopy);
    setTxt("sh-mail", tr.btnShareMail);
    setTxt("eval-routine-heading", tr.evalRoutineHeading);
    setTxt("eval-coffee-heading", tr.evalCoffeeHeading);
    setTxt("desk-heading", tr.deskTitle);
    setTxt("desk-context-label", tr.deskContextLabel);
    setTxt("desk-checklist-heading", tr.deskChecklistHeading);
    setTxt("desk-form-heading", tr.deskFormHeading);
    setTxt("desk-synergies-heading", tr.deskSynergiesHeading);
    setTxt("desk-insights-heading-text", tr.deskInsightsHeading);
    setTxt("disruption-prompt", tr.disruptionPrompt);

    // Mobilflikar & Delningsskärm
    setTxt("mob-tab-map", tr.mobTabMap);
    const mobDeskBtn = document.getElementById("mob-tab-desk");
    if (mobDeskBtn) {
      mobDeskBtn.innerHTML = `${tr.mobTabDesk} (<span id="mob-insight-count">${this.insightDeck.length}</span>)`;
    }
    setTxt("mob-tab-log", tr.mobTabLog);
    setTxt("btn-tutorial", tr.btnTutorial);
    setTxt("landing-title", tr.landingTitle);
    setTxt("landing-lead", tr.landingLead);
    setTxt("btn-landing-play", tr.btnLandingPlay);

    if (this.tutorialStep > 0) {
      this.renderTutorial();
    }
    if (this.sharedData) {
      this.renderSharedLandingScreen();
    }
  }

  resetState() {
    this.dayIndex = 0; // 0..4 (Tisdag..Lördag)
    this.slotIndex = 0; // 0..2 (FM, EM, Kväll)
    this.turnNumber = 1; // 1..15
    this.maxTurns = 15;
    this.phase = "prep"; // 'prep' | 'sunday_delivery' | 'sunday_summary'

    // Pastorns tillstånd
    this.energy = 80; // 0..100 (Mental skärpa & ork)
    this.spirit = 48; // 0..100 (Andlig frimodighet / Ethos)
    this.relation = 55; // 0..100 (Församlingsrelation & förtroende)
    this.doNotDisturb = false;

    // Homiletiska dimensioner (0..100)
    this.stats = {
      logos: 6,     // Exegetik & teologiskt djup
      kairos: 6,    // Samtidsanalys & relevans
      pathos: 6,    // Själavårdande närhet & hjärta
      rhetoric: 5   // Retorisk form, språk & framförande
    };

    // Process- och arbetsrutinspårning
    this.process = {
      exegesisDone: false,
      exegesisDay: null,
      incubationTurns: 0,
      structureDone: false,
      structureQuality: 0,
      draftProgress: 0, // 0..100%
      draftQualitySum: 0,
      draftWriteCount: 0,
      polished: false,
      practicedInPulpit: false,
      saturdayNightRested: false,
      saturdayNightPanic: false,
      eveningWorkCount: 0,
      activityCounts: {},
      dailyActivities: [[], [], [], [], []]
    };

    // Uppnådda arbetsrutin-synergier
    this.unlockedSynergies = [];

    // Insamlade Insiktskort under veckan
    this.insightDeck = [];
    this.selectedForm = "narrative";

    const tr = this.t();
    this.currentLocation = "study";
    this.pastorThought = tr.initialThought || "Måndagens ledighet är över. Söndagens bibeltext ligger uppslagen på skrivbordet...";
    this.activityLog = [
      {
        turn: 0,
        timeLabel: tr.initialLogTime || "Tisdag morgon",
        title: tr.initialLogTitle ? tr.initialLogTitle(this.sunday.title) : `Ny predikovecka: ${this.sunday.title}`,
        detail: tr.initialLogDetail ? tr.initialLogDetail(this.sunday.scriptureRef) : `Söndagens text: ${this.sunday.scriptureRef}.`,
        hintDetail: tr.initialLogHint || "",
        type: "info"
      }
    ];

    // Störningsmoment-historik
    this.usedDisruptions = new Set();
    this.activeDisruption = null;

    // Söndagens interaktiva predikoleverans
    this.sundayActIndex = 0;
    this.sundayActChoices = [];
    this.parishionerHearts = {};
    this.data.parishioners.forEach((p) => {
      this.parishionerHearts[p.id] = 35;
    });
    this.evaluation = null;
  }

  startNewGame(sundayId) {
    const found = this.data.sundays.find((s) => s.id === sundayId);
    if (found) this.sunday = found;
    this.resetState();
    if (!this.headless) {
      try {
        if (window.history && window.history.replaceState && (window.location.search.includes("score=") || window.location.search.includes("r="))) {
          window.history.replaceState({}, "", window.location.pathname);
        }
      } catch (e) {}
      const sel = document.getElementById("scenario-select");
      if (sel && this.sunday) sel.value = this.sunday.id;
      if (this.scene3d) {
        this.scene3d.moveToLocation("study", true);
        this.scene3d.setTimeOfDay("morning");
      }
      this.setMobileTab("map");
      this.renderAll(true);
      setTimeout(() => this.scrollToWeekTimeline(750), 160);
    }
  }

  setMobileTab(tab) {
    this.mobileTab = ["map", "desk", "log"].includes(tab) ? tab : "map";
    if (this.headless) return;
    document.body.dataset.mobTab = this.mobileTab;
    ["map", "desk", "log"].forEach((t) => {
      const btn = document.getElementById(`mob-tab-${t}`);
      if (btn) btn.classList.toggle("active", t === this.mobileTab);
    });
    if (this.mobileTab === "map" && this.scene3d) {
      setTimeout(() => this.scene3d.onResize(), 30);
    }
  }

  // Cirkulerar automatiskt till nästa söndag i menyn när man trycker på "Ny vecka" / "New Week"
  startNextSunday() {
    const currentIdx = this.data.sundays.findIndex((s) => this.sunday && s.id === this.sunday.id);
    const nextIdx = (currentIdx + 1) % this.data.sundays.length;
    const nextSunday = this.data.sundays[nextIdx];
    this.startNewGame(nextSunday.id);
  }

  setShowHints(val) {
    this.showHints = Boolean(val);
    if (!this.headless) {
      const chk = document.getElementById("chk-show-hints");
      if (chk) chk.checked = this.showHints;
      this.renderAll(false);
    }
  }

  toggleAvatarGender() {
    this.avatarGender = this.avatarGender === "male" ? "female" : "male";
    if (!this.headless) {
      const tr = this.t();
      const btn = document.getElementById("btn-avatar");
      if (btn) {
        btn.innerHTML = this.avatarGender === "female" ? tr.avatarFemale : tr.avatarMale;
      }
      if (this.scene3d) {
        this.scene3d.setAvatarGender(this.avatarGender);
      }
    }
  }

  getCurrentDay() {
    const list = this.getDaysList();
    return list[Math.min(this.dayIndex, list.length - 1)];
  }

  getCurrentSlot() {
    const list = this.getSlotsList();
    return list[Math.min(this.slotIndex, list.length - 1)];
  }

  // ==========================================================================
  // BYT PLATS / RUM PÅ KYRKBACKEN (Roterar 3D-scenen & animerar aktivitetstiles)
  // ==========================================================================
  goToLocation(locId) {
    if (!locId || !this.data.locations.some((l) => l.id === locId)) return;
    const changed = this.currentLocation !== locId;
    this.currentLocation = locId;

    if (!this.headless) {
      if (this.scene3d) {
        this.scene3d.moveToLocation(locId, false);
      }
      if (changed && window.soundEngine) {
        window.soundEngine.playStep();
      }
      this.renderMapAndActivities(changed);
      if (this.tutorialStep === 1) {
        this.setTutorialStep(2);
      }
    }
  }

  // ==========================================================================
  // UTFÖR AKTIVITET (Kärnmekaniken för predikoförberedelsen)
  // ==========================================================================
  performActivity(activityId) {
    if (this.phase !== "prep" || this.activeDisruption) return false;

    const activity = this.data.activities.find((a) => a.id === activityId);
    if (!activity) return false;

    const tr = this.t();
    const en = this.isEn();
    const day = this.getCurrentDay();
    const slot = this.getCurrentSlot();

    // Kontrollera om energin är för låg för krävande aktiviteter
    if (activity.energyCost > 0 && this.energy < 12 && activity.id !== "rest_incubation" && activity.id !== "prayer_silence") {
      if (!this.headless) {
        this.showToast(tr.exhaustedToast, "warning");
      } else {
        this.energy = this.clamp(this.energy + 15, 0, 100);
        this.spirit = this.clamp(this.spirit - 8, 0, 100);
        this.advanceTurn();
      }
      return false;
    }

    const prevSnap = !this.headless ? this.captureStatsSnapshot() : null;
    if (!this.headless && this.tutorialStep > 0) {
      this.finishTutorial();
    }

    const roomChanged = this.currentLocation !== activity.locationId;
    this.currentLocation = activity.locationId;

    if (!this.headless) {
      if (this.scene3d) {
        this.scene3d.moveToLocation(activity.locationId, false);
      }
      if (window.soundEngine) window.soundEngine.playStep();
    }

    // Spåra antal gånger denna aktivitet har utförts (Avtagande marginalnytta / Tunnelseende)
    const prevCount = this.process.activityCounts[activity.id] || 0;
    this.process.activityCounts[activity.id] = prevCount + 1;

    let repetitionFactor = 1.0;
    if (activity.id === "write_draft" || activity.id === "rest_incubation") {
      if (prevCount === 1) repetitionFactor = 0.95;
      else if (prevCount === 2) repetitionFactor = 0.65;
      else if (prevCount === 3) repetitionFactor = 0.30;
      else if (prevCount >= 4) repetitionFactor = 0.10;
    } else {
      if (prevCount === 1) repetitionFactor = 0.78;
      else if (prevCount === 2) repetitionFactor = 0.42;
      else if (prevCount === 3) repetitionFactor = 0.15;
      else if (prevCount >= 4) repetitionFactor = 0.0;
    }

    // Beräkna energikostnad & kvällsslitage
    let energyDelta = -activity.energyCost;
    if (slot.isEvening && activity.energyCost > 0) {
      energyDelta -= 6;
      this.process.eveningWorkCount++;
      if (this.process.eveningWorkCount >= 3) {
        this.spirit = this.clamp(this.spirit - 4, 0, 100);
      }
    }

    // Effektivitetsmultiplikator beroende på skärpa/energi
    let focusMultiplier = 1.0;
    if (this.energy >= 75) focusMultiplier = 1.12;
    else if (this.energy < 35) focusMultiplier = 0.65;
    else if (this.energy < 50) focusMultiplier = 0.85;

    const totalMult = focusMultiplier * repetitionFactor;

    let gains = {
      logos: Math.round((activity.baseGains.logos || 0) * totalMult),
      kairos: Math.round((activity.baseGains.kairos || 0) * totalMult),
      pathos: Math.round((activity.baseGains.pathos || 0) * totalMult),
      rhetoric: Math.round((activity.baseGains.rhetoric || 0) * totalMult),
      spirit: Math.round((activity.baseGains.spirit || 0) * repetitionFactor),
      relation: Math.round((activity.baseGains.relation || 0) * repetitionFactor)
    };

    let notes = [];
    let synergyTriggered = false;

    if (prevCount >= 2 && activity.id !== "write_draft" && activity.id !== "rest_incubation") {
      notes.push(tr.diminishNote(prevCount + 1));
      if (prevCount >= 3) {
        this.spirit = this.clamp(this.spirit - 4, 0, 100);
      }
    }

    // ------------------------------------------------------------------------
    // HOMILETISKA ARBETSRUTIN-REGLER & FORM-SPECIFIKA BONUSAR
    // ------------------------------------------------------------------------

    // 1. NÄRLÄSA BIBELTEXTEN (Exeges)
    if (activity.id === "exegesis") {
      if (!this.process.exegesisDone) {
        this.process.exegesisDone = true;
        this.process.exegesisDay = this.dayIndex;
        if (this.dayIndex <= 1) {
          notes.push(
            en
              ? "🌱 **Early Textual Grounding!** 'Echo of the Text' is now active during the week's encounters and reading."
              : "🌱 **Tidig Textförankring!** »Textens eko« är nu aktivt under veckans möten och läsning."
          );
          this.unlockSynergy("early_seed", 5);
          synergyTriggered = true;
        } else {
          notes.push(en ? "📖 You have now opened Sunday's biblical text." : "📖 Du har nu öppnat söndagens text.");
        }
      } else if (prevCount === 1) {
        gains.logos += 2;
        notes.push(
          en
            ? "🔍 On re-reading, you uncover further nuances in the pericope."
            : "🔍 Vid omläsningen upptäcker du ytterligare detaljer i perikopen."
        );
      }
      if (prevCount <= 1) {
        this.tryDrawSpecificInsight("exegesis");
      }
    }

    // 2. TEOLOGISKA KOMMENTARER
    if (activity.id === "theology_study") {
      if (!this.process.exegesisDone) {
        gains.logos = Math.round(gains.logos * 0.55);
        notes.push(
          en
            ? "⚠️ You read commentaries before close-reading the biblical text yourself—second-hand theology."
            : "⚠️ Du läste kommentarer innan du själv närläst bibeltexten – det blev andrahandstänkt."
        );
      } else if (prevCount === 0) {
        gains.logos += 3;
        if (this.selectedForm === "contrast") gains.logos += 2;
        notes.push(
          en
            ? "📚 Because you already wrestled with the biblical text, the commentaries bring deep clarity!"
            : "📚 Eftersom du redan brottats med bibeltexten ger kommentarerna djup klarhet!"
        );
        this.tryDrawSpecificInsight("exegesis");
      }
    }

    // 3. TEXTENS EKO (Inkubationsbonus på möten och tidning)
    if (this.process.exegesisDone && prevCount <= 1 && this.process.incubationTurns < 4) {
      if (["parish_coffee", "pastoral_visit", "read_newspapers"].includes(activity.id)) {
        this.process.incubationTurns++;
        gains.logos += 2;
        gains.rhetoric += 2;
        notes.push(
          en
            ? "🔔 **Echo of the Text:** Sunday's scripture sheds fresh light on what you see and hear today (+2 Exegesis, +2 Rhetoric)!"
            : "🔔 **Textens eko:** Söndagens bibeltext kastar nytt ljus över det du ser och hör idag (+2 Logos, +2 Retorik)!"
        );
      }
    }

    // 4. TIDNINGSLÄSNING & SAMTIDSANALYS
    if (activity.id === "read_newspapers") {
      if (prevCount <= 1) this.tryDrawSpecificInsight("contemporary");
      if (this.selectedForm === "prophetic" || this.selectedForm === "contrast") {
        gains.kairos += 2;
      }
      const todayActs = this.process.dailyActivities[this.dayIndex];
      if ((todayActs.includes("exegesis") || todayActs.includes("theology_study")) && !this.hasSynergy("barth_double")) {
        gains.kairos += 5;
        gains.logos += 3;
        this.unlockSynergy("barth_double", 6);
        notes.push(
          en
            ? "⚡ **Synergy: Karl Barth's Double Vision!** The biblical text and today's news illuminate each other directly."
            : "⚡ **Synergi: Karl Barths Dubbelblick!** Bibeltexten och dagens nyheter belyser varandra direkt."
        );
        synergyTriggered = true;
      }
    }

    // 5. FÖRSAMLINGSHEMMET & SJÄLAVÅRD
    if (activity.id === "parish_coffee" || activity.id === "pastoral_visit") {
      if (prevCount <= 1) this.tryDrawSpecificInsight("pastoral");
      if (this.selectedForm === "pastoral" || this.selectedForm === "narrative") {
        gains.pathos += 2;
      }
      if (!this.process.exegesisDone && activity.id === "parish_coffee") {
        notes.push(
          en
            ? "☕ Pleasant coffee chat, but since you haven't read Sunday's text yet, the conversation sparked no clear homiletical connections."
            : "☕ Trevligt kyrkkaffe, men eftersom du inte läst söndagens text ännu gav samtalet inga tydliga predikouppslag."
        );
      }
    }

    // 6. SKISSA STRUKTUR & HOMILETISK IDÉ (Brobygget)
    if (activity.id === "structure_sketch") {
      const hasLogos = this.stats.logos >= 18;
      const hasLife = this.stats.kairos >= 14 && this.stats.pathos >= 14;
      if (hasLogos && hasLife) {
        this.process.structureDone = true;
        this.process.structureQuality = Math.min(100, Math.round((this.stats.logos + this.stats.kairos + this.stats.pathos) * 1.1));
        gains.rhetoric += 6;
        this.unlockSynergy("stott_bridge", 8);
        notes.push(
          en
            ? "🌉 **Strong Homiletic Outline!** Biblical analysis, contemporary context, and pastoral empathy all came together as you drew the central thread."
            : "🌉 **Stark homiletisk struktur!** Både textanalys, samtid och livsnärhet fanns på plats när du drog upp den röda tråden."
        );
        synergyTriggered = true;
      } else if (!this.process.exegesisDone) {
        this.process.structureDone = true;
        this.process.structureQuality = 30;
        gains.rhetoric = 2;
        notes.push(
          en
            ? "⚠️ You tried to build an outline without having read the biblical text properly. The structure feels hollow."
            : "⚠️ Du försökte bygga en disposition utan att ha läst bibeltexten ordentligt. Strukturen blev ihålig."
        );
      } else {
        this.process.structureDone = true;
        this.process.structureQuality = Math.max(this.process.structureQuality, 58);
        notes.push(en ? "🧭 You now have a basic sermon outline." : "🧭 Du har nu en grunddisposition.");
      }
    }

    // 7. SKRIVA PREDIKOMANUS
    if (activity.id === "write_draft") {
      this.process.draftWriteCount++;
      if (!this.process.exegesisDone) {
        this.process.draftProgress = Math.min(100, this.process.draftProgress + 20);
        this.process.draftQualitySum += 25;
        gains.rhetoric = 2;
        this.spirit = this.clamp(this.spirit - 5, 0, 100);
        notes.push(
          en
            ? "⚠️ **Spinning Your Wheels at the Keyboard:** You are trying to write without exegetical grounding."
            : "⚠️ **Tomgång vid tangentbordet:** Du försöker skriva utan exegetisk grund."
        );
      } else if (!this.process.structureDone) {
        this.process.draftProgress = Math.min(100, this.process.draftProgress + 32);
        this.process.draftQualitySum += 55;
        notes.push(
          en
            ? "✍️ You are drafting pages, but lack a sketched structural outline."
            : "✍️ Du skriver på utkastet, men saknar en skissad struktur."
        );
      } else {
        const boost = 42;
        this.process.draftProgress = Math.min(100, this.process.draftProgress + boost);
        this.process.draftQualitySum += 92;
        gains.rhetoric += 4;
        notes.push(
          en
            ? "✍️ **Flow at the Desk!** With a clear outline and rich insights, the sermon manuscript takes shape with power."
            : "✍️ **Flöde vid skrivbordet!** Med tydlig struktur och mättade insikter växer predikomanuset fram med kraft."
        );
      }

      if (this.dayIndex === 4 && slot.isEvening) {
        this.process.saturdayNightPanic = true;
        this.spirit = this.clamp(this.spirit - 10, 0, 100);
        notes.push(
          en
            ? "🌙 **Saturday Night Panic:** You are up late Saturday night frantically typing the manuscript!"
            : "🌙 **Lördagsnattens panik:** Du sitter sent på lördagskvällen med manuset!"
        );
      }
    }

    // 8. FILA PÅ RETORIK & BILDSPRÅK
    if (activity.id === "polish_rhetoric") {
      if (this.process.draftProgress < 40) {
        gains.rhetoric = 3;
        notes.push(
          en
            ? "⚠️ You are trying to polish phrasing before having a substantial manuscript draft to work with!"
            : "⚠️ Du försöker finslipa formuleringar innan det finns ett rejält manusutkast att arbeta med!"
        );
      } else {
        this.process.polished = true;
        this.process.draftProgress = Math.min(100, this.process.draftProgress + 22);
        gains.rhetoric += 5;
        if (this.selectedForm === "prophetic" || this.selectedForm === "narrative") gains.rhetoric += 2;
        notes.push(
          en
            ? "✒️ You cut theological jargon, chisel vivid metaphors, and create cadence for the spoken word."
            : "✒️ Du rensar bort teologisk jargong, mejslar fram träffsäkra bilder och skapar rytm i språket."
        );
      }
    }

    // 9. ÖVA I PREDIKSTOLEN
    if (activity.id === "practice_pulpit") {
      if (this.process.draftProgress < 65) {
        gains.rhetoric = 4;
        notes.push(
          en
            ? "⚠️ You stepped into the pulpit with a half-finished draft. Good for your voice, but the flow stumbled."
            : "⚠️ Du ställde dig i predikstolen med ett halvfärdigt utkast. Bra för rösten, men tankarna hackade."
        );
      } else {
        this.process.practicedInPulpit = true;
        gains.rhetoric += 5;
        gains.spirit += 4;
        this.unlockSynergy("embodied_word", 7);
        notes.push(
          en
            ? "🎙️ **The Word Is Embodied!** You test the acoustics, find the natural pauses, and can lift your eyes from the page."
            : "🎙️ **Orden sitter i kroppen!** Du provar akustiken, hittar konstpauserna och kan lyfta blicken från pappret."
        );
        synergyTriggered = true;
      }
    }

    // 10. BÖN & TYSTNAD I KYRKORUMMET
    if (activity.id === "prayer_silence") {
      if (this.selectedForm === "pastoral") {
        gains.spirit += 3;
        gains.pathos += 2;
      }
      const todayActs = this.process.dailyActivities[this.dayIndex];
      if ((todayActs.includes("exegesis") || todayActs.includes("theology_study")) && !this.hasSynergy("lectio_divina")) {
        gains.logos += 4;
        gains.spirit += 5;
        this.unlockSynergy("lectio_divina", 6);
        notes.push(
          en
            ? "🕯️ **Lectio Divina:** What you just studied with the intellect now sinks deep into the heart."
            : "🕯️ **Lectio Divina:** Det du nyss studerade med intellektet sjunker nu ner i hjärtat."
        );
        synergyTriggered = true;
      }
    }

    // 11. VILA & INKUBATION I PRÄSTGÅRDEN
    if (activity.id === "rest_incubation") {
      if (this.process.exegesisDone && !this.hasSynergy("incubation_walk") && this.dayIndex < 4) {
        gains.logos += 3;
        gains.rhetoric += 3;
        if (this.selectedForm === "narrative") gains.pathos += 3;
        this.unlockSynergy("incubation_walk", 5);
        notes.push(
          en
            ? "🌲 **Homiletic Incubation:** During your walk in the woods, a knot in the sermon untangled itself effortlessly!"
            : "🌲 **Homiletisk inkubation:** Under skogspromenaden löstes en knut i predikan helt utan ansträngning!"
        );
      }
      if (this.dayIndex === 4 && slot.isEvening && this.process.draftProgress >= 80 && this.process.structureDone) {
        this.process.saturdayNightRested = true;
        gains.spirit += 10;
        this.unlockSynergy("saturday_peace", 8);
        notes.push(
          en
            ? "🌟 **Saturday Peace!** The manuscript is ready on your desk and you go to sleep rested and confident for Sunday morning."
            : "🌟 **Lördagsfrid!** Manuset ligger redo på skrivbordet och du går till sängs utvilad och trygg inför söndagen."
        );
        synergyTriggered = true;
      }
    }

    this.process.dailyActivities[this.dayIndex].push(activity.id);

    this.energy = this.clamp(this.energy + energyDelta, 0, 100);
    this.spirit = this.clamp(this.spirit + gains.spirit, 0, 100);
    this.relation = this.clamp(this.relation + gains.relation, 0, 100);

    if (this.doNotDisturb) {
      this.relation = this.clamp(this.relation - 4, 0, 100);
      notes.push(
        en ? "🔕 *Phone on silent (-4 Parish Trust).*" : "🔕 *Telefonen på ljudlöst (-4 Församlingsrelation).*"
      );
    }

    this.stats.logos = this.clamp(this.stats.logos + gains.logos, 0, 100);
    this.stats.kairos = this.clamp(this.stats.kairos + gains.kairos, 0, 100);
    this.stats.pathos = this.clamp(this.stats.pathos + gains.pathos, 0, 100);
    this.stats.rhetoric = this.clamp(this.stats.rhetoric + gains.rhetoric, 0, 100);

    const gainParts = [];
    if (gains.logos > 0) gainParts.push(`+${gains.logos} ${tr.gainLogos}`);
    if (gains.kairos > 0) gainParts.push(`+${gains.kairos} ${tr.gainKairos}`);
    if (gains.pathos > 0) gainParts.push(`+${gains.pathos} ${tr.gainPathos}`);
    if (gains.rhetoric > 0) gainParts.push(`+${gains.rhetoric} ${tr.gainRhetoric}`);
    if (gains.spirit > 0) gainParts.push(`+${gains.spirit} ${tr.gainSpirit}`);

    this.pastorThought = notes.length > 0 ? notes[0].replace(/\*\*/g, "") : `${activity.title}: ${gainParts.join(", ")}`;

    this.activityLog.unshift({
      turn: this.turnNumber,
      timeLabel: `${day.name} ${slot.name.toLowerCase()}`,
      title: `${activity.icon} ${activity.title}`,
      detail: `${gainParts.join(" · ")}${notes.length ? " — " + notes.join(" ") : ""}`,
      type: synergyTriggered ? "synergy" : "normal"
    });

    if (!this.headless && synergyTriggered && window.soundEngine) {
      window.soundEngine.playSynergy();
    }

    this.checkDisruptionAfterSlot();

    if (this.headless) {
      if (!this.activeDisruption) {
        this.advanceTurn(roomChanged);
      }
      return true;
    }

    const pendingDisruption = this.activeDisruption;
    this.activeDisruption = null;

    if (!pendingDisruption) {
      this.advanceTurn(roomChanged);
    } else {
      this.renderAll(roomChanged);
    }

    this.runPostActionChoreography(prevSnap, () => {
      if (pendingDisruption) {
        this.activeDisruption = pendingDisruption;
        this.renderDisruptionModal();
      }
    });
    return true;
  }

  hasSynergy(id) {
    return this.unlockedSynergies.some((s) => s.id === id);
  }

  // ==========================================================================
  // INSIKTSKORT & HOMILETISKA SYNERGIER
  // ==========================================================================
  tryDrawSpecificInsight(poolKey) {
    const pool = this.sunday.specificInsights[poolKey] || [];
    const available = pool.filter((card) => !this.insightDeck.some((c) => c.id === card.id));
    if (available.length > 0) {
      const drawn = available[0];
      this.addInsightCard(drawn);
    }
  }

  addInsightCard(card) {
    if (this.insightDeck.some((c) => c.id === card.id)) return;
    this.insightDeck.push(card);
    if (!this.headless && window.soundEngine) {
      window.soundEngine.playInsight();
      this.showToast(this.t().insightToast(card.title), "insight");
    }
  }

  unlockSynergy(id, bonusPoints) {
    if (this.hasSynergy(id)) return;
    const tr = this.t();
    const synMeta = (tr.synergies && tr.synergies[id]) || { title: id, description: "" };
    this.unlockedSynergies.push({
      id,
      title: synMeta.title,
      description: synMeta.description,
      bonusPoints
    });
    if (!this.headless) {
      this.showToast(tr.synergyToast(synMeta.title, bonusPoints), "synergy");
    }
  }

  // ==========================================================================
  // STÖRNINGSMOMENT (Kriser, möten & pastorala avbrott)
  // ==========================================================================
  checkDisruptionAfterSlot() {
    if (this.turnNumber >= this.maxTurns) return;

    const chance = this.doNotDisturb ? 0.12 : 0.36;
    if (this.rng() > chance) return;

    const urgentIds = new Set(["grief_call", "writers_block"]);
    const available = this.data.disruptions.filter((d) => {
      if (this.usedDisruptions.has(d.id)) return false;
      if (this.doNotDisturb && !urgentIds.has(d.id)) return false;
      return true;
    });

    if (available.length === 0) return;
    const chosen = available[Math.floor(this.rng() * available.length)];
    this.usedDisruptions.add(chosen.id);
    this.activeDisruption = chosen;
    if (!this.headless && window.soundEngine) {
      window.soundEngine.playDisruption();
    }
  }

  resolveDisruptionChoice(choiceIndex) {
    if (!this.activeDisruption) return;
    const d = this.activeDisruption;
    const choice = d.choices[choiceIndex];
    if (!choice) return;

    const prevSnap = !this.headless ? this.captureStatsSnapshot() : null;
    const eff = choice.effects || {};
    this.energy = this.clamp(this.energy + (eff.energy || 0), 0, 100);
    this.spirit = this.clamp(this.spirit + (eff.spirit || 0), 0, 100);
    this.relation = this.clamp(this.relation + (eff.relation || 0), 0, 100);
    this.stats.logos = this.clamp(this.stats.logos + (eff.logos || 0), 0, 100);
    this.stats.kairos = this.clamp(this.stats.kairos + (eff.kairos || 0), 0, 100);
    this.stats.pathos = this.clamp(this.stats.pathos + (eff.pathos || 0), 0, 100);
    this.stats.rhetoric = this.clamp(this.stats.rhetoric + (eff.rhetoric || 0), 0, 100);

    if (choice.insightCard) {
      this.addInsightCard(choice.insightCard);
    }

    this.pastorThought = choice.outcomeText;
    this.activityLog.unshift({
      turn: this.turnNumber,
      timeLabel: this.t().disruptionLogTime,
      title: `⚡ ${d.title}`,
      detail: choice.outcomeText,
      type: "disruption"
    });

    this.activeDisruption = null;
    this.advanceTurn(false);
    if (!this.headless) {
      this.runPostActionChoreography(prevSnap);
    }
  }

  advanceTurn(animateTiles = false) {
    if (this.turnNumber >= this.maxTurns) {
      this.startSundayService();
      return;
    }

    this.turnNumber++;
    this.slotIndex++;
    if (this.slotIndex >= SLOTS.length) {
      this.slotIndex = 0;
      this.dayIndex++;
      this.energy = this.clamp(this.energy + 9, 0, 100);
    }

    if (!this.headless) {
      if (this.scene3d) {
        const s = this.getCurrentSlot();
        this.scene3d.setTimeOfDay(s.index === 0 ? "morning" : s.index === 1 ? "afternoon" : "evening");
      }
      this.renderAll(animateTiles);
    }
  }

  // ==========================================================================
  // SÖNDAGENS HÖGMÄSSA – Dramaturgisk Predikoleverans i 4 Akter
  // ==========================================================================
  startSundayService() {
    this.phase = "sunday_delivery";
    this.sundayActIndex = 0;
    this.sundayActChoices = [];
    if (!this.headless) {
      if (this.scene3d) {
        this.scene3d.moveToLocation("sanctuary", false);
        this.scene3d.setTimeOfDay("sunday");
      }
      if (window.soundEngine) window.soundEngine.playChurchBell();
    }

    this.data.parishioners.forEach((p) => {
      this.parishionerHearts[p.id] = Math.round(18 + this.relation * 0.28);
    });

    if (!this.headless) {
      this.renderAll(false);
    }
  }

  evaluateActFitAndMonotony(actIndex, statFocus) {
    const en = this.isEn();
    const baseFitTable = [
      { kairos: 1.18, pathos: 1.10, rhetoric: 0.96, logos: 0.55 }, // Akt 1: Exordium
      { logos: 1.24, kairos: 0.74, pathos: 0.70, rhetoric: 0.80 }, // Akt 2: Explicatio
      { pathos: 1.24, logos: 0.65, kairos: 0.65, rhetoric: 0.82 }, // Akt 3: Evangelium
      { rhetoric: 1.20, kairos: 1.16, pathos: 1.00, logos: 0.55 }  // Akt 4: Applicatio
    ];

    let fitMultiplier = (baseFitTable[actIndex] && baseFitTable[actIndex][statFocus]) || 1.0;

    if (this.selectedForm === "pastoral") {
      if (actIndex === 0 && statFocus === "pathos") fitMultiplier = 1.22;
      if (actIndex === 3 && statFocus === "pathos") fitMultiplier = 1.16;
    } else if (this.selectedForm === "contrast") {
      if (actIndex === 0 && statFocus === "kairos") fitMultiplier = 1.24;
      if (actIndex === 3 && statFocus === "kairos") fitMultiplier = 1.22;
    } else if (this.selectedForm === "prophetic") {
      if (actIndex === 0 && statFocus === "kairos") fitMultiplier = 1.24;
      if (actIndex === 3 && statFocus === "rhetoric") fitMultiplier = 1.26;
    } else if (this.selectedForm === "narrative") {
      if (actIndex === 2 && statFocus === "pathos") fitMultiplier = 1.26;
    }

    const prevFocuses = this.sundayActChoices.map((c) => c.statFocus);
    const sameCount = prevFocuses.filter((f) => f === statFocus).length;
    const immediateRepeat = prevFocuses.length > 0 && prevFocuses[prevFocuses.length - 1] === statFocus;

    let monotonyMultiplier = 1.0;
    let monotonyWarning = "";

    if (sameCount >= 3) {
      monotonyMultiplier = 0.20;
      monotonyWarning = en
        ? " 🚨 Total monotony! You have hammered the exact same note through the entire sermon—the pews are zoning out."
        : " 🚨 Total monotoni! Du har malt på i exakt samma spår genom hela predikan – bänkraderna zonerar ut.";
    } else if (sameCount === 2) {
      monotonyMultiplier = 0.42;
      monotonyWarning = en
        ? " ⚠️ Monotonous! This is the third time you've used the same homiletical approach."
        : " ⚠️ Entonigt! Det här är tredje gången du använder samma predikogrepp.";
    } else if (immediateRepeat) {
      monotonyMultiplier = 0.62;
      monotonyWarning = en
        ? " ⚠️ Repetition from the previous act—the dramatic momentum slows down."
        : " ⚠️ Upprepning från föregående akt – dramaturgin tappar fart.";
    }

    let draftReadiness = 1.0;
    if (this.process.draftProgress < 30) {
      draftReadiness = 0.50;
    } else if (this.process.draftProgress < 65) {
      draftReadiness = 0.78;
    } else if (this.process.draftProgress < 85) {
      draftReadiness = 0.92;
    }

    return {
      multiplier: fitMultiplier * monotonyMultiplier * draftReadiness,
      fitMultiplier,
      monotonyMultiplier,
      monotonyWarning
    };
  }

  getSundayActOptions(actIndex) {
    const en = this.isEn();
    const usedCardIds = new Set(this.sundayActChoices.filter((c) => c.cardId).map((c) => c.cardId));
    const availableCards = this.insightDeck.filter((c) => !usedCardIds.has(c.id));

    const roleHints = en
      ? [
          "Act 1 (Exordium) hooks listeners best through contemporary connection (Kairos) or a lived human story (Pathos).",
          "Act 2 (Explicatio) is the ideal place to open the biblical text and exegetical depth (Logos).",
          "Act 3 (Evangelium) is the turning point where grace, prayer, and pastoral warmth (Pathos/Ethos) must carry the room.",
          "Act 4 (Applicatio) sends the congregation into Monday morning with rhetorical force (Rhetoric) and concrete life (Kairos)."
        ]
      : [
          "Akt 1 (Exordium) väcker bäst intresse genom samtidsanknytning (Kairos) eller livsnära berättelse (Pathos).",
          "Akt 2 (Explicatio) är rätt plats för att öppna grundtexten och det exegetiska djupet (Logos).",
          "Akt 3 (Evangelium) är vändpunkten där nåden, bönen och den själavårdande värmen (Pathos/Ethos) måste bära.",
          "Akt 4 (Applicatio) sänder ut församlingen i måndagens vardag med retorisk kraft (Retorik) och konkretion (Kairos)."
        ];

    const options = [];

    // 1. Oanvända Insiktskort
    availableCards.forEach((card) => {
      const evalFit = this.evaluateActFitAndMonotony(actIndex, card.category);
      let hintSuffix = "";
      if (this.showHints) {
        hintSuffix =
          evalFit.fitMultiplier >= 1.1
            ? en
              ? " · 🌟 Fits this act!"
              : " · 🌟 Passar denna akt perfekt!"
            : evalFit.fitMultiplier < 0.78
            ? en
              ? " · ⚠️ Clashes with act role"
              : " · ⚠️ Skaver mot aktens roll"
            : "";
      }

      options.push({
        id: "card_focus",
        cardId: card.id,
        statFocus: card.category,
        title: en ? `💡 Weave in insight: “${card.title}”` : `💡 Använd insikt: »${card.title}«`,
        subtitle: card.quote,
        badge: en
          ? `Insight Card [${card.category.toUpperCase()}]${hintSuffix}`
          : `Insiktskort [${card.category.toUpperCase()}]${hintSuffix}`,
        deliver: () => {
          const baseStatVal = this.stats[card.category] || 12;
          const raw = card.power * 0.46 + baseStatVal * 0.16;
          const scoreBoost = Math.max(2, Math.round(raw * evalFit.multiplier));
          return {
            scoreBoost,
            narrative:
              (en ? `You weave in the insight “${card.title}”. ` : `Du väver in insikten om »${card.title}«. `) +
              (evalFit.fitMultiplier >= 1.08
                ? en
                  ? "It lands at the exact right moment in the sermon's dramatic arc, creating palpable focus across the sanctuary!"
                  : "Den faller in på exakt rätt ställe i predikans dramaturgi och skapar ett påtagligt fokus i kyrkorummet!"
                : en
                ? "It is a fine thought, though placing it in this part of the sermon keeps it from reaching its full power."
                : "Det är en fin tanke, men placeringen i den här delen av predikan gör att den inte når sin fulla kraft.") +
              evalFit.monotonyWarning,
            statFocus: card.category,
            cardId: card.id
          };
        }
      });
    });

    // 2. Logos
    {
      const evalFit = this.evaluateActFitAndMonotony(actIndex, "logos");
      const hintBadge = this.showHints
        ? actIndex === 1
          ? en
            ? " · 🌟 Fits Act 2!"
            : " · 🌟 Passar Akt 2!"
          : actIndex === 0
          ? en
            ? " · ⚠️ Heavy as an opener"
            : " · ⚠️ Tungt i inledning"
          : ""
        : "";
      options.push({
        id: "logos_delivery",
        statFocus: "logos",
        title: en
          ? "📜 Open the Original Text & Theological Depth (Logos)"
          : "📜 Öppna grundtextens och teologins djup (Logos)",
        subtitle: this.showHints
          ? roleHints[actIndex]
          : en
          ? "Let the biblical context, original language, and theological lines carry this section."
          : "Låt bibelordets sammanhang, grundtext och teologiska linjer bära denna del.",
        badge: en ? `Exegesis (${this.stats.logos})${hintBadge}` : `Exeges (${this.stats.logos})${hintBadge}`,
        deliver: () => {
          const raw = this.stats.logos * 0.24 + (this.process.exegesisDone ? 2.5 : -5);
          const scoreBoost = Math.max(1, Math.round(raw * evalFit.multiplier));
          let narrative = "";
          if (actIndex === 0) {
            narrative = en
              ? "You open the sermon straight into a technical textual exposition. Bengt listens, but many in the pews struggle to see why it matters to them."
              : "Du startar predikan rakt i en teknisk textutläggning. Bengt lyssnar, men många i bänkarna har svårt att förstå varför detta angår dem.";
          } else if (actIndex === 1 && this.stats.logos >= 26) {
            narrative = en
              ? "Here in the second act, you unfold the biblical context with clarity and authority. The ancient text comes alive!"
              : "Här i andra akten öppnar du bibeltextens sammanhang med klarhet och auktoritet. Texten får liv!";
          } else if (this.stats.logos < 20) {
            narrative = en
              ? "You try to explain the background of the text, but because your exegesis during the week was thin, it sounds shallow."
              : "Du försöker förklara textens bakgrund, men eftersom exegesen blev knapphändig under veckan låter det tunt.";
          } else {
            narrative = en ? "You expound the theological lines of the text." : "Du lägger ut textens teologiska linjer.";
          }
          return {
            scoreBoost,
            narrative: narrative + evalFit.monotonyWarning,
            statFocus: "logos"
          };
        }
      });
    }

    // 3. Pathos & Spirit
    {
      const evalFit = this.evaluateActFitAndMonotony(actIndex, "pathos");
      const hintBadge = this.showHints && actIndex === 2 ? (en ? " · 🌟 Fits Act 3!" : " · 🌟 Passar Akt 3!") : "";
      options.push({
        id: "pathos_delivery",
        statFocus: "pathos",
        title: en
          ? "🕯️ Speak from the Heart of Grace & Human Vulnerability (Pathos & Ethos)"
          : "🕯️ Tala nära ur hjärtat om nåden och människans sårbarhet (Pathos & Ethos)",
        subtitle: en
          ? "Meet the eyes of your parishioners and let the Gospel become personal and consoling."
          : "Möt församlingsbornas blickar och låt evangeliet bli personligt och tröstande.",
        badge: en
          ? `Pastoral (${this.stats.pathos}) & Ethos (${this.spirit})${hintBadge}`
          : `Själavård (${this.stats.pathos}) & Frimodighet (${this.spirit})${hintBadge}`,
        deliver: () => {
          const raw = this.stats.pathos * 0.18 + this.spirit * 0.11;
          const scoreBoost = Math.max(1, Math.round(raw * evalFit.multiplier));
          let narrative = "";
          if (this.stats.pathos >= 24 && this.spirit >= 55) {
            narrative = en
              ? "Your voice carries genuine presence, prayer, and pastoral warmth. The entire sanctuary falls utterly still."
              : "Din röst bärs av äkta närvaro, bön och själavårdande värme. Det blir alldeles tyst i bänkarna.";
          } else if (this.stats.pathos < 16) {
            narrative = en
              ? "You try to sound warm and empathetic, but having barely met people all week, the words feel somewhat constructed."
              : "Du försöker låta varm och inkännande, men eftersom du knappt mött människor i veckan känns orden lite konstruerade.";
          } else {
            narrative = en
              ? "You speak quietly of God's care in the midst of life's struggles."
              : "Du talar stillsamt om Guds omsorg mitt i livets kamp.";
          }
          return {
            scoreBoost,
            narrative: narrative + evalFit.monotonyWarning,
            statFocus: "pathos"
          };
        }
      });
    }

    // 4. Kairos
    {
      const evalFit = this.evaluateActFitAndMonotony(actIndex, "kairos");
      const hintBadge =
        this.showHints && (actIndex === 0 || actIndex === 3) ? (en ? " · 🌟 Fits here!" : " · 🌟 Passar här!") : "";
      options.push({
        id: "kairos_delivery",
        statFocus: "kairos",
        title: en
          ? "📰 Connect to Modern Life & Cultural Debate (Kairos)"
          : "📰 Knyt an till vår tids livspussel och samhällsdebatt (Kairos)",
        subtitle: en
          ? "Name the longing of contemporary people and the world outside the church windows."
          : "Sätt fingret på nutidsmänniskans längtan och hur världen ser ut utanför kyrkfönstret.",
        badge: en ? `Context (${this.stats.kairos})${hintBadge}` : `Samtid (${this.stats.kairos})${hintBadge}`,
        deliver: () => {
          const raw = this.stats.kairos * 0.24 + (this.hasSynergy("barth_double") ? 2 : 0);
          const scoreBoost = Math.max(1, Math.round(raw * evalFit.multiplier));
          let narrative = "";
          if (this.stats.kairos >= 24) {
            narrative = en
              ? "The connection to our own time lands like an arrow. Confirmand Liam and IT architect Johan sit up straight!"
              : "Kopplingen till vår egen tid sitter som en pil. Konfirmanden Liam och IT-arkitekten Johan rätar på ryggen!";
          } else if (this.stats.kairos < 16) {
            narrative = en
              ? "You try to reference modern life, but having neither read the papers nor listened to the community this week, the example feels dated."
              : "Du försöker referera till nutiden, men eftersom du varken läst tidningen eller lyssnat på samhället i veckan blir exemplet daterat.";
          } else {
            narrative = en
              ? "You highlight how Sunday's theme challenges our everyday life."
              : "Du lyfter fram hur söndagens tema utmanar vår vardag.";
          }
          return {
            scoreBoost,
            narrative: narrative + evalFit.monotonyWarning,
            statFocus: "kairos"
          };
        }
      });
    }

    // 5. Rhetoric
    {
      const evalFit = this.evaluateActFitAndMonotony(actIndex, "rhetoric");
      const hintBadge =
        this.showHints && actIndex === 3 ? (en ? " · 🌟 Ideal landing in Act 4!" : " · 🌟 Perfekt landning i Akt 4!") : "";
      options.push({
        id: "rhetoric_delivery",
        statFocus: "rhetoric",
        title: en
          ? "🎙️ Paint a Closing Image & Send Forth with Spoken Power (Rhetoric)"
          : "🎙️ Måla en bärande slutbild och sänd ut med muntlig skärpa (Retorik)",
        subtitle: en
          ? "Let cadence, metaphor, and rehearsed delivery gather the sermon into lived action."
          : "Låt språket, rytmen och den inövade förkunnelsen samla ihop predikan till handling.",
        badge: en ? `Rhetoric (${this.stats.rhetoric})${hintBadge}` : `Retorik (${this.stats.rhetoric})${hintBadge}`,
        deliver: () => {
          const raw = this.stats.rhetoric * 0.23 + (this.process.practicedInPulpit ? 3.5 : 0) + (this.process.polished ? 2 : 0);
          const scoreBoost = Math.max(1, Math.round(raw * evalFit.multiplier));
          let narrative = "";
          if (this.stats.rhetoric >= 22 && this.process.practicedInPulpit) {
            narrative = en
              ? "You lift your eyes from the manuscript and land the sermon with an image that lingers in the air long after you say 'Amen'."
              : "Du lyfter blicken från manuset och landar predikan med en bild som hänger kvar i luften långt efter att du sagt »Amen«.";
          } else {
            narrative = en
              ? "You gather the threads with an encouragement for the coming week."
              : "Du knyter ihop tankarna med en uppmaning inför den nya veckan.";
          }
          return {
            scoreBoost,
            narrative: narrative + evalFit.monotonyWarning,
            statFocus: "rhetoric"
          };
        }
      });
    }

    return options;
  }

  chooseSundayActOption(optionIndex) {
    if (this.phase !== "sunday_delivery") return;
    const options = this.getSundayActOptions(this.sundayActIndex);
    const chosen = options[optionIndex] || options[0];
    if (!chosen) return;

    const prevSnap = !this.headless ? this.captureStatsSnapshot() : null;
    const result = chosen.deliver();
    if (!this.headless && window.soundEngine) {
      window.soundEngine.playOrganChord();
    }

    this.data.parishioners.forEach((p) => {
      const weight = p.needs[result.statFocus] || 0.2;
      const gain = Math.round(result.scoreBoost * (0.45 + weight * 1.1));
      this.parishionerHearts[p.id] = this.clamp(this.parishionerHearts[p.id] + gain, 0, 100);
    });

    this.sundayActChoices.push({
      actNumber: this.sundayActIndex + 1,
      actTitle: this.data.sermonSections[this.sundayActIndex].title,
      optionId: chosen.id,
      optionTitle: chosen.title,
      narrative: result.narrative,
      scoreBoost: result.scoreBoost,
      statFocus: result.statFocus,
      cardId: result.cardId || null
    });

    this.sundayActIndex++;
    if (this.sundayActIndex >= this.data.sermonSections.length) {
      this.finishSermonAndEvaluate();
      if (!this.headless) {
        this.scrollToWeekTimeline(650);
      }
    } else if (!this.headless) {
      this.renderAll(false);
      this.runPostActionChoreography(prevSnap);
    }
  }

  // ==========================================================================
  // SLUTUTVÄRDERING
  // ==========================================================================
  finishSermonAndEvaluate() {
    this.phase = "sunday_summary";
    this.evaluation = this.calculateFinalEvaluation();
    if (!this.headless) {
      this.updateUrlWithScore(this.evaluation);
      this.saveSermonToBackend(this.evaluation);
      this.renderAll(false);
    }
    return this.evaluation;
  }

  updateUrlWithScore(ev) {
    if (typeof window === "undefined" || !ev) return;
    try {
      const langCode = this.lang === "en" ? "en" : "se";
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, "", `${window.location.pathname}?r=${ev.totalScore}-100&lang=${langCode}`);
      }

      const shareTitle =
        this.lang === "en"
          ? `I scored ${ev.totalScore} out of 100 in "The Homiletics Workshop"`
          : `Jag fick ${ev.totalScore} av 100 poäng i "Predikoverkstaden"`;
      document.title = shareTitle;
      const ogTitleEl = document.getElementById("og-title");
      if (ogTitleEl) ogTitleEl.setAttribute("content", shareTitle);
    } catch (e) {}
  }

  calculateFinalEvaluation() {
    const en = this.isEn();
    const target = this.sunday.targetProfile;

    // 1. DE FYRA PELARNAS MÅLUPPFYLLNAD & BALANS (Max 31 poäng)
    const ratios = {
      logos: Math.min(1.12, this.stats.logos / (target.logos * 1.18)),
      kairos: Math.min(1.12, this.stats.kairos / (target.kairos * 1.18)),
      pathos: Math.min(1.12, this.stats.pathos / (target.pathos * 1.18)),
      rhetoric: Math.min(1.12, this.stats.rhetoric / (target.rhetoric * 1.18))
    };

    const avgRatio = (ratios.logos + ratios.kairos + ratios.pathos + ratios.rhetoric) / 4;
    const minRatio = Math.min(ratios.logos, ratios.kairos, ratios.pathos, ratios.rhetoric);

    let balanceFactor = 1.0;
    if (minRatio < 0.30) balanceFactor = 0.48;
    else if (minRatio < 0.50) balanceFactor = 0.68;
    else if (minRatio < 0.70) balanceFactor = 0.84;
    else if (minRatio < 0.85) balanceFactor = 0.94;
    else if (minRatio >= 0.92) balanceFactor = 1.02;

    const pillarScore = Math.min(31, Math.round(avgRatio * 25.82 * balanceFactor));

    // 2. MANUS, STRUKTUR & GESTALTNINGSPROCESS (Max 21 poäng)
    let processScore = 0;
    if (this.process.exegesisDone) {
      processScore += this.process.exegesisDay === 0 ? 3.0 : this.process.exegesisDay === 1 ? 2.0 : 1.0;
    }
    if (this.process.structureDone) {
      processScore += (this.process.structureQuality / 100) * 4.5;
    }
    const avgDraftQual = this.process.draftWriteCount > 0 ? this.process.draftQualitySum / this.process.draftWriteCount : 25;
    processScore += (this.process.draftProgress / 100) * (avgDraftQual / 100) * 7.5;

    if (this.process.polished) processScore += 3.0;
    if (this.process.practicedInPulpit) processScore += 3.0;
    processScore = Math.min(21, Math.round(processScore));

    let unpreparedPenalty = 0;
    if (this.process.draftProgress === 0) unpreparedPenalty += 9;
    else if (this.process.draftProgress < 50) unpreparedPenalty += 5;
    else if (this.process.draftProgress < 80) unpreparedPenalty += 2;
    if (!this.process.structureDone) unpreparedPenalty += 4;
    if (!this.process.exegesisDone) unpreparedPenalty += 6;

    // 3. SÖNDAGENS LEVERANS & RETORISK KOMBO I DE 4 AKTERNA (Max 25 poäng)
    const rawDeliverySum = this.sundayActChoices.reduce((sum, c) => sum + c.scoreBoost, 0);
    let deliveryScore = Math.min(17, Math.round(rawDeliverySum * 0.40));

    const focuses = this.sundayActChoices.map((c) => c.statFocus);
    const uniqueFocuses = new Set(focuses).size;
    const usedCardsCount = new Set(this.sundayActChoices.filter((c) => c.cardId).map((c) => c.cardId)).size;

    const act1Good = focuses[0] === "kairos" || focuses[0] === "pathos";
    const act2Good = focuses[1] === "logos";
    const act3Good = focuses[2] === "pathos";
    const act4Good = focuses[3] === "rhetoric" || focuses[3] === "kairos" || (this.selectedForm === "pastoral" && focuses[3] === "pathos");
    const matchingActsCount = [act1Good, act2Good, act3Good, act4Good].filter(Boolean).length;

    let dramaturgyBonus = 0;
    let dramaturgyNote = "";

    if (uniqueFocuses === 1) {
      dramaturgyBonus = -12;
      dramaturgyNote = en
        ? "❌ **Monotonous Pulpit Delivery (-12 pts):** You chose the exact same focus in all four acts of the sermon. Without movement between text, context, grace, and sending, the pews grew weary."
        : "❌ **Monoton predikoleverans (-12p):** Du valde samma inriktning i predikans alla fyra akter. Utan växling mellan text, nutid, nåd och sändning tröttnade kyrkbänkarna.";
    } else if (uniqueFocuses === 2) {
      dramaturgyBonus = -4;
      dramaturgyNote = en
        ? "⚠️ **One-Dimensional Dramaturgy (-4 pts):** The sermon swung between only two registers and lacked a full rhetorical arc."
        : "⚠️ **Ensidig dramaturgi (-4p):** Predikan pendlade bara mellan två lägen och saknade en fulltonig retorisk båge.";
    } else if (uniqueFocuses >= 3) {
      if (matchingActsCount === 4 && uniqueFocuses === 4) {
        dramaturgyBonus = 5 + (usedCardsCount >= 3 ? 2 : usedCardsCount >= 2 ? 1 : 0);
        dramaturgyNote = en
          ? "🌟 **Masterful 4-Act Dramaturgy (+7 pts):** All four acts (Contemporary Hook -> Biblical Exegesis -> Gospel Reversal -> Rhetorical Sending) formed a compelling homiletical arc!"
          : "🌟 **Fulländad 4-akts dramaturgi (+7p):** Alla fyra akter (Samtidsöppning -> Textutläggning -> Evangeliets vändpunkt -> Retorisk sändning) bildade en oemotståndlig retorisk kombo!";
      } else if (matchingActsCount >= 3) {
        dramaturgyBonus = 2 + (usedCardsCount >= 3 ? 1 : 0);
        dramaturgyNote = en
          ? "✅ **Thoughtful Rhetorical Arc (+3 pts):** You varied your voice well and let each act fulfill its homiletical purpose."
          : "✅ **Genomtänkt retorisk båge (+3p):** Du varierade tilltalet väl och lät varje akt fylla sin homiletiska uppgift.";
      } else {
        dramaturgyBonus = 0;
        dramaturgyNote = en
          ? "ℹ️ **Varied but Inverted Order:** You varied your approach in the pulpit, though some elements appeared in the wrong dramatic sequence."
          : "ℹ️ **Varierad men omkastad ordning:** Du varierade dina grepp i predikstolen, men vissa delar låg i fel dramaturgisk ordning.";
      }
    }

    deliveryScore = this.clamp(deliveryScore + dramaturgyBonus, 0, 25);

    // 4. ARBETSRUTIN-SYNERGIER, FORM-ANPASSNING & PASTORAL HÅLLBARHET
    const synergyRaw = this.unlockedSynergies.reduce((sum, s) => sum + s.bonusPoints, 0);
    let synergyScore = Math.min(9, Math.floor(synergyRaw * 0.175) + (this.insightDeck.length >= 5 && this.unlockedSynergies.length >= 6 && this.relation >= 82 ? 2 : 0));

    let formBonus = 0;
    let formNote = "";
    const isRecForm = this.selectedForm === this.sunday.recommendedForm;

    if (this.selectedForm === "narrative") {
      const hasStats = this.stats.logos >= 28 && this.stats.pathos >= 28;
      const hasMethod = this.hasSynergy("incubation_walk") && focuses[2] === "pathos";
      if (hasStats && hasMethod) {
        formBonus = isRecForm ? 4 : 3;
        formNote = en
          ? "✅ **Faithful to the Narrative Form:** You let the story mature during a forest walk and united textual depth with a powerful Gospel turning point."
          : "✅ **Trogen den narrativa formen:** Du lät berättelsen mogna under skogspromenaden och förenade textdjup med en stark vändpunkt i nåden.";
      } else if (hasStats) {
        formBonus = 2;
      }
    } else if (this.selectedForm === "contrast") {
      const hasStats = this.stats.logos >= 28 && this.stats.kairos >= 28;
      const hasMethod = this.hasSynergy("barth_double") && this.hasSynergy("stott_bridge");
      if (hasStats && hasMethod) {
        formBonus = isRecForm ? 4 : 3;
        formNote = en
          ? "✅ **Faithful to the Bridge-Builder Form:** You united rigorous exegesis with contemporary diagnosis (*Barth's Double Vision* & *Stott's Bridge*)."
          : "✅ **Trogen Brobyggar-formen:** Du förenade grundlig exeges med dagstidningens samtidsdiagnos (*Barths Dubbelblick* & *Stotts Brobygge*).";
      } else if (hasStats) {
        formBonus = 2;
      }
    } else if (this.selectedForm === "pastoral") {
      const hasStats = this.stats.pathos >= 30 && this.spirit >= 65;
      const hasMethod = this.relation >= 68 && (this.hasSynergy("lectio_divina") || (this.process.activityCounts["prayer_silence"] || 0) >= 2);
      if (hasStats && hasMethod) {
        formBonus = isRecForm ? 4 : 3;
        formNote = en
          ? "✅ **Faithful to the Pastoral Form:** Altar prayer, strong parish presence, and deep pastoral care carried the sermon."
          : "✅ **Trogen den själavårdande formen:** Bön vid altaret, hög församlingsnärvaro och djup själavård bar predikan.";
      } else if (hasStats) {
        formBonus = 2;
      }
    } else if (this.selectedForm === "prophetic") {
      const hasStats = this.stats.kairos >= 28 && this.stats.rhetoric >= 28;
      const hasMethod = this.hasSynergy("embodied_word") && this.process.polished && (focuses[0] === "kairos" || focuses[3] === "rhetoric");
      if (hasStats && hasMethod) {
        formBonus = isRecForm ? 4 : 3;
        formNote = en
          ? "✅ **Faithful to the Prophetic Form:** Sharp cultural analysis combined with polished imagery and rehearsed pulpit delivery."
          : "✅ **Trogen den profetiska formen:** Skarp samtidsanalys kombinerades med finslipat bildspråk och inövad skärpa i predikstolen.";
      } else if (hasStats) {
        formBonus = 2;
      }
    }

    if (formBonus === 0 && avgRatio >= 0.72) {
      formBonus = 1;
      formNote = en
        ? "ℹ️ **Weak Alignment with Chosen Sermon Form:** Your preparation routine this week did not fully match the homiletical form you selected."
        : "ℹ️ **Svag koppling till vald predikoform:** Ditt arbetssätt under veckan matchade inte fullt ut den predikoform du hade valt.";
    }

    let ethosAndSustainability = 0;
    if (this.spirit >= 78) ethosAndSustainability += 2;
    else if (this.spirit >= 64) ethosAndSustainability += 1;
    else if (this.spirit < 35) ethosAndSustainability -= 4;

    if (this.relation >= 74) ethosAndSustainability += 1;
    else if (this.relation < 42) ethosAndSustainability -= 4;

    if (this.energy < 18) ethosAndSustainability -= 6;
    else if (this.energy < 30) ethosAndSustainability -= 3;
    else if (this.energy >= 58 && this.process.saturdayNightRested) ethosAndSustainability += 1;

    if (this.process.saturdayNightPanic) ethosAndSustainability -= 6;

    const rawTotal = pillarScore + processScore + deliveryScore + synergyScore + formBonus + ethosAndSustainability - unpreparedPenalty;
    const totalScore = this.clamp(Math.round(rawTotal), 14, 98);

    this.data.parishioners.forEach((p) => {
      const personalFit =
        (p.needs.logos || 0) * ratios.logos +
        (p.needs.kairos || 0) * ratios.kairos +
        (p.needs.pathos || 0) * ratios.pathos +
        (p.needs.rhetoric || 0) * ratios.rhetoric +
        (p.needs.spirit || 0) * (this.spirit / 65);

      const blended = Math.round(totalScore * 0.55 + personalFit * 30 + (this.relation - 55) * 0.20);
      this.parishionerHearts[p.id] = this.clamp(blended, 10, 99);
    });

    let rankTitle = "";
    let rankSubtitle = "";
    if (totalScore >= 90) {
      rankTitle = en ? "🌟 Cathedral Resonance – Homiletical Masterpiece" : "🌟 Katedralens Klang – Homiletiskt Mästerverk";
      rankSubtitle = en
        ? "A rare triumph! Exegesis, cultural diagnosis, pastoral empathy, manuscript craft, and Sunday dramaturgy fused into gold."
        : "Sällsynt fullträff! Exeges, samtidsdiagnos, själavård, manusarbete och söndagens dramaturgi smälte samman till guld.";
    } else if (totalScore >= 78) {
      rankTitle = en ? "🕯️ Sustaining & Luminous Proclamation" : "🕯️ Bärande & Genomlyst Förkunnelse";
      rankSubtitle = en
        ? "A strong, well-prepared sermon where both the biblical text and people's lived reality were taken seriously."
        : "En stark och väl förberedd predikan där både bibeltexten och människornas liv togs på stort allvar.";
    } else if (totalScore >= 64) {
      rankTitle = en ? "📖 Solid Sunday Sermon" : "📖 Hedervärd Söndagspredikan";
      rankSubtitle = en
        ? "The message had good points and touched several listeners, though parts of the craft or balance left room to grow."
        : "Budskapet hade goda poänger och flera i bänkarna berördes, men delar av hantverket eller balansen lämnade mer att önska.";
    } else if (totalScore >= 46) {
      rankTitle = en ? "📄 Uneven & Fragmented Sermon" : "📄 Haltande & Splittrad Predikan";
      rankSubtitle = en
        ? "One-sided preparation or gaps in the manuscript and dramatic arc kept the sermon from truly taking flight."
        : "Ensidig förberedelse eller brister i manus och dramaturgi gjorde att predikan hade svårt att lyfta.";
    } else {
      rankTitle = en ? "🌧️ Homiletical Belly-Flop" : "🌧️ Homiletiskt Magplask";
      rankSubtitle = en
        ? "Church coffee hour is buzzing with disappointed faces. Tunnel vision, neglected text study, or sheer exhaustion brought the sermon down."
        : "Kyrkkaffet surrar av besvikna miner. Tunnelseende, utebliven textbearbetning eller total utmattning fällde predikan.";
    }

    const routineFeedback = [];
    if (dramaturgyNote) routineFeedback.push(dramaturgyNote);
    if (formNote) routineFeedback.push(formNote);

    if (minRatio < 0.55) {
      const weakestKey = Object.keys(ratios).reduce((a, b) => (ratios[a] < ratios[b] ? a : b));
      const names = en
        ? {
            logos: "Exegesis & Textual Depth (Logos)",
            kairos: "Contemporary Relevance (Kairos)",
            pathos: "Pastoral Empathy (Pathos)",
            rhetoric: "Rhetorical Craft"
          }
        : {
            logos: "Exegetik & Textdjup (Logos)",
            kairos: "Samtidsrelevans (Kairos)",
            pathos: "Själavård & Hjärta (Pathos)",
            rhetoric: "Retorisk gestaltning"
          };
      routineFeedback.push(
        en
          ? `❌ **Unbalanced Preparation:** You severely neglected **${names[weakestKey]}**. A sermon stands on four legs—if one is missing, the whole table tips.`
          : `❌ **Obalanserad förberedelse:** Du försummade **${names[weakestKey]}** grovt. En predikan står på fyra ben – om ett ben saknas välter helheten.`
      );
    } else if (minRatio >= 0.92) {
      routineFeedback.push(
        en
          ? `✅ **Harmonious Whole:** You achieved high excellence across all four homiletical dimensions (Logos, Kairos, Pathos, and Rhetoric)!`
          : `✅ **Harmonisk helhet:** Du nådde hög verkshöjd i alla fyra homiletiska dimensioner (Logos, Kairos, Pathos och Retorik)!`
      );
    }

    if (this.process.exegesisDone && this.process.exegesisDay <= 1) {
      routineFeedback.push(
        en
          ? "✅ **Exemplary Incubation:** You studied the biblical text early in the week so 'Echo of the Text' enriched your later encounters."
          : "✅ **Föredömlig inkubation:** Du gjorde bibelstudiet redan tidigt i veckan så att »Textens eko« berikade dina möten."
      );
    } else if (!this.process.exegesisDone) {
      routineFeedback.push(
        en
          ? "❌ **Unread Biblical Text (-6 pts):** You stepped into the pulpit without having close-read Sunday's scripture!"
          : "❌ **Oläst bibeltext (-6p):** Du gick upp i predikstolen utan att ha närläst söndagens grundtext!"
      );
    }

    if (this.process.structureDone && this.process.structureQuality >= 70) {
      routineFeedback.push(
        en
          ? "✅ **Strong Bridge-Building:** You sketched the sermon's structure after gathering both theological depth and everyday insights."
          : "✅ **Stark brobyggnad:** Du skissade predikans struktur efter att ha samlat både teologiskt djup och vardagsinsikter."
      );
    } else if (!this.process.structureDone) {
      routineFeedback.push(
        en
          ? "⚠️ **Missing Outline (-4 pts):** You skipped 'Sketch Homiletic Structure & Focus', leaving the sermon scattered."
          : "⚠️ **Saknad disposition (-4p):** Du hoppade över »Skissa struktur & homiletisk idé«, vilket gjorde predikan spretig."
      );
    }

    if (this.process.draftProgress < 65) {
      routineFeedback.push(
        en
          ? `⚠️ **Unfinished Manuscript (${this.process.draftProgress}%):** You arrived at Sunday morning without a completed sermon draft.`
          : `⚠️ **Ofärdigt manus (${this.process.draftProgress}%):** Du kom till söndagen utan ett färdigskrivet manusutkast.`
      );
    } else if (this.process.practicedInPulpit && this.process.polished) {
      routineFeedback.push(
        en
          ? "✅ **Complete Craftsmanship:** The manuscript was fully drafted, stylistically polished, and rehearsed aloud in the pulpit."
          : "✅ **Fulländat hantverk:** Manuset blev både färdigskrivet, språkligt finslipat och övat på plats i predikstolen."
      );
    }

    if (this.process.saturdayNightRested) {
      routineFeedback.push(
        en
          ? "✅ **Saturday Peace:** You finished on time and rested Saturday evening—giving you calm authority on Sunday morning."
          : "✅ **Lördagsfrid:** Du var klar i tid och vilade på lördagskvällen – det gav lugn och auktoritet på söndag morgon."
      );
    } else if (this.process.saturdayNightPanic) {
      routineFeedback.push(
        en
          ? "⚠️ **Saturday Night Panic (-6 pts):** Staying up late Saturday night panic-writing drained your spiritual authenticity in the pulpit."
          : "⚠️ **Lördagsnattens panik (-6p):** Att sitta uppe lördag kväll och råskriva sänkte din andliga frimodighet i predikstolen."
      );
    }

    const coffeeQuotes = this.generateDiagnosticCoffeeQuotes(totalScore, ratios, uniqueFocuses);

    return {
      date: new Date().toLocaleDateString(en ? "en-US" : "sv-SE"),
      sundayTitle: this.sunday.title,
      scriptureRef: this.sunday.scriptureRef,
      totalScore,
      breakdown: {
        pillarScore,
        processScore,
        deliveryScore,
        synergyScore,
        formBonus,
        ethosAndSustainability,
        unpreparedPenalty
      },
      rankTitle,
      rankSubtitle,
      stats: { ...this.stats },
      energy: this.energy,
      spirit: this.spirit,
      relation: this.relation,
      draftProgress: this.process.draftProgress,
      synergies: [...this.unlockedSynergies],
      routineFeedback,
      coffeeQuotes
    };
  }

  // ==========================================================================
  // KYRKKAFFETS RÖSTER (Svenska & Engelska)
  // ==========================================================================
  generateDiagnosticCoffeeQuotes(totalScore, ratios, uniqueFocuses) {
    const en = this.isEn();
    const isMonotonous = uniqueFocuses === 1;
    const noManuscript = this.process.draftProgress < 55 || !this.process.structureDone;
    const exhausted = this.energy < 22 || this.process.saturdayNightPanic;
    const lowLogos = ratios.logos < 0.65 || !this.process.exegesisDone;
    const lowKairos = ratios.kairos < 0.65;
    const lowPathos = ratios.pathos < 0.65;
    const lowRhetoric = ratios.rhetoric < 0.65;
    const ivoryTower = ratios.logos >= 1.0 && (lowPathos || lowKairos);

    return this.data.parishioners.map((p) => {
      const heart = this.parishionerHearts[p.id] || 40;
      let comment = "";
      let tone = "neutral";

      if (heart >= 82 && totalScore >= 78) {
        tone = "praise";
        switch (p.id) {
          case "margareta":
            comment = en
              ? `“To think that a Bible passage I've heard for forty years could be opened so freshly and comfort so deeply. Today I felt both seen and carried!”`
              : `»Tänk att en bibeltext jag hört i fyrtio år kunde öppnas så nytt och samtidigt trösta så djupt. Idag kände jag mig både sedd och buren!«`;
            break;
          case "johan":
            comment = en
              ? `“Honestly, that was razor-sharp. The pastor neither dodged the hard parts of the Greek text nor our modern performance anxiety. I was riveted.”`
              : `»Helt ärligt: det här var knivskarpt. Pastorn väjde varken för grundtextens svårigheter eller vår tids prestationsstress. Jag satt som fastnaglad.«`;
            break;
          case "sara":
            comment = en
              ? `“When the pastor paused at the turning point and spoke of grace, I teared up in the pew. Those were the exact words I needed to make it through another week.”`
              : `»När pastorn stannade upp i vändpunkten och talade om nåden brast det för mig i bänken. Precis de orden jag behövde för att orka en vecka till.«`;
            break;
          case "liam":
            comment = en
              ? `“Best sermon I've heard! Zero boring script-reading, and the connection to everyday life at the end even got my friends in the back pew to listen.”`
              : `»Bästa predikan jag hört! Ingen tråkig innantilläsning, och kopplingen till vår vardag i slutet fick till och med mina kompisar på sista bänk att lyssna.«`;
            break;
          case "bengt":
            comment = en
              ? `“Solid exegesis, a clear structural outline, and a rhetorical arc that held together from the opening sentence to the Amen. Hats off!”`
              : `»Gedigen exeges, klar disposition och en retorisk båge som höll från första meningen till amen. Hatten av!«`;
            break;
          case "agda":
            comment = en
              ? `“You could tell in every word that the pastor had prayed through this text personally. It was a holy hour in church today.”`
              : `»Det märktes i varje ord att pastorn själv hade bett sig igenom den här texten. Det var en helig stund i kyrkan idag.«`;
            break;
        }
      } else if (heart < 56 || totalScore < 58) {
        tone = "grumble";
        if (p.id === "liam") {
          if (ivoryTower || isMonotonous) {
            comment = en
              ? `“Sorry, but was the pastor even talking to us? It sounded like someone reading aloud from a dusty encyclopedia in the exact same tone for twenty minutes.”`
              : `»Alltså förlåt, men pratade pastorn ens med oss? Det lät som någon som läste högt ur en dammig uppslagsbok i samma tonläge i tjugo minuter.«`;
          } else if (noManuscript || lowRhetoric) {
            comment = en
              ? `“The pastor kept losing the thread mid-sentence. If even the preacher doesn't know where the sermon is going, how are we in the back pew supposed to stay awake?”`
              : `»Pastorn tappade ju bort sig i sina egna meningar hela tiden. Om inte ens prästen vet vart predikan är på väg, hur ska vi på sista bänk orka lyssna?«`;
          } else {
            comment = en
              ? `“I tried listening at the start, but it felt zero percent relevant to anyone under eighty.”`
              : `»Jag försökte lyssna i början, men det kändes noll relevant för någon under åttio år.«`;
          }
        } else if (p.id === "johan") {
          if (lowKairos) {
            comment = en
              ? `“Has the pastor even opened a newspaper or spoken to a working person this week? Utterly disconnected from reality.”`
              : `»Har pastorn överhuvudtaget öppnat en dagstidning eller pratat med en yrkesarbetande människa den här veckan? Helt världsfrånvänt.«`;
          } else if (noManuscript) {
            comment = en
              ? `“Complete lack of a central thread. Like an unprepared Monday morning presentation where the speaker forgot to do the homework.”`
              : `»Total avsaknad av röd tråd. Som ett oförberett måndagsmöte där talaren glömt göra sin hemläxa.«`;
          } else if (lowLogos) {
            comment = en
              ? `“Way too much vague opinion and sentimentality. I missed intellectual substance and real biblical analysis.”`
              : `»Lite väl mycket allmänt tyckande och känslosvall. Jag saknade intellektuellt tuggmotstånd och verklig textanalys.«`;
          } else {
            comment = en
              ? `“It started promisingly but fell flat in execution. Monotonous and lacking edge.”`
              : `»Det började lovande men föll platt i utförandet. Monotont och utan skärpa.«`;
          }
        } else if (p.id === "sara") {
          if (lowPathos || ivoryTower) {
            comment = en
              ? `“I came here completely wiped out longing for a word of comfort, and got a cold theological lecture over my head. I feel lonelier than when I arrived.”`
              : `»Jag kom hit helt slutkörd och längtade efter ett ord av tröst, men fick en kall teologisk föreläsning över huvudet. Känner mig mer ensam än när jag kom.«`;
          } else if (exhausted) {
            comment = en
              ? `“The pastor looked more exhausted than I am! It sounded like a script forced out at 2 AM in pure panic.”`
              : `»Pastorn såg ju mer utmattad ut än jag! Det lät som ett manus framkrystat klockan två i natt på ren stress.«`;
          } else {
            comment = en
              ? `“I don't know... the words just bounced off today. There was no warmth or direction that stuck.”`
              : `»Jag vet inte... orden studsade liksom bara. Det fanns ingen värme eller riktning som fastnade.«`;
          }
        } else if (p.id === "bengt") {
          if (lowLogos) {
            comment = en
              ? `“Forgive me for being blunt at the coffee table, but whatever happened to Sunday's biblical text? That was a casual chat, not a sermon!”`
              : `»Ursäkta att jag är rakt på sak vid kaffebordet, men var tog söndagens bibeltext vägen? Det där var ett allmänt kåseri, inte en predikan!«`;
          } else if (noManuscript) {
            comment = en
              ? `“Good exegetical impulses, but without an outline and a finished manuscript the sermon fell apart into loose fragments.”`
              : `»Goda exegetiska ansatser, men utan disposition och färdigarbetat manus ramlade predikan isär i lösa fragment.«`;
          } else if (isMonotonous) {
            comment = en
              ? `“Even an old teacher like me grows tired when the preacher grinds away in the exact same rut across all four parts without rhetorical variation.”`
              : `»Även en gammal lärare som jag tröttnar när predikanten maler på i exakt samma spår genom alla fyra delar utan retorisk variation.«`;
          } else {
            comment = en
              ? `“Technically accurate in places, but dry as dust and lacking a unifying idea.”`
              : `»Tekniskt sett korrekt på sina ställen, men torrt som snus och utan bärande idé.«`;
          }
        } else if (p.id === "margareta") {
          if (this.relation < 45) {
            comment = en
              ? `“Well, the pastor has been locked up in the study all week and hasn't been seen in the parish, and you could hear it—you can't preach over the heads of your flock!”`
              : `»Ja, pastorn har ju suttit inlåst på kammaren hela veckan och inte synts till i församlingen, och det hördes – man kan inte predika över huvudet på sitt folk!«`;
          } else if (lowLogos) {
            comment = en
              ? `“It was pleasant enough, I suppose, but surely one could ask for a bit more grounding in God's Word on a Sunday morning?”`
              : `»Nog var det trevligt alltid, men lite mer förankring i Guds ord hade man väl ändå kunnat begära på en söndag?«`;
          } else if (lowPathos) {
            comment = en
              ? `“Lots of fine theological words, but the heart wasn't in it. At least the coffee is good today!”`
              : `»Det var många fina teologiska ord, men hjärtat var inte med. Kaffet var i alla fall gott idag!«`;
          } else {
            comment = en
              ? `“Not the pastor's most memorable Sunday in the pulpit, to put it kindly.”`
              : `»Det var väl inte pastorns mest minnesvärda söndag i predikstolen, om jag ska säga det snällt.«`;
          }
        } else if (p.id === "agda") {
          if (this.spirit < 42 || exhausted) {
            comment = en
              ? `“Dear me, there was no peace or prayer behind the words today. You could hear how hurried and spiritually drained the pastor was.”`
              : `»Kära hjärtanes, det fanns ingen ro eller bön bakom orden idag. Man hörde hur jäktad och andligt dränerad pastorn var.«`;
          } else if (ivoryTower) {
            comment = en
              ? `“So many complicated academic terms... I mostly sat wondering when the Gospel of Jesus would arrive.”`
              : `»Så många svåra akademiska termer... jag satt mest och undrade när evangeliet om Jesus skulle komma.«`;
          } else {
            comment = en
              ? `“A bit scattered and heavy-going today, though the hymns carried us anyway.”`
              : `»Lite spretigt och tungrott var det allt idag, men psalmerna bar oss ändå.«`;
          }
        }
      } else {
        tone = "mixed";
        if (p.id === "bengt") {
          comment =
            ratios.logos >= 0.85
              ? en
                ? `“The textual exposition in the middle was genuinely solid, even if the application at the end felt a bit half-baked.”`
                : `»Textutläggningen i mitten var riktigt hedervärd, även om tillämpningen på slutet kändes lite halvfärdig.«`
              : en
              ? `“Warmly and engagingly delivered, though I wished the pastor had dug much deeper into the biblical text itself.”`
              : `»Varmt och engagerat framfört, men jag hade önskat att pastorn borrade betydligt djupare i själva bibeltexten.«`;
        } else if (p.id === "johan") {
          comment =
            ratios.kairos >= 0.85
              ? en
                ? `“The cultural diagnosis hit the mark, though the structure wobbled a bit toward the end.”`
                : `»Samtidsspaningen träffade rätt, men strukturen svajade lite på vägen mot slutet.«`
              : en
              ? `“A decent sermon, but it would have gained a lot from sharper contemporary analysis and less churchy jargon.”`
              : `»En helt okej predikan, men den hade vunnit mycket på skarpare nutidsanalys och mindre kyrklig jargong.«`;
        } else if (p.id === "sara") {
          comment =
            ratios.pathos >= 0.85
              ? en
                ? `“There was lovely warmth when the pastor spoke of grace, even if the rest of the sermon was a little hard to follow.”`
                : `»Det fanns en väldigt fin värme när pastorn talade om nåden, även om resten av predikan var lite svår att hänga med i.«`
              : en
              ? `“Good thoughts, but it stayed a bit in the head today—I needed more concrete comfort for everyday life.”`
              : `»Bra tankar, men det stannade lite i huvudet idag – jag hade behövt mer konkret tröst för vardagen.«`;
        } else if (p.id === "liam") {
          comment =
            ratios.rhetoric >= 0.85
              ? en
                ? `“The pastor spoke vividly and well, though some parts in the middle dragged a bit.”`
                : `»Pastorn pratade levande och bra, men vissa delar i mitten blev lite långrandiga.«`
              : en
              ? `“A few cool points, but pretty slow pacing in places.”`
              : `»Några schyssta poänger, men rätt segt tempo på sina ställen.«`;
        } else if (p.id === "margareta") {
          comment = en
            ? `“A steady Sunday sermon with good intentions, even if you could tell the week had been full of other things.”`
            : `»En stabil söndagspredikan med goda intentioner, även om det märktes att veckan varit full av annat.«`;
        } else {
          comment = en
            ? `“Lovely to be at High Mass today. Parts of the sermon warmed my heart, while other parts drifted by.”`
            : `»Fint med högmässa idag. Vissa delar av predikan värmde gott, annat flög lite förbi.«`;
        }
      }

      return {
        name: p.name,
        role: p.role,
        avatar: p.avatar,
        heart,
        tone,
        comment
      };
    });
  }

  async saveSermonToBackend(evalData) {
    if (this.headless) return;
    try {
      if (window.goatcounter && typeof window.goatcounter.count === "function") {
        window.goatcounter.count({
          path: `sermon-completed/${this.sunday.id}`,
          title: `Sermon Completed (${evalData.totalScore}p)`,
          event: true
        });
      }
    } catch (e) {}
    try {
      const localList = JSON.parse(localStorage.getItem("predikoverkstaden_archive") || "[]");
      localList.unshift(evalData);
      localStorage.setItem("predikoverkstaden_archive", JSON.stringify(localList.slice(0, 20)));

      await fetch("/api/sermons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(evalData)
      });
    } catch (e) {
      // Fallback till localStorage
    }
  }

  // ==========================================================================
  // DELNING & AVSKALAD DELNINGSSKÄRM (exakt efter mönster från nt2026-eller-nt1981)
  // ==========================================================================
  baseUrl() {
    if (typeof window === "undefined" || !window.location) return "";
    const path = window.location.pathname.replace(/\/(se|sv|en|index\.html)\/?$/, "/");
    return window.location.origin + (path.endsWith("/") ? path : path + "/");
  }

  getShareInfo() {
    const ev = this.evaluation || this.calculateFinalEvaluation();
    const s = this.clamp(Math.round(ev.totalScore || 0), 0, 100);
    const en = this.isEn();
    const title = en ? "The Homiletics Workshop" : "Predikoverkstaden";
    const url = en ? `${this.baseUrl()}share/en/${s}.html` : `${this.baseUrl()}r/${s}-av-100.html`;
    const text = en
      ? `I scored ${s} out of 100 in "${title}". Can you prepare and preach a better Sunday sermon?`
      : `Jag fick ${s} av 100 poäng i spelet "${title}". Kan du förbereda och leverera en bättre predikan?`;
    return { s, title, url, text };
  }

  copyShareUrl() {
    if (this.headless) return;
    const { s, url } = this.getShareInfo();
    const tr = this.t();
    try {
      if (window.goatcounter && typeof window.goatcounter.count === "function") {
        window.goatcounter.count({ path: "dela-kopiera", title: `Copy Link (${s})`, event: true });
      }
    } catch (e) {}

    const done = () => {
      const msgEl = document.getElementById("share-copied-msg");
      if (msgEl) msgEl.textContent = tr.shareCopiedMsg;
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, () => window.prompt("Kopiera länken:", url));
    } else {
      window.prompt("Kopiera länken:", url);
    }
  }

  shareNative() {
    if (this.headless || !navigator.share) return;
    const { s, title, url, text } = this.getShareInfo();
    try {
      if (window.goatcounter && typeof window.goatcounter.count === "function") {
        window.goatcounter.count({ path: "dela-system", title: `Native Share (${s})`, event: true });
      }
    } catch (e) {}
    navigator.share({ title, text, url }).catch(() => {});
  }

  checkSharedResultFromUrl() {
    if (this.headless || typeof window === "undefined") return;
    try {
      const search = window.location.search || "";
      let score = null;

      // 1. Stöd ?r=88-100 eller ?r=88 (som i nt2026-eller-nt1981)
      const mR = /[?&]r=(\d{1,3})(?:-100)?(?:&|$)/.exec(search);
      if (mR) {
        score = parseInt(mR[1], 10);
      } else {
        // 2. Stöd även ?score=88
        const params = new URLSearchParams(search);
        if (params.has("score")) {
          score = parseInt(params.get("score"), 10);
        }
      }

      if (score === null || isNaN(score) || score < 0 || score > 100) return;

      const params = new URLSearchParams(search);
      const sundayId = params.get("s") || this.sunday.id;
      const matchedSunday = this.data.sundays.find((s) => s.id === sundayId);
      if (matchedSunday) {
        this.sunday = matchedSunday;
        const sel = document.getElementById("scenario-select");
        if (sel) sel.value = matchedSunday.id;
      }

      this.sharedData = { score, sundayId: this.sunday.id };
      this.renderSharedLandingScreen();

      try {
        if (window.goatcounter && typeof window.goatcounter.count === "function") {
          window.goatcounter.count({ path: "fran-delad-lank", title: `From Shared Link (${score})`, event: true });
        }
      } catch (e) {}
    } catch (e) {}
  }

  renderSharedLandingScreen() {
    if (this.headless || !this.sharedData) return;
    const screen = document.getElementById("shared-landing-screen");
    if (!screen) return;

    const tr = this.t();
    const titleEl = document.getElementById("landing-title");
    const leadEl = document.getElementById("landing-lead");
    const friendEl = document.getElementById("landing-friend-box");
    const playBtn = document.getElementById("btn-landing-play");

    if (titleEl) titleEl.textContent = tr.landingTitle;
    if (leadEl) leadEl.textContent = tr.landingLead;
    if (friendEl && tr.landingFriendHtml) {
      friendEl.innerHTML = tr.landingFriendHtml(this.sharedData.score);
    }
    if (playBtn) playBtn.textContent = tr.btnLandingPlay;

    document.body.classList.add("shared-landing-mode");
    screen.classList.remove("hidden");
  }

  closeSharedResultAndPlay() {
    const screen = document.getElementById("shared-landing-screen");
    if (screen) screen.classList.add("hidden");
    document.body.classList.remove("shared-landing-mode");

    const targetSundayId = (this.sharedData && this.sharedData.sundayId) || this.sunday.id;
    this.sharedData = null;
    try {
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, "", window.location.pathname);
      }
      document.title = this.t().pageTitle;
    } catch (e) {}
    this.startNewGame(targetSundayId);
    if (this.scene3d) {
      setTimeout(() => this.scene3d.onResize(), 40);
    }
    this.checkInitialTutorial();
  }

  // ==========================================================================
  // INTERAKTIV MINITUTORIAL I TVÅ STEG (Välj plats -> Välj aktivitet)
  // ==========================================================================
  checkInitialTutorial() {
    if (this.headless || typeof window === "undefined") return;
    if (this.sharedData) return; // Vänta tills användaren tryckt på "Spela" på delningsskärmen
    try {
      const done = localStorage.getItem("predikoverkstaden_tutorial_done");
      if (!done) {
        this.startTutorial(false);
      }
    } catch (e) {
      this.startTutorial(false);
    }
  }

  startTutorial(force = false) {
    if (this.headless) return;
    if (force && this.phase !== "prep") {
      this.startNewGame(this.sunday.id);
    }
    this.setMobileTab("map");
    this.setTutorialStep(1);
    setTimeout(() => this.scrollToWeekTimeline(650), 80);
  }

  setTutorialStep(step) {
    this.tutorialStep = step;
    if (!this.headless) {
      this.renderTutorial();
    }
  }

  advanceTutorial() {
    if (this.tutorialStep === 1) {
      this.setTutorialStep(2);
      // Scrolla mjukt så att aktivitetsrutorna syns tydligt under platsknapparna
      const actCard = document.getElementById("activities-section-card");
      if (actCard && typeof window !== "undefined") {
        const rect = actCard.getBoundingClientRect();
        if (rect.bottom > window.innerHeight) {
          this.smoothScrollToY(window.scrollY + Math.min(180, rect.top - 90), 500);
        }
      }
    } else {
      this.finishTutorial();
    }
  }

  finishTutorial() {
    this.tutorialStep = 0;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("predikoverkstaden_tutorial_done", "1");
      } catch (e) {}
    }
    if (!this.headless) {
      this.renderTutorial();
    }
  }

  renderTutorial() {
    if (this.headless) return;
    const banner = document.getElementById("tutorial-banner");
    const locBar = document.getElementById("location-filter-bar");
    const sceneWrap = document.querySelector(".scene3d-wrapper");
    const actGrid = document.getElementById("activities-grid");

    if (locBar) locBar.classList.toggle("tutorial-spotlight-active", this.tutorialStep === 1);
    if (sceneWrap) sceneWrap.classList.toggle("tutorial-spotlight-active", this.tutorialStep === 1);
    if (actGrid) actGrid.classList.toggle("tutorial-spotlight-active", this.tutorialStep === 2);

    if (!banner) return;
    if (this.tutorialStep === 0 || this.phase !== "prep") {
      banner.classList.add("hidden");
      return;
    }

    const tr = this.t();
    banner.classList.remove("hidden");
    const stepPill = document.getElementById("tutorial-step-pill");
    const titleEl = document.getElementById("tutorial-title");
    const bodyEl = document.getElementById("tutorial-body");
    const nextBtn = document.getElementById("btn-tutorial-next");
    const skipBtn = document.getElementById("btn-tutorial-skip");

    if (this.tutorialStep === 1) {
      if (stepPill) stepPill.textContent = tr.tutStep1Pill;
      if (titleEl) titleEl.textContent = tr.tutStep1Title;
      if (bodyEl) bodyEl.textContent = tr.tutStep1Body;
      if (nextBtn) nextBtn.textContent = tr.tutStep1Next;
      if (skipBtn) skipBtn.textContent = tr.tutSkip;
    } else if (this.tutorialStep === 2) {
      if (stepPill) stepPill.textContent = tr.tutStep2Pill;
      if (titleEl) titleEl.textContent = tr.tutStep2Title;
      if (bodyEl) bodyEl.textContent = tr.tutStep2Body;
      if (nextBtn) nextBtn.textContent = tr.tutStep2Done;
      if (skipBtn) skipBtn.textContent = tr.tutSkip;
    }
  }

  // ==========================================================================
  // MJUK SCROLL TILL VECKODAGSPANELEN & KONSEKVENS-ANIMATION PÅ STATS
  // ==========================================================================
  smoothScrollToY(targetY, durationMs = 680, onComplete = null) {
    if (this.headless || typeof window === "undefined") {
      if (onComplete) onComplete();
      return;
    }
    if (this._scrollAnimId) {
      cancelAnimationFrame(this._scrollAnimId);
      this._scrollAnimId = null;
    }

    const startY = window.scrollY || window.pageYOffset || 0;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const clampedTarget = Math.max(0, Math.min(maxScroll, targetY));
    const diff = clampedTarget - startY;

    if (Math.abs(diff) < 4 || durationMs <= 0) {
      window.scrollTo(0, clampedTarget);
      if (onComplete) onComplete();
      return;
    }

    const startTime = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - startTime) / durationMs);
      // Mjuk easeInOutCubic-kurva ("i måttligt tempo")
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      window.scrollTo(0, Math.round(startY + diff * ease));
      if (t < 1) {
        this._scrollAnimId = requestAnimationFrame(step);
      } else {
        this._scrollAnimId = null;
        if (onComplete) onComplete();
      }
    };
    this._scrollAnimId = requestAnimationFrame(step);
  }

  scrollToWeekTimeline(durationMs = 680, onComplete = null) {
    if (this.headless || typeof window === "undefined") {
      if (onComplete) onComplete();
      return;
    }
    const timelineEl = document.getElementById("week-timeline");
    if (!timelineEl) {
      if (onComplete) onComplete();
      return;
    }
    const rect = timelineEl.getBoundingClientRect();
    const targetY = (window.scrollY || window.pageYOffset || 0) + rect.top - 6;
    this.smoothScrollToY(targetY, durationMs, onComplete);
  }

  captureStatsSnapshot() {
    return {
      phase: this.phase,
      energy: this.energy,
      spirit: this.spirit,
      relation: this.relation,
      logos: this.stats.logos,
      kairos: this.stats.kairos,
      pathos: this.stats.pathos,
      rhetoric: this.stats.rhetoric,
      draftProgress: this.process.draftProgress,
      hearts: { ...this.parishionerHearts }
    };
  }

  setStatValueInDOM(snap) {
    if (this.headless || !snap) return;
    const setBarAndNum = (barId, valId, val, isMeter = false) => {
      const bar = document.getElementById(barId);
      const numEl = document.getElementById(valId);
      const clamped = this.clamp(Math.round(val), 0, 100);
      if (bar) bar.style.width = `${clamped}%`;
      if (numEl) {
        if (isMeter) {
          numEl.innerHTML = `<span class="v-num">${clamped}</span><span class="v-max">/100</span>`;
        } else {
          numEl.textContent = String(clamped);
        }
      }
    };

    setBarAndNum("meter-energy-bar", "meter-energy-val", snap.energy, true);
    setBarAndNum("meter-spirit-bar", "meter-spirit-val", snap.spirit, true);
    setBarAndNum("meter-relation-bar", "meter-relation-val", snap.relation, true);

    ["logos", "kairos", "pathos", "rhetoric"].forEach((k) => {
      setBarAndNum(`pillar-bar-${k}`, `pillar-val-${k}`, snap[k], false);
      setBarAndNum(`mob-pillar-bar-${k}`, `mob-pillar-val-${k}`, snap[k], false);
    });

    if (snap.hearts) {
      Object.keys(snap.hearts).forEach((pid) => {
        setBarAndNum(`pew-bar-${pid}`, `pew-heart-val-${pid}`, snap.hearts[pid], false);
      });
    }
  }

  runPostActionChoreography(prevSnap, onDone = null) {
    if (this.headless || !prevSnap) {
      if (onDone) onDone();
      return;
    }

    const newSnap = this.captureStatsSnapshot();
    // Sätt först DOM-siffror och staplar till föregående värden medan vi scrollar upp till veckodagspanelen
    this.setStatValueInDOM(prevSnap);

    this.scrollToWeekTimeline(560, () => {
      this.animateStatsTransition(prevSnap, newSnap, onDone);
    });
  }

  animateStatsTransition(prevSnap, newSnap, onDone = null) {
    if (this.headless || typeof window === "undefined") {
      if (onDone) onDone();
      return;
    }
    if (this._statAnimId) {
      cancelAnimationFrame(this._statAnimId);
      this._statAnimId = null;
    }

    // Samla alla mätare/pelare som har ändrats och tänd upp deras boxar + delta-badges
    const highlightTargets = [];
    const registerChange = (boxIds, oldVal, newVal) => {
      const delta = Math.round(newVal - oldVal);
      if (delta === 0) return;
      const cls = delta > 0 ? "stat-changed-up" : "stat-changed-down";
      const badgeTxt = delta > 0 ? `+${delta}` : `${delta}`;

      boxIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.remove("stat-changed-up", "stat-changed-down");
        void el.offsetWidth;
        el.classList.add(cls);

        let badge = el.querySelector(".stat-delta-badge");
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "stat-delta-badge";
          el.appendChild(badge);
        }
        badge.textContent = badgeTxt;
        badge.className = `stat-delta-badge ${delta > 0 ? "delta-up" : "delta-down"}`;
        highlightTargets.push({ el, badge });
      });
    };

    registerChange(["meter-energy-box"], prevSnap.energy, newSnap.energy);
    registerChange(["meter-spirit-box"], prevSnap.spirit, newSnap.spirit);
    registerChange(["meter-relation-box"], prevSnap.relation, newSnap.relation);

    ["logos", "kairos", "pathos", "rhetoric"].forEach((k) => {
      registerChange([`pillar-row-${k}`, `mob-pillar-box-${k}`], prevSnap[k], newSnap[k]);
    });

    if (newSnap.phase === "sunday_delivery" && prevSnap.hearts && newSnap.hearts) {
      Object.keys(newSnap.hearts).forEach((pid) => {
        registerChange([`pew-card-${pid}`], prevSnap.hearts[pid] || 35, newSnap.hearts[pid] || 35);
      });
    }

    // Lys även upp hela statspanelen mjukt
    const panelEls = [
      document.querySelector(".pastor-meters"),
      document.getElementById("mobile-desk-hud"),
      document.getElementById("homiletic-pillars"),
      newSnap.phase === "sunday_delivery" ? document.getElementById("pews-grid") : null
    ].filter(Boolean);

    panelEls.forEach((p) => {
      p.classList.remove("stats-panel-pulse");
      void p.offsetWidth;
      p.classList.add("stats-panel-pulse");
    });

    const duration = 680;
    const startTime = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic

      const interp = {
        energy: prevSnap.energy + (newSnap.energy - prevSnap.energy) * ease,
        spirit: prevSnap.spirit + (newSnap.spirit - prevSnap.spirit) * ease,
        relation: prevSnap.relation + (newSnap.relation - prevSnap.relation) * ease,
        logos: prevSnap.logos + (newSnap.logos - prevSnap.logos) * ease,
        kairos: prevSnap.kairos + (newSnap.kairos - prevSnap.kairos) * ease,
        pathos: prevSnap.pathos + (newSnap.pathos - prevSnap.pathos) * ease,
        rhetoric: prevSnap.rhetoric + (newSnap.rhetoric - prevSnap.rhetoric) * ease,
        hearts: {}
      };

      if (newSnap.hearts && prevSnap.hearts) {
        Object.keys(newSnap.hearts).forEach((pid) => {
          const o = prevSnap.hearts[pid] || 35;
          const n = newSnap.hearts[pid] || 35;
          interp.hearts[pid] = o + (n - o) * ease;
        });
      }

      this.setStatValueInDOM(interp);

      if (t < 1) {
        this._statAnimId = requestAnimationFrame(tick);
      } else {
        this._statAnimId = null;
        this.setStatValueInDOM(newSnap);
        setTimeout(() => {
          highlightTargets.forEach(({ el, badge }) => {
            el.classList.remove("stat-changed-up", "stat-changed-down");
            if (badge) badge.remove();
          });
          panelEls.forEach((p) => p.classList.remove("stats-panel-pulse"));
        }, 900);
        if (onDone) {
          setTimeout(onDone, 240);
        }
      }
    };

    this._statAnimId = requestAnimationFrame(tick);
  }

  // ==========================================================================
  // HJÄLPFUNKTIONER & UI-RENDERING
  // ==========================================================================
  clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  toggleDoNotDisturb() {
    this.doNotDisturb = !this.doNotDisturb;
    if (!this.headless) this.renderAll(false);
  }

  selectSermonForm(formId) {
    this.selectedForm = formId;
    if (!this.headless) this.renderAll(false);
  }

  showToast(message, type = "info") {
    if (this.headless) return;
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = message.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  // ==========================================================================
  // HUVUDRENDERING AV DOM
  // ==========================================================================
  renderAll(animateTiles = false) {
    if (!this.headless) {
      this.renderHeader();
      this.renderTimeline();
      this.renderMapAndActivities(animateTiles);
      this.renderSermonDesk();
      this.renderDisruptionModal();
      this.renderMainPhaseView();
      this.renderTutorial();
    }
  }

  renderHeader() {
    const tr = this.t();
    const day = this.getCurrentDay();
    const slot = this.getCurrentSlot();

    document.getElementById("sunday-badge-title").textContent = this.sunday.title;
    document.getElementById("sunday-badge-ref").textContent = this.sunday.scriptureRef;
    document.getElementById("sunday-badge").style.borderColor = this.sunday.colorHex;

    if (this.phase === "prep") {
      document.getElementById("current-time-display").innerHTML = `${slot.icon} <strong>${day.name} ${slot.name}</strong> <span class="muted"><span class="time-range-full">(${slot.time}) · </span>${tr.passWord} ${this.turnNumber}/${this.maxTurns}</span>`;
    } else if (this.phase === "sunday_delivery") {
      document.getElementById("current-time-display").innerHTML = `${tr.sundayServiceTime} <span class="muted">(${tr.sundayActOf} ${this.sundayActIndex + 1}/4)</span>`;
    } else {
      document.getElementById("current-time-display").innerHTML = tr.sundayCoffeeTime;
    }

    this.updateMeter("meter-energy", this.energy);
    this.updateMeter("meter-spirit", this.spirit);
    this.updateMeter("meter-relation", this.relation);

    const echoEl = document.getElementById("echo-status-pill");
    if (this.process.exegesisDone) {
      echoEl.className = "status-pill echo-active";
      echoEl.innerHTML = this.showHints ? tr.echoActiveHint(this.process.incubationTurns) : tr.echoActive;
    } else {
      echoEl.className = "status-pill echo-inactive";
      echoEl.innerHTML = this.showHints ? tr.echoInactiveHint : tr.echoInactive;
    }

    const dndBtn = document.getElementById("btn-dnd");
    if (dndBtn) {
      dndBtn.className = this.doNotDisturb ? "btn-utility dnd-on" : "btn-utility";
      dndBtn.innerHTML = this.doNotDisturb ? tr.dndOn : tr.dndOff;
    }
  }

  updateMeter(idPrefix, val) {
    const bar = document.getElementById(`${idPrefix}-bar`);
    const label = document.getElementById(`${idPrefix}-val`);
    if (bar) bar.style.width = `${this.clamp(val, 0, 100)}%`;
    if (label) label.innerHTML = `<span class="v-num">${val}</span><span class="v-max">/100</span>`;
  }

  renderTimeline() {
    const container = document.getElementById("week-timeline");
    if (!container) return;
    const tr = this.t();
    const daysList = this.getDaysList();
    const slotsList = this.getSlotsList();

    let html = "";
    daysList.forEach((d, dIdx) => {
      const isCurrentDay = this.phase === "prep" && dIdx === this.dayIndex;
      const isPastDay = this.phase !== "prep" || dIdx < this.dayIndex;
      const shortName = d.name.slice(0, 3);
      html += `<div class="timeline-day ${isCurrentDay ? "day-current" : ""} ${isPastDay ? "day-past" : ""}">
        <div class="timeline-day-name"><span class="day-full">${d.name}</span><span class="day-short">${shortName}</span></div>
        <div class="timeline-slots">`;

      slotsList.forEach((s, sIdx) => {
        const turnNum = dIdx * 3 + sIdx + 1;
        let slotClass = "slot-dot";
        if (this.phase !== "prep" || turnNum < this.turnNumber) slotClass += " slot-done";
        else if (this.phase === "prep" && turnNum === this.turnNumber) slotClass += " slot-active";
        html += `<span class="${slotClass}" title="${d.name} ${s.name}"></span>`;
      });

      html += `</div></div>`;
    });

    const sunShort = this.isEn() ? "🔔 Sun" : "🔔 Sön";
    html += `<div class="timeline-day ${this.phase !== "prep" ? "day-current sunday-node-active" : ""}">
      <div class="timeline-day-name"><span class="day-full">${tr.sundayNode}</span><span class="day-short">${sunShort}</span></div>
      <div class="timeline-slots"><span class="slot-dot ${this.phase === "sunday_summary" ? "slot-done" : this.phase === "sunday_delivery" ? "slot-active" : ""}"></span></div>
    </div>`;

    container.innerHTML = html;
  }

  renderMapAndActivities(animateRoomChange = false) {
    const tr = this.t();
    const thoughtEl = document.getElementById("pastor-thought-bubble");
    if (thoughtEl) {
      thoughtEl.textContent = this.isEn() ? `“${this.pastorThought}”` : `»${this.pastorThought}«`;
    }

    const currentLocObj = this.data.locations.find((l) => l.id === this.currentLocation) || this.data.locations[0];

    const roomIconEl = document.querySelector(".room-banner-icon");
    const roomTitleEl = document.getElementById("current-room-title");
    const roomDescEl = document.getElementById("current-room-desc");
    if (roomIconEl && currentLocObj) roomIconEl.textContent = currentLocObj.icon;
    if (roomTitleEl && currentLocObj) roomTitleEl.textContent = `${currentLocObj.name} — ${currentLocObj.subtitle}`;
    if (roomDescEl && currentLocObj) roomDescEl.textContent = currentLocObj.description;

    const filterContainer = document.getElementById("location-filter-bar");
    if (filterContainer) {
      filterContainer.innerHTML = this.data.locations
        .map((loc) => {
          const active = this.currentLocation === loc.id ? "active" : "";
          return `<button class="loc-chip ${active}" onclick="game.goToLocation('${loc.id}')">${loc.icon} ${loc.name}</button>`;
        })
        .join("");
    }

    const actGrid = document.getElementById("activities-grid");
    const actSectionCard = document.getElementById("activities-section-card");
    if (!actGrid) return;

    const slot = this.getCurrentSlot();
    const roomActivities = this.data.activities.filter((a) => a.locationId === this.currentLocation);

    actGrid.innerHTML = roomActivities
      .map((a, idx) => {
        let costNum = a.energyCost;
        if (slot.isEvening && costNum > 0) costNum += 6;

        const usedCount = this.process.activityCounts[a.id] || 0;
        const countBadge =
          usedCount >= 2 && a.id !== "write_draft" && a.id !== "rest_incubation"
            ? `<span class="diminish-pill" title="${tr.diminishTitle}">${tr.diminishBadge(usedCount)}</span>`
            : usedCount > 0
            ? `<span class="count-pill">${tr.countBadge(usedCount)}</span>`
            : "";

        const costBadge =
          costNum > 0
            ? `<span class="cost-badge cost-drain">${tr.energyDrain(costNum, slot.isEvening)}</span>`
            : `<span class="cost-badge cost-restore">${tr.energyRestore(Math.abs(costNum))}</span>`;

        let recBadge = "";
        if (this.showHints) {
          if (a.id === "exegesis" && !this.process.exegesisDone) {
            recBadge = `<span class="rec-pill">${tr.recStart}</span>`;
          } else if (a.id === "structure_sketch" && this.process.exegesisDone && !this.process.structureDone && this.stats.kairos >= 14 && this.stats.pathos >= 14) {
            recBadge = `<span class="rec-pill">${tr.recBridge}</span>`;
          } else if (a.id === "write_draft" && this.process.structureDone && this.process.draftProgress < 85) {
            recBadge = `<span class="rec-pill">${tr.recWrite}</span>`;
          } else if (a.id === "practice_pulpit" && this.process.draftProgress >= 65 && !this.process.practicedInPulpit) {
            recBadge = `<span class="rec-pill">${tr.recPractice}</span>`;
          } else if (a.id === "rest_incubation" && this.dayIndex === 4 && slot.isEvening && this.process.draftProgress >= 80) {
            recBadge = `<span class="rec-pill">${tr.recRest}</span>`;
          }
        }

        const hintHtml = this.showHints ? `<div class="activity-routine-hint">${a.routineHint}</div>` : "";
        const animStyle = animateRoomChange ? `style="animation-delay: ${idx * 65}ms"` : "";
        const animClass = animateRoomChange ? "tile-room-enter" : "";

        return `
        <div class="activity-card ${animClass}" ${animStyle} onclick="game.performActivity('${a.id}')">
          <div class="activity-card-top">
            <div class="activity-icon-wrap">${a.icon}</div>
            <div class="activity-title-group">
              <div class="activity-loc-tag">${currentLocObj.icon} ${currentLocObj.name} ${recBadge} ${countBadge}</div>
              <h4>${a.title}</h4>
            </div>
            ${costBadge}
          </div>
          <p class="activity-desc">${a.description}</p>
          ${hintHtml}
        </div>
      `;
      })
      .join("");

    if (animateRoomChange && actSectionCard) {
      actSectionCard.classList.remove("room-switch-flash");
      void actSectionCard.offsetWidth;
      actSectionCard.classList.add("room-switch-flash");
    }

    const logEl = document.getElementById("activity-log-list");
    if (logEl) {
      logEl.innerHTML = this.activityLog
        .slice(0, 8)
        .map((item) => {
          const textDetail = item.detail + (this.showHints && item.hintDetail ? " " + item.hintDetail : "");
          return `
        <div class="log-entry log-${item.type}">
          <div class="log-meta">${item.timeLabel}</div>
          <div class="log-title">${item.title}</div>
          <div class="log-detail">${textDetail.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</div>
        </div>
      `;
        })
        .join("");
    }
  }

  renderSermonDesk() {
    const tr = this.t();
    const chEl = document.getElementById("desk-challenge-body");
    if (chEl) {
      chEl.innerHTML = this.showHints
        ? `${this.sunday.contextDescription} <br><br><em>${tr.deskHomileticHint}</em> ${this.sunday.homileticChallenge}`
        : `${this.sunday.contextDescription}`;
    }

    const pillars = [
      { key: "logos", label: tr.pillarLogos, icon: "📜", target: this.sunday.targetProfile.logos },
      { key: "kairos", label: tr.pillarKairos, icon: "📰", target: this.sunday.targetProfile.kairos },
      { key: "pathos", label: tr.pillarPathos, icon: "❤️", target: this.sunday.targetProfile.pathos },
      { key: "rhetoric", label: tr.pillarRhetoric, icon: "🎙️", target: this.sunday.targetProfile.rhetoric }
    ];

    const statsHtml = pillars
      .map((p) => {
        const val = this.stats[p.key];
        const pct = this.clamp(val, 0, 100);
        const reached = val >= p.target;
        const scoreRight = this.showHints
          ? `<span class="pillar-score ${reached ? "target-met" : ""}"><span id="pillar-val-${p.key}">${val}</span> <small>/ ${tr.goalWord} ${p.target}+</small></span>`
          : `<span class="pillar-score"><span id="pillar-val-${p.key}">${val}</span></span>`;
        const markerHtml = this.showHints
          ? `<div class="pillar-target-marker" style="left: ${p.target}%" title="${tr.targetTip}"></div>`
          : "";

        return `
        <div id="pillar-row-${p.key}" class="pillar-row">
          <div class="pillar-label">
            <span>${p.icon} ${p.label}</span>
            ${scoreRight}
          </div>
          <div class="pillar-track">
            <div id="pillar-bar-${p.key}" class="pillar-fill fill-${p.key}" style="width: ${pct}%"></div>
            ${markerHtml}
          </div>
        </div>
      `;
      })
      .join("");
    document.getElementById("homiletic-pillars").innerHTML = statsHtml;

    const checkItems = [
      { done: this.process.exegesisDone, label: tr.chkExegesis },
      { done: this.process.structureDone, label: tr.chkStructure(this.process.structureQuality) },
      { done: this.process.draftProgress >= 80, label: tr.chkDraft(this.process.draftProgress) },
      { done: this.process.polished && this.process.practicedInPulpit, label: tr.chkPolished }
    ];

    document.getElementById("process-checklist").innerHTML = checkItems
      .map(
        (c) =>
          `<div class="proc-step ${c.done ? "proc-done" : ""}">
            <span>${c.done ? "✅" : "⬜"}</span> ${c.label}
          </div>`
      )
      .join("");

    const formSelectEl = document.getElementById("sermon-form-selector");
    if (formSelectEl) {
      formSelectEl.innerHTML = this.data.sermonForms
        .map((f) => {
          const active = this.selectedForm === f.id ? "selected" : "";
          const recTag = this.showHints && f.id === this.sunday.recommendedForm ? `<span class="rec-pill">${tr.recForm}</span>` : "";
          const bonusHtml = this.showHints ? `<div class="form-option-bonus">${f.bonusDescription}</div>` : "";
          return `
          <div class="form-option ${active}" onclick="game.selectSermonForm('${f.id}')">
            <div class="form-option-header">
              <span>${f.icon} <strong>${f.name}</strong> ${recTag}</span>
              <span class="theorist-tag">${f.theorist}</span>
            </div>
            <div class="form-option-desc">${f.description}</div>
            ${bonusHtml}
          </div>
        `;
        })
        .join("");
    }

    const synEl = document.getElementById("synergy-badges-list");
    if (synEl) {
      if (this.unlockedSynergies.length === 0) {
        synEl.innerHTML = this.showHints
          ? `<div class="empty-hint">${tr.emptySynergiesHint}</div>`
          : `<div class="empty-hint">${tr.emptySynergies}</div>`;
      } else {
        synEl.innerHTML = this.unlockedSynergies
          .map(
            (s) => `
          <div class="synergy-badge">
            <div><strong>✨ ${s.title}</strong> <span class="syn-pts">+${s.bonusPoints}p</span></div>
            <div class="syn-desc">${s.description}</div>
          </div>
        `
          )
          .join("");
      }
    }

    const countBadge = document.getElementById("insight-count-badge");
    if (countBadge) countBadge.textContent = this.insightDeck.length;

    const mobCountBadge = document.getElementById("mob-insight-count");
    if (mobCountBadge) mobCountBadge.textContent = this.insightDeck.length;

    // Uppdatera även mobilens kompakta Homiletik-HUD (så man ser 4 pelare + manusstatus utan att scrolla!)
    const mobHudEl = document.getElementById("mobile-desk-hud");
    if (mobHudEl) {
      const miniPillars = pillars
        .map((p) => {
          const val = this.stats[p.key];
          const pct = this.clamp(val, 0, 100);
          return `
            <div id="mob-pillar-box-${p.key}" class="mob-hud-pillar" onclick="game.setMobileTab('desk')">
              <div class="mob-hud-pillar-top"><span>${p.icon}</span><strong id="mob-pillar-val-${p.key}">${val}</strong></div>
              <div class="mob-hud-bar"><div id="mob-pillar-bar-${p.key}" class="pillar-fill fill-${p.key}" style="width:${pct}%"></div></div>
            </div>
          `;
        })
        .join("");

      const miniChecks = [
        { done: this.process.exegesisDone, lbl: tr.hudText },
        { done: this.process.structureDone, lbl: tr.hudOutline },
        { done: this.process.draftProgress >= 80, lbl: tr.hudDraft(this.process.draftProgress) },
        { done: this.process.polished && this.process.practicedInPulpit, lbl: tr.hudPulpit }
      ]
        .map((c) => `<span class="mob-hud-step ${c.done ? "done" : ""}" onclick="game.setMobileTab('desk')">${c.done ? "✅" : "⬜"} ${c.lbl}</span>`)
        .join("");

      mobHudEl.innerHTML = `
        <div class="mob-hud-pillars-row">${miniPillars}</div>
        <div class="mob-hud-steps-row">${miniChecks}</div>
      `;
    }

    const insightsEl = document.getElementById("unlocked-insights-list");
    if (insightsEl) {
      if (this.insightDeck.length === 0) {
        insightsEl.innerHTML = `<div class="empty-hint">${tr.emptyInsights}</div>`;
      } else {
        const catNames = { logos: tr.catLogos, kairos: tr.catKairos, pathos: tr.catPathos };
        insightsEl.innerHTML = this.insightDeck
          .map(
            (card) => `
          <div class="insight-deck-card cat-${card.category}">
            <div class="insight-card-header">
              <strong>${card.title}</strong>
              <span class="insight-cat-pill">${catNames[card.category] || card.category}</span>
            </div>
            <div class="insight-card-quote">${this.isEn() ? `“${card.quote}”` : `»${card.quote}«`}</div>
          </div>
        `
          )
          .join("");
      }
    }
  }

  renderDisruptionModal() {
    const modal = document.getElementById("disruption-modal");
    if (!modal) return;
    if (!this.activeDisruption) {
      modal.classList.add("hidden");
      return;
    }

    const d = this.activeDisruption;
    modal.classList.remove("hidden");
    document.getElementById("disruption-type").textContent = d.type;
    document.getElementById("disruption-title").innerHTML = `${d.icon} ${d.title}`;
    document.getElementById("disruption-desc").textContent = d.description;

    const choicesEl = document.getElementById("disruption-choices");
    choicesEl.innerHTML = d.choices
      .map(
        (c, idx) => `
      <button class="disruption-choice-btn" onclick="game.resolveDisruptionChoice(${idx})">
        <div class="choice-main">${c.label}</div>
        ${this.showHints ? `<div class="choice-effect">${c.effectSummary}</div>` : ""}
      </button>
    `
      )
      .join("");
  }

  renderMainPhaseView() {
    const prepView = document.getElementById("prep-phase-view");
    const sundayView = document.getElementById("sunday-phase-view");
    const summaryView = document.getElementById("summary-phase-view");

    document.body.dataset.phase = this.phase;
    if (!document.body.dataset.mobTab) {
      document.body.dataset.mobTab = this.mobileTab || "map";
    }

    prepView.classList.toggle("hidden", this.phase !== "prep");
    sundayView.classList.toggle("hidden", this.phase !== "sunday_delivery");
    summaryView.classList.toggle("hidden", this.phase !== "sunday_summary");

    if (this.phase === "sunday_delivery") {
      this.renderSundayDeliveryView();
    } else if (this.phase === "sunday_summary") {
      this.renderSundaySummaryView();
    }
  }

  renderSundayDeliveryView() {
    const tr = this.t();
    const act = this.data.sermonSections[this.sundayActIndex];
    const options = this.getSundayActOptions(this.sundayActIndex);

    document.getElementById("pulpit-sunday-title").textContent = `${this.sunday.title} · ${this.sunday.scriptureRef}`;
    document.getElementById("pulpit-scripture-quote").textContent = this.sunday.scriptureQuote;
    document.getElementById("pulpit-act-heading").textContent = act.title;
    document.getElementById("pulpit-act-subtitle").textContent = this.showHints
      ? act.subtitle + tr.pulpitSubtitleTip
      : act.subtitle;

    const pewsEl = document.getElementById("pews-grid");
    pewsEl.innerHTML = this.data.parishioners
      .map((p) => {
        const heart = this.parishionerHearts[p.id] || 35;
        let mood = tr.moodWaiting;
        if (heart >= 80) mood = tr.moodMoved;
        else if (heart >= 60) mood = tr.moodNodding;
        else if (heart < 35) mood = tr.moodRestless;
        return `
        <div id="pew-card-${p.id}" class="pew-card">
          <div class="pew-avatar">${p.avatar}</div>
          <div class="pew-info">
            <div class="pew-name">${p.name} <small class="muted">(<span id="pew-heart-val-${p.id}">${heart}</span>%)</small></div>
            <div class="pew-role">${p.role}</div>
            <div class="pew-mood">${mood}</div>
            <div class="pew-bar-wrap">
              <div id="pew-bar-${p.id}" class="pew-bar-fill" style="width: ${heart}%"></div>
            </div>
          </div>
        </div>
      `;
      })
      .join("");

    const optsEl = document.getElementById("pulpit-options-list");
    optsEl.innerHTML = options
      .map(
        (o, idx) => `
      <button class="pulpit-choice-card" onclick="game.chooseSundayActOption(${idx})">
        <div class="pulpit-choice-top">
          <strong>${o.title}</strong>
          <span class="pulpit-badge">${o.badge}</span>
        </div>
        <div class="pulpit-choice-sub">${o.subtitle}</div>
      </button>
    `
      )
      .join("");

    const historyEl = document.getElementById("pulpit-act-history");
    historyEl.innerHTML = this.sundayActChoices
      .map(
        (c) => `
      <div class="delivered-act-item">
        <strong>${c.actTitle}:</strong> ${c.narrative.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}
      </div>
    `
      )
      .join("");
  }

  renderSundaySummaryView() {
    const ev = this.evaluation;
    if (!ev) return;
    const tr = this.t();

    document.getElementById("eval-score-number").textContent = ev.totalScore;
    document.getElementById("eval-rank-title").textContent = ev.rankTitle;
    document.getElementById("eval-rank-subtitle").textContent = ev.rankSubtitle;

    // Uppdatera delningslänkarna (exakt enligt mönstret i nt2026-eller-nt1981)
    const { title, url, text } = this.getShareInfo();
    const enc = encodeURIComponent;
    const shFb = document.getElementById("sh-fb");
    const shX = document.getElementById("sh-x");
    const shWa = document.getElementById("sh-wa");
    const shLi = document.getElementById("sh-li");
    const shMail = document.getElementById("sh-mail");
    const shNative = document.getElementById("btn-share-native");
    const copiedMsg = document.getElementById("share-copied-msg");

    if (shFb) shFb.href = "https://www.facebook.com/sharer/sharer.php?u=" + enc(url);
    if (shX) shX.href = "https://twitter.com/intent/tweet?text=" + enc(text) + "&url=" + enc(url);
    if (shWa) shWa.href = "https://wa.me/?text=" + enc(text + " " + url);
    if (shLi) shLi.href = "https://www.linkedin.com/sharing/share-offsite/?url=" + enc(url);
    if (shMail) shMail.href = "mailto:?subject=" + enc(title) + "&body=" + enc(text + "\n\n" + url);
    if (shNative) shNative.classList.toggle("hidden", !navigator.share);
    if (copiedMsg) copiedMsg.textContent = "";

    document.getElementById("eval-routine-list").innerHTML = ev.routineFeedback
      .map((item) => `<li class="routine-feedback-item">${item.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</li>`)
      .join("");

    document.getElementById("eval-coffee-grid").innerHTML = ev.coffeeQuotes
      .map(
        (q) => `
      <div class="coffee-quote-card coffee-tone-${q.tone}">
        <div class="coffee-header">
          <span class="coffee-avatar">${q.avatar}</span>
          <div>
            <strong>${q.name}</strong>
            <div class="muted">${q.role} · ${tr.impactWord}: ${q.heart}/100</div>
          </div>
        </div>
        <p class="coffee-text">${q.comment}</p>
      </div>
    `
      )
      .join("");
  }
}

// ============================================================================
// INITIERING VID SIDLADDNING (WEBBLÄSARE) & EXPORT FÖR NODE (HEADLESS)
// ============================================================================
if (typeof window !== "undefined" && typeof document !== "undefined") {
  window.SermonGame = SermonGame;
  window.addEventListener("DOMContentLoaded", () => {
    window.game = new SermonGame();

    if (window.ParishScene3D) {
      window.game.scene3d = new window.ParishScene3D(
        "parish-scene3d",
        "scene3d-labels",
        (locId) => window.game.goToLocation(locId)
      );
      window.game.scene3d.moveToLocation("study", true);
    }

    const sundaySelect = document.getElementById("scenario-select");
    if (sundaySelect) {
      window.game.populateSundaySelect();
      sundaySelect.addEventListener("change", (e) => {
        window.game.startNewGame(e.target.value);
      });
    }

    window.game.renderStaticTranslations();
    window.game.setMobileTab("map");
    window.game.renderAll(false);
    window.game.checkSharedResultFromUrl();
    window.game.checkInitialTutorial();
    if (!window.game.sharedData) {
      setTimeout(() => window.game.scrollToWeekTimeline(750), 220);
    }
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { SermonGame, DAYS, SLOTS };
}
