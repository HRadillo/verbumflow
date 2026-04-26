import sourceConjugations from "../../docs/references/french_conjugations.json";

export type VerbTenses = {
  [key: string]: {
    [key: string]: string;
  };
};

export type VerbData = {
  [key: string]: VerbTenses;
};

type RawConjugationEntry = {
  translation_en?: string;
  moods?: Record<string, Record<string, string>>;
};

const SOURCE_TO_APP_TENSE: Record<string, string> = {
  "indicatif présent": "Présent",
  "indicatif imparfait": "Imparfait",
  "indicatif futur-simple": "Futur simple",
  "indicatif passé-composé": "Passé composé",
  "indicatif plus-que-parfait": "Plus-que-parfait",
  "conditionnel présent": "Conditionnel Présent",
  "subjonctif présent": "Subjonctif Présent",
  "participe participe-passé": "Participe passé",
};

const standardPronouns: [string, string[]][] = [
  ["je", ["je", "j'"]],
  ["tu", ["tu"]],
  ["il/elle", ["il", "elle", "on"]],
  ["nous", ["nous"]],
  ["vous", ["vous"]],
  ["ils/elles", ["ils", "elles"]],
];

const subjPronouns: [string, string[]][] = [
  ["que je", ["je", "j'"]],
  ["que tu", ["tu"]],
  ["qu'il/elle", ["il", "elle", "on"]],
  ["que nous", ["nous"]],
  ["que vous", ["vous"]],
  ["qu'ils/elles", ["ils", "elles"]],
];

