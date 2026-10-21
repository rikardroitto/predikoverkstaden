// ============================================================================
// PREDIKOVERKSTADEN / THE HOMILETICS WORKSHOP – Bilingual Localization (SV / EN)
// Complete English dataset (GAME_DATA_EN) & UI/Engine translation strings
// ============================================================================

const GAME_DATA_EN = {
  // --------------------------------------------------------------------------
  // 1. LITURGICAL SUNDAYS (Scenarios)
  // --------------------------------------------------------------------------
  sundays: [
    {
      id: "septuagesima",
      title: "Septuagesima – Grace and Service",
      liturgicalColor: "violet",
      colorHex: "#6b3fa0",
      scriptureRef: "Matt 20:1–16 (The Laborers in the Vineyard)",
      scriptureQuote: "“So the last will be first, and the first will be last.”",
      contextDescription:
        "A high-achieving parish where many are exhausted from careers and volunteer burnout, while long-time churchwardens quietly grumble that newcomers receive immediate attention.",
      homileticChallenge:
        "The text provokes our deepest sense of fairness. Without thorough exegesis and pastoral sensitivity, the sermon risks becoming either flat moralism ('work harder in God's kingdom!') or cheap comfort that ignores people's exhaustion.",
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
            title: "The True Value of a Denarius",
            category: "logos",
            power: 14,
            quote: "A denarius was not a performance bonus—it was exactly what a family needed to survive the day. The vineyard owner does not pay by merit, but gives life according to need.",
            description: "Historical-critical key shifting focus from a labor dispute to God's radical provision."
          },
          {
            id: "sep_ex_2",
            title: "The Evil Eye (ὁ ὀφθαλμός σου πονηρός)",
            category: "logos",
            power: 12,
            quote: "In the Greek text, the owner asks: 'Is your eye evil because I am good?' Envy blinds us to the fact that we ourselves live by the very same gift.",
            description: "Linguistic detail in the Greek text that exposes the mechanism of self-righteousness."
          }
        ],
        contemporary: [
          {
            id: "sep_ka_1",
            title: "The Meritocracy of Burnout Culture",
            category: "kairos",
            power: 13,
            quote: "In the culture pages, a sociologist writes about how we measure human worth in step counters, résumé lines, and productivity—all the way into the church pews.",
            description: "Cultural diagnosis that makes the vineyard hour-counting urgently relevant."
          },
          {
            id: "sep_ka_2",
            title: "Left Standing in the Marketplace at 5 PM",
            category: "kairos",
            power: 11,
            quote: "Unemployment statistics in the local paper capture the quiet ache of feeling that no one asks for your strength or life experience.",
            description: "Social analysis giving voice to the eleventh-hour workers."
          }
        ],
        pastoral: [
          {
            id: "sep_pa_1",
            title: "Churchwarden Margareta's Exhaustion",
            category: "pathos",
            power: 14,
            quote: "During a conversation in the sacristy, Margareta broke down: 'I have carried this parish for thirty years, and sometimes I wonder if God even sees me.'",
            description: "Lived parish reality allowing you to speak tenderly to the 'first-hour workers' without condemning them."
          },
          {
            id: "sep_pa_2",
            title: "The Confirmand's Question About Being Enough",
            category: "pathos",
            power: 12,
            quote: "Liam, 14, stayed behind after class: 'Do you have to have believed your whole life to count in church?'",
            description: "A concrete human face for eleventh-hour grace."
          }
        ]
      }
    },
    {
      id: "advent1",
      title: "First Sunday of Advent – Season of Grace",
      liturgicalColor: "white",
      colorHex: "#d99b26",
      scriptureRef: "Matt 21:1–9 (The Triumphal Entry into Jerusalem)",
      scriptureQuote: "“Look, your king is coming to you, humble, and mounted on a donkey.”",
      contextDescription:
        "The church will be packed to the rafters with both regular worshippers and secularized families who have come for the choir, the trumpets, and the holiday spirit.",
      homileticChallenge:
        "The danger is 'cozy Advent'—delivering mere glittering nostalgia—or, conversely, scolding visitors for only showing up in December. How do you proclaim the humble power of the King so that both regulars and newcomers are deeply moved?",
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
            title: "The Donkey vs. the Warhorse (Zech 9:9)",
            category: "logos",
            power: 14,
            quote: "When Roman governors entered Jerusalem, they rode warhorses flanked by spears. Jesus stages the prophet Zechariah's peace-parody of imperial power.",
            description: "Historical contrast that awakens even the sleepiest Advent visitor."
          },
          {
            id: "adv_ex_2",
            title: "Hosanna – A Cry for Help, Not Just Cheers",
            category: "logos",
            power: 12,
            quote: "The Hebrew 'Hoshia-na' literally means 'Save us now!' It is not polite applause, but a desperate cry of hope.",
            description: "Restores existential depth to a worn liturgical word."
          }
        ],
        contemporary: [
          {
            id: "adv_ka_1",
            title: "The Craving for Control and Strongmen",
            category: "kairos",
            power: 13,
            quote: "In a world where superpowers rearm and leaders compete in displays of dominance, a vulnerable King on a borrowed donkey looks like either folly or our only salvation.",
            description: "Connects the Advent story to contemporary geopolitical anxiety."
          },
          {
            id: "adv_ka_2",
            title: "Behind the Polished December Facade",
            category: "kairos",
            power: 12,
            quote: "Behind the glowing Advent candlesticks in the windows, so many families carry quiet anxiety over finances, loneliness, and fractured relationships.",
            description: "Opens the door for those who came to church with a knot in their stomach."
          }
        ],
        pastoral: [
          {
            id: "adv_pa_1",
            title: "The Divorced Father in Pew Seven",
            category: "pathos",
            power: 14,
            quote: "On the bus you met Anders, spending every-other-week Advent without his children for the first time: 'I think I'll go to church on Sunday just to escape the silence in my apartment.'",
            description: "Reminds you who is actually sitting in the pew when the brass fanfare fades."
          },
          {
            id: "adv_pa_2",
            title: "The Choir Singer's Longing for Reality",
            category: "pathos",
            power: 11,
            quote: "After choir rehearsal, soprano Karin said: 'We sing Hosanna until the roof lifts, but help us on Sunday to understand what it means on Monday morning.'",
            description: "Grounds the sermon in everyday discipleship."
          }
        ]
      }
    },
    {
      id: "tacksagelse",
      title: "Thanksgiving Sunday – Praise in the Shadows",
      liturgicalColor: "white",
      colorHex: "#2e7d5b",
      scriptureRef: "Phil 4:4–9 (Rejoice in the Lord Always)",
      scriptureQuote: "“Rejoice in the Lord always; again I will say, Rejoice.”",
      contextDescription:
        "The chancel is decorated with autumn apples and harvest loaves, but on Monday the town's largest employer announced 140 layoffs. Anxiety and bitterness hang heavy in the air.",
      homileticChallenge:
        "How do you preach thanksgiving and joy when the community is bleeding? A cheerful 'think positive!' sermon will feel like an insult. The key lies in remembering that Paul writes his epistle of joy from a prison cell.",
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
            title: "Letter from a Roman Prison Cell",
            category: "logos",
            power: 14,
            quote: "Paul does not write 'Rejoice!' from a sunny resort, but in chains awaiting an uncertain verdict. Joy in Philippians is defiant resilience, not shallow optimism.",
            description: "Rescues the biblical text from toxic positivity."
          },
          {
            id: "tack_ex_2",
            title: "God's Peace as a Garrison (φρουρήσει)",
            category: "logos",
            power: 12,
            quote: "The Greek word for 'guard' your hearts is a military term: God's peace stands watch at the gate of your thoughts when anxiety besieges the mind.",
            description: "Gives concrete substance to the promise of God's peace."
          }
        ],
        contemporary: [
          {
            id: "tack_ka_1",
            title: "The Factory Layoffs and Trust in the Future",
            category: "kairos",
            power: 15,
            quote: "The front page of the local paper shows silent workers outside the factory gates. When security is pulled away, what our hope truly rests upon is laid bare.",
            description: "Dares to name the elephant in the room honestly and in solidarity."
          },
          {
            id: "tack_ka_2",
            title: "The Tyranny of the Gratitude Industry",
            category: "kairos",
            power: 11,
            quote: "Self-help culture's demand to always 'feel grateful' piles guilt onto those who grieve. Christian thanksgiving has room for lament.",
            description: "Frees listeners from forced smiles."
          }
        ],
        pastoral: [
          {
            id: "tack_pa_1",
            title: "Coffee Table Conversation with a Laid-Off Worker",
            category: "pathos",
            power: 15,
            quote: "Mechanic Stefan stared into his coffee cup: 'I'm ashamed to walk through town. Everyone asks how it's going.' Yet in sharing bread, he found a room where he was more than his pay stub.",
            description: "Gives the sermon immediate human warmth and solidarity."
          },
          {
            id: "tack_pa_2",
            title: "The Widow's Jar of Applesauce at the Altar",
            category: "pathos",
            power: 12,
            quote: "Agda, 82, brought a single glass jar of homemade applesauce: 'It isn't much, Pastor, but my hands still work.'",
            description: "A quiet image of defiant gratitude amid life's limitations."
          }
        ]
      }
    },
    {
      id: "domsondagen",
      title: "Christ the King / Judgment Sunday",
      liturgicalColor: "green",
      colorHex: "#2d5a3c",
      scriptureRef: "Matt 25:31–46 (The Judgment of the Son of Man)",
      scriptureQuote: "“Just as you did it to one of the least of these brothers and sisters of mine, you did it to me.”",
      contextDescription:
        "The final Sunday of the liturgical year. Dark November fog outside the windows. The word 'Judgment' triggers old religious dread among the elderly or total indifference among the young.",
      homileticChallenge:
        "If you preach only Law ('You must help more poor people or else!') you crush tender consciences. If you wave away judgment, evil and injustice in the world lose their moral gravity.",
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
            title: "The Surprise of the Righteous",
            category: "logos",
            power: 15,
            quote: "Notice that the sheep are just as astonished as the goats: 'Lord, when did we see you hungry?' They were not counting goodness points for heaven—their love was uncalculating and free.",
            description: "Breaks through all religious performance anxiety in the text."
          },
          {
            id: "dom_ex_2",
            title: "The Judge Who Bears the Wounds Himself",
            category: "logos",
            power: 13,
            quote: "The One seated on the throne of glory in Matthew 25 is the very same Jesus who, two chapters later, is himself stripped, thirsty, imprisoned, and crucified.",
            description: "Christological key uniting judgment and gospel."
          }
        ],
        contemporary: [
          {
            id: "dom_ka_1",
            title: "The Longing for Truth to Prevail",
            category: "kairos",
            power: 13,
            quote: "In a world of war crimes, disinformation, and abuses never held to account, God's final judgment is not a threat—it is the promise that evil does not get the last word.",
            description: "Explains why divine judgment is good news for the powerless."
          },
          {
            id: "dom_ka_2",
            title: "The Gaze That Glides Past the Beggar",
            category: "kairos",
            power: 12,
            quote: "In our digitized city we can noise-cancel reality with headphones and screens. Sin here is not active malice, but failing to see.",
            description: "Piercing analysis of everyday modern life."
          }
        ],
        pastoral: [
          {
            id: "dom_pa_1",
            title: "Night Shift at the Shelter",
            category: "pathos",
            power: 14,
            quote: "The deacon showed you the mugs of hot soup: 'Here we don't debate theories of Christ's presence—we meet Him in the freezing man at the door.'",
            description: "Gives the sermon diaconal credibility (Ethos)."
          },
          {
            id: "dom_pa_2",
            title: "An Dying Man's Anxiety Over His Life",
            category: "pathos",
            power: 13,
            quote: "By the hospital bed, Bengt whispered: 'What if my life wasn't enough?' You were able to point him to the Judge who is the same Shepherd who has carried him.",
            description: "Deep pastoral grounding."
          }
        ]
      }
    }
  ],

  // --------------------------------------------------------------------------
  // 2. PARISH LOCATIONS (6 3D nodes)
  // --------------------------------------------------------------------------
  locations: [
    {
      id: "study",
      name: "The Study",
      subtitle: "Desk & Theological Library",
      icon: "📖",
      x: 22,
      y: 28,
      description: "Your study at the parish office. Greek lexicons, biblical commentaries, coffee mugs, and your half-written manuscript crowd the desk."
    },
    {
      id: "sanctuary",
      name: "The Sanctuary",
      subtitle: "Altar & Pulpit",
      icon: "🕯️",
      x: 52,
      y: 18,
      description: "The quiet church sanctuary. At the altar rail you can pray and center yourself; in the pulpit you can test how your words actually sound in the room."
    },
    {
      id: "parish_hall",
      name: "Fellowship Hall",
      subtitle: "Coffee Hour & Parish Groups",
      icon: "☕",
      x: 78,
      y: 32,
      description: "It always smells of fresh coffee here. Retirees, confirmands, choir members, and volunteers gather in the joys and worries of everyday life."
    },
    {
      id: "town_square",
      name: "Town Square & Library",
      subtitle: "Newspapers & Public Pulse",
      icon: "📰",
      x: 24,
      y: 72,
      description: "The pulse of the town. In the library reading room and the square café you read daily newspapers, cultural essays, and listen to people's conversations."
    },
    {
      id: "pastoral_care",
      name: "Pastoral Care",
      subtitle: "Home Visits & Hospital",
      icon: "🏥",
      x: 56,
      y: 76,
      description: "Where life comes to a head. At kitchen tables and hospital bedsides you meet human vulnerability, doubt, and life's deepest questions."
    },
    {
      id: "parsonage",
      name: "The Parsonage",
      subtitle: "Rest, Woods & Incubation",
      icon: "🏠",
      x: 82,
      y: 70,
      description: "Home and the forest trail behind the garden. Here you restore your mental sharpness—and let the biblical text mature in the subconscious."
    }
  ],

  // --------------------------------------------------------------------------
  // 3. ACTIVITIES
  // --------------------------------------------------------------------------
  activities: [
    // --- THE STUDY ---
    {
      id: "exegesis",
      title: "Close Reading & Biblical Exegesis",
      locationId: "study",
      icon: "📜",
      category: "logos",
      energyCost: 14,
      baseGains: { logos: 11, kairos: 0, pathos: 0, rhetoric: 1, spirit: 2 },
      bestPhase: "early",
      description:
        "Wrestle with Sunday's pericope, context, and original Greek/Hebrew keywords. Doing this early in the week activates 'Echo of the Text', enriching all later encounters!",
      routineHint: "🌟 Best Tue–Wed: Plants the seed so the text can germinate all week."
    },
    {
      id: "theology_study",
      title: "Study Commentaries & Dogmatics",
      locationId: "study",
      icon: "📚",
      category: "logos",
      energyCost: 16,
      baseGains: { logos: 13, kairos: 1, pathos: 0, rhetoric: 2, spirit: 0 },
      bestPhase: "early_mid",
      description:
        "Dive into Church Fathers, modern biblical commentaries, and systematic theology to avoid flat clichés and theological pitfalls.",
      routineHint: "🔍 Yields the best return after you have first read the biblical text yourself."
    },
    {
      id: "structure_sketch",
      title: "Sketch Homiletic Structure & Focus",
      locationId: "study",
      icon: "🧭",
      category: "structure",
      energyCost: 12,
      baseGains: { logos: 2, kairos: 2, pathos: 2, rhetoric: 6, spirit: 0 },
      bestPhase: "mid",
      description:
        "Formulate the sermon's central thread (Focus & Function) and build bridges between the world of the Bible and the lives of your listeners.",
      routineHint: "🌉 Requires both Exegesis (Logos) and Context/Pastoral Care (Kairos/Pathos) to build a strong bridge!"
    },
    {
      id: "write_draft",
      title: "Write Sermon Manuscript",
      locationId: "study",
      icon: "✍️",
      category: "writing",
      energyCost: 18,
      baseGains: { logos: 1, kairos: 1, pathos: 1, rhetoric: 6, spirit: 0 },
      bestPhase: "mid_late",
      description:
        "Put thoughts into concrete, spoken language. Transforms your gathered insights and structural outline into a coherent sermon draft.",
      routineHint: "⚠️ Don't write too early without raw material and an outline—you'll just spin your wheels!"
    },
    {
      id: "polish_rhetoric",
      title: "Polish Rhetoric & Imagery",
      locationId: "study",
      icon: "✒️",
      category: "rhetoric",
      energyCost: 12,
      baseGains: { logos: 0, kairos: 1, pathos: 1, rhetoric: 12, spirit: 0 },
      bestPhase: "late",
      description:
        "Cut theological jargon ('Canaanite dialect'), sharpen metaphors, pace the sentences for the ear, and craft a memorable opening and landing.",
      routineHint: "✨ Requires a substantial manuscript draft to already be in place."
    },

    // --- THE SANCTUARY ---
    {
      id: "prayer_silence",
      title: "Prayer, Lectio Divina & Silence",
      locationId: "sanctuary",
      icon: "🕯️",
      category: "spirit",
      energyCost: -8,
      baseGains: { logos: 2, kairos: 0, pathos: 3, rhetoric: 0, spirit: 15 },
      bestPhase: "any",
      description:
        "Kneel at the altar in Lectio Divina. Transforms academic knowledge into personal address and strengthens your inner authenticity (Ethos).",
      routineHint: "🕊️ Protects against spiritual emptiness and lets biblical study sink into the heart."
    },
    {
      id: "practice_pulpit",
      title: "Rehearse Delivery in the Pulpit",
      locationId: "sanctuary",
      icon: "🎙️",
      category: "rhetoric",
      energyCost: 12,
      baseGains: { logos: 0, kairos: 0, pathos: 2, rhetoric: 12, spirit: 4 },
      bestPhase: "late",
      description:
        "Step into the pulpit and preach aloud in the empty sanctuary. Feel the acoustics, the pauses, the cadence, and free your eyes from the paper.",
      routineHint: "🏛️ Best Fri–Sat once the draft is ready. Gives a major boost to Sunday delivery!"
    },

    // --- FELLOWSHIP HALL ---
    {
      id: "parish_coffee",
      title: "Talk with People in Fellowship Hall",
      locationId: "parish_hall",
      icon: "☕",
      category: "pathos",
      energyCost: 10,
      baseGains: { logos: 0, kairos: 4, pathos: 10, rhetoric: 1, spirit: 1, relation: 8 },
      bestPhase: "early_mid",
      description:
        "Sit down at the tables and listen to retirees, parents, and confirmands. What are the people of your parish actually celebrating and struggling with this week?",
      routineHint: "💬 If you have already read Sunday's text, you will suddenly hear connections everywhere!"
    },

    // --- TOWN SQUARE & LIBRARY ---
    {
      id: "read_newspapers",
      title: "Read Newspapers & Cultural Debate",
      locationId: "town_square",
      icon: "📰",
      category: "kairos",
      energyCost: 10,
      baseGains: { logos: 1, kairos: 13, pathos: 2, rhetoric: 2, spirit: 0 },
      bestPhase: "early_mid",
      description:
        "Karl Barth's classic advice: 'Take your Bible and take your newspaper, and read both.' Capture the diagnosis of our time, the news cycle, and cultural longing.",
      routineHint: "🌍 Combine on the same day with Exegesis to unlock 'Karl Barth's Double Vision'!"
    },

    // --- PASTORAL CARE ---
    {
      id: "pastoral_visit",
      title: "Home Visits & Pastoral Counseling",
      locationId: "pastoral_care",
      icon: "🤝",
      category: "pathos",
      energyCost: 16,
      baseGains: { logos: 0, kairos: 2, pathos: 14, rhetoric: 0, spirit: 4, relation: 10 },
      bestPhase: "early_mid",
      description:
        "Meet people where life hurts. Gives your preaching an existential weight and authenticity that no commentary can replace.",
      routineHint: "❤️ Costs energy, but unlocks the strongest Pathos insights and builds deep parish trust."
    },

    // --- THE PARSONAGE ---
    {
      id: "rest_incubation",
      title: "Forest Walk, Rest & Incubation",
      locationId: "parsonage",
      icon: "🌲",
      category: "rest",
      energyCost: -28,
      baseGains: { logos: 2, kairos: 2, pathos: 2, rhetoric: 2, spirit: 8 },
      bestPhase: "any",
      description:
        "Step away from the desk, walk in the woods, or spend time with family. Restores mental sharpness—and if you've started working on the text, it matures on its own!",
      routineHint: "🌿 On Saturday evening, rest grants 'Saturday Peace'. During the week, it triggers 'Homiletic Incubation' if the text has been read."
    }
  ],

  // --------------------------------------------------------------------------
  // 4. HOMILETIC FORMS
  // --------------------------------------------------------------------------
  sermonForms: [
    {
      id: "narrative",
      name: "Lowry's Narrative Arc (The Homiletical Plot)",
      theorist: "Eugene Lowry / Fred Craddock",
      icon: "🌊",
      description:
        "Begins with an existential discrepancy ('upsetting the equilibrium'), deepens the dilemma until human solutions fail, lets the Gospel turn everything around in a sudden reversal, and lands in new life.",
      bonusDescription: "Rewards balanced Logos & Pathos, forest incubation, and a strong Gospel reversal in Act 3."
    },
    {
      id: "contrast",
      name: "The Bridge-Builder – Between Two Worlds",
      theorist: "John Stott / Karl Barth",
      icon: "🌉",
      description:
        "Places the ancient biblical horizon and our contemporary horizon in sharp dialogue until the spark between Then and Now ignites faith.",
      bonusDescription: "Rewards high Logos & Kairos, Karl Barth's Double Vision, and John Stott's Bridge."
    },
    {
      id: "pastoral",
      name: "Pastoral Consolation & Accompaniment",
      theorist: "Pastoral Homiletics",
      icon: "🕯️",
      description:
        "Warm, attentive proclamation that dares to linger in pain and doubt without quick fixes, letting grace speak quietly yet sustainingly.",
      bonusDescription: "Rewards high Pathos, strong Spiritual Authenticity (Ethos), altar prayer, and parish trust."
    },
    {
      id: "prophetic",
      name: "Prophetic Imagination & Social Vision",
      theorist: "Walter Brueggemann",
      icon: "🔥",
      description:
        "Exposes the false securities of the present age ('prophetic criticizing') and paints God's alternative reality ('prophetic energizing').",
      bonusDescription: "Rewards high Kairos & Rhetoric, polished imagery, and pulpit rehearsal."
    }
  ],

  // --------------------------------------------------------------------------
  // 5. DISRUPTIONS & PASTORAL DILEMMAS
  // --------------------------------------------------------------------------
  disruptions: [
    {
      id: "boiler_leak",
      title: "The Church Heating System Has Failed!",
      type: "Facility Crisis",
      icon: "🔧",
      description:
        "Caretaker Göran stands in your study doorway with a furrowed brow: 'It's 11°C (52°F) in the sanctuary and the emergency plumber needs an immediate sign-off on an expensive part!'",
      choices: [
        {
          label: "Head down to the boiler room and solve the crisis with Göran",
          effectSummary: "-10 Energy, +8 Parish Trust, +1 Concrete Everyday Metaphor (Rhetoric +5)",
          effects: { energy: -10, relation: 8, rhetoric: 5 },
          insightCard: {
            id: "ins_boiler",
            title: "Boiler Room Metaphor: When the Heat Goes Out",
            category: "kairos",
            power: 9,
            quote: "Down in the church basement you realized how quickly a grand, beautiful sanctuary turns freezing cold when the hidden source below stops burning.",
            description: "A down-to-earth illustration that everyone in the pews will smile and recognize."
          },
          outcomeText: "You got the heat running after an hour with a wrench. You lost writing time, but Göran is grateful and you gained an unexpectedly vivid opening illustration!"
        },
        {
          label: "Delegate to the church council chair and close your door",
          effectSummary: "No energy loss, -5 Parish Trust, +4 Study Focus (Logos +4)",
          effects: { energy: 0, relation: -5, logos: 4 },
          outcomeText: "Göran mutters in the hallway, but you kept your focus at the desk."
        }
      ]
    },
    {
      id: "grief_call",
      title: "Unexpected Bereavement Call",
      type: "Urgent Pastoral Care",
      icon: "🕊️",
      description:
        "A parishioner calls in tears. Her elderly father passed away this morning and the family is gathering at the house. 'Could the pastor come by for a moment and pray with us?'",
      choices: [
        {
          label: "Drop everything, take your pastoral liturgy book, and go immediately",
          effectSummary: "-16 Energy, +15 Parish Trust, +8 Spiritual Authenticity, Strong Pastoral Insight",
          effects: { energy: -16, relation: 15, spirit: 8, pathos: 10 },
          insightCard: {
            id: "ins_grief_bed",
            title: "The Silence Beside a Completed Life",
            category: "pathos",
            power: 15,
            quote: "When everything trivial is stripped away at a deathbed, only one question remains: whose hands carry us across the threshold?",
            description: "Gives your sermon a gravity and tenderness that touches listeners deeply."
          },
          outcomeText: "Your schedule fell apart this afternoon, but in that quiet room you were reminded why you became a preacher."
        },
        {
          label: "Express warm condolences by phone and schedule a visit for next week",
          effectSummary: "-4 Energy, -6 Parish Trust",
          effects: { energy: -4, relation: -6 },
          outcomeText: "The family understood, though your conscience stings a little as you try to return to your books."
        }
      ]
    },
    {
      id: "choir_conflict",
      title: "Storm in the Choir Over Sunday's Hymns",
      type: "Parish Conflict",
      icon: "🎼",
      description:
        "The church musician and the choir president arrive at your door simultaneously. One wants a contemporary worship song; the other refuses to sing anything written after 1819.",
      choices: [
        {
          label: "Mediate theologically: tie the hymn choices to Sunday's biblical text",
          effectSummary: "-12 Energy, +10 Parish Trust, +6 Logos, +5 Rhetoric",
          effects: { energy: -12, relation: 10, logos: 6, rhetoric: 5 },
          outcomeText: "By showing how both the classic chorale and the modern song illuminate Sunday's scripture, you turned the quarrel into shared liturgical joy!"
        },
        {
          label: "Make a quick unilateral ruling so you can get back to your sermon",
          effectSummary: "-2 Energy, -8 Parish Trust",
          effects: { energy: -2, relation: -8 },
          outcomeText: "You saved time, but there will be stiff faces in the organ loft on Sunday."
        }
      ]
    },
    {
      id: "budget_meeting",
      title: "Emergency Sub-Committee on the Photocopier Lease",
      type: "Bureaucracy & Meetings",
      icon: "📋",
      description:
        "The administration committee wonders if you can sit in for two hours comparing leasing contracts for double-sided color photocopiers.",
      choices: [
        {
          label: "Politely but firmly decline: 'I need to prepare Sunday's proclamation'",
          effectSummary: "+4 Spiritual Authenticity, -3 Parish Trust, you keep your energy",
          effects: { energy: 0, spirit: 4, relation: -3, logos: 3 },
          outcomeText: "The committee chair raised an eyebrow, but respected that the Word of God takes time."
        },
        {
          label: "Sit through the meeting out of duty and drink lukewarm thermos coffee",
          effectSummary: "-15 Energy, +5 Parish Trust, -4 Spiritual Authenticity (boredom!)",
          effects: { energy: -15, relation: 5, spirit: -4 },
          outcomeText: "Two hours of your life vanished into a debate over toner cartridges. You feel drained."
        }
      ]
    },
    {
      id: "confirmand_dropin",
      title: "A Confirmand Drops In With Hard Questions",
      type: "Unexpected Encounter",
      icon: "🎒",
      description:
        "Just as you open your manuscript file, there is a shy knock. It's 14-year-old Maja asking: 'How can anyone believe in God when the world looks the way it does on the news?'",
      choices: [
        {
          label: "Make hot chocolate and take her question with complete seriousness",
          effectSummary: "-10 Energy, +8 Trust, +8 Kairos, +8 Pathos, Strong Insight Card",
          effects: { energy: -10, relation: 8, kairos: 8, pathos: 8 },
          insightCard: {
            id: "ins_confirmand_doubt",
            title: "A Teenager's Honest Theodicy Question",
            category: "kairos",
            power: 13,
            quote: "When Maja asked where God is in the news feed, you realized adults carry the exact same question—they just don't dare ask it out loud.",
            description: "Allows your sermon to speak straight into the reality of doubters."
          },
          outcomeText: "Your conversation with Maja sparked an electric urgency that will lift your entire sermon!"
        },
        {
          label: "Give a quick textbook answer and refer her to next week's class",
          effectSummary: "-2 Energy, -5 Parish Trust, -3 Authenticity",
          effects: { energy: -2, relation: -5, spirit: -3 },
          outcomeText: "Maja nodded quietly and left. You saved time, but felt you missed a holy moment."
        }
      ]
    },
    {
      id: "local_journalist",
      title: "The Local Newspaper Calls for a Comment",
      type: "Public Witness",
      icon: "🎙️",
      description:
        "A reporter from the local paper calls: 'We're writing a feature on how people in town are coping with anxiety and loneliness this autumn. Does the church have anything to say?'",
      choices: [
        {
          label: "Give a thoughtful, warm interview rooted in this week's biblical text",
          effectSummary: "-10 Energy, +10 Kairos, +6 Rhetoric, +6 Parish Trust",
          effects: { energy: -10, kairos: 10, rhetoric: 6, relation: 6 },
          outcomeText: "Being forced to articulate the message for newspaper readers without church jargon suddenly clarified your own central sermon idea!"
        },
        {
          label: "Decline the interview due to lack of time",
          effectSummary: "No energy loss, -2 Kairos",
          effects: { energy: 0, kairos: -2 },
          outcomeText: "You worked undisturbed, but missed a chance to test your thoughts in the public square."
        }
      ]
    },
    {
      id: "writers_block",
      title: "Homiletic Dryness & Doubt at the Keyboard",
      type: "Inner Crisis",
      icon: "🌧️",
      description:
        "The cursor blinks mockingly on the screen. Every sentence you type feels like hollow religious paper-rustling. 'Do I actually have anything at all to say on Sunday?'",
      choices: [
        {
          label: "Step away from the computer, light a candle, and pray honestly for help",
          effectSummary: "-4 Energy, +14 Spiritual Authenticity, +6 Pathos",
          effects: { energy: -4, spirit: 14, pathos: 6 },
          insightCard: {
            id: "ins_humble_preacher",
            title: "The Preacher's Empty Hands",
            category: "pathos",
            power: 12,
            quote: "When your own clever phrasing ran dry, you were forced to rely on the very grace you are called to preach.",
            description: "Brings a disarming honesty (Ethos) to the pulpit."
          },
          outcomeText: "Once you stopped trying to be brilliant, the knot in your chest loosened."
        },
        {
          label: "Grit your teeth, drink three cups of strong coffee, and force out pages",
          effectSummary: "-16 Energy, +6 Logos, +4 Rhetoric, -5 Authenticity",
          effects: { energy: -16, logos: 6, rhetoric: 4, spirit: -5 },
          outcomeText: "You forced out two pages through sheer willpower, but your head is throbbing."
        }
      ]
    },
    {
      id: "volunteer_burnout",
      title: "A Sunday School Volunteer on the Verge of Burnout",
      type: "Parish Care",
      icon: "🫖",
      description:
        "Sunday school teacher Sara stops by with tears in her eyes. She doesn't have the strength to lead children's church this Sunday and feels like a failure.",
      choices: [
        {
          label: "Listen, relieve her immediately, and remind her she is loved without performing",
          effectSummary: "-10 Energy, +12 Trust, +10 Pathos, +5 Authenticity",
          effects: { energy: -10, relation: 12, pathos: 10, spirit: 5 },
          outcomeText: "Sara walked out with her shoulders lowered, and your conversation gave you a living glimpse of what grace means in practice."
        },
        {
          label: "Try to pep-talk her into pushing through just this one more weekend",
          effectSummary: "-4 Energy, -10 Parish Trust, -5 Authenticity",
          effects: { energy: -4, relation: -10, spirit: -5 },
          outcomeText: "Sara agreed throughTight lips, but it felt hollow when you returned to writing about God's compassion."
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 6. PARISHIONERS IN THE PEWS
  // --------------------------------------------------------------------------
  parishioners: [
    {
      id: "margareta",
      name: "Margareta, 71",
      role: "Devoted Churchwarden",
      avatar: "👵",
      needs: { logos: 0.35, pathos: 0.35, spirit: 0.3 },
      bio: "Knows her Bible inside out, but longs to be seen and comforted—not taken for granted."
    },
    {
      id: "johan",
      name: "Johan, 42",
      role: "Overworked IT Architect",
      avatar: "👨‍💼",
      needs: { kairos: 0.45, logos: 0.3, rhetoric: 0.25 },
      bio: "Allergic to pious clichés. Listens intently when the sermon connects intellectual depth with the pressures of modern life."
    },
    {
      id: "sara",
      name: "Sara, 34",
      role: "Exhausted Parent of Toddlers",
      avatar: "👩",
      needs: { pathos: 0.45, rhetoric: 0.3, spirit: 0.25 },
      bio: "Slept four hours last night. Needs concrete imagery, warmth, and a Gospel that carries her when her strength runs out."
    },
    {
      id: "liam",
      name: "Liam, 15",
      role: "Confirmand in the Back Pew",
      avatar: "🧑",
      needs: { rhetoric: 0.4, kairos: 0.35, pathos: 0.25 },
      bio: "Zones out immediately if the pastor reads monotonously from a script, but perks up when preaching becomes honest and courageous."
    },
    {
      id: "bengt",
      name: "Bengt, 66",
      role: "Skeptical Retired Teacher",
      avatar: "👓",
      needs: { logos: 0.45, kairos: 0.35, rhetoric: 0.2 },
      bio: "Appreciates when the preacher actually knows the biblical text and historical context and doesn't dodge difficult passages."
    },
    {
      id: "agda",
      name: "Agda, 83",
      role: "Widow in the Front Pew",
      avatar: "🧣",
      needs: { spirit: 0.45, pathos: 0.35, logos: 0.2 },
      bio: "Senses immediately whether the preacher has prayed over the words or is merely delivering a lecture."
    }
  ],

  // --------------------------------------------------------------------------
  // 7. THE 4 ACTS OF THE SERMON (Sunday Pulpit Delivery)
  // --------------------------------------------------------------------------
  sermonSections: [
    {
      id: "exordium",
      number: 1,
      title: "1. Introduction & Hook (Exordium)",
      subtitle: "Awaken interest and name 'the itch'—why does this matter to us today?",
      primaryStat: "kairos",
      secondaryStat: "rhetoric"
    },
    {
      id: "explicatio",
      number: 2,
      title: "2. The World of the Text & Exegesis (Explicatio)",
      subtitle: "Open the biblical context, original language, and theological tension",
      primaryStat: "logos",
      secondaryStat: "rhetoric"
    },
    {
      id: "evangelium",
      number: 3,
      title: "3. The Turning Point & Grace (Evangelium)",
      subtitle: "Where our own efforts fail and Christ meets our deepest human need",
      primaryStat: "pathos",
      secondaryStat: "spirit"
    },
    {
      id: "applicatio",
      number: 4,
      title: "4. Sending & Concrete Life (Applicatio)",
      subtitle: "How do we live in this reality as we walk out the church doors on Monday morning?",
      primaryStat: "kairos",
      secondaryStat: "pathos"
    }
  ]
};

const UI_STRINGS = {
  sv: {
    pageTitle: "Predikoverkstaden – Från Text till Predikstol",
    appTitle: "Predikoverkstaden",
    appSubtitle: "Homiletiskt strategispel om pastorns vardag, textens mognad & söndagens predikan",
    lblSunday: "Söndag:",
    btnNewWeek: "🔄 Ny vecka",
    avatarMale: "👔 Avatar: Manlig",
    avatarFemale: "👚 Avatar: Kvinnlig",
    hintLabel: "💡 Ge mig ledtrådar",
    hintTooltip: "Slå på eller av tips, rekommendationer och målnivåer i gränssnittet",
    dndOn: "🔕 Ljudlös telefon: PÅ",
    dndOff: "🔔 Telefon: Öppen",
    soundOn: "🔊 Ljud: På",
    soundOff: "🔇 Ljud: Av",
    langBtn: "🇬🇧 English",
    meterEnergy: "⚡ Energi & Skärpa",
    meterEnergyTip: "Mental skärpa och ork. Låg energi sänker utbytet av studier och skrivande.",
    meterSpirit: "🕯️ Frimodighet (Ethos)",
    meterSpiritTip: "Andlig förankring och äkthet (Ethos). Stärks av bön, tystnad och goda vägval.",
    meterRelation: "🤝 Församlingsrelation",
    meterRelationTip: "Församlingens förtroende och hur lyhörda kyrkbänkarna är på söndag.",
    mapTitle: "⛪ Kyrkbacken & Pastorsexpeditionen",
    mapSubtitle: "Klicka på en byggnad eller skylt för att vandra dit – scenen roterar fram platsen och byter aktivitetstiles nedan.",
    logTitle: "📓 Pastorns Veckologg",
    pulpitPewsTitle: "👥 Kyrkbänkarna (Församlingens gensvar i realtid)",
    pulpitBadgeNow: "I PREDIKSTOLEN NU",
    scorePointsLabel: "Effektpoäng",
    btnPlayAgain: "🔄 Spela en ny predikovecka",
    shareHeading: "DELA DITT RESULTAT",
    btnShareNative: "Dela …",
    btnShareCopy: "Kopiera länk",
    btnShareMail: "E-post",
    shareCopiedMsg: "Länken är kopierad.",
    landingTitle: "Predikoverkstaden",
    landingLead: "Ett homiletiskt strategispel om pastorns vardag, textens mognad och söndagens predikan.",
    landingFriendHtml: (s) => `Någon har delat sitt resultat: <strong>${s} av 100 poäng</strong>. Kan du slå det?`,
    btnLandingPlay: "Spela",
    mobTabMap: "⛪ Kyrkbacke & Val",
    mobTabDesk: "📜 Skrivbord & Insikter",
    mobTabLog: "📓 Veckologg",
    hudText: "Text",
    hudOutline: "Struktur",
    hudDraft: (p) => `Manus ${p}%`,
    hudPulpit: "Övad",
    btnTutorial: "❓ Guide",
    tutStep1Pill: "STEG 1 AV 2 · VÄLJ PLATS",
    tutStep1Title: "👋 Välkommen till Predikoverkstaden!",
    tutStep1Body:
      "Du har 15 arbetspass (tisdag–lördag) på dig att förbereda söndagens predikan. Börja med att välja var prästen ska befinna sig: klicka på någon av de upplysta platsknapparna nedan (eller direkt på en byggnad på kyrkbacken).",
    tutStep1Next: "Nästa: Visa aktiviteter →",
    tutStep2Pill: "STEG 2 AV 2 · VÄLJ AKTIVITET",
    tutStep2Title: "✨ Välj vad du vill ägna passet åt",
    tutStep2Body:
      "Varje plats har sina egna aktiviteter – från bibelstudium, tidningsläsning och själavård till bön, skrivande och vila. Klicka på en av de upplysta aktivitetsrutorna nedan för att genomföra ditt första pass!",
    tutStep2Done: "Börja spela! ⛪",
    tutSkip: "Stäng",
    evalRoutineHeading: "🎓 Homiletisk Processanalys (Arbetsrutin)",
    evalCoffeeHeading: "☕ Röster vid Kyrkkaffet",
    deskTitle: "📜 Predikoverkstaden (Skrivbordet)",
    deskContextLabel: "Veckans kontext:",
    deskHomileticHint: "Homiletisk ledtråd:",
    deskChecklistHeading: "🧭 Manus & Förberedelsestatus",
    deskFormHeading: "📐 Predikans Form (Homiletisk inriktning)",
    deskSynergiesHeading: "✨ Upplåsta Arbetsrutin-synergier",
    deskInsightsHeading: "💡 Upplåsta Insikter under veckan",
    disruptionPrompt: "Hur hanterar du situationen?",
    sundayNode: "🔔 Söndag",
    passWord: "Pass",
    sundayServiceTime: "🔔 <strong>Söndag kl. 11:00 – Högmässa</strong>",
    sundayActOf: "Predikans akt",
    sundayCoffeeTime: "☕ <strong>Söndag kl. 12:30 – Kyrkkaffe & Utvärdering</strong>",
    echoActiveHint: (n) => `🌱 Textens eko aktivt (${n}/4 inkubationsmöten)`,
    echoActive: "🌱 Textens eko aktivt",
    echoInactiveHint: "💤 Texten oläst (Läs bibeltexten i Arbetsrummet!)",
    echoInactive: "💤 Texten oläst",
    initialThought: "Måndagens ledighet är över. Söndagens bibeltext ligger uppslagen på skrivbordet...",
    initialLogTime: "Tisdag morgon",
    initialLogTitle: (t) => `Ny predikovecka: ${t}`,
    initialLogDetail: (r) => `Söndagens text: ${r}.`,
    initialLogHint: "Tips: Börja gärna med att närläsa bibeltexten i Arbetsrummet så att den får ligga och gro under veckans möten!",
    exhaustedToast: "⚠️ Du är alldeles för utmattad! Gå till Prästgården för vila eller Kyrkorummet för stilla bön.",
    diminishNote: (n) => `⚠️ **Avtagande utbyte (${n}:a gången):** Utan nya perspektiv från andra platser går tankarna i cirklar.`,
    diminishBadge: (n) => `⚠️ Körts ${n} ggr`,
    diminishTitle: "Avtagande marginalnytta vid upprepning",
    countBadge: (n) => `Körts ${n}x`,
    energyDrain: (n, ev) => `⚡ -${n} Energi${ev ? " (Kväll)" : ""}`,
    energyRestore: (n) => `🌿 +${n} Energi`,
    recStart: "🌟 Rekommenderad start!",
    recBridge: "🌉 Redo för brobygge!",
    recWrite: "✍️ Skrivläge!",
    recPractice: "🎙️ Öva i kyrkan!",
    recRest: "🌙 Lördagsfrid!",
    recForm: "🌟 Passar söndagen",
    goalWord: "mål",
    targetTip: "Rekommenderad nivå för söndagens text",
    pillarLogos: "Exegetik & Textdjup (Logos)",
    pillarKairos: "Samtid & Kultur (Kairos)",
    pillarPathos: "Själavård & Närhet (Pathos)",
    pillarRhetoric: "Retorik & Gestaltning",
    chkExegesis: "Bibeltexten närläst",
    chkStructure: (q) => `Struktur (${q}%)`,
    chkDraft: (p) => `Manusutkast (${p}%)`,
    chkPolished: "Språk & Predikstol övad",
    emptySynergiesHint: "Inga rutinbonusar upplåsta ännu. Tips: Börja med bibeltexten i Arbetsrummet och kombinera med tidningsläsning, bön och möten!",
    emptySynergies: "Inga arbetsrutin-synergier upplåsta ännu.",
    emptyInsights: "Inga specifika predikoinsikter samlade ännu. Utforska bibeltexten, samtiden och möten med människor under veckan!",
    catLogos: "📜 Exeges",
    catKairos: "📰 Samtid",
    catPathos: "❤️ Själavård",
    gainLogos: "Exeges",
    gainKairos: "Samtid",
    gainPathos: "Själavård",
    gainRhetoric: "Retorik",
    gainSpirit: "Frimodighet",
    insightToast: (t) => `💡 Ny insikt upplåst: »${t}«! Den ligger nu i din insiktslista till höger inför söndagen.`,
    synergyToast: (t, p) => `✨ Rutinbonus upplåst: ${t} (+${p}p)`,
    disruptionLogTime: "Störningsmoment",
    pulpitSubtitleTip: " — Tips: Variera ditt grepp mellan akterna så att predikan får en levande retorisk båge!",
    moodMoved: "🥹 Djupt berörd",
    moodNodding: "🙂 Nickar instämmande",
    moodWaiting: "😐 Lyssnar avvaktande",
    moodRestless: "😒 Skruvar på sig i bänken",
    impactWord: "Beröring",
    days: [
      { index: 0, name: "Tisdag", theme: "Inlyssnandets dag", phase: "early" },
      { index: 1, name: "Onsdag", theme: "Fördjupningens dag", phase: "early_mid" },
      { index: 2, name: "Torsdag", theme: "Brobyggets dag", phase: "mid" },
      { index: 3, name: "Fredag", theme: "Gestaltningens dag", phase: "mid_late" },
      { index: 4, name: "Lördag", theme: "Mognadens dag", phase: "late" }
    ],
    slots: [
      { index: 0, name: "Förmiddag", time: "08:30–12:00", icon: "🌅", isEvening: false },
      { index: 1, name: "Eftermiddag", time: "13:00–17:00", icon: "☀️", isEvening: false },
      { index: 2, name: "Kväll", time: "18:30–21:30", icon: "🌙", isEvening: true }
    ],
    synergies: {
      early_seed: {
        title: "Tidig Sådd (Tis–Ons)",
        description: "Du läste grundtexten tidigt i veckan så att den får gro i det undermedvetna."
      },
      barth_double: {
        title: "Karl Barths Dubbelblick",
        description: "Bibeln i ena handen och tidningen i den andra under samma dag!"
      },
      stott_bridge: {
        title: "John Stotts Brobygge",
        description: "Du skissade predikans struktur med förankring i både Bibelns värld, samtiden och själavården."
      },
      embodied_word: {
        title: "Förkroppsligat Ord",
        description: "Du övade ett färdigt utkast på plats i predikstolen så att orden kan bäras med fri blick."
      },
      lectio_divina: {
        title: "Lectio Divina (Studium & Bön)",
        description: "Du förenade intellektuellt bibelstudium med bön vid altaret."
      },
      incubation_walk: {
        title: "Homiletisk Inkubation",
        description: "När du släppte taget och gick ut i skogen föll predikans pusselbitar på plats av sig själva."
      },
      saturday_peace: {
        title: "Lördagsfrid i Prästgården",
        description: "Du var väl förberedd och kunde gå till vila i tid på lördagskvällen."
      }
    }
  },

  en: {
    pageTitle: "The Homiletics Workshop – From Text to Pulpit",
    appTitle: "The Homiletics Workshop",
    appSubtitle: "A homiletical strategy game of pastoral life, textual incubation & Sunday preaching",
    lblSunday: "Sunday:",
    btnNewWeek: "🔄 New Week",
    avatarMale: "👔 Avatar: Male",
    avatarFemale: "👚 Avatar: Female",
    hintLabel: "💡 Give me hints",
    hintTooltip: "Toggle homiletical hints, recommendations, and target markers in the interface",
    dndOn: "🔕 Phone Muted: ON",
    dndOff: "🔔 Phone: Open",
    soundOn: "🔊 Sound: On",
    soundOff: "🔇 Sound: Off",
    langBtn: "🇸🇪 Svenska",
    meterEnergy: "⚡ Energy & Sharpness",
    meterEnergyTip: "Mental focus and stamina. Low energy reduces the yield of study and writing.",
    meterSpirit: "🕯️ Authenticity (Ethos)",
    meterSpiritTip: "Spiritual grounding and inner authenticity (Ethos). Strengthened by prayer, silence, and faithful choices.",
    meterRelation: "🤝 Parish Trust",
    meterRelationTip: "The congregation's trust and how receptive the pews will be on Sunday morning.",
    mapTitle: "⛪ The Parish Green & Study",
    mapSubtitle: "Click a building or label to walk there—the scene rotates the location to the front and swaps the activity tiles below.",
    logTitle: "📓 Pastor's Weekly Journal",
    pulpitPewsTitle: "👥 The Pews (Live Congregation Response)",
    pulpitBadgeNow: "IN THE PULPIT NOW",
    scorePointsLabel: "Impact Score",
    btnPlayAgain: "🔄 Play Another Preaching Week",
    shareHeading: "SHARE YOUR RESULT",
    btnShareNative: "Share …",
    btnShareCopy: "Copy link",
    btnShareMail: "Email",
    shareCopiedMsg: "Link copied.",
    landingTitle: "The Homiletics Workshop",
    landingLead: "A homiletical strategy game of pastoral life, textual incubation, and Sunday preaching.",
    landingFriendHtml: (s) => `Someone shared their result: <strong>${s} out of 100 points</strong>. Can you beat it?`,
    btnLandingPlay: "Play",
    mobTabMap: "⛪ Parish & Actions",
    mobTabDesk: "📜 Desk & Insights",
    mobTabLog: "📓 Journal",
    hudText: "Text",
    hudOutline: "Outline",
    hudDraft: (p) => `Draft ${p}%`,
    hudPulpit: "Pulpit",
    btnTutorial: "❓ Guide",
    tutStep1Pill: "STEP 1 OF 2 · CHOOSE LOCATION",
    tutStep1Title: "👋 Welcome to The Homiletics Workshop!",
    tutStep1Body:
      "You have 15 sessions (Tuesday–Saturday) to prepare Sunday's sermon. First, choose where the pastor walks: click one of the glowing location buttons below (or a building on the Parish Green).",
    tutStep1Next: "Next: Show Activities →",
    tutStep2Pill: "STEP 2 OF 2 · CHOOSE ACTIVITY",
    tutStep2Title: "✨ Choose an Activity for This Session",
    tutStep2Body:
      "Each location offers unique activities—from exegesis, reading the news, and pastoral care to prayer, drafting, and rest. Click any glowing activity card below to begin your week!",
    tutStep2Done: "Start Playing! ⛪",
    tutSkip: "Close",
    evalRoutineHeading: "🎓 Homiletical Process Analysis (Work Routine)",
    evalCoffeeHeading: "☕ Voices at Church Coffee Hour",
    deskTitle: "📜 The Sermon Desk",
    deskContextLabel: "Weekly Context:",
    deskHomileticHint: "Homiletical Hint:",
    deskChecklistHeading: "🧭 Manuscript & Preparation Status",
    deskFormHeading: "📐 Sermon Form (Homiletical Approach)",
    deskSynergiesHeading: "✨ Unlocked Routine Synergies",
    deskInsightsHeading: "💡 Unlocked Insights This Week",
    disruptionPrompt: "How do you handle the situation?",
    sundayNode: "🔔 Sunday",
    passWord: "Session",
    sundayServiceTime: "🔔 <strong>Sunday 11:00 AM – High Mass</strong>",
    sundayActOf: "Sermon Act",
    sundayCoffeeTime: "☕ <strong>Sunday 12:30 PM – Coffee Hour & Evaluation</strong>",
    echoActiveHint: (n) => `🌱 Echo of the Text active (${n}/4 incubation encounters)`,
    echoActive: "🌱 Echo of the Text active",
    echoInactiveHint: "💤 Text unread (Read the biblical text in The Study!)",
    echoInactive: "💤 Text unread",
    initialThought: "Monday's day off is over. Sunday's biblical text lies open on the desk...",
    initialLogTime: "Tuesday morning",
    initialLogTitle: (t) => `New Preaching Week: ${t}`,
    initialLogDetail: (r) => `Sunday's text: ${r}.`,
    initialLogHint: "Tip: Start by close-reading the biblical text in The Study so it can germinate during the week's encounters!",
    exhaustedToast: "⚠️ You are far too exhausted! Go to The Parsonage to rest or The Sanctuary for quiet prayer.",
    diminishNote: (n) => `⚠️ **Diminishing returns (#${n}):** Without fresh perspectives from other places, your thoughts are going in circles.`,
    diminishBadge: (n) => `⚠️ Done ${n}x`,
    diminishTitle: "Diminishing marginal returns from repetition",
    countBadge: (n) => `Done ${n}x`,
    energyDrain: (n, ev) => `⚡ -${n} Energy${ev ? " (Evening)" : ""}`,
    energyRestore: (n) => `🌿 +${n} Energy`,
    recStart: "🌟 Recommended start!",
    recBridge: "🌉 Ready for bridge-building!",
    recWrite: "✍️ Ready to draft!",
    recPractice: "🎙️ Rehearse in church!",
    recRest: "🌙 Saturday peace!",
    recForm: "🌟 Fits this Sunday",
    goalWord: "goal",
    targetTip: "Recommended level for Sunday's text",
    pillarLogos: "Exegesis & Textual Depth (Logos)",
    pillarKairos: "Culture & Context (Kairos)",
    pillarPathos: "Pastoral Empathy (Pathos)",
    pillarRhetoric: "Rhetoric & Delivery",
    chkExegesis: "Biblical text close-read",
    chkStructure: (q) => `Outline (${q}%)`,
    chkDraft: (p) => `Manuscript Draft (${p}%)`,
    chkPolished: "Polished & Rehearsed",
    emptySynergiesHint: "No routine synergies unlocked yet. Tip: Start with the biblical text in The Study and combine with newspapers, prayer, and pastoral encounters!",
    emptySynergies: "No work-routine synergies unlocked yet.",
    emptyInsights: "No specific sermon insights gathered yet. Explore the biblical text, contemporary life, and pastoral encounters during the week!",
    catLogos: "📜 Exegesis",
    catKairos: "📰 Context",
    catPathos: "❤️ Pastoral",
    gainLogos: "Exegesis",
    gainKairos: "Context",
    gainPathos: "Pastoral",
    gainRhetoric: "Rhetoric",
    gainSpirit: "Authenticity",
    insightToast: (t) => `💡 New insight unlocked: “${t}”! It has been added to your insight list on the right for Sunday.`,
    synergyToast: (t, p) => `✨ Routine Synergy Unlocked: ${t} (+${p} pts)`,
    disruptionLogTime: "Interruption",
    pulpitSubtitleTip: " — Tip: Vary your approach across the four acts so the sermon builds a living rhetorical arc!",
    moodMoved: "🥹 Deeply moved",
    moodNodding: "🙂 Nodding in agreement",
    moodWaiting: "😐 Listening attentively",
    moodRestless: "😒 Shifting in the pew",
    impactWord: "Resonance",
    days: [
      { index: 0, name: "Tuesday", theme: "Day of Listening", phase: "early" },
      { index: 1, name: "Wednesday", theme: "Day of Deepening", phase: "early_mid" },
      { index: 2, name: "Thursday", theme: "Day of Bridge-Building", phase: "mid" },
      { index: 3, name: "Friday", theme: "Day of Shaping", phase: "mid_late" },
      { index: 4, name: "Saturday", theme: "Day of Maturation", phase: "late" }
    ],
    slots: [
      { index: 0, name: "Morning", time: "08:30–12:00", icon: "🌅", isEvening: false },
      { index: 1, name: "Afternoon", time: "13:00–17:00", icon: "☀️", isEvening: false },
      { index: 2, name: "Evening", time: "18:30–21:30", icon: "🌙", isEvening: true }
    ],
    synergies: {
      early_seed: {
        title: "Early Sowing (Tue–Wed)",
        description: "You read the biblical text early in the week so it could germinate in your subconscious."
      },
      barth_double: {
        title: "Karl Barth's Double Vision",
        description: "The Bible in one hand and the newspaper in the other on the very same day!"
      },
      stott_bridge: {
        title: "John Stott's Bridge-Building",
        description: "You sketched the sermon structure anchored in both the biblical world, contemporary life, and pastoral care."
      },
      embodied_word: {
        title: "Embodied Word",
        description: "You rehearsed a completed draft in the pulpit so the words can be delivered with free eye contact."
      },
      lectio_divina: {
        title: "Lectio Divina (Study & Prayer)",
        description: "You united intellectual biblical study with contemplative prayer at the altar."
      },
      incubation_walk: {
        title: "Homiletic Incubation",
        description: "When you let go of the desk and walked in the woods, the pieces of the sermon fell into place on their own."
      },
      saturday_peace: {
        title: "Saturday Peace at the Parsonage",
        description: "You finished preparing in time and rested on Saturday evening."
      }
    }
  }
};

if (typeof window !== "undefined") {
  window.GAME_DATA_SV = window.GAME_DATA;
  window.GAME_DATA_EN = GAME_DATA_EN;
  window.UI_STRINGS = UI_STRINGS;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { GAME_DATA_EN, UI_STRINGS };
}
