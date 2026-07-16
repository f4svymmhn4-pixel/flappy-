import {
  AgeGroup,
  AlreadyHas,
  BudgetRange,
  GiftType,
  Passion,
  Reaction,
  Relation,
  Style,
} from "../types/domain";

export interface Option<T extends string> {
  value: T;
  emoji: string;
  label: string;
  subtitle?: string;
}

export const relationOptions: Option<Relation>[] = [
  { value: "partenaire", emoji: "❤️", label: "Mon/ma partenaire" },
  { value: "papa", emoji: "👨", label: "Papa" },
  { value: "maman", emoji: "👩", label: "Maman" },
  { value: "enfant", emoji: "👦", label: "Mon enfant" },
  { value: "frere_soeur", emoji: "👧", label: "Mon frère / ma sœur" },
  { value: "ami", emoji: "👬", label: "Un ami proche" },
  { value: "collegue", emoji: "🤝", label: "Un collègue" },
  { value: "famille", emoji: "💍", label: "Un membre de ma famille" },
  { value: "autre", emoji: "✨", label: "Autre" },
];

export const ageOptions: Option<AgeGroup>[] = [
  { value: "0-3", emoji: "👶", label: "0-3 ans" },
  { value: "4-6", emoji: "🧸", label: "4-6 ans" },
  { value: "7-10", emoji: "🎮", label: "7-10 ans" },
  { value: "11-15", emoji: "🔥", label: "11-15 ans" },
  { value: "16-20", emoji: "🎧", label: "16-20 ans" },
  { value: "21-30", emoji: "🚀", label: "21-30 ans" },
  { value: "31-45", emoji: "✨", label: "31-45 ans" },
  { value: "46-60", emoji: "🌿", label: "46-60 ans" },
  { value: "60+", emoji: "⭐", label: "60+" },
];

export const budgetOptions: Option<BudgetRange>[] = [
  { value: "moins10", emoji: "💸", label: "Moins de 10 €" },
  { value: "10-30", emoji: "🎁", label: "10-30 €" },
  { value: "30-50", emoji: "🎁", label: "30-50 €" },
  { value: "50-100", emoji: "⭐", label: "50-100 €" },
  { value: "100-200", emoji: "💎", label: "100-200 €" },
  { value: "plus200", emoji: "👑", label: "Plus de 200 €" },
];

export const passionOptions: Option<Passion>[] = [
  { value: "jeux_video", emoji: "🎮", label: "Jeux vidéo" },
  { value: "sport", emoji: "⚽", label: "Sport" },
  { value: "fitness", emoji: "🏋️", label: "Fitness / musculation" },
  { value: "rugby", emoji: "🏉", label: "Rugby / sports collectifs" },
  { value: "cuisine", emoji: "🍳", label: "Cuisine" },
  { value: "gastronomie", emoji: "🍷", label: "Gastronomie" },
  { value: "lecture", emoji: "📚", label: "Lecture" },
  { value: "films_series", emoji: "🎬", label: "Films et séries" },
  { value: "musique", emoji: "🎵", label: "Musique" },
  { value: "instruments", emoji: "🎸", label: "Instruments" },
  { value: "photo_video", emoji: "📸", label: "Photo / vidéo" },
  { value: "voyage", emoji: "✈️", label: "Voyage" },
  { value: "nature", emoji: "🌱", label: "Nature" },
  { value: "decoration", emoji: "🏠", label: "Décoration" },
  { value: "creation_artistique", emoji: "🎨", label: "Création artistique" },
  { value: "apprentissage_culture", emoji: "🧠", label: "Apprentissage / culture" },
  { value: "automobile", emoji: "🚗", label: "Automobile" },
  { value: "moto", emoji: "🏍", label: "Moto" },
  { value: "animaux", emoji: "🐶", label: "Animaux" },
  { value: "mode_beaute", emoji: "👗", label: "Mode / beauté" },
  { value: "jeux_societe", emoji: "🎲", label: "Jeux de société" },
  { value: "jardinage", emoji: "🌿", label: "Jardinage" },
  { value: "cafe_lifestyle", emoji: "☕", label: "Café / lifestyle" },
];