function pickFirstPronounValue(source: Record<string, string>, candidates: string[]): string | null {
  for (const key of candidates) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

function mapPronouns(source: Record<string, string>, isSubjunctive: boolean): Record<string, string> {
  if (source._?.trim()) {
    return { "(participe)": source._.trim() };
  }

  const mapped: Record<string, string> = {};
  const mapping = isSubjunctive ? subjPronouns : standardPronouns;

  for (const [targetKey, candidates] of mapping) {
    const value = pickFirstPronounValue(source, candidates);
    if (value) {
      mapped[targetKey] = value;
    }
  }

  return mapped;
}

function buildVerbDataFromSource(raw: Record<string, RawConjugationEntry>): VerbData {
  const built: VerbData = {};

  for (const [verb, payload] of Object.entries(raw)) {
    const moods = payload.moods ?? {};
    const perVerb: VerbTenses = {};

    for (const [sourceTense, sourcePronouns] of Object.entries(moods)) {
      const mappedTense = SOURCE_TO_APP_TENSE[sourceTense];
      if (!mappedTense) continue;

      const mappedPronouns = mapPronouns(
        sourcePronouns,
        mappedTense === "Subjonctif Présent"
      );

      if (Object.keys(mappedPronouns).length > 0) {
        perVerb[mappedTense] = mappedPronouns;
      }
    }

    if (Object.keys(perVerb).length > 0) {
      built[verb] = perVerb;
    }
  }

  return built;
}

export const verbData: VerbData = buildVerbDataFromSource(
  sourceConjugations as Record<string, RawConjugationEntry>
);

const rules: Record<string, Record<string, string>> = {
    "Présent": {
        "er": "For regular -er verbs, drop the -er and add endings: -e, -es, -e, -ons, -ez, -ent.",
        "ir": "For regular -ir verbs, drop the -ir and add endings: -is, -is, -it, -issons, -issez, -issent.",
        "re": "For regular -re verbs, drop the -re and add endings: -s, -s, -, -ons, -ez, -ent.",
        "g-er": "For verbs ending in -ger, add an 'e' before the '-ons' ending in the 'nous' form (e.g., nous mangeons).",
        "c-er": "For verbs ending in -cer, the 'c' becomes 'ç' before the '-ons' ending in the 'nous' form (e.g., nous commençons).",
        "y-er": "For verbs ending in -yer, the 'y' becomes an 'i' before a silent 'e' (e.g., je nettoie).",
        "e-consonant-er": "For verbs with 'e' as the second to last vowel, change 'e' to 'è' before a silent 'e' (e.g., j'achète).",
        "é-consonant-er": "For verbs with 'é' as the second to last vowel, change 'é' to 'è' before a silent 'e', except in nous/vous forms (e.g., je préfère).",
        "appeler": "Verbs like 'appeler' or 'jeter' double the consonant before a silent 'e' (e.g. j'appelle, je jette).",
        "conduire": "Verbs ending in -uire (like conduire, traduire) follow this pattern: -uis, -uis, -uit, -uisons, -uisez, -uisent.",
        "craindre": "Verbs ending in -aindre, -eindre, -oindre (like craindre, peindre, joindre) follow this pattern: drop -dre, add -s, -s, -t, and 'gn' for plural forms.",
        "plaire": "Verbs like plaire and se taire have a circumflex on the 'i' in the 'il/elle' form: plaît.",
        "être": "Irregular verb. Memorize its forms.",
        "avoir": "Irregular verb. Memorize its forms.",
        "aller": "Irregular verb. Memorize its forms.",
        "faire": "Irregular verb. Memorize its forms.",
        "pouvoir": "Irregular verb with stem changes (peux, peux, peut, peuvent).",
        "vouloir": "Irregular verb with stem changes (veux, veux, veut, veulent).",
        "savoir": "Irregular verb. Memorize its forms.",
        "dire": "Irregular verb. Note 'vous dites'.",
        "mettre": "Irregular -re verb, follows a pattern like 'battre'.",
        "prendre": "Irregular verb. Note the double 'n' in the 'ils/elles' form.",
        "voir": "Irregular verb with stem changes in nous/vous forms.",
        "devoir": "Irregular verb with stem changes (dois, dois, doit, doivent).",
        "venir": "Irregular verb with stem changes (viens, viens, vient, viennent). 'nous' and 'vous' are regular.",
        "croire": "Irregular verb. Note 'y' in nous/vous forms.",
        "boire": "Irregular verb with stem changes (boi- to buv-).",
        "recevoir": "Irregular verb with stem change 'ç' before 'o' or 'u'.",
        "dormir": "Irregular -ir verb. Drops 'm' for singular forms.",
        "courir": "Irregular verb. Conjugates like a regular -ir verb but has irregular future/conditional stems.",
        "sentir": "Irregular -ir verb, similar pattern to 'dormir'.",
        "servir": "Irregular -ir verb, similar pattern to 'dormir'."
    },
    "Passé composé": {
        "default": "Formed with the present tense of the auxiliary verb ('avoir' or 'être') + the past participle of the main verb.",
        "être": "Most verbs use 'avoir'. Verbs of movement and reflexive verbs use 'être'. The past participle agrees in gender and number with the subject when 'être' is used."
    },
    "Imparfait": {
        "default": "Formed from the 'nous' form of the present tense. Drop the -ons and add the endings: -ais, -ais, -ait, -ions, -iez, -aient.",
        "être": "'être' is the only verb with an irregular stem for the imparfait: 'ét-'."
    },
    "Futur simple": {
        "default": "For regular verbs, add the future endings to the infinitive: -ai, -as, -a, -ons, -ez, -ont.",
        "re": "For -re verbs, drop the final 'e' from the infinitive before adding the endings.",
        "y-er": "For verbs ending in -yer, the 'y' becomes an 'i' in the future stem (e.g. nettoyer -> nettoier-).",
        "e-consonant-er": "For verbs like acheter, the 'e' becomes 'è' in the future stem (e.g. achèter-).",
        "appeler": "Verbs like 'appeler' double the 'l' in the future stem (appeller-).",
        "irregular": "Many common verbs have irregular stems in the futur simple. These must be memorized."
    },
    "Plus-que-parfait": {
      "default": "The 'pluperfect' is formed with the imparfait of the auxiliary verb ('avoir' or 'être') + the past participle. It describes an action that happened before another past action."
    },
    "Conditionnel Présent": {
      "default": "Uses the same stem as the Futur Simple. Add the imparfait endings: -ais, -ais, -ait, -ions, -iez, -aient."
    },
    "Subjonctif Présent": {
      "default": "Stem comes from the 'ils/elles' form of the present tense. Drop '-ent' and add subjunctive endings: -e, -es, -e, -ions, -iez, -ent. The nous/vous forms often resemble the imparfait.",
      "irregular": "Some verbs like avoir, être, aller, faire, savoir, vouloir, pouvoir have irregular subjunctive forms that must be memorized."
    },
    "Impératif Présent": {
        "default": "Commands. Forms for 'tu', 'nous', 'vous'. 'tu' form is usually the same as the 'je' present tense form (for -er verbs, drop the final 's'). 'nous' and 'vous' forms are the same as the present tense.",
        "irregular": "Avoir, être, and savoir have irregular imperative forms."
    }
  };
  
  const tips: Record<string, Record<string, string>> = {
    "Présent": {
        "er": "Think 'parler': je parle, tu parles, il parle, nous parlons, vous parlez, ils parlent.",
        "ir": "Think 'finir': je finis, tu finis, il finit, nous finissons, vous finissez, ils finissent.",
        "re": "Think 'vendre': je vends, tu vends, il vend, nous vendons, vous vendez, ils vendent.",
        "c-er": "The 'c' needs to stay soft, like an 's' sound. 'ç' makes it happen before the 'o'.",
        "g-er": "The 'g' needs to stay soft, like a 'j' sound. The 'e' makes it happen before the 'o'."
    },
    "Passé composé": {
        "être": "Remember DR MRS VANDERTRAMP for verbs that use 'être': Devenir, Revenir, Monter, Rester, Sortir, Venir, Aller, Naître, Descendre, Entrer, Rentrer, Tomber, Retourner, Arriver, Mourir, Partir."
    },
    "Imparfait": {
        "default": "The 'imperfect' describes past actions that were ongoing, habitual, or descriptive. Think 'was/were ...ing' or 'used to'."
    },
    "Futur simple": {
        "irregular": "Common irregular future stems: aller (ir-), avoir (aur-), être (ser-), faire (fer-), voir (ver-), envoyer (enverr-)."
    },
    "Conditionnel Présent": {
        "default": "Often translates to 'would' in English. It's used for polite requests, hypotheticals, and future-in-the-past."
    },
    "Subjonctif Présent": {
        "default": "Used to express doubt, desire, emotion, or uncertainty. Look for trigger phrases like 'il faut que...' or 'je veux que...'. The 'que' is a big clue!"
    },
    "Impératif Présent": {
        "er": "For regular -er verbs, the 'tu' command drops the final 's' (e.g., 'Parle !'), unless it's followed by 'y' or 'en'."
    }
  };

  export function getRule(verb: string, tense: string): { rule: string | null; tip: string | null } {
    let specialCase: string | null = null;
    let verbGroup = "default";

    if (verb.endsWith("er")) verbGroup = "er";
    if (verb.endsWith("ir")) verbGroup = "ir";
    if (verb.endsWith("re")) verbGroup = "re";

    // Tense-specific logic
    if (tense === "Présent") {
        if (verb.endsWith("ger")) specialCase = "g-er";
        else if (verb.endsWith("cer")) specialCase = "c-er";
        else if (verb.endsWith("yer")) specialCase = "y-er";
        else if (verb === "acheter" || verb === "lever") specialCase = "e-consonant-er";
        else if (verb.endsWith("ébrer") || verb.endsWith("écer") || verb.endsWith("émer") || verb.endsWith("éner") || verb.endsWith("éper") || verb.endsWith("éser") || verb.endsWith("éter") || verb.endsWith("étrer") || verb.endsWith("éyer")) specialCase = "é-consonant-er";
        else if (verb === "appeler" || verb === "jeter") specialCase = "appeler";
        else if (["conduire", "traduire", "produire"].includes(verb)) specialCase = "conduire";
        else if (["craindre", "peindre", "joindre"].includes(verb)) specialCase = "craindre";
    }

    if (tense === "Futur simple") {
        if (verb.endsWith("yer")) specialCase = "y-er";
        else if (verb === "acheter") specialCase = "e-consonant-er";
        else if (verb === "appeler") specialCase = "appeler";
    }

    if (tense === "Subjonctif Présent") {
        const irregularSubjunctive = ["avoir", "être", "aller", "faire", "pouvoir", "savoir", "vouloir"];
        if (irregularSubjunctive.includes(verb)) {
            specialCase = "irregular";
        }
    }
    
    if (tense === "Impératif Présent") {
        const irregularImperative = ["avoir", "être", "savoir"];
        if (irregularImperative.includes(verb)) specialCase = "irregular";
        else if (verb.endsWith("er")) specialCase = "er";
    }
    
    // Check for fully irregular verbs that have their own rules
    if (rules[tense]?.[verb]) {
      specialCase = verb;
    }


    const specialCaseRule = specialCase ? rules[tense]?.[specialCase] : null;
    const specialCaseTip = specialCase ? tips[tense]?.[specialCase] : null;
    let rule = specialCaseRule || rules[tense]?.[verbGroup] || rules[tense]?.default || null;
    let tip = specialCaseTip || tips[tense]?.[verbGroup] || tips[tense]?.default || null;

    if (tense === "Futur simple" || tense === "Conditionnel Présent") {
        const irregularStems = ["aller", "avoir", "être", "faire", "voir", "pouvoir", "vouloir", "savoir", "devoir", "venir", "envoyer", "recevoir", "courir", "mourir"];
        if (irregularStems.includes(verb)) {
            rule = rule || rules[tense]?.irregular;
            tip = tip || tips[tense]?.irregular;
        }
    }
     if (tense === "Passé composé" || tense === "Plus-que-parfait") {
        const etreVerbs = ["aller", "venir", "partir", "rester", "passer", "devenir", "mourir", "descendre", "naître", "monter", "rentrer", "sortir", "tomber", "retourner", "arriver"];
        if (etreVerbs.includes(verb)) {
            tip = tips["Passé composé"]?.["être"] || tip;
        }
    }

    return { rule, tip };
  }
  
  export const verbs = Object.keys(verbData);
  
  export const tenses = Array.from(
    new Set(Object.values(verbData).flatMap((tenses) => Object.keys(tenses)))
  );
  
  export const pronouns = Array.from(
    new Set(
      Object.values(verbData).flatMap((tenses) =>
        Object.values(tenses).flatMap((pronouns) => Object.keys(pronouns))
      )
    )
  );
  
  export const allConjugations = Array.from(new Set(
    Object.values(verbData).flatMap(tenses => 
      Object.values(tenses).flatMap(pronouns => Object.values(pronouns))
    )
  ));
  
