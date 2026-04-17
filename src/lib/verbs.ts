
export type VerbTenses = {
  [key: string]: {
    [key: string]: string;
  };
};

export type VerbData = {
  [key: string]: VerbTenses;
};

export const verbData: VerbData = {
    "être": {
      "Présent": { "je": "suis", "tu": "es", "il/elle": "est", "nous": "sommes", "vous": "êtes", "ils/elles": "sont" },
      "Imparfait": { "j'": "étais", "tu": "étais", "il/elle": "était", "nous": "étions", "vous": "étiez", "ils/elles": "étaient" },
      "Futur simple": { "je": "serai", "tu": "seras", "il/elle": "sera", "nous": "serons", "vous": "serez", "ils/elles": "seront" },
      "Passé composé": { "j'": "ai été", "tu": "as été", "il/elle": "a été", "nous": "avons été", "vous": "avez été", "ils/elles": "ont été" },
      "Plus-que-parfait": { "j'": "avais été", "tu": "avais été", "il/elle": "avait été", "nous": "avions été", "vous": "aviez été", "ils/elles": "avaient été" },
      "Conditionnel Présent": { "je": "serais", "tu": "serais", "il/elle": "serait", "nous": "serions", "vous": "seriez", "ils/elles": "seraient" },
      "Subjonctif Présent": { "que je": "sois", "que tu": "sois", "qu'il/elle": "soit", "que nous": "soyons", "que vous": "soyez", "qu'ils/elles": "soient" },
      "Impératif Présent": { "tu": "sois", "nous": "soyons", "vous": "soyez" }
    },
    "avoir": {
      "Présent": { "j'": "ai", "tu": "as", "il/elle": "a", "nous": "avons", "vous": "avez", "ils/elles": "ont" },
      "Imparfait": { "j'": "avais", "tu": "avais", "il/elle": "avait", "nous": "avions", "vous": "aviez", "ils/elles": "avaient" },
      "Futur simple": { "j'": "aurai", "tu": "auras", "il/elle": "aura", "nous": "aurons", "vous": "aurez", "ils/elles": "auront" },
      "Passé composé": { "j'": "ai eu", "tu": "as eu", "il/elle": "a eu", "nous": "avons eu", "vous": "avez eu", "ils/elles": "ont eu" },
      "Plus-que-parfait": { "j'": "avais eu", "tu": "avais eu", "il/elle": "avait eu", "nous": "avions eu", "vous": "aviez eu", "ils/elles": "avaient eu" },
      "Conditionnel Présent": { "j'": "aurais", "tu": "aurais", "il/elle": "aurait", "nous": "aurions", "vous": "auriez", "ils/elles": "auraient" },
      "Subjonctif Présent": { "que j'": "aie", "que tu": "aies", "qu'il/elle": "ait", "que nous": "ayons", "que vous": "ayez", "qu'ils/elles": "aient" },
      "Impératif Présent": { "tu": "aie", "nous": "ayons", "vous": "ayez" }
    },
    "aller": {
      "Présent": { "je": "vais", "tu": "vas", "il/elle": "va", "nous": "allons", "vous": "allez", "ils/elles": "vont" },
      "Imparfait": { "j'": "allais", "tu": "allais", "il/elle": "allait", "nous": "allions", "vous": "alliez", "ils/elles": "allaient" },
      "Futur simple": { "j'": "irai", "tu": "iras", "il/elle": "ira", "nous": "irons", "vous": "irez", "ils/elles": "iront" },
      "Passé composé": { "je": "suis allé(e)", "tu": "es allé(e)", "il/elle": "est allé(e)", "nous": "sommes allé(e)s", "vous": "êtes allé(e)(s)", "ils/elles": "sont allé(e)s" },
      "Plus-que-parfait": { "j'": "étais allé(e)", "tu": "étais allé(e)", "il/elle": "était allé(e)", "nous": "étions allé(e)s", "vous": "étiez allé(e)(s)", "ils/elles": "étaient allé(e)s" },
      "Conditionnel Présent": { "j'": "irais", "tu": "irais", "il/elle": "irait", "nous": "irions", "vous": "iriez", "ils/elles": "iraient" },
      "Subjonctif Présent": { "que j'": "aille", "que tu": "ailles", "qu'il/elle": "aille", "que nous": "allions", "que vous": "alliez", "qu'ils/elles": "aillent" },
      "Impératif Présent": { "tu": "va", "nous": "allons", "vous": "allez" }
    },
    "parler": {
      "Présent": { "je": "parle", "tu": "parles", "il/elle": "parle", "nous": "parlons", "vous": "parlez", "ils/elles": "parlent" },
      "Imparfait": { "je": "parlais", "tu": "parlais", "il/elle": "parlait", "nous": "parlions", "vous": "parliez", "ils/elles": "parlaient" },
      "Futur simple": { "je": "parlerai", "tu": "parleras", "il/elle": "parlera", "nous": "parlerons", "vous": "parlerez", "ils/elles": "parleront" },
      "Passé composé": { "j'": "ai parlé", "tu": "as parlé", "il/elle": "a parlé", "nous": "avons parlé", "vous": "avez parlé", "ils/elles": "ont parlé" },
      "Plus-que-parfait": { "j'": "avais parlé", "tu": "avais parlé", "il/elle": "avait parlé", "nous": "avions parlé", "vous": "aviez parlé", "ils/elles": "avaient parlé" },
      "Conditionnel Présent": { "je": "parlerais", "tu": "parlerais", "il/elle": "parlerait", "nous": "parlerions", "vous": "parleriez", "ils/elles": "parleraient" },
      "Subjonctif Présent": { "que je": "parle", "que tu": "parles", "qu'il/elle": "parle", "que nous": "parlions", "que vous": "parliez", "qu'ils/elles": "parlent" },
      "Impératif Présent": { "tu": "parle", "nous": "parlons", "vous": "parlez" }
    },
    "finir": {
      "Présent": { "je": "finis", "tu": "finis", "il/elle": "finit", "nous": "finissons", "vous": "finissez", "ils/elles": "finissent" },
      "Imparfait": { "je": "finissais", "tu": "finissais", "il/elle": "finissait", "nous": "finissions", "vous": "finissiez", "ils/elles": "finissaient" },
      "Futur simple": { "je": "finirai", "tu": "finiras", "il/elle": "finira", "nous": "finirons", "vous": "finirez", "ils/elles": "finiront" },
      "Passé composé": { "j'": "ai fini", "tu": "as fini", "il/elle": "a fini", "nous": "avons fini", "vous": "avez fini", "ils/elles": "ont fini" },
      "Plus-que-parfait": { "j'": "avais fini", "tu": "avais fini", "il/elle": "avait fini", "nous": "avions fini", "vous": "aviez fini", "ils/elles": "avaient fini" },
      "Conditionnel Présent": { "je": "finirais", "tu": "finirais", "il/elle": "finirait", "nous": "finirions", "vous": "finiriez", "ils/elles": "finiraient" },
      "Subjonctif Présent": { "que je": "finisse", "que tu": "finisses", "qu'il/elle": "finisse", "que nous": "finissions", "que vous": "finissiez", "qu'ils/elles": "finissent" },
      "Impératif Présent": { "tu": "finis", "nous": "finissons", "vous": "finissez" }
    },
    "vendre": {
        "Présent": { "je": "vends", "tu": "vends", "il/elle": "vend", "nous": "vendons", "vous": "vendez", "ils/elles": "vendent" },
        "Imparfait": { "je": "vendais", "tu": "vendais", "il/elle": "vendait", "nous": "vendions", "vous": "vendiez", "ils/elles": "vendaient" },
        "Futur simple": { "je": "vendrai", "tu": "vendras", "il/elle": "vendra", "nous": "vendrons", "vous": "vendrez", "ils/elles": "vendront" },
        "Passé composé": { "j'": "ai vendu", "tu": "as vendu", "il/elle": "a vendu", "nous": "avons vendu", "vous": "avez vendu", "ils/elles": "ont vendu" },
        "Plus-que-parfait": { "j'": "avais vendu", "tu": "avais vendu", "il/elle": "avait vendu", "nous": "avions vendu", "vous": "aviez vendu", "ils/elles": "avaient vendu" },
        "Conditionnel Présent": { "je": "vendrais", "tu": "vendrais", "il/elle": "vendrait", "nous": "vendrions", "vous": "vendriez", "ils/elles": "vendraient" },
        "Subjonctif Présent": { "que je": "vende", "que tu": "vendes", "qu'il/elle": "vende", "que nous": "vendions", "que vous": "vendiez", "qu'ils/elles": "vendent" },
        "Impératif Présent": { "tu": "vends", "nous": "vendons", "vous": "vendez" }
    },
    "faire": {
        "Présent": { "je": "fais", "tu": "fais", "il/elle": "fait", "nous": "faisons", "vous": "faites", "ils/elles": "font" },
        "Imparfait": { "je": "faisais", "tu": "faisais", "il/elle": "faisait", "nous": "faisions", "vous": "faisiez", "ils/elles": "faisaient" },
        "Futur simple": { "je": "ferai", "tu": "feras", "il/elle": "fera", "nous": "ferons", "vous": "ferez", "ils/elles": "feront" },
        "Passé composé": { "j'": "ai fait", "tu": "as fait", "il/elle": "a fait", "nous": "avons fait", "vous": "avez fait", "ils/elles": "ont fait" },
        "Plus-que-parfait": { "j'": "avais fait", "tu": "avais fait", "il/elle": "avait fait", "nous": "avions fait", "vous": "aviez fait", "ils/elles": "avaient fait" },
        "Conditionnel Présent": { "je": "ferais", "tu": "ferais", "il/elle": "ferait", "nous": "ferions", "vous": "feriez", "ils/elles": "feraient" },
        "Subjonctif Présent": { "que je": "fasse", "que tu": "fasses", "qu'il/elle": "fasse", "que nous": "fassions", "que vous": "fassiez", "qu'ils/elles": "fassent" },
        "Impératif Présent": { "tu": "fais", "nous": "faisons", "vous": "faites" }
    },
    "pouvoir": {
        "Présent": { "je": "peux", "tu": "peux", "il/elle": "peut", "nous": "pouvons", "vous": "pouvez", "ils/elles": "peuvent" },
        "Imparfait": { "je": "pouvais", "tu": "pouvais", "il/elle": "pouvait", "nous": "pouvions", "vous": "pouviez", "ils/elles": "pouvaient" },
        "Futur simple": { "je": "pourrai", "tu": "pourras", "il/elle": "pourra", "nous": "pourrons", "vous": "pourrez", "ils/elles": "pourront" },
        "Passé composé": { "j'": "ai pu", "tu": "as pu", "il/elle": "a pu", "nous": "avons pu", "vous": "avez pu", "ils/elles": "ont pu" },
        "Plus-que-parfait": { "j'": "avais pu", "tu": "avais pu", "il/elle": "avait pu", "nous": "avions pu", "vous": "aviez pu", "ils/elles": "avaient pu" },
        "Conditionnel Présent": { "je": "pourrais", "tu": "pourrais", "il/elle": "pourrait", "nous": "pourrions", "vous": "pourriez", "ils/elles": "pourraient" },
        "Subjonctif Présent": { "que je": "puisse", "que tu": "puisses", "qu'il/elle": "puisse", "que nous": "puissions", "que vous": "puissiez", "qu'ils/elles": "puissent" }
    },
    "vouloir": {
        "Présent": { "je": "veux", "tu": "veux", "il/elle": "veut", "nous": "voulons", "vous": "voulez", "ils/elles": "veulent" },
        "Imparfait": { "je": "voulais", "tu": "voulais", "il/elle": "voulait", "nous": "voulions", "vous": "vouliez", "ils/elles": "voulaient" },
        "Futur simple": { "je": "voudrai", "tu": "voudras", "il/elle": "voudra", "nous": "voudrons", "vous": "voudrez", "ils/elles": "voudront" },
        "Passé composé": { "j'": "ai voulu", "tu": "as voulu", "il/elle": "a voulu", "nous": "avons voulu", "vous": "avez voulu", "ils/elles": "ont voulu" },
        "Plus-que-parfait": { "j'": "avais voulu", "tu": "avais voulu", "il/elle": "avait voulu", "nous": "avions voulu", "vous": "aviez voulu", "ils/elles": "avaient voulu" },
        "Conditionnel Présent": { "je": "voudrais", "tu": "voudrais", "il/elle": "voudrait", "nous": "voudrions", "vous": "voudriez", "ils/elles": "voudraient" },
        "Subjonctif Présent": { "que je": "veuille", "que tu": "veuilles", "qu'il/elle": "veuille", "que nous": "voulions", "que vous": "vouliez", "qu'ils/elles": "veuillent" },
        "Impératif Présent": { "tu": "veuille", "nous": "voulons", "vous": "veuillez" }
    },
    "savoir": {
        "Présent": { "je": "sais", "tu": "sais", "il/elle": "sait", "nous": "savons", "vous": "savez", "ils/elles": "savent" },
        "Imparfait": { "je": "savais", "tu": "savais", "il/elle": "savait", "nous": "savions", "vous": "saviez", "ils/elles": "savaient" },
        "Futur simple": { "je": "saurai", "tu": "sauras", "il/elle": "saura", "nous": "saurons", "vous": "saurez", "ils/elles": "sauront" },
        "Passé composé": { "j'": "ai su", "tu": "as su", "il/elle": "a su", "nous": "avons su", "vous": "avez su", "ils/elles": "ont su" },
        "Plus-que-parfait": { "j'": "avais su", "tu": "avais su", "il/elle": "avait su", "nous": "avions su", "vous": "aviez su", "ils/elles": "avaient su" },
        "Conditionnel Présent": { "je": "saurais", "tu": "saurais", "il/elle": "saurait", "nous": "saurions", "vous": "sauriez", "ils/elles": "sauraient" },
        "Subjonctif Présent": { "que je": "sache", "que tu": "saches", "qu'il/elle": "sache", "que nous": "sachions", "que vous": "sachiez", "qu'ils/elles": "sachent" },
        "Impératif Présent": { "tu": "sache", "nous": "sachons", "vous": "sachez" }
    },
    "dire": {
        "Présent": { "je": "dis", "tu": "dis", "il/elle": "dit", "nous": "disons", "vous": "dites", "ils/elles": "disent" },
        "Imparfait": { "je": "disais", "tu": "disais", "il/elle": "disait", "nous": "disions", "vous": "disiez", "ils/elles": "disaient" },
        "Futur simple": { "je": "dirai", "tu": "diras", "il/elle": "dira", "nous": "dirons", "vous": "direz", "ils/elles": "diront" },
        "Passé composé": { "j'": "ai dit", "tu": "as dit", "il/elle": "a dit", "nous": "avons dit", "vous": "avez dit", "ils/elles": "ont dit" },
        "Plus-que-parfait": { "j'": "avais dit", "tu": "avais dit", "il/elle": "avait dit", "nous": "avions dit", "vous": "aviez dit", "ils/elles": "avaient dit" },
        "Conditionnel Présent": { "je": "dirais", "tu": "dirais", "il/elle": "dirait", "nous": "dirions", "vous": "diriez", "ils/elles": "diraient" },
        "Subjonctif Présent": { "que je": "dise", "que tu": "dises", "qu'il/elle": "dise", "que nous": "disions", "que vous": "disiez", "qu'ils/elles": "disent" },
        "Impératif Présent": { "tu": "dis", "nous": "disons", "vous": "dites" }
    },
    "mettre": {
        "Présent": { "je": "mets", "tu": "mets", "il/elle": "met", "nous": "mettons", "vous": "mettez", "ils/elles": "mettent" },
        "Imparfait": { "je": "mettais", "tu": "mettais", "il/elle": "mettait", "nous": "mettions", "vous": "mettiez", "ils/elles": "mettaient" },
        "Futur simple": { "je": "mettrai", "tu": "mettras", "il/elle": "mettra", "nous": "mettrons", "vous": "mettrez", "ils/elles": "mettront" },
        "Passé composé": { "j'": "ai mis", "tu": "as mis", "il/elle": "a mis", "nous": "avons mis", "vous": "avez mis", "ils/elles": "ont mis" },
        "Plus-que-parfait": { "j'": "avais mis", "tu": "avais mis", "il/elle": "avait mis", "nous": "avions mis", "vous": "aviez mis", "ils/elles": "avaient mis" },
        "Conditionnel Présent": { "je": "mettrais", "tu": "mettrais", "il/elle": "mettrait", "nous": "mettrions", "vous": "mettriez", "ils/elles": "mettraient" },
        "Subjonctif Présent": { "que je": "mette", "que tu": "mettes", "qu'il/elle": "mette", "que nous": "mettions", "que vous": "mettiez", "qu'ils/elles": "mettent" },
        "Impératif Présent": { "tu": "mets", "nous": "mettons", "vous": "mettez" }
    },
    "prendre": {
        "Présent": { "je": "prends", "tu": "prends", "il/elle": "prend", "nous": "prenons", "vous": "prenez", "ils/elles": "prennent" },
        "Imparfait": { "je": "prenais", "tu": "prenais", "il/elle": "prenait", "nous": "prenions", "vous": "preniez", "ils/elles": "prenaient" },
        "Futur simple": { "je": "prendrai", "tu": "prendras", "il/elle": "prendra", "nous": "prendrons", "vous": "prendrez", "ils/elles": "prendront" },
        "Passé composé": { "j'": "ai pris", "tu": "as pris", "il/elle": "a pris", "nous": "avons pris", "vous": "avez pris", "ils/elles": "ont pris" },
        "Plus-que-parfait": { "j'": "avais pris", "tu": "avais pris", "il/elle": "avait pris", "nous": "avions pris", "vous": "aviez pris", "ils/elles": "avaient pris" },
        "Conditionnel Présent": { "je": "prendrais", "tu": "prendrais", "il/elle": "prendrait", "nous": "prendrions", "vous": "prendriez", "ils/elles": "prendraient" },
        "Subjonctif Présent": { "que je": "prenne", "que tu": "prennes", "qu'il/elle": "prenne", "que nous": "prenions", "que vous": "preniez", "qu'ils/elles": "prennent" },
        "Impératif Présent": { "tu": "prends", "nous": "prenons", "vous": "prenez" }
    },
    "voir": {
        "Présent": { "je": "vois", "tu": "vois", "il/elle": "voit", "nous": "voyons", "vous": "voyez", "ils/elles": "voient" },
        "Imparfait": { "je": "voyais", "tu": "voyais", "il/elle": "voyait", "nous": "voyions", "vous": "voyiez", "ils/elles": "voyaient" },
        "Futur simple": { "je": "verrai", "tu": "verras", "il/elle": "verra", "nous": "verrons", "vous": "verrez", "ils/elles": "verront" },
        "Passé composé": { "j'": "ai vu", "tu": "as vu", "il/elle": "a vu", "nous": "avons vu", "vous": "avez vu", "ils/elles": "ont vu" },
        "Plus-que-parfait": { "j'": "avais vu", "tu": "avais vu", "il/elle": "avait vu", "nous": "avions vu", "vous": "aviez vu", "ils/elles": "avaient vu" },
        "Conditionnel Présent": { "je": "verrais", "tu": "verrais", "il/elle": "verrait", "nous": "verrions", "vous": "verriez", "ils/elles": "verraient" },
        "Subjonctif Présent": { "que je": "voie", "que tu": "voies", "qu'il/elle": "voie", "que nous": "voyions", "que vous": "voyiez", "qu'ils/elles": "voient" },
        "Impératif Présent": { "tu": "vois", "nous": "voyons", "vous": "voyez" }
    },
    "devoir": {
        "Présent": { "je": "dois", "tu": "dois", "il/elle": "doit", "nous": "devons", "vous": "devez", "ils/elles": "doivent" },
        "Imparfait": { "je": "devais", "tu": "devais", "il/elle": "devait", "nous": "devions", "vous": "deviez", "ils/elles": "devaient" },
        "Futur simple": { "je": "devrai", "tu": "devras", "il/elle": "devra", "nous": "devrons", "vous": "devrez", "ils/elles": "devront" },
        "Passé composé": { "j'": "ai dû", "tu": "as dû", "il/elle": "a dû", "nous": "avons dû", "vous": "avez dû", "ils/elles": "ont dû" },
        "Plus-que-parfait": { "j'": "avais dû", "tu": "avais dû", "il/elle": "avait dû", "nous": "avions dû", "vous": "aviez dû", "ils/elles": "avaient dû" },
        "Conditionnel Présent": { "je": "devrais", "tu": "devrais", "il/elle": "devrait", "nous": "devrions", "vous": "devriez", "ils/elles": "devraient" },
        "Subjonctif Présent": { "que je": "doive", "que tu": "doives", "qu'il/elle": "doive", "que nous": "devions", "que vous": "deviez", "qu'ils/elles": "doivent" }
    },
    "venir": {
        "Présent": { "je": "viens", "tu": "viens", "il/elle": "vient", "nous": "venons", "vous": "venez", "ils/elles": "viennent" },
        "Imparfait": { "je": "venais", "tu": "venais", "il/elle": "venait", "nous": "venions", "vous": "veniez", "ils/elles": "venaient" },
        "Futur simple": { "je": "viendrai", "tu": "viendras", "il/elle": "viendra", "nous": "viendrons", "vous": "viendrez", "ils/elles": "viendront" },
        "Passé composé": { "je": "suis venu(e)", "tu": "es venu(e)", "il/elle": "est venu(e)", "nous": "sommes venu(e)s", "vous": "êtes venu(e)(s)", "ils/elles": "sont venu(e)s" },
        "Plus-que-parfait": { "j'": "étais venu(e)", "tu": "étais venu(e)", "il/elle": "était venu(e)", "nous": "étions venu(e)s", "vous": "étiez venu(e)(s)", "ils/elles": "étaient venu(e)s" },
        "Conditionnel Présent": { "je": "viendrais", "tu": "viendrais", "il/elle": "viendrait", "nous": "viendrions", "vous": "viendriez", "ils/elles": "viendraient" },
        "Subjonctif Présent": { "que je": "vienne", "que tu": "viennes", "qu'il/elle": "vienne", "que nous": "venions", "que vous": "veniez", "qu'ils/elles": "viennent" },
        "Impératif Présent": { "tu": "viens", "nous": "venons", "vous": "venez" }
    },
    "croire": {
        "Présent": { "je": "crois", "tu": "crois", "il/elle": "croit", "nous": "croyons", "vous": "croyez", "ils/elles": "croient" },
        "Imparfait": { "je": "croyais", "tu": "croyais", "il/elle": "croyait", "nous": "croyions", "vous": "croyiez", "ils/elles": "croyaient" },
        "Futur simple": { "je": "croirai", "tu": "croiras", "il/elle": "croira", "nous": "croirons", "vous": "croirez", "ils/elles": "croiront" },
        "Passé composé": { "j'": "ai cru", "tu": "as cru", "il/elle": "a cru", "nous": "avons cru", "vous": "avez cru", "ils/elles": "ont cru" },
        "Plus-que-parfait": { "j'": "avais cru", "tu": "avais cru", "il/elle": "avait cru", "nous": "avions cru", "vous": "aviez cru", "ils/elles": "avaient cru" },
        "Conditionnel Présent": { "je": "croirais", "tu": "croirais", "il/elle": "croirait", "nous": "croirions", "vous": "croiriez", "ils/elles": "croiraient" },
        "Subjonctif Présent": { "que je": "croie", "que tu": "croies", "qu'il/elle": "croie", "que nous": "croyions", "que vous": "croyiez", "qu'ils/elles": "croient" },
        "Impératif Présent": { "tu": "crois", "nous": "croyons", "vous": "croyez" }
    },
    "trouver": {
        "Présent": { "je": "trouve", "tu": "trouves", "il/elle": "trouve", "nous": "trouvons", "vous": "trouvez", "ils/elles": "trouvent" },
        "Imparfait": { "je": "trouvais", "tu": "trouvais", "il/elle": "trouvait", "nous": "trouvions", "vous": "trouviez", "ils/elles": "trouvaient" },
        "Futur simple": { "je": "trouverai", "tu": "trouveras", "il/elle": "trouvera", "nous": "trouverons", "vous": "trouverez", "ils/elles": "trouveront" },
        "Passé composé": { "j'": "ai trouvé", "tu": "as trouvé", "il/elle": "a trouvé", "nous": "avons trouvé", "vous": "avez trouvé", "ils/elles": "ont trouvé" },
        "Plus-que-parfait": { "j'": "avais trouvé", "tu": "avais trouvé", "il/elle": "avait trouvé", "nous": "avions trouvé", "vous": "aviez trouvé", "ils/elles": "avaient trouvé" },
        "Conditionnel Présent": { "je": "trouverais", "tu": "trouverais", "il/elle": "trouverait", "nous": "trouverions", "vous": "trouveriez", "ils/elles": "trouveraient" },
        "Subjonctif Présent": { "que je": "trouve", "que tu": "trouves", "qu'il/elle": "trouve", "que nous": "trouvions", "que vous": "trouviez", "qu'ils/elles": "trouvent" },
        "Impératif Présent": { "tu": "trouve", "nous": "trouvons", "vous": "trouvez" }
    },
    "donner": {
        "Présent": { "je": "donne", "tu": "donnes", "il/elle": "donne", "nous": "donnons", "vous": "donnez", "ils/elles": "donnent" },
        "Imparfait": { "je": "donnais", "tu": "donnais", "il/elle": "donnait", "nous": "donnions", "vous": "donniez", "ils/elles": "donnaient" },
        "Futur simple": { "je": "donnerai", "tu": "donneras", "il/elle": "donnera", "nous": "donnerons", "vous": "donnerez", "ils/elles": "donneront" },
        "Passé composé": { "j'": "ai donné", "tu": "as donné", "il/elle": "a donné", "nous": "avons donné", "vous": "avez donné", "ils/elles": "ont donné" },
        "Plus-que-parfait": { "j'": "avais donné", "tu": "avais donné", "il/elle": "avait donné", "nous": "avions donné", "vous": "aviez donné", "ils/elles": "avaient donné" },
        "Conditionnel Présent": { "je": "donnerais", "tu": "donnerais", "il/elle": "donnerait", "nous": "donnerions", "vous": "donneriez", "ils/elles": "donneraient" },
        "Subjonctif Présent": { "que je": "donne", "que tu": "donnes", "qu'il/elle": "donne", "que nous": "donnions", "que vous": "donniez", "qu'ils/elles": "donnent" },
        "Impératif Présent": { "tu": "donne", "nous": "donnons", "vous": "donnez" }
    },
    "comprendre": {
        "Présent": { "je": "comprends", "tu": "comprends", "il/elle": "comprend", "nous": "comprenons", "vous": "comprenez", "ils/elles": "comprennent" },
        "Imparfait": { "je": "comprenais", "tu": "comprenais", "il/elle": "comprenait", "nous": "comprenions", "vous": "compreniez", "ils/elles": "comprenaient" },
        "Futur simple": { "je": "comprendrai", "tu": "comprendras", "il/elle": "comprendra", "nous": "comprendrons", "vous": "comprendrez", "ils/elles": "comprendront" },
        "Passé composé": { "j'": "ai compris", "tu": "as compris", "il/elle": "a compris", "nous": "avons compris", "vous": "avez compris", "ils/elles": "ont compris" },
        "Plus-que-parfait": { "j'": "avais compris", "tu": "avais compris", "il/elle": "avait compris", "nous": "avions compris", "vous": "aviez compris", "ils/elles": "avaient compris" },
        "Conditionnel Présent": { "je": "comprendrais", "tu": "comprendrais", "il/elle": "comprendrait", "nous": "comprendrions", "vous": "comprendriez", "ils/elles": "comprendraient" },
        "Subjonctif Présent": { "que je": "comprenne", "que tu": "comprennes", "qu'il/elle": "comprenne", "que nous": "comprenions", "que vous": "compreniez", "qu'ils/elles": "comprennent" },
        "Impératif Présent": { "tu": "comprends", "nous": "comprenons", "vous": "comprenez" }
    },
    "partir": {
        "Présent": { "je": "pars", "tu": "pars", "il/elle": "part", "nous": "partons", "vous": "partez", "ils/elles": "partent" },
        "Imparfait": { "je": "partais", "tu": "partais", "il/elle": "partait", "nous": "partions", "vous": "partiez", "ils/elles": "partaient" },
        "Futur simple": { "je": "partirai", "tu": "partiras", "il/elle": "partira", "nous": "partirons", "vous": "partirez", "ils/elles": "partiront" },
        "Passé composé": { "je": "suis parti(e)", "tu": "es parti(e)", "il/elle": "est parti(e)", "nous": "sommes parti(e)s", "vous": "êtes parti(e)(s)", "ils/elles": "sont parti(e)s" },
        "Plus-que-parfait": { "j'": "étais parti(e)", "tu": "étais parti(e)", "il/elle": "était parti(e)", "nous": "étions parti(e)s", "vous": "étiez parti(e)(s)", "ils/elles": "étaient parti(e)s" },
        "Conditionnel Présent": { "je": "partirais", "tu": "partirais", "il/elle": "partirait", "nous": "partirions", "vous": "partiriez", "ils/elles": "partiraient" },
        "Subjonctif Présent": { "que je": "parte", "que tu": "partes", "qu'il/elle": "parte", "que nous": "partions", "que vous": "partiez", "qu'ils/elles": "partent" },
        "Impératif Présent": { "tu": "pars", "nous": "partons", "vous": "partez" }
    },
    "demander": {
        "Présent": { "je": "demande", "tu": "demandes", "il/elle": "demande", "nous": "demandons", "vous": "demandez", "ils/elles": "demandent" },
        "Imparfait": { "je": "demandais", "tu": "demandais", "il/elle": "demandait", "nous": "demandions", "vous": "demandiez", "ils/elles": "demandaient" },
        "Futur simple": { "je": "demanderai", "tu": "demanderas", "il/elle": "demandera", "nous": "demanderons", "vous": "demanderez", "ils/elles": "demanderont" },
        "Passé composé": { "j'": "ai demandé", "tu": "as demandé", "il/elle": "a demandé", "nous": "avons demandé", "vous": "avez demandé", "ils/elles": "ont demandé" },
        "Plus-que-parfait": { "j'": "avais demandé", "tu": "avais demandé", "il/elle": "avait demandé", "nous": "avions demandé", "vous": "aviez demandé", "ils/elles": "avaient demandé" },
        "Conditionnel Présent": { "je": "demanderais", "tu": "demanderais", "il/elle": "demanderait", "nous": "demanderions", "vous": "demanderiez", "ils/elles": "demanderaient" },
        "Subjonctif Présent": { "que je": "demande", "que tu": "demandes", "qu'il/elle": "demande", "que nous": "demandions", "que vous": "demandiez", "qu'ils/elles": "demandent" },
        "Impératif Présent": { "tu": "demande", "nous": "demandons", "vous": "demandez" }
    },
    "tenir": {
        "Présent": { "je": "tiens", "tu": "tiens", "il/elle": "tient", "nous": "tenons", "vous": "tenez", "ils/elles": "tiennent" },
        "Imparfait": { "je": "tenais", "tu": "tenais", "il/elle": "tenait", "nous": "tenions", "vous": "teniez", "ils/elles": "tenaient" },
        "Futur simple": { "je": "tiendrai", "tu": "tiendras", "il/elle": "tiendra", "nous": "tiendrons", "vous": "tiendrez", "ils/elles": "tiendront" },
        "Passé composé": { "j'": "ai tenu", "tu": "as tenu", "il/elle": "a tenu", "nous": "avons tenu", "vous": "avez tenu", "ils/elles": "ont tenu" },
        "Plus-que-parfait": { "j'": "avais tenu", "tu": "avais tenu", "il/elle": "avait tenu", "nous": "avions tenu", "vous": "aviez tenu", "ils/elles": "avaient tenu" },
        "Conditionnel Présent": { "je": "tiendrais", "tu": "tiendrais", "il/elle": "tiendrait", "nous": "tiendrions", "vous": "tiendriez", "ils/elles": "tiendraient" },
        "Subjonctif Présent": { "que je": "tienne", "que tu": "tiennes", "qu'il/elle": "tienne", "que nous": "tenions", "que vous": "teniez", "qu'ils/elles": "tiennent" },
        "Impératif Présent": { "tu": "tiens", "nous": "tenons", "vous": "tenez" }
    },
    "sembler": {
        "Présent": { "il/elle": "semble", "ils/elles": "semblent" },
        "Imparfait": { "il/elle": "semblait", "ils/elles": "semblaient" },
        "Futur simple": { "il/elle": "semblera", "ils/elles": "sembleront" },
        "Passé composé": { "il/elle": "a semblé", "ils/elles": "ont semblé" },
        "Plus-que-parfait": { "il/elle": "avait semblé", "ils/elles": "avaient semblé" },
        "Conditionnel Présent": { "il/elle": "semblerait", "ils/elles": "sembleraient" },
        "Subjonctif Présent": { "qu'il/elle": "semble", "qu'ils/elles": "semblent" }
    },
    "laisser": {
        "Présent": { "je": "laisse", "tu": "laisses", "il/elle": "laisse", "nous": "laissons", "vous": "laissez", "ils/elles": "laissent" },
        "Imparfait": { "je": "laissais", "tu": "laissais", "il/elle": "laissait", "nous": "laissions", "vous": "laissiez", "ils/elles": "laissaient" },
        "Futur simple": { "je": "laisserai", "tu": "laisseras", "il/elle": "laissera", "nous": "laisserons", "vous": "laisserez", "ils/elles": "laisseront" },
        "Passé composé": { "j'": "ai laissé", "tu": "as laissé", "il/elle": "a laissé", "nous": "avons laissé", "vous": "avez laissé", "ils/elles": "ont laissé" },
        "Plus-que-parfait": { "j'": "avais laissé", "tu": "avais laissé", "il/elle": "avait laissé", "nous": "avions laissé", "vous": "aviez laissé", "ils/elles": "avaient laissé" },
        "Conditionnel Présent": { "je": "laisserais", "tu": "laisserais", "il/elle": "laisserait", "nous": "laisserions", "vous": "laisseriez", "ils/elles": "laisseraient" },
        "Subjonctif Présent": { "que je": "laisse", "que tu": "laisses", "qu'il/elle": "laisse", "que nous": "laissions", "que vous": "laissiez", "qu'ils/elles": "laissent" },
        "Impératif Présent": { "tu": "laisse", "nous": "laissons", "vous": "laissez" }
    },
    "rester": {
        "Présent": { "je": "reste", "tu": "restes", "il/elle": "reste", "nous": "restons", "vous": "restez", "ils/elles": "restent" },
        "Imparfait": { "je": "restais", "tu": "restais", "il/elle": "restait", "nous": "restions", "vous": "restiez", "ils/elles": "restaient" },
        "Futur simple": { "je": "resterai", "tu": "resteras", "il/elle": "restera", "nous": "resterons", "vous": "resterez", "ils/elles": "resteront" },
        "Passé composé": { "je": "suis resté(e)", "tu": "es resté(e)", "il/elle": "est resté(e)", "nous": "sommes resté(e)s", "vous": "êtes resté(e)(s)", "ils/elles": "sont resté(e)s" },
        "Plus-que-parfait": { "j'": "étais resté(e)", "tu": "étais resté(e)", "il/elle": "était resté(e)", "nous": "étions resté(e)s", "vous": "étiez resté(e)(s)", "ils/elles": "étaient resté(e)s" },
        "Conditionnel Présent": { "je": "resterais", "tu": "resterais", "il/elle": "resterait", "nous": "resterions", "vous": "resteriez", "ils/elles": "resteraient" },
        "Subjonctif Présent": { "que je": "reste", "que tu": "restes", "qu'il/elle": "reste", "que nous": "restions", "que vous": "restiez", "qu'ils/elles": "restent" },
        "Impératif Présent": { "tu": "reste", "nous": "restons", "vous": "restez" }
    },
    "penser": {
        "Présent": { "je": "pense", "tu": "penses", "il/elle": "pense", "nous": "pensons", "vous": "pensez", "ils/elles": "pensent" },
        "Imparfait": { "je": "pensais", "tu": "pensais", "il/elle": "pensait", "nous": "pensions", "vous": "pensiez", "ils/elles": "pensaient" },
        "Futur simple": { "je": "penserai", "tu": "penseras", "il/elle": "pensera", "nous": "penserons", "vous": "penserez", "ils/elles": "penseront" },
        "Passé composé": { "j'": "ai pensé", "tu": "as pensé", "il/elle": "a pensé", "nous": "avons pensé", "vous": "avez pensé", "ils/elles": "ont pensé" },
        "Plus-que-parfait": { "j'": "avais pensé", "tu": "avais pensé", "il/elle": "avait pensé", "nous": "avions pensé", "vous": "aviez pensé", "ils/elles": "avaient pensé" },
        "Conditionnel Présent": { "je": "penserais", "tu": "penserais", "il/elle": "penserait", "nous": "penserions", "vous": "penseriez", "ils/elles": "penseraient" },
        "Subjonctif Présent": { "que je": "pense", "que tu": "penses", "qu'il/elle": "pense", "que nous": "pensions", "que vous": "pensiez", "qu'ils/elles": "pensent" },
        "Impératif Présent": { "tu": "pense", "nous": "pensons", "vous": "pensez" }
    },
    "entendre": {
        "Présent": { "j'": "entends", "tu": "entends", "il/elle": "entend", "nous": "entendons", "vous": "entendez", "ils/elles": "entendent" },
        "Imparfait": { "j'": "entendais", "tu": "entendais", "il/elle": "entendait", "nous": "entendions", "vous": "entendiez", "ils/elles": "entendaient" },
        "Futur simple": { "j'": "entendrai", "tu": "entendras", "il/elle": "entendra", "nous": "entendrons", "vous": "entendrez", "ils/elles": "entendront" },
        "Passé composé": { "j'": "ai entendu", "tu": "as entendu", "il/elle": "a entendu", "nous": "avons entendu", "vous": "avez entendu", "ils/elles": "ont entendu" },
        "Plus-que-parfait": { "j'": "avais entendu", "tu": "avais entendu", "il/elle": "avait entendu", "nous": "avions entendu", "vous": "aviez entendu", "ils/elles": "avaient entendu" },
        "Conditionnel Présent": { "j'": "entendrais", "tu": "entendrais", "il/elle": "entendrait", "nous": "entendrions", "vous": "entendriez", "ils/elles": "entendraient" },
        "Subjonctif Présent": { "que j'": "entende", "que tu": "entendes", "qu'il/elle": "entende", "que nous": "entendions", "que vous": "entendiez", "qu'ils/elles": "entendent" },
        "Impératif Présent": { "tu": "entends", "nous": "entendons", "vous": "entendez" }
    },
    "attendre": {
        "Présent": { "j'": "attends", "tu": "attends", "il/elle": "attend", "nous": "attendons", "vous": "attendez", "ils/elles": "attendent" },
        "Imparfait": { "j'": "attendais", "tu": "attendais", "il/elle": "attendait", "nous": "attendions", "vous": "attendiez", "ils/elles": "attendaient" },
        "Futur simple": { "j'": "attendrai", "tu": "attendras", "il/elle": "attendra", "nous": "attendrons", "vous": "attendrez", "ils/elles": "attendront" },
        "Passé composé": { "j'": "ai attendu", "tu": "as attendu", "il/elle": "a attendu", "nous": "avons attendu", "vous": "avez attendu", "ils/elles": "ont attendu" },
        "Plus-que-parfait": { "j'": "avais attendu", "tu": "avais attendu", "il/elle": "avait attendu", "nous": "avions attendu", "vous": "aviez attendu", "ils/elles": "avaient attendu" },
        "Conditionnel Présent": { "j'": "attendrais", "tu": "attendrais", "il/elle": "attendrait", "nous": "attendrions", "vous": "attendriez", "ils/elles": "attendraient" },
        "Subjonctif Présent": { "que j'": "attende", "que tu": "attendes", "qu'il/elle": "attende", "que nous": "attendions", "que vous": "attendiez", "qu'ils/elles": "attendent" },
        "Impératif Présent": { "tu": "attends", "nous": "attendons", "vous": "attendez" }
    },
    "vivre": {
        "Présent": { "je": "vis", "tu": "vis", "il/elle": "vit", "nous": "vivons", "vous": "vivez", "ils/elles": "vivent" },
        "Imparfait": { "je": "vivais", "tu": "vivais", "il/elle": "vivait", "nous": "vivions", "vous": "viviez", "ils/elles": "vivaient" },
        "Futur simple": { "je": "vivrai", "tu": "vivras", "il/elle": "vivra", "nous": "vivrons", "vous": "vivrez", "ils/elles": "vivront" },
        "Passé composé": { "j'": "ai vécu", "tu": "as vécu", "il/elle": "a vécu", "nous": "avons vécu", "vous": "avez vécu", "ils/elles": "ont vécu" },
        "Plus-que-parfait": { "j'": "avais vécu", "tu": "avais vécu", "il/elle": "avait vécu", "nous": "avions vécu", "vous": "aviez vécu", "ils/elles": "avaient vécu" },
        "Conditionnel Présent": { "je": "vivrais", "tu": "vivrais", "il/elle": "vivrait", "nous": "vivrions", "vous": "vivriez", "ils/elles": "vivraient" },
        "Subjonctif Présent": { "que je": "vive", "que tu": "vives", "qu'il/elle": "vive", "que nous": "vivions", "que vous": "viviez", "qu'ils/elles": "vivent" },
        "Impératif Présent": { "tu": "vis", "nous": "vivons", "vous": "vivez" }
    },
    "répondre": {
        "Présent": { "je": "réponds", "tu": "réponds", "il/elle": "répond", "nous": "répondons", "vous": "répondez", "ils/elles": "répondent" },
        "Imparfait": { "je": "répondais", "tu": "répondais", "il/elle": "répondait", "nous": "répondions", "vous": "répondiez", "ils/elles": "répondaient" },
        "Futur simple": { "je": "répondrai", "tu": "répondras", "il/elle": "répondra", "nous": "répondrons", "vous": "répondrez", "ils/elles": "répondront" },
        "Passé composé": { "j'": "ai répondu", "tu": "as répondu", "il/elle": "a répondu", "nous": "avons répondu", "vous": "avez répondu", "ils/elles": "ont répondu" },
        "Plus-que-parfait": { "j'": "avais répondu", "tu": "avais répondu", "il/elle": "avait répondu", "nous": "avions répondu", "vous": "aviez répondu", "ils/elles": "avaient répondu" },
        "Conditionnel Présent": { "je": "répondrais", "tu": "répondrais", "il/elle": "répondrait", "nous": "répondrions", "vous": "répondriez", "ils/elles": "répondraient" },
        "Subjonctif Présent": { "que je": "réponde", "que tu": "répondes", "qu'il/elle": "réponde", "que nous": "répondions", "que vous": "répondiez", "qu'ils/elles": "répondent" },
        "Impératif Présent": { "tu": "réponds", "nous": "répondons", "vous": "répondez" }
    },
    "connaître": {
        "Présent": { "je": "connais", "tu": "connais", "il/elle": "connaît", "nous": "connaissons", "vous": "connaissez", "ils/elles": "connaissent" },
        "Imparfait": { "je": "connaissais", "tu": "connaissais", "il/elle": "connaissait", "nous": "connaissions", "vous": "connaissiez", "ils/elles": "connaissaient" },
        "Futur simple": { "je": "connaîtrai", "tu": "connaîtras", "il/elle": "connaîtra", "nous": "connaîtrons", "vous": "connaîtrez", "ils/elles": "connaîtront" },
        "Passé composé": { "j'": "ai connu", "tu": "as connu", "il/elle": "a connu", "nous": "avons connu", "vous": "avez connu", "ils/elles": "ont connu" },
        "Plus-que-parfait": { "j'": "avais connu", "tu": "avais connu", "il/elle": "avait connu", "nous": "avions connu", "vous": "aviez connu", "ils/elles": "avaient connu" },
        "Conditionnel Présent": { "je": "connaîtrais", "tu": "connaîtrais", "il/elle": "connaîtrait", "nous": "connaîtrions", "vous": "connaîtriez", "ils/elles": "connaîtraient" },
        "Subjonctif Présent": { "que je": "connaisse", "que tu": "connaisses", "qu'il/elle": "connaisse", "que nous": "connaissions", "que vous": "connaissiez", "qu'ils/elles": "connaissent" },
        "Impératif Présent": { "tu": "connais", "nous": "connaissons", "vous": "connaissez" }
    },
    "suivre": {
        "Présent": { "je": "suis", "tu": "suis", "il/elle": "suit", "nous": "suivons", "vous": "suivez", "ils/elles": "suivent" },
        "Imparfait": { "je": "suivais", "tu": "suivais", "il/elle": "suivait", "nous": "suivions", "vous": "suiviez", "ils/elles": "suivaient" },
        "Futur simple": { "je": "suivrai", "tu": "suivras", "il/elle": "suivra", "nous": "suivrons", "vous": "suivrez", "ils/elles": "suivront" },
        "Passé composé": { "j'": "ai suivi", "tu": "as suivi", "il/elle": "a suivi", "nous": "avons suivi", "vous": "avez suivi", "ils/elles": "ont suivi" },
        "Plus-que-parfait": { "j'": "avais suivi", "tu": "avais suivi", "il/elle": "avait suivi", "nous": "avions suivi", "vous": "aviez suivi", "ils/elles": "avaient suivi" },
        "Conditionnel Présent": { "je": "suivrais", "tu": "suivrais", "il/elle": "suivrait", "nous": "suivrions", "vous": "suivriez", "ils/elles": "suivraient" },
        "Subjonctif Présent": { "que je": "suive", "que tu": "suives", "qu'il/elle": "suive", "que nous": "suivions", "que vous": "suiviez", "qu'ils/elles": "suivent" },
        "Impératif Présent": { "tu": "suis", "nous": "suivons", "vous": "suivez" }
    },
    "porter": {
        "Présent": { "je": "porte", "tu": "portes", "il/elle": "porte", "nous": "portons", "vous": "portez", "ils/elles": "portent" },
        "Imparfait": { "je": "portais", "tu": "portais", "il/elle": "portait", "nous": "portions", "vous": "portiez", "ils/elles": "portaient" },
        "Futur simple": { "je": "porterai", "tu": "porteras", "il/elle": "portera", "nous": "porterons", "vous": "porterez", "ils/elles": "porteront" },
        "Passé composé": { "j'": "ai porté", "tu": "as porté", "il/elle": "a porté", "nous": "avons porté", "vous": "avez porté", "ils/elles": "ont porté" },
        "Plus-que-parfait": { "j'": "avais porté", "tu": "avais porté", "il/elle": "avait porté", "nous": "avions porté", "vous": "aviez porté", "ils/elles": "avaient porté" },
        "Conditionnel Présent": { "je": "porterais", "tu": "porterais", "il/elle": "porterait", "nous": "porterions", "vous": "porteriez", "ils/elles": "porteraient" },
        "Subjonctif Présent": { "que je": "porte", "que tu": "portes", "qu'il/elle": "porte", "que nous": "portions", "que vous": "portiez", "qu'ils/elles": "portent" },
        "Impératif Présent": { "tu": "porte", "nous": "portons", "vous": "portez" }
    },
    "aimer": {
        "Présent": { "j'": "aime", "tu": "aimes", "il/elle": "aime", "nous": "aimons", "vous": "aimez", "ils/elles": "aiment" },
        "Imparfait": { "j'": "aimais", "tu": "aimais", "il/elle": "aimait", "nous": "aimions", "vous": "aimiez", "ils/elles": "aimaient" },
        "Futur simple": { "j'": "aimerai", "tu": "aimeras", "il/elle": "aimera", "nous": "aimerons", "vous": "aimerez", "ils/elles": "aimeront" },
        "Passé composé": { "j'": "ai aimé", "tu": "as aimé", "il/elle": "a aimé", "nous": "avons aimé", "vous": "avez aimé", "ils/elles": "ont aimé" },
        "Plus-que-parfait": { "j'": "avais aimé", "tu": "avais aimé", "il/elle": "avait aimé", "nous": "avions aimé", "vous": "aviez aimé", "ils/elles": "avaient aimé" },
        "Conditionnel Présent": { "j'": "aimerais", "tu": "aimerais", "il/elle": "aimerait", "nous": "aimerions", "vous": "aimeriez", "ils/elles": "aimeraient" },
        "Subjonctif Présent": { "que j'": "aime", "que tu": "aimes", "qu'il/elle": "aime", "que nous": "aimions", "que vous": "aimiez", "qu'ils/elles": "aiment" },
        "Impératif Présent": { "tu": "aime", "nous": "aimons", "vous": "aimez" }
    },
    "passer": {
        "Présent": { "je": "passe", "tu": "passes", "il/elle": "passe", "nous": "passons", "vous": "passez", "ils/elles": "passent" },
        "Imparfait": { "je": "passais", "tu": "passais", "il/elle": "passait", "nous": "passions", "vous": "passiez", "ils/elles": "passaient" },
        "Futur simple": { "je": "passerai", "tu": "passeras", "il/elle": "passera", "nous": "passerons", "vous": "passerez", "ils/elles": "passeront" },
        "Passé composé": { "je": "suis passé(e)", "tu": "es passé(e)", "il/elle": "est passé(e)", "nous": "sommes passé(e)s", "vous": "êtes passé(e)(s)", "ils/elles": "sont passé(e)s" },
        "Plus-que-parfait": { "j'": "étais passé(e)", "tu": "étais passé(e)", "il/elle": "était passé(e)", "nous": "étions passé(e)s", "vous": "étiez passé(e)(s)", "ils/elles": "étaient passé(e)s" },
        "Conditionnel Présent": { "je": "passerais", "tu": "passerais", "il/elle": "passerait", "nous": "passerions", "vous": "passeriez", "ils/elles": "passeraient" },
        "Subjonctif Présent": { "que je": "passe", "que tu": "passes", "qu'il/elle": "passe", "que nous": "passions", "que vous": "passiez", "qu'ils/elles": "passent" },
        "Impératif Présent": { "tu": "passe", "nous": "passons", "vous": "passez" }
    },
    "devenir": {
        "Présent": { "je": "deviens", "tu": "deviens", "il/elle": "devient", "nous": "devenons", "vous": "devenez", "ils/elles": "deviennent" },
        "Imparfait": { "je": "devenais", "tu": "devenais", "il/elle": "devenait", "nous": "devenions", "vous": "deveniez", "ils/elles": "devenaient" },
        "Futur simple": { "je": "deviendrai", "tu": "deviendras", "il/elle": "deviendra", "nous": "deviendrons", "vous": "deviendrez", "ils/elles": "deviendront" },
        "Passé composé": { "je": "suis devenu(e)", "tu": "es devenu(e)", "il/elle": "est devenu(e)", "nous": "sommes devenu(e)s", "vous": "êtes devenu(e)(s)", "ils/elles": "sont devenu(e)s" },
        "Plus-que-parfait": { "j'": "étais devenu(e)", "tu": "étais devenu(e)", "il/elle": "était devenu(e)", "nous": "étions devenu(e)s", "vous": "étiez devenu(e)(s)", "ils/elles": "étaient devenu(e)s" },
        "Conditionnel Présent": { "je": "deviendrais", "tu": "deviendrais", "il/elle": "deviendrait", "nous": "deviendrions", "vous": "deviendriez", "ils/elles": "deviendraient" },
        "Subjonctif Présent": { "que je": "devienne", "que tu": "deviennes", "qu'il/elle": "devienne", "que nous": "devenions", "que vous": "deveniez", "qu'ils/elles": "deviennent" }
    },
    "écrire": {
        "Présent": { "j'": "écris", "tu": "écris", "il/elle": "écrit", "nous": "écrivons", "vous": "écrivez", "ils/elles": "écrivent" },
        "Imparfait": { "j'": "écrivais", "tu": "écrivais", "il/elle": "écrivait", "nous": "écrivions", "vous": "écriviez", "ils/elles": "écrivaient" },
        "Futur simple": { "j'": "écrirai", "tu": "écriras", "il/elle": "écrira", "nous": "écrirons", "vous": "écrirez", "ils/elles": "écriront" },
        "Passé composé": { "j'": "ai écrit", "tu": "as écrit", "il/elle": "a écrit", "nous": "avons écrit", "vous": "avez écrit", "ils/elles": "ont écrit" },
        "Plus-que-parfait": { "j'": "avais écrit", "tu": "avais écrit", "il/elle": "avait écrit", "nous": "avions écrit", "vous": "aviez écrit", "ils/elles": "avaient écrit" },
        "Conditionnel Présent": { "j'": "écrirais", "tu": "écrirais", "il/elle": "écrirait", "nous": "écririons", "vous": "écririez", "ils/elles": "écriraient" },
        "Subjonctif Présent": { "que j'": "écrive", "que tu": "écrives", "qu'il/elle": "écrive", "que nous": "écrivions", "que vous": "écriviez", "qu'ils/elles": "écrivent" },
        "Impératif Présent": { "tu": "écris", "nous": "écrivons", "vous": "écrivez" }
    },
    "lire": {
        "Présent": { "je": "lis", "tu": "lis", "il/elle": "lit", "nous": "lisons", "vous": "lisez", "ils/elles": "lisent" },
        "Imparfait": { "je": "lisais", "tu": "lisais", "il/elle": "lisait", "nous": "lisions", "vous": "lisiez", "ils/elles": "lisaient" },
        "Futur simple": { "je": "lirai", "tu": "liras", "il/elle": "lira", "nous": "lirons", "vous": "lirez", "ils/elles": "liront" },
        "Passé composé": { "j'": "ai lu", "tu": "as lu", "il/elle": "a lu", "nous": "avons lu", "vous": "avez lu", "ils/elles": "ont lu" },
        "Plus-que-parfait": { "j'": "avais lu", "tu": "avais lu", "il/elle": "avait lu", "nous": "avions lu", "vous": "aviez lu", "ils/elles": "avaient lu" },
        "Conditionnel Présent": { "je": "lirais", "tu": "lirais", "il/elle": "lirait", "nous": "lirions", "vous": "liriez", "ils/elles": "liraient" },
        "Subjonctif Présent": { "que je": "lise", "que tu": "lises", "qu'il/elle": "lise", "que nous": "lisions", "que vous": "lisiez", "qu'ils/elles": "lisent" },
        "Impératif Présent": { "tu": "lis", "nous": "lisons", "vous": "lisez" }
    },
    "jouer": {
        "Présent": { "je": "joue", "tu": "joues", "il/elle": "joue", "nous": "jouons", "vous": "jouez", "ils/elles": "jouent" },
        "Imparfait": { "je": "jouais", "tu": "jouais", "il/elle": "jouait", "nous": "jouions", "vous": "jouiez", "ils/elles": "jouaient" },
        "Futur simple": { "je": "jouerai", "tu": "joueras", "il/elle": "jouera", "nous": "jouerons", "vous": "jouerez", "ils/elles": "joueront" },
        "Passé composé": { "j'": "ai joué", "tu": "as joué", "il/elle": "a joué", "nous": "avons joué", "vous": "avez joué", "ils/elles": "ont joué" },
        "Plus-que-parfait": { "j'": "avais joué", "tu": "avais joué", "il/elle": "avait joué", "nous": "avions joué", "vous": "aviez joué", "ils/elles": "avaient joué" },
        "Conditionnel Présent": { "je": "jouerais", "tu": "jouerais", "il/elle": "jouerait", "nous": "jouerions", "vous": "joueriez", "ils/elles": "joueraient" },
        "Subjonctif Présent": { "que je": "joue", "que tu": "joues", "qu'il/elle": "joue", "que nous": "jouions", "que vous": "jouiez", "qu'ils/elles": "jouent" },
        "Impératif Présent": { "tu": "joue", "nous": "jouons", "vous": "jouez" }
    },
    "mourir": {
        "Présent": { "je": "meurs", "tu": "meurs", "il/elle": "meurt", "nous": "mourons", "vous": "mourez", "ils/elles": "meurent" },
        "Imparfait": { "je": "mourais", "tu": "mourais", "il/elle": "mourait", "nous": "mourions", "vous": "mouriez", "ils/elles": "mouraient" },
        "Futur simple": { "je": "mourrai", "tu": "mourras", "il/elle": "mourra", "nous": "mourrons", "vous": "mourrez", "ils/elles": "mourront" },
        "Passé composé": { "je": "suis mort(e)", "tu": "es mort(e)", "il/elle": "est mort(e)", "nous": "sommes mort(e)s", "vous": "êtes mort(e)(s)", "ils/elles": "sont mort(e)s" },
        "Plus-que-parfait": { "j'": "étais mort(e)", "tu": "étais mort(e)", "il/elle": "était mort(e)", "nous": "étions mort(e)s", "vous": "étiez mort(e)(s)", "ils/elles": "étaient mort(e)s" },
        "Conditionnel Présent": { "je": "mourrais", "tu": "mourrais", "il/elle": "mourrait", "nous": "mourrions", "vous": "mourriez", "ils/elles": "mourraient" },
        "Subjonctif Présent": { "que je": "meure", "que tu": "meures", "qu'il/elle": "meure", "que nous": "mourions", "que vous": "mouriez", "qu'ils/elles": "meurent" }
    },
    "ouvrir": {
        "Présent": { "j'": "ouvre", "tu": "ouvres", "il/elle": "ouvre", "nous": "ouvrons", "vous": "ouvrez", "ils/elles": "ouvrent" },
        "Imparfait": { "j'": "ouvrais", "tu": "ouvrais", "il/elle": "ouvrait", "nous": "ouvrions", "vous": "ouvriez", "ils/elles": "ouvraient" },
        "Futur simple": { "j'": "ouvrirai", "tu": "ouvriras", "il/elle": "ouvrira", "nous": "ouvrirons", "vous": "ouvrirez", "ils/elles": "ouvriront" },
        "Passé composé": { "j'": "ai ouvert", "tu": "as ouvert", "il/elle": "a ouvert", "nous": "avons ouvert", "vous": "avez ouvert", "ils/elles": "ont ouvert" },
        "Plus-que-parfait": { "j'": "avais ouvert", "tu": "avais ouvert", "il/elle": "avait ouvert", "nous": "avions ouvert", "vous": "aviez ouvert", "ils/elles": "avaient ouvert" },
        "Conditionnel Présent": { "j'": "ouvrirais", "tu": "ouvrirais", "il/elle": "ouvrirait", "nous": "ouvririons", "vous": "ouvririez", "ils/elles": "ouvriraient" },
        "Subjonctif Présent": { "que j'": "ouvre", "que tu": "ouvres", "qu'il/elle": "ouvre", "que nous": "ouvrions", "que vous": "ouvriez", "qu'ils/elles": "ouvrent" },
        "Impératif Présent": { "tu": "ouvre", "nous": "ouvrons", "vous": "ouvrez" }
    },
    "perdre": {
        "Présent": { "je": "perds", "tu": "perds", "il/elle": "perd", "nous": "perdons", "vous": "perdez", "ils/elles": "perdent" },
        "Imparfait": { "je": "perdais", "tu": "perdais", "il/elle": "perdait", "nous": "perdions", "vous": "perdiez", "ils/elles": "perdaient" },
        "Futur simple": { "je": "perdrai", "tu": "perdras", "il/elle": "perdra", "nous": "perdrons", "vous": "perdrez", "ils/elles": "perdront" },
        "Passé composé": { "j'": "ai perdu", "tu": "as perdu", "il/elle": "a perdu", "nous": "avons perdu", "vous": "avez perdu", "ils/elles": "ont perdu" },
        "Plus-que-parfait": { "j'": "avais perdu", "tu": "avais perdu", "il/elle": "avait perdu", "nous": "avions perdu", "vous": "aviez perdu", "ils/elles": "avaient perdu" },
        "Conditionnel Présent": { "je": "perdrais", "tu": "perdrais", "il/elle": "perdrait", "nous": "perdrions", "vous": "perdriez", "ils/elles": "perdraient" },
        "Subjonctif Présent": { "que je": "perde", "que tu": "perdes", "qu'il/elle": "perde", "que nous": "perdions", "que vous": "perdiez", "qu'ils/elles": "perdent" },
        "Impératif Présent": { "tu": "perds", "nous": "perdons", "vous": "perdez" }
    },
    "payer": {
        "Présent": { "je": "paie", "tu": "paies", "il/elle": "paie", "nous": "payons", "vous": "payez", "ils/elles": "paient" },
        "Imparfait": { "je": "payais", "tu": "payais", "il/elle": "payait", "nous": "payions", "vous": "payiez", "ils/elles": "payaient" },
        "Futur simple": { "je": "paierai", "tu": "paieras", "il/elle": "paiera", "nous": "paierons", "vous": "paierez", "ils/elles": "paieront" },
        "Passé composé": { "j'": "ai payé", "tu": "as payé", "il/elle": "a payé", "nous": "avons payé", "vous": "avez payé", "ils/elles": "ont payé" },
        "Plus-que-parfait": { "j'": "avais payé", "tu": "avais payé", "il/elle": "avait payé", "nous": "avions payé", "vous": "aviez payé", "ils/elles": "avaient payé" },
        "Conditionnel Présent": { "je": "paierais", "tu": "paierais", "il/elle": "paierait", "nous": "paierions", "vous": "paieriez", "ils/elles": "paieraient" },
        "Subjonctif Présent": { "que je": "paie", "que tu": "paies", "qu'il/elle": "paie", "que nous": "payions", "que vous": "payiez", "qu'ils/elles": "paient" },
        "Impératif Présent": { "tu": "paie", "nous": "payons", "vous": "payez" }
    },
    "appeler": {
        "Présent": { "j'": "appelle", "tu": "appelles", "il/elle": "appelle", "nous": "appelons", "vous": "appelez", "ils/elles": "appellent" },
        "Imparfait": { "j'": "appelais", "tu": "appelais", "il/elle": "appelait", "nous": "appelions", "vous": "appeliez", "ils/elles": "appelaient" },
        "Futur simple": { "j'": "appellerai", "tu": "appelleras", "il/elle": "appellera", "nous": "appellerons", "vous": "appellerez", "ils/elles": "appelleront" },
        "Passé composé": { "j'": "ai appelé", "tu": "as appelé", "il/elle": "a appelé", "nous": "avons appelé", "vous": "avez appelé", "ils/elles": "ont appelé" },
        "Plus-que-parfait": { "j'": "avais appelé", "tu": "avais appelé", "il/elle": "avait appelé", "nous": "avions appelé", "vous": "aviez appelé", "ils/elles": "avaient appelé" },
        "Conditionnel Présent": { "j'": "appellerais", "tu": "appellerais", "il/elle": "appellerait", "nous": "appellerions", "vous": "appelleriez", "ils/elles": "appelleraient" },
        "Subjonctif Présent": { "que j'": "appelle", "que tu": "appelles", "qu'il/elle": "appelle", "que nous": "appelions", "que vous": "appeliez", "qu'ils/elles": "appellent" },
        "Impératif Présent": { "tu": "appelle", "nous": "appelons", "vous": "appelez" }
    },
    "essayer": {
        "Présent": { "j'": "essaie", "tu": "essaies", "il/elle": "essaie", "nous": "essayons", "vous": "essayez", "ils/elles": "essaient" },
        "Imparfait": { "j'": "essayais", "tu": "essayais", "il/elle": "essayait", "nous": "essayions", "vous": "essayiez", "ils/elles": "essayaient" },
        "Futur simple": { "j'": "essaierai", "tu": "essaieras", "il/elle": "essaiera", "nous": "essaierons", "vous": "essaierez", "ils/elles": "essaieront" },
        "Passé composé": { "j'": "ai essayé", "tu": "as essayé", "il/elle": "a essayé", "nous": "avons essayé", "vous": "avez essayé", "ils/elles": "ont essayé" },
        "Plus-que-parfait": { "j'": "avais essayé", "tu": "avais essayé", "il/elle": "avait essayé", "nous": "avions essayé", "vous": "aviez essayé", "ils/elles": "avaient essayé" },
        "Conditionnel Présent": { "j'": "essaierais", "tu": "essaierais", "il/elle": "essaierait", "nous": "essaierions", "vous": "essaieriez", "ils/elles": "essaieraient" },
        "Subjonctif Présent": { "que j'": "essaie", "que tu": "essaies", "qu'il/elle": "essaie", "que nous": "essayions", "que vous": "essayiez", "qu'ils/elles": "essaient" },
        "Impératif Présent": { "tu": "essaie", "nous": "essayons", "vous": "essayez" }
    },
    "manger": {
        "Présent": { "je": "mange", "tu": "manges", "il/elle": "mange", "nous": "mangeons", "vous": "mangez", "ils/elles": "mangent" },
        "Imparfait": { "je": "mangeais", "tu": "mangeais", "il/elle": "mangeait", "nous": "mangions", "vous": "mangiez", "ils/elles": "mangeaient" },
        "Futur simple": { "je": "mangerai", "tu": "mangeras", "il/elle": "mangera", "nous": "mangerons", "vous": "mangerez", "ils/elles": "mangeront" },
        "Passé composé": { "j'": "ai mangé", "tu": "as mangé", "il/elle": "a mangé", "nous": "avons mangé", "vous": "avez mangé", "ils/elles": "ont mangé" },
        "Plus-que-parfait": { "j'": "avais mangé", "tu": "avais mangé", "il/elle": "avait mangé", "nous": "avions mangé", "vous": "aviez mangé", "ils/elles": "avaient mangé" },
        "Conditionnel Présent": { "je": "mangerais", "tu": "mangerais", "il/elle": "mangerait", "nous": "mangerions", "vous": "mangeriez", "ils/elles": "mangeraient" },
        "Subjonctif Présent": { "que je": "mange", "que tu": "manges", "qu'il/elle": "mange", "que nous": "mangions", "que vous": "mangiez", "qu'ils/elles": "mangent" },
        "Impératif Présent": { "tu": "mange", "nous": "mangeons", "vous": "mangez" }
    },
    "boire": {
        "Présent": { "je": "bois", "tu": "bois", "il/elle": "boit", "nous": "buvons", "vous": "buvez", "ils/elles": "boivent" },
        "Imparfait": { "je": "buvais", "tu": "buvais", "il/elle": "buvait", "nous": "buvions", "vous": "buviez", "ils/elles": "buvaient" },
        "Futur simple": { "je": "boirai", "tu": "boiras", "il/elle": "boira", "nous": "boirons", "vous": "boirez", "ils/elles": "boiront" },
        "Passé composé": { "j'": "ai bu", "tu": "as bu", "il/elle": "a bu", "nous": "avons bu", "vous": "avez bu", "ils/elles": "ont bu" },
        "Plus-que-parfait": { "j'": "avais bu", "tu": "avais bu", "il/elle": "avait bu", "nous": "avions bu", "vous": "aviez bu", "ils/elles": "avaient bu" },
        "Conditionnel Présent": { "je": "boirais", "tu": "boirais", "il/elle": "boirait", "nous": "boirions", "vous": "boiriez", "ils/elles": "boiraient" },
        "Subjonctif Présent": { "que je": "boive", "que tu": "boives", "qu'il/elle": "boive", "que nous": "buvions", "que vous": "buviez", "qu'ils/elles": "boivent" },
        "Impératif Présent": { "tu": "bois", "nous": "buvons", "vous": "buvez" }
    },
    "envoyer": {
        "Présent": { "j'": "envoie", "tu": "envoies", "il/elle": "envoie", "nous": "envoyons", "vous": "envoyez", "ils/elles": "envoient" },
        "Imparfait": { "j'": "envoyais", "tu": "envoyais", "il/elle": "envoyait", "nous": "envoyions", "vous": "envoyiez", "ils/elles": "envoyaient" },
        "Futur simple": { "j'": "enverrai", "tu": "enverras", "il/elle": "enverra", "nous": "enverrons", "vous": "enverrez", "ils/elles": "enverront" },
        "Passé composé": { "j'": "ai envoyé", "tu": "as envoyé", "il/elle": "a envoyé", "nous": "avons envoyé", "vous": "avez envoyé", "ils/elles": "ont envoyé" },
        "Plus-que-parfait": { "j'": "avais envoyé", "tu": "avais envoyé", "il/elle": "avait envoyé", "nous": "avions envoyé", "vous": "aviez envoyé", "ils/elles": "avaient envoyé" },
        "Conditionnel Présent": { "j'": "enverrais", "tu": "enverrais", "il/elle": "enverrait", "nous": "enverrions", "vous": "enverriez", "ils/elles": "enverraient" },
        "Subjonctif Présent": { "que j'": "envoie", "que tu": "envoies", "qu'il/elle": "envoie", "que nous": "envoyions", "que vous": "envoyiez", "qu'ils/elles": "envoient" },
        "Impératif Présent": { "tu": "envoie", "nous": "envoyons", "vous": "envoyez" }
    },
    "recevoir": {
        "Présent": { "je": "reçois", "tu": "reçois", "il/elle": "reçoit", "nous": "recevons", "vous": "recevez", "ils/elles": "reçoivent" },
        "Imparfait": { "je": "recevais", "tu": "recevais", "il/elle": "recevait", "nous": "recevions", "vous": "receviez", "ils/elles": "recevaient" },
        "Futur simple": { "je": "recevrai", "tu": "recevras", "il/elle": "recevra", "nous": "recevrons", "vous": "recevrez", "ils/elles": "recevront" },
        "Passé composé": { "j'": "ai reçu", "tu": "as reçu", "il/elle": "a reçu", "nous": "avons reçu", "vous": "avez reçu", "ils/elles": "ont reçu" },
        "Plus-que-parfait": { "j'": "avais reçu", "tu": "avais reçu", "il/elle": "avait reçu", "nous": "avions reçu", "vous": "aviez reçu", "ils/elles": "avaient reçu" },
        "Conditionnel Présent": { "je": "recevrais", "tu": "recevrais", "il/elle": "recevrait", "nous": "recevrions", "vous": "recevriez", "ils/elles": "recevraient" },
        "Subjonctif Présent": { "que je": "reçoive", "que tu": "reçoives", "qu'il/elle": "reçoive", "que nous": "recevions", "que vous": "receviez", "qu'ils/elles": "reçoivent" },
        "Impératif Présent": { "tu": "reçois", "nous": "recevons", "vous": "recevez" }
    },
    "choisir": {
        "Présent": { "je": "choisis", "tu": "choisis", "il/elle": "choisit", "nous": "choisissons", "vous": "choisissez", "ils/elles": "choisissent" },
        "Imparfait": { "je": "choisissais", "tu": "choisissais", "il/elle": "choisissait", "nous": "choisissions", "vous": "choisissiez", "ils/elles": "choisissaient" },
        "Futur simple": { "je": "choisirai", "tu": "choisiras", "il/elle": "choisira", "nous": "choisirons", "vous": "choisirez", "ils/elles": "choisiront" },
        "Passé composé": { "j'": "ai choisi", "tu": "as choisi", "il/elle": "a choisi", "nous": "avons choisi", "vous": "avez choisi", "ils/elles": "ont choisi" },
        "Plus-que-parfait": { "j'": "avais choisi", "tu": "avais choisi", "il/elle": "avait choisi", "nous": "avions choisi", "vous": "aviez choisi", "ils/elles": "avaient choisi" },
        "Conditionnel Présent": { "je": "choisirais", "tu": "choisirais", "il/elle": "choisirait", "nous": "choisirions", "vous": "choisiriez", "ils/elles": "choisiraient" },
        "Subjonctif Présent": { "que je": "choisisse", "que tu": "choisisses", "qu'il/elle": "choisisse", "que nous": "choisissions", "que vous": "choisissiez", "qu'ils/elles": "choisissent" },
        "Impératif Présent": { "tu": "choisis", "nous": "choisissons", "vous": "choisissez" }
    },
    "dormir": {
        "Présent": { "je": "dors", "tu": "dors", "il/elle": "dort", "nous": "dormons", "vous": "dormez", "ils/elles": "dorment" },
        "Imparfait": { "je": "dormais", "tu": "dormais", "il/elle": "dormait", "nous": "dormions", "vous": "dormiez", "ils/elles": "dormaient" },
        "Futur simple": { "je": "dormirai", "tu": "dormiras", "il/elle": "dormira", "nous": "dormirons", "vous": "dormirez", "ils/elles": "dormiront" },
        "Passé composé": { "j'": "ai dormi", "tu": "as dormi", "il/elle": "a dormi", "nous": "avons dormi", "vous": "avez dormi", "ils/elles": "ont dormi" },
        "Plus-que-parfait": { "j'": "avais dormi", "tu": "avais dormi", "il/elle": "avait dormi", "nous": "avions dormi", "vous": "aviez dormi", "ils/elles": "avaient dormi" },
        "Conditionnel Présent": { "je": "dormirais", "tu": "dormirais", "il/elle": "dormirait", "nous": "dormirions", "vous": "dormiriez", "ils/elles": "dormiraient" },
        "Subjonctif Présent": { "que je": "dorme", "que tu": "dormes", "qu'il/elle": "dorme", "que nous": "dormions", "que vous": "dormiez", "qu'ils/elles": "dorment" },
        "Impératif Présent": { "tu": "dors", "nous": "dormons", "vous": "dormez" }
    },
    "courir": {
        "Présent": { "je": "cours", "tu": "cours", "il/elle": "court", "nous": "courons", "vous": "courez", "ils/elles": "courent" },
        "Imparfait": { "je": "courais", "tu": "courais", "il/elle": "courait", "nous": "courions", "vous": "couriez", "ils/elles": "couraient" },
        "Futur simple": { "je": "courrai", "tu": "courras", "il/elle": "courra", "nous": "courrons", "vous": "courrez", "ils/elles": "courront" },
        "Passé composé": { "j'": "ai couru", "tu": "as couru", "il/elle": "a couru", "nous": "avons couru", "vous": "avez couru", "ils/elles": "ont couru" },
        "Plus-que-parfait": { "j'": "avais couru", "tu": "avais couru", "il/elle": "avait couru", "nous": "avions couru", "vous": "aviez couru", "ils/elles": "avaient couru" },
        "Conditionnel Présent": { "je": "courrais", "tu": "courrais", "il/elle": "courrait", "nous": "courrions", "vous": "courriez", "ils/elles": "courraient" },
        "Subjonctif Présent": { "que je": "coure", "que tu": "coures", "qu'il/elle": "coure", "que nous": "courions", "que vous": "couriez", "qu'ils/elles": "courent" },
        "Impératif Présent": { "tu": "cours", "nous": "courons", "vous": "courez" }
    },
    "sentir": {
        "Présent": { "je": "sens", "tu": "sens", "il/elle": "sent", "nous": "sentons", "vous": "sentez", "ils/elles": "sentent" },
        "Imparfait": { "je": "sentais", "tu": "sentais", "il/elle": "sentait", "nous": "sentions", "vous": "sentiez", "ils/elles": "sentaient" },
        "Futur simple": { "je": "sentirai", "tu": "sentiras", "il/elle": "sentira", "nous": "sentirons", "vous": "sentirez", "ils/elles": "sentiront" },
        "Passé composé": { "j'": "ai senti", "tu": "as senti", "il/elle": "a senti", "nous": "avons senti", "vous": "avez senti", "ils/elles": "ont senti" },
        "Plus-que-parfait": { "j'": "avais senti", "tu": "avais senti", "il/elle": "avait senti", "nous": "avions senti", "vous": "aviez senti", "ils/elles": "avaient senti" },
        "Conditionnel Présent": { "je": "sentirais", "tu": "sentirais", "il/elle": "sentirait", "nous": "sentirions", "vous": "sentiriez", "ils/elles": "sentiraient" },
        "Subjonctif Présent": { "que je": "sente", "que tu": "sentes", "qu'il/elle": "sente", "que nous": "sentions", "que vous": "sentiez", "qu'ils/elles": "sentent" },
        "Impératif Présent": { "tu": "sens", "nous": "sentons", "vous": "sentez" }
    },
    "servir": {
        "Présent": { "je": "sers", "tu": "sers", "il/elle": "sert", "nous": "servons", "vous": "servez", "ils/elles": "servent" },
        "Imparfait": { "je": "servais", "tu": "servais", "il/elle": "servait", "nous": "servions", "vous": "serviez", "ils/elles": "servaient" },
        "Futur simple": { "je": "servirai", "tu": "serviras", "il/elle": "servira", "nous": "servirons", "vous": "servirez", "ils/elles": "serviront" },
        "Passé composé": { "j'": "ai servi", "tu": "as servi", "il/elle": "a servi", "nous": "avons servi", "vous": "avez servi", "ils/elles": "ont servi" },
        "Plus-que-parfait": { "j'": "avais servi", "tu": "avais servi", "il/elle": "avait servi", "nous": "avions servi", "vous": "aviez servi", "ils/elles": "avaient servi" },
        "Conditionnel Présent": { "je": "servirais", "tu": "servirais", "il/elle": "servirait", "nous": "servirions", "vous": "serviriez", "ils/elles": "serviraient" },
        "Subjonctif Présent": { "que je": "serve", "que tu": "serves", "qu'il/elle": "serve", "que nous": "servions", "que vous": "serviez", "qu'ils/elles": "servent" },
        "Impératif Présent": { "tu": "sers", "nous": "servons", "vous": "servez" }
    },
    "acheter": {
      "Présent": { "j'": "achète", "tu": "achètes", "il/elle": "achète", "nous": "achetons", "vous": "achetez", "ils/elles": "achètent" },
      "Imparfait": { "j'": "achetais", "tu": "achetais", "il/elle": "achetait", "nous": "achetions", "vous": "achetiez", "ils/elles": "achetaient" },
      "Futur simple": { "j'": "achèterai", "tu": "achèteras", "il/elle": "achètera", "nous": "achèterons", "vous": "achèterez", "ils/elles": "achèteront" },
      "Passé composé": { "j'": "ai acheté", "tu": "as acheté", "il/elle": "a acheté", "nous": "avons acheté", "vous": "avez acheté", "ils/elles": "ont acheté" },
      "Plus-que-parfait": { "j'": "avais acheté", "tu": "avais acheté", "il/elle": "avait acheté", "nous": "avions acheté", "vous": "aviez acheté", "ils/elles": "avaient acheté" },
      "Conditionnel Présent": { "j'": "achèterais", "tu": "achèterais", "il/elle": "achèterait", "nous": "achèterions", "vous": "achèteriez", "ils/elles": "achèteraient" },
      "Subjonctif Présent": { "que j'": "achète", "que tu": "achètes", "qu'il/elle": "achète", "que nous": "achetions", "que vous": "achetiez", "qu'ils/elles": "achètent" },
      "Impératif Présent": { "tu": "achète", "nous": "achetons", "vous": "achetez" }
    },
    "préférer": {
      "Présent": { "je": "préfère", "tu": "préfères", "il/elle": "préfère", "nous": "préférons", "vous": "préférez", "ils/elles": "préfèrent" },
      "Imparfait": { "je": "préférais", "tu": "préférais", "il/elle": "préférait", "nous": "préférions", "vous": "préfériez", "ils/elles": "préféraient" },
      "Futur simple": { "je": "préférerai", "tu": "préféreras", "il/elle": "préférera", "nous": "préférerons", "vous": "préférerez", "ils/elles": "préféreront" },
      "Passé composé": { "j'": "ai préféré", "tu": "as préféré", "il/elle": "a préféré", "nous": "avons préféré", "vous": "avez préféré", "ils/elles": "ont préféré" },
      "Plus-que-parfait": { "j'": "avais préféré", "tu": "avais préféré", "il/elle": "avait préféré", "nous": "avions préféré", "vous": "aviez préféré", "ils/elles": "avaient préféré" },
      "Conditionnel Présent": { "je": "préférerais", "tu": "préférerais", "il/elle": "préférerait", "nous": "préférerions", "vous": "préféreriez", "ils/elles": "préféreraient" },
      "Subjonctif Présent": { "que je": "préfère", "que tu": "préfères", "qu'il/elle": "préfère", "que nous": "préférions", "que vous": "préfériez", "qu'ils/elles": "préfèrent" },
      "Impératif Présent": { "tu": "préfère", "nous": "préférons", "vous": "préférez" }
    },
    "nettoyer": {
      "Présent": { "je": "nettoie", "tu": "nettoies", "il/elle": "nettoie", "nous": "nettoyons", "vous": "nettoyez", "ils/elles": "nettoient" },
      "Imparfait": { "je": "nettoyais", "tu": "nettoyais", "il/elle": "nettoyait", "nous": "nettoyions", "vous": "nettoyiez", "ils/elles": "nettoyaient" },
      "Futur simple": { "je": "nettoierai", "tu": "nettoieras", "il/elle": "nettoiera", "nous": "nettoierons", "vous": "nettoierez", "ils/elles": "nettoieront" },
      "Passé composé": { "j'": "ai nettoyé", "tu": "as nettoyé", "il/elle": "a nettoyé", "nous": "avons nettoyé", "vous": "avez nettoyé", "ils/elles": "ont nettoyé" },
      "Plus-que-parfait": { "j'": "avais nettoyé", "tu": "avais nettoyé", "il/elle": "avait nettoyé", "nous": "avions nettoyé", "vous": "aviez nettoyé", "ils/elles": "avaient nettoyé" },
      "Conditionnel Présent": { "je": "nettoierais", "tu": "nettoierais", "il/elle": "nettoierait", "nous": "nettoierions", "vous": "nettoieriez", "ils/elles": "nettoieraient" },
      "Subjonctif Présent": { "que je": "nettoie", "que tu": "nettoies", "qu'il/elle": "nettoie", "que nous": "nettoyions", "que vous": "nettoyiez", "qu'ils/elles": "nettoient" },
      "Impératif Présent": { "tu": "nettoie", "nous": "nettoyons", "vous": "nettoyez" }
    },
    "commencer": {
      "Présent": { "je": "commence", "tu": "commences", "il/elle": "commence", "nous": "commençons", "vous": "commencez", "ils/elles": "commencent" },
      "Imparfait": { "je": "commençais", "tu": "commençais", "il/elle": "commençait", "nous": "commencions", "vous": "commenciez", "ils/elles": "commençaient" },
      "Futur simple": { "je": "commencerai", "tu": "commenceras", "il/elle": "commencera", "nous": "commencerons", "vous": "commencerez", "ils/elles": "commenceront" },
      "Passé composé": { "j'": "ai commencé", "tu": "as commencé", "il/elle": "a commencé", "nous": "avons commencé", "vous": "avez commencé", "ils/elles": "ont commencé" },
      "Plus-que-parfait": { "j'": "avais commencé", "tu": "avais commencé", "il/elle": "avait commencé", "nous": "avions commencé", "vous": "aviez commencé", "ils/elles": "avaient commencé" },
      "Conditionnel Présent": { "je": "commencerais", "tu": "commencerais", "il/elle": "commencerait", "nous": "commencerions", "vous": "commenceriez", "ils/elles": "commenceraient" },
      "Subjonctif Présent": { "que je": "commence", "que tu": "commences", "qu'il/elle": "commence", "que nous": "commencions", "que vous": "commenciez", "qu'ils/elles": "commencent" },
      "Impératif Présent": { "tu": "commence", "nous": "commençons", "vous": "commencez" }
    },
    "agir": {
      "Présent": { "j'": "agis", "tu": "agis", "il/elle": "agit", "nous": "agissons", "vous": "agissez", "ils/elles": "agissent" },
      "Imparfait": { "j'": "agissais", "tu": "agissais", "il/elle": "agissait", "nous": "agissions", "vous": "agissiez", "ils/elles": "agissaient" },
      "Futur simple": { "j'": "agirai", "tu": "agiras", "il/elle": "agira", "nous": "agirons", "vous": "agirez", "ils/elles": "agiront" },
      "Passé composé": { "j'": "ai agi", "tu": "as agi", "il/elle": "a agi", "nous": "avons agi", "vous": "avez agi", "ils/elles": "ont agi" },
      "Plus-que-parfait": { "j'": "avais agi", "tu": "avais agi", "il/elle": "avait agi", "nous": "avions agi", "vous": "aviez agi", "ils/elles": "avaient agi" },
      "Conditionnel Présent": { "j'": "agirais", "tu": "agirais", "il/elle": "agirait", "nous": "agirions", "vous": "agiriez", "ils/elles": "agiraient" },
      "Subjonctif Présent": { "que j'": "agisse", "que tu": "agisses", "qu'il/elle": "agisse", "que nous": "agissions", "que vous": "agissiez", "qu'ils/elles": "agissent" },
      "Impératif Présent": { "tu": "agis", "nous": "agissons", "vous": "agissez" }
    },
    "réfléchir": {
      "Présent": { "je": "réfléchis", "tu": "réfléchis", "il/elle": "réfléchit", "nous": "réfléchissons", "vous": "réfléchissez", "ils/elles": "réfléchissent" },
      "Imparfait": { "je": "réfléchissais", "tu": "réfléchissais", "il/elle": "réfléchissait", "nous": "réfléchissions", "vous": "réfléchissiez", "ils/elles": "réfléchissaient" },
      "Futur simple": { "je": "réfléchirai", "tu": "réfléchiras", "il/elle": "réfléchira", "nous": "réfléchirons", "vous": "réfléchirez", "ils/elles": "réfléchiront" },
      "Passé composé": { "j'": "ai réfléchi", "tu": "as réfléchi", "il/elle": "a réfléchi", "nous": "avons réfléchi", "vous": "avez réfléchi", "ils/elles": "ont réfléchi" },
      "Plus-que-parfait": { "j'": "avais réfléchi", "tu": "avais réfléchi", "il/elle": "avait réfléchi", "nous": "avions réfléchi", "vous": "aviez réfléchi", "ils/elles": "avaient réfléchi" },
      "Conditionnel Présent": { "je": "réfléchirais", "tu": "réfléchirais", "il/elle": "réfléchirait", "nous": "réfléchirions", "vous": "réfléchiriez", "ils/elles": "réfléchiraient" },
      "Subjonctif Présent": { "que je": "réfléchisse", "que tu": "réfléchisses", "qu'il/elle": "réfléchisse", "que nous": "réfléchissions", "que vous": "réfléchissiez", "qu'ils/elles": "réfléchissent" },
      "Impératif Présent": { "tu": "réfléchis", "nous": "réfléchissons", "vous": "réfléchissez" }
    },
    "descendre": {
      "Présent": { "je": "descends", "tu": "descends", "il/elle": "descend", "nous": "descendons", "vous": "descendez", "ils/elles": "descendent" },
      "Imparfait": { "je": "descendais", "tu": "descendais", "il/elle": "descendait", "nous": "descendions", "vous": "descendiez", "ils/elles": "descendaient" },
      "Futur simple": { "je": "descendrai", "tu": "descendras", "il/elle": "descendra", "nous": "descendrons", "vous": "descendrez", "ils/elles": "descendront" },
      "Passé composé": { "je": "suis descendu(e)", "tu": "es descendu(e)", "il/elle": "est descendu(e)", "nous": "sommes descendu(e)s", "vous": "êtes descendu(e)(s)", "ils/elles": "sont descendu(e)s" },
      "Plus-que-parfait": { "j'": "étais descendu(e)", "tu": "étais descendu(e)", "il/elle": "était descendu(e)", "nous": "étions descendu(e)s", "vous": "étiez descendu(e)(s)", "ils/elles": "étaient descendu(e)s" },
      "Conditionnel Présent": { "je": "descendrais", "tu": "descendrais", "il/elle": "descendrait", "nous": "descendrions", "vous": "descendriez", "ils/elles": "descendraient" },
      "Subjonctif Présent": { "que je": "descende", "que tu": "descendes", "qu'il/elle": "descende", "que nous": "descendions", "que vous": "descendiez", "qu'ils/elles": "descendent" },
      "Impératif Présent": { "tu": "descends", "nous": "descendons", "vous": "descendez" }
    },
    "conduire": {
      "Présent": { "je": "conduis", "tu": "conduis", "il/elle": "conduit", "nous": "conduisons", "vous": "conduisez", "ils/elles": "conduisent" },
      "Imparfait": { "je": "conduisais", "tu": "conduisais", "il/elle": "conduisait", "nous": "conduisions", "vous": "conduisiez", "ils/elles": "conduisaient" },
      "Futur simple": { "je": "conduirai", "tu": "conduiras", "il/elle": "conduira", "nous": "conduirons", "vous": "conduirez", "ils/elles": "conduiront" },
      "Passé composé": { "j'": "ai conduit", "tu": "as conduit", "il/elle": "a conduit", "nous": "avons conduit", "vous": "avez conduit", "ils/elles": "ont conduit" },
      "Plus-que-parfait": { "j'": "avais conduit", "tu": "avais conduit", "il/elle": "avait conduit", "nous": "avions conduit", "vous": "aviez conduit", "ils/elles": "avaient conduit" },
      "Conditionnel Présent": { "je": "conduirais", "tu": "conduirais", "il/elle": "conduirait", "nous": "conduirions", "vous": "conduiriez", "ils/elles": "conduiraient" },
      "Subjonctif Présent": { "que je": "conduise", "que tu": "conduises", "qu'il/elle": "conduise", "que nous": "conduisions", "que vous": "conduisiez", "qu'ils/elles": "conduisent" },
      "Impératif Présent": { "tu": "conduis", "nous": "conduisons", "vous": "conduisez" }
    },
    "craindre": {
      "Présent": { "je": "crains", "tu": "crains", "il/elle": "craint", "nous": "craignons", "vous": "craignez", "ils/elles": "craignent" },
      "Imparfait": { "je": "craignais", "tu": "craignais", "il/elle": "craignait", "nous": "craignions", "vous": "craigniez", "ils/elles": "craignaient" },
      "Futur simple": { "je": "craindrai", "tu": "craindras", "il/elle": "craindra", "nous": "craindrons", "vous": "craindrez", "ils/elles": "craindront" },
      "Passé composé": { "j'": "ai craint", "tu": "as craint", "il/elle": "a craint", "nous": "avons craint", "vous": "avez craint", "ils/elles": "ont craint" },
      "Plus-que-parfait": { "j'": "avais craint", "tu": "avais craint", "il/elle": "avait craint", "nous": "avions craint", "vous": "aviez craint", "ils/elles": "avaient craint" },
      "Conditionnel Présent": { "je": "craindrais", "tu": "craindrais", "il/elle": "craindrait", "nous": "craindrions", "vous": "craindriez", "ils/elles": "craindraient" },
      "Subjonctif Présent": { "que je": "craigne", "que tu": "craignes", "qu'il/elle": "craigne", "que nous": "craignions", "que vous": "craigniez", "qu'ils/elles": "craignent" },
      "Impératif Présent": { "tu": "crains", "nous": "craignons", "vous": "craignez" }
    },
    "plaire": {
      "Présent": { "je": "plais", "tu": "plais", "il/elle": "plaît", "nous": "plaisons", "vous": "plaisez", "ils/elles": "plaisent" },
      "Imparfait": { "je": "plaisais", "tu": "plaisais", "il/elle": "plaisait", "nous": "plaisions", "vous": "plaisiez", "ils/elles": "plaisaient" },
      "Futur simple": { "je": "plairai", "tu": "plairas", "il/elle": "plaira", "nous": "plairons", "vous": "plairez", "ils/elles": "plairont" },
      "Passé composé": { "j'": "ai plu", "tu": "as plu", "il/elle": "a plu", "nous": "avons plu", "vous": "avez plu", "ils/elles": "ont plu" },
      "Plus-que-parfait": { "j'": "avais plu", "tu": "avais plu", "il/elle": "avait plu", "nous": "avions plu", "vous": "aviez plu", "ils/elles": "avaient plu" },
      "Conditionnel Présent": { "je": "plairais", "tu": "plairais", "il/elle": "plairait", "nous": "plairions", "vous": "plairiez", "ils/elles": "plairaient" },
      "Subjonctif Présent": { "que je": "plaise", "que tu": "plaises", "qu'il/elle": "plaise", "que nous": "plaisions", "que vous": "plaisiez", "qu'ils/elles": "plaisent" },
      "Impératif Présent": { "tu": "plais", "nous": "plaisons", "vous": "plaisez" }
    },
    "rire": {
      "Présent": { "je": "ris", "tu": "ris", "il/elle": "rit", "nous": "rions", "vous": "riez", "ils/elles": "rient" },
      "Imparfait": { "je": "riais", "tu": "riais", "il/elle": "riait", "nous": "riions", "vous": "riiez", "ils/elles": "riaient" },
      "Futur simple": { "je": "rirai", "tu": "riras", "il/elle": "rira", "nous": "rirons", "vous": "rirez", "ils/elles": "riront" },
      "Passé composé": { "j'": "ai ri", "tu": "as ri", "il/elle": "a ri", "nous": "avons ri", "vous": "avez ri", "ils/elles": "ont ri" },
      "Plus-que-parfait": { "j'": "avais ri", "tu": "avais ri", "il/elle": "avait ri", "nous": "avions ri", "vous": "aviez ri", "ils/elles": "avaient ri" },
      "Conditionnel Présent": { "je": "rirais", "tu": "rirais", "il/elle": "rirait", "nous": "ririons", "vous": "ririez", "ils/elles": "riraient" },
      "Subjonctif Présent": { "que je": "rie", "que tu": "ries", "qu'il/elle": "rie", "que nous": "riions", "que vous": "riiez", "qu'ils/elles": "rient" },
      "Impératif Présent": { "tu": "ris", "nous": "rions", "vous": "riez" }
    },
    "suffire": {
      "Présent": { "je": "suffis", "tu": "suffis", "il/elle": "suffit", "nous": "suffisons", "vous": "suffisez", "ils/elles": "suffisent" },
      "Imparfait": { "je": "suffisais", "tu": "suffisais", "il/elle": "suffisait", "nous": "suffisions", "vous": "suffisiez", "ils/elles": "suffisaient" },
      "Futur simple": { "je": "suffirai", "tu": "suffiras", "il/elle": "suffira", "nous": "suffirons", "vous": "suffirez", "ils/elles": "suffiront" },
      "Passé composé": { "j'": "ai suffi", "tu": "as suffi", "il/elle": "a suffi", "nous": "avons suffi", "vous": "avez suffi", "ils/elles": "ont suffi" },
      "Plus-que-parfait": { "j'": "avais suffi", "tu": "avais suffi", "il/elle": "avait suffi", "nous": "avions suffi", "vous": "aviez suffi", "ils/elles": "avaient suffi" },
      "Conditionnel Présent": { "je": "suffirais", "tu": "suffirais", "il/elle": "suffirait", "nous": "suffirions", "vous": "suffiriez", "ils/elles": "suffiraient" },
      "Subjonctif Présent": { "que je": "suffise", "que tu": "suffises", "qu'il/elle": "suffise", "que nous": "suffisions", "que vous": "suffisiez", "qu'ils/elles": "suffisent" },
      "Impératif Présent": { "tu": "suffis", "nous": "suffisons", "vous": "suffisez" }
    }
  };

  const rules = {
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
  
  const tips = {
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
    const irregularVerbs = ["être", "avoir", "aller", "faire", "pouvoir", "vouloir", "savoir", "dire", "mettre", "prendre", "voir", "devoir", "venir", "croire", "boire", "recevoir", "dormir", "courir", "sentir", "servir"];
    if (rules[tense]?.[verb]) {
      specialCase = verb;
    } else if (irregularVerbs.includes(verb) && rules[tense]?.[verb]) {
       specialCase = verb;
    }


    let rule = rules[tense]?.[specialCase!] || rules[tense]?.[verbGroup] || rules[tense]?.default || null;
    let tip = tips[tense]?.[specialCase!] || tips[tense]?.[verbGroup] || tips[tense]?.default || null;

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
  