export const styleOptions: Option<Style>[] = [
  {
    value: "bobo_parisien",
    emoji: "🥐",
    label: "Bobo parisien(ne)",
    subtitle: "Aime les objets beaux, cafés, déco, artisanat, expériences originales.",
  },
  {
    value: "rugbyman",
    emoji: "🍻",
    label: "Rugbyman / troisième mi-temps",
    subtitle: "Aime le sport, les amis, les bons moments, l'humour.",
  },
  {
    value: "elegant_classique",
    emoji: "🧥",
    label: "Élégant(e) classique",
    subtitle: "Aime la qualité, les belles marques, les objets intemporels.",
  },
  {
    value: "geek_passionne",
    emoji: "💻",
    label: "Geek passionné(e)",
    subtitle: "Aime technologie, jeux, gadgets, nouveautés.",
  },
  {
    value: "aventurier",
    emoji: "🌍",
    label: "Aventurier(e)",
    subtitle: "Aime voyager, explorer, découvrir.",
  },
  {
    value: "zen_bienetre",
    emoji: "🧘",
    label: "Zen / bien-être",
    subtitle: "Aime relaxation, équilibre, prendre soin de soi.",
  },
  {
    value: "creatif",
    emoji: "🎨",
    label: "Créatif(ve)",
    subtitle: "Aime fabriquer, créer, personnaliser.",
  },
  {
    value: "passionne_hobby",
    emoji: "🏎",
    label: "Passionné(e)",
    subtitle: "A une passion forte et aime les objets liés à celle-ci.",
  },
  {
    value: "drole_bande",
    emoji: "🤪",
    label: "Le/la drôle de la bande",
    subtitle: "Aime humour, cadeaux décalés.",
  },
  {
    value: "cocooning_maison",
    emoji: "🏡",
    label: "Cocooning maison",
    subtitle: "Aime confort, intérieur, ambiance.",
  },
];

export const giftTypeOptions: Option<GiftType>[] = [
  { value: "inattendu", emoji: "✨", label: "Un cadeau qu'il/elle n'aurait jamais pensé acheter" },
  { value: "ameliore_quotidien", emoji: "🛠", label: "Quelque chose qui améliore vraiment son quotidien" },
  { value: "valeur_sentimentale", emoji: "❤️", label: "Quelque chose avec une histoire ou une valeur sentimentale" },
  { value: "experience_memorable", emoji: "🎭", label: "Une expérience mémorable" },
  { value: "original_rare", emoji: "🔥", label: "Quelque chose d'original que peu de personnes possèdent" },
  { value: "impressionnant", emoji: "👑", label: "Un cadeau impressionnant dès l'ouverture" },
  { value: "fou_rire", emoji: "😂", label: "Un cadeau qui provoque un fou rire" },
  { value: "connaissance_profonde", emoji: "💌", label: "Un cadeau qui montre que je connais vraiment cette personne" },
];

export const reactionOptions: Option<Reaction>[] = [
  { value: "comment_trouve", emoji: "😍", label: '"Mais comment tu as trouvé ça ?"' },
  { value: "trop_drole", emoji: "😂", label: '"Excellent, c\'est trop drôle"' },
  { value: "ca_me_touche", emoji: "❤️", label: '"Ça me touche vraiment"' },
  { value: "pas_attendu", emoji: "🤩", label: '"Je ne m\'y attendais pas"' },
  { value: "exactement_fallait", emoji: "😌", label: '"C\'est exactement ce qu\'il me fallait"' },
  { value: "personne_offert", emoji: "🔥", label: '"Personne ne m\'avait offert ça"' },
];

export const alreadyHasOptions: Option<AlreadyHas>[] = [
  { value: "vetements", emoji: "👕", label: "Vêtements" },
  { value: "livres", emoji: "📚", label: "Livres" },
  { value: "jeux", emoji: "🎮", label: "Jeux" },
  { value: "decoration", emoji: "🏠", label: "Décoration" },
  { value: "technologie", emoji: "🔌", label: "Technologie" },
  { value: "beaute", emoji: "💄", label: "Beauté" },
  { value: "cuisine", emoji: "🍳", label: "Cuisine" },
  { value: "sais_pas", emoji: "❓", label: "Je ne sais pas" },
];
