// ============================================================================
// PREDIKOVERKSTADEN – Homiletisk & Praktisk-teologisk Speldata
// ============================================================================

const GAME_DATA = {
  // --------------------------------------------------------------------------
  // 1. KYRKOÅRETS SÖNDAGAR (Scenarier)
  // --------------------------------------------------------------------------
  sundays: [
    {
      id: "septuagesima",
      title: "Septuagesima – Nåd och tjänst",
      liturgicalColor: "violet",
      colorHex: "#6b3fa0",
      scriptureRef: "Matt 20:1–16 (Arbetarna i vingården)",
      scriptureQuote: "»Så skall de sista bli först och de första sist.«",
      contextDescription:
        "En högpresterande församling där många är utmattade av karriär och ideellt slit, samtidigt som trogna kyrkvärdar i hemlighet muttrar över att nykomlingar får uppmärksamhet direkt.",
      homileticChallenge:
        "Texten provocerar vår djupaste rättvisekänsla. Utan grundlig exeges och själavårdande blick riskerar predikan att antingen bli platt moralism ('jobba mer i Guds rike!') eller billig tröst som inte tar människors trötthet på allvar.",
      targetProfile: {
        logos: 34,
        kairos: 28,
        pathos: 36,
        rhetoric: 30
      },
      recommendedForm: "narrative",
      specificInsights: {
        exegesis: [
          {
            id: "sep_ex_1",
            title: "Denarens verkliga värde",
            category: "logos",
            power: 14,
            quote: "En denar var inte en prestationsbonus – det var exakt vad en familj behövde för att överleva dagen. Vingårdsherren ger inte lön efter merit, utan liv efter behov.",
            description: "Historisk-kritisk nyckel som förskjuter fokus från facklig lönestrid till Guds radikala omsorg."
          },
          {
            id: "sep_ex_2",
            title: "Det onda ögat (ὁ ὀφθαλμός σου πονηρός)",
            category: "logos",
            power: 12,
            quote: "I grundtexten frågar vingårdsherren: 'Är ditt öga ont för att jag är god?' Avundsjukan gör oss blinda för att vi själva lever av samma gåva.",
            description: "Språklig detalj i grekiskan som avslöjar självrättfärdighetens mekanism."
          }
        ],
        contemporary: [
          {
            id: "sep_ka_1",
            title: "Utmattningssamhällets meritokrati",
            category: "kairos",
            power: 13,
            quote: "På kultursidorna skriver en sociolog om hur vi mäter vårt människovärde i stegräknare, CV-rader och produktivitet – ända in i kyrkbänken.",
            description: "Kulturell diagnos som gör vingårdens timräknande brännande aktuellt."
          },
          {
            id: "sep_ka_2",
            title: "De som står kvar på torget kl. 17",
            category: "kairos",
            power: 11,
            quote: "Arbetsförmedlingens statistik i lokaltidningen: känslan av att ingen efterfrågar ens kraft eller ens livserfarenhet.",
            description: "Samhällsanalys som ger röst åt elfte timmens arbetare."
          }
        ],
        pastoral: [
          {
            id: "sep_pa_1",
            title: "Kyrkvärden Margaretas trötthet",
            category: "pathos",
            power: 14,
            quote: "Under samtalet i sakristian brast det för Margareta: 'Jag har burit den här församlingen i trettio år, och ibland undrar jag om Gud ens ser mig.'",
            description: "Levd församlingsverklighet som gör att du kan tala med ömhet till 'första timmens arbetare' utan att döma dem."
          },
          {
            id: "sep_pa_2",
            title: "Konfirmandens fråga om att duga",
            category: "pathos",
            power: 12,
            quote: "Liam, 14, stannade kvar efter träffen: 'Måste man ha trott hela livet för att räknas i kyrkan?'",
            description: "Ett konkret ansikte på elfte timmens nåd."
          }
        ]
      }
    },
    {
      id: "advent1",
      title: "Första söndagen i advent – Nådens år",
      liturgicalColor: "white",
      colorHex: "#d99b26",
      scriptureRef: "Matt 21:1–9 (Intåget i Jerusalem)",
      scriptureQuote: "»Se, din kung kommer till dig, ödmjuk och ridande på en åsna.«",
      contextDescription:
        "Kyrkan kommer att vara knökfull av både vana gudstjänstbesökare och sekulariserade familjer som kommit för körsången, trumpeterna och julstämningen.",
      homileticChallenge:
        "Faran är 'mys-advent' – att bara leverera glittrig nostalgi – eller tvärtom att skälla på besökarna för att de bara går i kyrkan vid jul. Hur förkunnar du kungens ödmjuka makt så att både kyrkovana och ovana berörs på djupet?",
      targetProfile: {
        logos: 30,
        kairos: 34,
        pathos: 30,
        rhetoric: 36
      },
      recommendedForm: "contrast",
      specificInsights: {
        exegesis: [
          {
            id: "adv_ex_1",
            title: "Åsnan mot stridshästen (Sak 9:9)",
            category: "logos",
            power: 14,
            quote: "När romerska ståthållare red in i Jerusalem kom de på stridshästar med lansar. Jesus iscensätter profeten Sakarjas fredsparodi på imperiets makt.",
            description: "Historisk kontrast som väcker även den mest sömniga adventsbesökare."
          },
          {
            id: "adv_ex_2",
            title: "Hosianna – ett nödrop, inte bara jubel",
            category: "logos",
            power: 12,
            quote: "Hebreiskans 'Hoshia-na' betyder bokstavligen 'Rädda oss nu!'. Det är inte ett artigt hurrarop, utan ett förtvivlat hopp.",
            description: "Ger djup åt en sliten liturgisk fras."
          }
        ],
        contemporary: [
          {
            id: "adv_ka_1",
            title: "Kontrollbehov och starka ledare",
            category: "kairos",
            power: 13,
            quote: "I en värld där stormakter rustar och ledare tävlar i styrkedemonstrationer framstår en sårbar kung på en lånad åsna som antingen dårskap eller vår enda räddning.",
            description: "Knyter adventsberättelsen till vår tids geopolitiska oro."
          },
          {
            id: "adv_ka_2",
            title: "Decemberstressens fasad",
            category: "kairos",
            power: 12,
            quote: "Bakom de putsade adventsljusstakarna i fönstren bär så många familjer på oro för ekonomi, ensamhet och spruckna relationer.",
            description: "Öppnar dörren för dem som kommit till kyrkan med en klump i magen."
          }
        ],
        pastoral: [
          {
            id: "adv_pa_1",
            title: "Den frånskilda pappan på bänkrad sju",
            category: "pathos",
            power: 14,
            quote: "På bussen mötte du Anders som ska fira varannan-vecka-advent utan sina barn för första gången: 'Jag går nog till kyrkan på söndag bara för att slippa tystnaden i lägenheten.'",
            description: "Påminner dig om vem som faktiskt sitter i bänken när trumpeten tystnat."
          },
          {
            id: "adv_pa_2",
            title: "Körsångarens längtan efter verklighet",
            category: "pathos",
            power: 11,
            quote: "Efter körrepetitionen sa sopranen Karin: 'Vi sjunger Hosianna så taket lyfter, men hjälp oss på söndag att förstå vad det betyder på måndag morgon.'",
            description: "Förankrar predikan i vardagens efterföljelse."
          }
        ]
      }
    },
    {
      id: "tacksagelse",
      title: "Tacksägelsedagen – Lovsång i skuggan",
      liturgicalColor: "white",
      colorHex: "#2e7d5b",
      scriptureRef: "Fil 4:4–9 (Gläd er alltid i Herren)",
      scriptureQuote: "»Gläd er i Herren alltid. Åter säger jag: gläd er!«",
      contextDescription:
        "Kyrkan är smyckad med höstfrukter och skördegåvor, men i måndags meddelade ortens största arbetsgivare att 140 personer varslas. Oro och bitterhet hänger i luften.",
      homileticChallenge:
        "Hur predikar man om tacksägelse och glädje när bygden blöder? En klämkäck 'tänk positivt'-predikan kommer att upplevas som ett hån. Nyckeln ligger i att Paulus skriver sitt glädjebrev från en fängelsecell.",
      targetProfile: {
        logos: 30,
        kairos: 34,
        pathos: 38,
        rhetoric: 28
      },
      recommendedForm: "pastoral",
      specificInsights: {
        exegesis: [
          {
            id: "tack_ex_1",
            title: "Brev från en romersk fängelsehåla",
            category: "logos",
            power: 14,
            quote: "Paulus skriver inte 'Gläd er!' från en solig semesterort, utan i bojor med oviss dom. Glädjen i Filipperbrevet är trotsig motståndskraft, inte ytlig optimism.",
            description: "Räddar bibeltexten från banal lyckokultur."
          },
          {
            id: "tack_ex_2",
            title: "Guds frid som en garnison (φρουρήσει)",
            category: "logos",
            power: 12,
            quote: "Ordet för 'bevara' era hjärtan är en militär term: Guds frid står på vakt vid tankarnas port när ångesten belägrar sinnet.",
            description: "Ger konkret substans åt löftet om Guds frid."
          }
        ],
        contemporary: [
          {
            id: "tack_ka_1",
            title: "Varslet på fabriken och framtidstron",
            category: "kairos",
            power: 15,
            quote: "Lokaltidningens förstasida visar tysta arbetare utanför fabriksgrindarna. När tryggheten rycks undan avslöjas vad vårt hopp egentligen vilar på.",
            description: "Vågar nämna elefanten i rummet rakt och solidariskt."
          },
          {
            id: "tack_ka_2",
            title: "Tacksamhetsindustrins tyranni",
            category: "kairos",
            power: 11,
            quote: "Självhjälpsböckernas krav på att alltid 'känna tacksamhet' lägger skuld på den som sörjer. Kristen tacksägelse rymmer också klagan.",
            description: "Befriar åhörarna från påklistrade leenden."
          }
        ],
        pastoral: [
          {
            id: "tack_pa_1",
            title: "Samtalet vid kaffebordet med en varslad",
            category: "pathos",
            power: 15,
            quote: "Mekanikern Stefan såg ner i kaffekoppen: 'Jag skäms för att gå ut på byn. Alla frågar hur det går.' Men när ni delade brödet fann han ett rum där han inte var sin lönespecifikation.",
            description: "Ger predikan en omedelbar mänsklig värme och solidaritet."
          },
          {
            id: "tack_pa_2",
            title: "Änkans burk med äppelmos till skördealtaret",
            category: "pathos",
            power: 12,
            quote: "Agda, 82, kom med en enda glasburk hemgjort äppelmos: 'Det är inte mycket, men händerna fungerar ännu.'",
            description: "En lågmäld bild av trotsig tacksamhet mitt i livets begränsning."
          }
        ]
      }
    },
    {
      id: "domsondagen",
      title: "Domsöndagen – Kristi återkomst",
      liturgicalColor: "green",
      colorHex: "#2d5a3c",
      scriptureRef: "Matt 25:31–46 (Människosonens dom)",
      scriptureQuote: "»Vad ni har gjort för någon av dessa minsta som är mina bröder, det har ni gjort för mig.«",
      contextDescription:
        "Kyrkoårets sista söndag. Mörk novemberdimma utanför fönstren. Ordet 'Dom' väcker antingen gammal religiös skräck hos de äldre eller total likgiltighet hos de yngre.",
      homileticChallenge:
        "Om du bara predikar lag ('Ni måste hjälpa fler fattiga annars går det illa!') krossar du de redan samvetsömma. Om du viftar bort domen förlorar ondskan och orättvisorna i världen sitt allvar.",
      targetProfile: {
        logos: 36,
        kairos: 34,
        pathos: 30,
        rhetoric: 30
      },
      recommendedForm: "prophetic",
      specificInsights: {
        exegesis: [
          {
            id: "dom_ex_1",
            title: "De rättfärdigas egen förvåning",
            category: "logos",
            power: 15,
            quote: "Lägg märke till att fåren är precis lika förvånade som getterna: 'Herre, när såg vi dig hungrig?' De räknade inte godhetspoäng för himlen – kärleken var omedveten och fri.",
            description: "Genombryter all religiös prestationsångest i texten."
          },
          {
            id: "dom_ex_2",
            title: "Domaren som själv bär såren",
            category: "logos",
            power: 13,
            quote: "Den som sitter på härlighetens tron i Matt 25 är samma Jesus som två kapitel senare själv blir utblottad, törstig, fängslad och korsfäst.",
            description: "Kristologisk nyckel som förenar dom och evangelium."
          }
        ],
        contemporary: [
          {
            id: "dom_ka_1",
            title: "Längtan efter att sanningen ska segra",
            category: "kairos",
            power: 13,
            quote: "I en värld av krigsbrott, desinformation och övergrepp som aldrig ställs till svars är Guds yttersta dom inte ett hot – utan löftet att ondskan inte får sista ordet.",
            description: "Förklarar varför domstanken är ett hoppets budskap för de maktlösa."
          },
          {
            id: "dom_ka_2",
            title: "Blicken som glider förbi tiggaren",
            category: "kairos",
            power: 12,
            quote: "I vår digitaliserade stad kan vi brusreducera bort verkligheten med hörlurar och skärmar. Synd är här inte aktiv elakhet, utan att inte se.",
            description: "Träffsäker vardagsanalys."
          }
        ],
        pastoral: [
          {
            id: "dom_pa_1",
            title: "Nattjouren på härbärget",
            category: "pathos",
            power: 14,
            quote: "Diakonen visade dig muggarna med varm soppa: 'Här diskuterar vi inte teologi om Kristi närvaro – vi ser honom i den frusne mannen vid dörren.'",
            description: "Ger predikan diakonal trovärdighet (Ethos)."
          },
          {
            id: "dom_pa_2",
            title: "Den gamles ångest inför döden",
            category: "pathos",
            power: 13,
            quote: "Vid sjuksängen viskade Bengt: 'Tänk om mitt liv inte räckte till?' Du fick peka på att Domaren är samma Herde som burit honom.",
            description: "Djup själavårdande förankring."
          }
        ]
      }
    }
  ],

  // --------------------------------------------------------------------------
  // 2. PLATSER PÅ KARTAN (6 noder där pastorn rör sig)
  // --------------------------------------------------------------------------
  locations: [
    {
      id: "study",
      name: "Arbetsrummet",
      subtitle: "Skrivbordet & Bokhyllan",
      icon: "📖",
      x: 22,
      y: 28,
      description: "Ditt arbetsrum på pastorsexpeditionen. Här trängs grekiska lexikon, bibelkommentarer, kaffekoppar och ditt halvfärdiga manus."
    },
    {
      id: "sanctuary",
      name: "Kyrkorummet",
      subtitle: "Altaret & Predikstolen",
      icon: "🕯️",
      x: 52,
      y: 18,
      description: "Det tysta kyrkorummet. Vid altaret kan du be och stilla dig; i predikstolen kan du prova hur orden faktiskt låter i rummet."
    },
    {
      id: "parish_hall",
      name: "Församlingshemmet",
      subtitle: "Kyrkkaffe & Grupper",
      icon: "☕",
      x: 78,
      y: 32,
      description: "Här luktar det alltid nybryggt kaffe. Pensionärer, konfirmander, körsångare och ideella möts i vardagens glädje och bekymmer."
    },
    {
      id: "town_square",
      name: "Torget & Biblioteket",
      subtitle: "Tidningar & Samtidspuls",
      icon: "📰",
      x: 24,
      y: 72,
      description: "Stadens puls. På bibliotekets läsesal och caféet vid torget läser du dagstidningar, kulturdebatt och lyssnar på människors samtal."
    },
    {
      id: "pastoral_care",
      name: "Själavård & Besök",
      subtitle: "Hembesök & Sjukhus",
      icon: "🏥",
      x: 56,
      y: 76,
      description: "Där livet ställs på sin spets. Vid köksbord och sjuksängar möter du människors sårbarhet, tvivel och djupaste livsfrågor."
    },
    {
      id: "parsonage",
      name: "Prästgården",
      subtitle: "Vila, Promenad & Inkubation",
      icon: "🏠",
      x: 82,
      y: 70,
      description: "Hemmet och skogsstigen bakom knuten. Här återhämtar du skärpan – och låter predikotexten mogna i det undermedvetna."
    }
  ],

  // --------------------------------------------------------------------------
  // 3. AKTIVITETER (Vad predikanten kan ägna ett arbetspass åt)
  // --------------------------------------------------------------------------
  activities: [
    // --- ARBETSRUMMET ---
    {
      id: "exegesis",
      title: "Närläsa bibeltexten & grundtext",
      locationId: "study",
      icon: "📜",
      category: "logos",
      energyCost: 14,
      baseGains: { logos: 11, kairos: 0, pathos: 0, rhetoric: 1, spirit: 2 },
      bestPhase: "early", // Tisdag–Onsdag ger inkubationsbonus!
      description:
        "Brottas med söndagens perikop, kontext och nyckelord. Görs detta tidigt i veckan aktiveras »Textens eko« som berikar alla senare möten!",
      routineHint: "🌟 Bäst Tisdag–Onsdag: Sår fröet som låter texten ligga och gro hela veckan."
    },
    {
      id: "theology_study",
      title: "Studera kommentarer & dogmatik",
      locationId: "study",
      icon: "📚",
      category: "logos",
      energyCost: 16,
      baseGains: { logos: 13, kairos: 1, pathos: 0, rhetoric: 2, spirit: 0 },
      bestPhase: "early_mid",
      description:
        "Fördjupa dig i kyrkofäder, moderna bibelkommentarer och systematisk teologi för att undvika platta klyschor och villospår.",
      routineHint: "🔍 Ger störst utdelning när du redan läst själva bibeltexten minst en gång."
    },
    {
      id: "structure_sketch",
      title: "Skissa struktur & homiletisk idé",
      locationId: "study",
      icon: "🧭",
      category: "structure",
      energyCost: 12,
      baseGains: { logos: 2, kairos: 2, pathos: 2, rhetoric: 6, spirit: 0 },
      bestPhase: "mid",
      description:
        "Formulera predikans »röda tråd« (fokus och funktion) och bygg broar mellan bibeltexten och människornas liv.",
      routineHint: "🌉 Kräver helst både Exegetik (Logos) och Samtid/Själavård (Kairos/Pathos) för att bli en stark bro!"
    },
    {
      id: "write_draft",
      title: "Skriva predikomanus",
      locationId: "study",
      icon: "✍️",
      category: "writing",
      energyCost: 18,
      baseGains: { logos: 1, kairos: 1, pathos: 1, rhetoric: 6, spirit: 0 },
      bestPhase: "mid_late",
      description:
        "Fäst tankarna i konkret, talad svenska. Omvandlar dina insamlade insikter och din struktur till ett sammanhängande predikoutkast.",
      routineHint: "⚠️ Skriv inte för tidigt utan råmaterial och struktur – då blir det tomma ord!"
    },
    {
      id: "polish_rhetoric",
      title: "Fila på retorik & bildspråk",
      locationId: "study",
      icon: "✒️",
      category: "rhetoric",
      energyCost: 12,
      baseGains: { logos: 0, kairos: 1, pathos: 1, rhetoric: 12, spirit: 0 },
      bestPhase: "late",
      description:
        "Stryk teologisk jargong ('Kanaans språk'), skärp metaforerna, rytmisera meningarna och skapa en minnesvärd öppning och landning.",
      routineHint: "✨ Kräver att ett utkast redan är påbörjat för att ge full effekt."
    },

    // --- KYRKORUMMET ---
    {
      id: "prayer_silence",
      title: "Bön, bibelmeditation & tystnad",
      locationId: "sanctuary",
      icon: "🕯️",
      category: "spirit",
      energyCost: -8, // Återställer lite energi och ger hög frimodighet!
      baseGains: { logos: 2, kairos: 0, pathos: 3, rhetoric: 0, spirit: 15 },
      bestPhase: "any",
      description:
        "Böj knä vid altaret i Lectio Divina. Förvandlar akademisk kunskap till personligt tilltal och stärker din inre förankring (Ethos).",
      routineHint: "🕊️ Skyddar mot andlig tomhet och gör att bibelstudier landar i hjärtat."
    },
    {
      id: "practice_pulpit",
      title: "Öva framförande i predikstolen",
      locationId: "sanctuary",
      icon: "🎙️",
      category: "rhetoric",
      energyCost: 12,
      baseGains: { logos: 0, kairos: 0, pathos: 2, rhetoric: 12, spirit: 4 },
      bestPhase: "late",
      description:
        "Gå upp i predikstolen och tala högt i det tomma kyrkorummet. Känn in tempot, konstpauserna, betoningarna och frigör dig från pappret.",
      routineHint: "🏛️ Bäst Fredag–Lördag när utkastet finns på plats. Ger stor bonus i söndagens leverans!"
    },

    // --- FÖRSAMLINGSHEMMET ---
    {
      id: "parish_coffee",
      title: "Samtala med folk i församlingshemmet",
      locationId: "parish_hall",
      icon: "☕",
      category: "pathos",
      energyCost: 10,
      baseGains: { logos: 0, kairos: 4, pathos: 10, rhetoric: 1, spirit: 1, relation: 8 },
      bestPhase: "early_mid",
      description:
        "Slå dig ner vid borden, lyssna på pensionärer, barnfamiljer och konfirmander. Vad gläds och brottas din församling faktiskt med den här veckan?",
      routineHint: "💬 Om du redan läst söndagens text hör du plötsligt kopplingar överallt i samtalen!"
    },

    // --- TORGET & BIBLIOTEKET ---
    {
      id: "read_newspapers",
      title: "Läsa dagstidningar & kulturdebatt",
      locationId: "town_square",
      icon: "📰",
      category: "kairos",
      energyCost: 10,
      baseGains: { logos: 1, kairos: 13, pathos: 2, rhetoric: 2, spirit: 0 },
      bestPhase: "early_mid",
      description:
        "Karl Barths klassiska råd: »Bibeln i ena handen och tidningen i den andra.« Fånga samtidens diagnos, nyhetsflödet och kulturens längtan.",
      routineHint: "🌍 Kombinera samma dag med Bibelstudium för synnergieffekten »Barths Dubbelblick«!"
    },

    // --- SJÄLAVÅRD & BESÖK ---
    {
      id: "pastoral_visit",
      title: "Göra hembesök & själavårdssamtal",
      locationId: "pastoral_care",
      icon: "🤝",
      category: "pathos",
      energyCost: 16,
      baseGains: { logos: 0, kairos: 2, pathos: 14, rhetoric: 0, spirit: 4, relation: 10 },
      bestPhase: "early_mid",
      description:
        "Möta människor där livet gör ont. Ger en existentiell tyngd och äkthet i predikan som inga böcker kan ersätta.",
      routineHint: "❤️ Kräver energi, men ger de starkaste Pathos-insikterna och bygger förtroende."
    },

    // --- PRÄSTGÅRDEN ---
    {
      id: "rest_incubation",
      title: "Skogspromenad, vila & inkubation",
      locationId: "parsonage",
      icon: "🌲",
      category: "rest",
      energyCost: -28, // Ger 28 energi tillbaka!
      baseGains: { logos: 2, kairos: 2, pathos: 2, rhetoric: 2, spirit: 8 },
      bestPhase: "any",
      description:
        "Släpp skrivbordet, gå ut i skogen eller umgås med familjen. Återställer din mentala skärpa – och har du redan börjat arbeta med texten mognar den av sig själv!",
      routineHint: "🌿 På lördag kväll ger vila »Söndagsfrimodighet«. Under veckan ger det »Homiletisk inkubation« om texten är läst."
    }
  ],

  // --------------------------------------------------------------------------
  // 4. HOMILETISKA FORMER / DISPOSITIONER
  // --------------------------------------------------------------------------
  sermonForms: [
    {
      id: "narrative",
      name: "Lowrys Narrativa Båge (Homiletical Plot)",
      theorist: "Eugene Lowry / Fred Craddock",
      icon: "🌊",
      description:
        "Börjar i en existentiell skavank ('The Itch'), fördjupar dilemmat tills våra egna lösningar spricker, låter evangeliet vända allt i en oväntad peripeti, och landar i ny livstolkning.",
      bonusDescription: "+20% effekt om både Pathos (Själavård) och Logos (Exeges) är välbalanserade."
    },
    {
      id: "contrast",
      name: "Brobyggaren – Två Världar i Dialog",
      theorist: "John Stott / Karl Barth",
      icon: "🌉",
      description:
        "Ställer Bibelns historiska horisont och vår egen samtidshorisont i skarp belysning mot varandra tills gnistan mellan då och nu tänder tro.",
      bonusDescription: "+20% effekt när både Logos (Text) och Kairos (Samtid) är höga."
    },
    {
      id: "pastoral",
      name: "Själavårdande Tröst & Medvandring",
      theorist: "Själavårdshomiletik",
      icon: "🕯️",
      description:
        "En varm, nära förkunnelse som vågar stanna i smärtan och tvivlet utan snabba svar, och låter nåden tala lågmält men bärande.",
      bonusDescription: "+25% effekt vid högt Pathos och hög Andlig Frimodighet (Ethos)."
    },
    {
      id: "prophetic",
      name: "Profetisk Samtidsutmaning & Vision",
      theorist: "Walter Brueggemann",
      icon: "🔥",
      description:
        "Avslöjar samtidens falska tryggheter ('kritik') och målar upp Guds alternativa verklighet ('energigivande hopp').",
      bonusDescription: "+20% effekt när Kairos (Samtid) och Retorisk skärpa samverkar."
    }
  ],

  // --------------------------------------------------------------------------
  // 5. STÖRNINGSMOMENT & PASTORALA HÄNDELSER (12 rika dilemman)
  // --------------------------------------------------------------------------
  disruptions: [
    {
      id: "boiler_leak",
      title: "Kyrkans värmepump har havererat!",
      type: "Katastrof i fastigheten",
      icon: "🔧",
      description:
        "Vaktmästaren Göran står i dörren till ditt arbetsrum med pannan i djupa veck: »Det är 11 grader i kyrkorummet och rörjouren vill ha besked om en dyr reservdel nu direkt!«",
      choices: [
        {
          label: "Följ med ner i pannrummet och lös krisen med Göran",
          effectSummary: "-10 Energi, +8 Församlingsrelation, +1 Konkret vardagsbild (Retorik +5)",
          effects: { energy: -10, relation: 8, rhetoric: 5 },
          insightCard: {
            id: "ins_boiler",
            title: "Metafor från pannrummet: När värmen slocknar",
            category: "kairos",
            power: 9,
            quote: "Nere i kyrkans källare insåg du hur snabbt ett stort vackert rum blir iskallt när källan i djupet stannar.",
            description: "En jordnära liknelse som alla i bänkarna kommer att le igenkännande åt."
          },
          outcomeText: "Ni fick igång värmen efter en timmes skruvande. Du förlorade skrivtid, men Göran är tacksam och du fick en oväntat bra inledningsbild!"
        },
        {
          label: "Delegera till kyrkorådets ordförande och stäng dörren",
          effectSummary: "Ingen energiförlust, -5 Församlingsrelation, +4 Fokus på studierna (Logos +4)",
          effects: { energy: 0, relation: -5, logos: 4 },
          outcomeText: "Göran muttrar lite i korridoren, men du fick behålla ditt fokus vid skrivbordet."
        }
      ]
    },
    {
      id: "grief_call",
      title: "Oväntat sorgebud i telefonen",
      type: "Akut själavård",
      icon: "🕊️",
      description:
        "En församlingsbo ringer gråtande. Hennes åldrige far gick bort under morgonen och familjen samlas nu i hemmet. »Kan pastorn komma förbi en liten stund och läsa en bön?«",
      choices: [
        {
          label: "Släpp allt, ta med handboken och åk dit direkt",
          effectSummary: "-16 Energi, +15 Församlingsrelation, +8 Andlig frimodighet, Starkt Själavårdskort",
          effects: { energy: -16, relation: 15, spirit: 8, pathos: 10 },
          insightCard: {
            id: "ins_grief_bed",
            title: "Tystnaden vid ett nyss avslutat liv",
            category: "pathos",
            power: 15,
            quote: "När allt det oväsentliga skalas bort vid en dödsbädd återstår bara frågan om vems händer som bär oss genom gränsen.",
            description: "Ger din predikan ett allvar och en ömhet som berör djupt."
          },
          outcomeText: "Ditt arbetsschema sprack helt den här eftermiddagen, men i det stilla rummet påmindes du om varför du blev predikant."
        },
        {
          label: "Beklaga sorgen varmt på telefon och boka hembesök till nästa vecka",
          effectSummary: "-4 Energi, -6 Församlingsrelation",
          effects: { energy: -4, relation: -6 },
          outcomeText: "Familjen hade förståelse, men en del av ditt samvete skaver medan du försöker läsa vidare."
        }
      ]
    },
    {
      id: "choir_conflict",
      title: "Storm i kyrkokören om söndagens psalmer",
      type: "Församlingskonflikt",
      icon: "🎼",
      description:
        "Kyrkomusikern och körordföranden dyker upp samtidigt. Den ena vill ha en nyskriven lovsång, den andra vägrar sjunga något yngre än Johan Olof Wallin (1819).",
      choices: [
        {
          label: "Medla teologiskt: knyt psalmvalet till söndagens bibeltext",
          effectSummary: "-12 Energi, +10 Församlingsrelation, +6 Logos, +5 Retorik",
          effects: { energy: -12, relation: 10, logos: 6, rhetoric: 5 },
          outcomeText: "Genom att visa hur både den klassiska koralen och den nya sången belyser söndagens text vände du grälet till gemensam gudstjänstglädje!"
        },
        {
          label: "Bestäm snabbt enväldigt så du får återgå till predikan",
          effectSummary: "-2 Energi, -8 Församlingsrelation",
          effects: { energy: -2, relation: -8 },
          outcomeText: "Du sparade tid, men det kommer att vara lite stela miner på orgelläktaren på söndag."
        }
      ]
    },
    {
      id: "budget_meeting",
      title: "Extrainsatt sammanträde om kopiatoravtalet",
      type: "Byråkrati & Mötesträsk",
      icon: "📋",
      description:
        "Administrationsutskottet undrar om du kan sitta med i två timmar och jämföra leasingavtal för dubbelsidiga färgkopiatorer.",
      choices: [
        {
          label: "Säg vänligt men bestämt nej: »Jag måste förbereda söndagens förkunnelse«",
          effectSummary: "+4 Andlig frimodighet, -3 Relation, du behåller din energi",
          effects: { energy: 0, spirit: 4, relation: -3, logos: 3 },
          outcomeText: "Utskottets ordförande höjde på ögonbrynen, men respekterade att Ordet får ta tid."
        },
        {
          label: "Sitt med av pliktkänsla och drick ljummet termoskaffe",
          effectSummary: "-15 Energi, +5 Relation, -4 Andlig frimodighet (tristess!)",
          effects: { energy: -15, relation: 5, spirit: -4 },
          outcomeText: "Två timmar av ditt liv försvann i en diskussion om tonerkassetter. Du känner dig dränerad."
        }
      ]
    },
    {
      id: "confirmand_dropin",
      title: "En konfirmand dyker upp med svåra frågor",
      type: "Oväntat möte",
      icon: "🎒",
      description:
        "Precis när du öppnat ditt dokument knackar det försiktigt. Det är 14-åriga Maja som undrar: »Hur kan man tro på Gud när världen ser ut som den gör på nyheterna?«",
      choices: [
        {
          label: "Bjud på varm choklad och ta hennes fråga på fullaste allvar",
          effectSummary: "-10 Energi, +8 Relation, +8 Kairos, +8 Pathos, Starkt Insiktskort",
          effects: { energy: -10, relation: 8, kairos: 8, pathos: 8 },
          insightCard: {
            id: "ins_confirmand_doubt",
            title: "Ttonåringens ärliga teodicéfråga",
            category: "kairos",
            power: 13,
            quote: "När Maja frågade var Gud är i nyhetsflödet insåg du att vuxna bär exakt samma fråga, men inte vågar ställa den högt.",
            description: "Gör att din predikan talar rakt in i tvivlarnas verklighet."
          },
          outcomeText: "Samtalet med Maja skapade en elektrisk nerv som kommer att lyfta hela din predikan!"
        },
        {
          label: "Ge ett snabbt standardsvar och hänvisa till nästa veckas träff",
          effectSummary: "-2 Energi, -5 Relation, -3 Frimodighet",
          effects: { energy: -2, relation: -5, spirit: -3 },
          outcomeText: "Maja nickade tyst och gick. Du sparade tid men kände att du missade ett heligt ögonblick."
        }
      ]
    },
    {
      id: "local_journalist",
      title: "Lokaltidningen ringer för en kommentar",
      type: "Offentligt samtal",
      icon: "🎙️",
      description:
        "En reporter från lokaltidningen ringer: »Vi skriver om hur människor i kommunen hanterar oro och ensamhet i höst. Har kyrkan något att säga?«",
      choices: [
        {
          label: "Ge en genomtänkt, varm intervju utifrån veckans bibeltext",
          effectSummary: "-10 Energi, +10 Kairos, +6 Retorik, +6 Församlingsrelation",
          effects: { energy: -10, kairos: 10, rhetoric: 6, relation: 6 },
          outcomeText: "När du tvingades formulera budskapet för tidningsläsare utan kyrkligt fikonspråk klarnade plötsligt din egen predikotanke!"
        },
        {
          label: "Avböj intervjun på grund av tidsbrist",
          effectSummary: "Ingen energiförlust, -2 Kairos",
          effects: { energy: 0, kairos: -2 },
          outcomeText: "Du fick arbeta ostört, men missade chansen att pröva tankarna i offentligheten."
        }
      ]
    },
    {
      id: "writers_block",
      title: "Homiletisk torka & tvivel vid tangentbordet",
      type: "Inre kris",
      icon: "🌧️",
      description:
        "Markören blinkar hånfullt på skärmen. Varje mening du skriver känns som religiöst pappersprassel. »Har jag egentligen något alls att säga på söndag?«",
      choices: [
        {
          label: "Lägg bort datorn, tänd ett ljus och be ärligt om hjälp",
          effectSummary: "-4 Energi, +14 Andlig frimodighet, +6 Pathos",
          effects: { energy: -4, spirit: 14, pathos: 6 },
          insightCard: {
            id: "ins_humble_preacher",
            title: "Predikantens tomma händer",
            category: "pathos",
            power: 12,
            quote: "När dina egna smarta formuleringar tog slut tvingades du själv lita på den nåd du ska predika om.",
            description: "Ger en avväpnande ärlighet (Ethos) i predikstolen."
          },
          outcomeText: "När du slutade försöka vara briljant lossnade knuten i bröstet."
        },
        {
          label: "Bita ihop, dricka tre koppar starkt kaffe och pressa fram text",
          effectSummary: "-16 Energi, +6 Logos, +4 Retorik, -5 Frimodighet",
          effects: { energy: -16, logos: 6, rhetoric: 4, spirit: -5 },
          outcomeText: "Du fick ner två sidor text genom ren viljekraft, men du är trött i huvudet."
        }
      ]
    },
    {
      id: "volunteer_burnout",
      title: "Ideell medarbetare på väg in i väggen",
      type: "Församlingsomsorg",
      icon: "🫖",
      description:
        "Söndagsskolläraren Sara tittar in med gråten i halsen. Hon orkar inte hålla i samlingen på söndag och känner sig som en svikare.",
      choices: [
        {
          label: "Lyssna, avlasta henne direkt och påminn henne om att hon är älskad utan prestation",
          effectSummary: "-10 Energi, +12 Relation, +10 Pathos, +5 Frimodighet",
          effects: { energy: -10, relation: 12, pathos: 10, spirit: 5 },
          outcomeText: "Sara gick därifrån med sänkta axlar, och ditt samtal gav dig en levande glimt av vad nåd faktiskt betyder i praktiken."
        },
        {
          label: "Försök peppa henne att hålla ut bara den här helgen också",
          effectSummary: "-4 Energi, -10 Relation, -5 Frimodighet",
          effects: { energy: -4, relation: -10, spirit: -5 },
          outcomeText: "Sara sa ja med sammanbitna läppar, men det kändes ihåligt när du sedan skulle skriva om Guds omsorg."
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 6. FÖRSAMLINGSBOR I KYRKBÄNKARNA PÅ SÖNDAGEN
  // --------------------------------------------------------------------------
  parishioners: [
    {
      id: "margareta",
      name: "Margareta, 71",
      role: "Trogen kyrkvärd",
      avatar: "👵",
      needs: { logos: 0.35, pathos: 0.35, spirit: 0.3 },
      bio: "Kan sin Bibel utan och innan, men längtar efter att bli sedd och tröstad – inte tagen för given."
    },
    {
      id: "johan",
      name: "Johan, 42",
      role: "Utarbetad IT-arkitekt",
      avatar: "👨‍💼",
      needs: { kairos: 0.45, logos: 0.3, rhetoric: 0.25 },
      bio: "Allergisk mot fromma klyschor. Lyssnar direkt om predikan kopplar samman intellektuell skärpa med vår tids livspussel."
    },
    {
      id: "sara",
      name: "Sara, 34",
      role: "Trött småbarnsförälder",
      avatar: "👩",
      needs: { pathos: 0.45, rhetoric: 0.3, spirit: 0.25 },
      bio: "Har sovit fyra timmar i natt. Behöver konkreta bilder, värme och ett evangelium som bär när krafterna tryter."
    },
    {
      id: "liam",
      name: "Liam, 15",
      role: "Konfirmand på sista bänk",
      avatar: "🧑",
      needs: { rhetoric: 0.4, kairos: 0.35, pathos: 0.25 },
      bio: "Zonar ut direkt om pastorn läser innantill med entonig röst, men spetsar öronen när det blir ärligt och modigt."
    },
    {
      id: "bengt",
      name: "Bengt, 66",
      role: "Skeptisk pensionerad lärare",
      avatar: "👓",
      needs: { logos: 0.45, kairos: 0.35, rhetoric: 0.2 },
      bio: "Uppskattar när predikanten faktiskt kan sin grundtext och historia och inte väjer för textens svåra ställen."
    },
    {
      id: "agda",
      name: "Agda, 83",
      role: "Änka i främre bänken",
      avatar: "🧣",
      needs: { spirit: 0.45, pathos: 0.35, logos: 0.2 },
      bio: "Känner direkt om predikanten själv har bett över orden eller bara håller ett föredrag."
    }
  ],

  // --------------------------------------------------------------------------
  // 7. PREDIKANS 4 AKTER (Byggblock i manuset & Söndagens leverans)
  // --------------------------------------------------------------------------
  sermonSections: [
    {
      id: "exordium",
      number: 1,
      title: "1. Inledning & Anknytning (Exordium)",
      subtitle: "Väcka intresse och naming »the itch« – varför angår detta oss idag?",
      primaryStat: "kairos",
      secondaryStat: "rhetoric"
    },
    {
      id: "explicatio",
      number: 2,
      title: "2. Textens Värld & Exeges (Explicatio)",
      subtitle: "Öppna bibeltextens sammanhang, grundtext och teologiska spänning",
      primaryStat: "logos",
      secondaryStat: "rhetoric"
    },
    {
      id: "evangelium",
      number: 3,
      title: "3. Vändpunkten & Nåden (Evangelium)",
      subtitle: "Där våra egna försök tar slut och Kristus möter människans djupaste behov",
      primaryStat: "pathos",
      secondaryStat: "spirit"
    },
    {
      id: "applicatio",
      number: 4,
      title: "4. Sändning & Konkretion (Applicatio)",
      subtitle: "Hur lever vi i detta när vi går ut genom kyrkporten på måndag morgon?",
      primaryStat: "kairos",
      secondaryStat: "pathos"
    }
  ]
};

if (typeof window !== "undefined") {
  window.GAME_DATA = GAME_DATA;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = GAME_DATA;
}

