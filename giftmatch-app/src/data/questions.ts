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
  { value: "famille", emoji: "👪", label: "Un membre de ma famille" },
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
  // Sport & fitness
  { value: "jeux_video", emoji: "🎮", label: "Jeux vidéo" },
  { value: "sport", emoji: "⚽", label: "Sport" },
  { value: "fitness", emoji: "🏋️", label: "Fitness / musculation" },
  { value: "rugby", emoji: "🏉", label: "Rugby / sports collectifs" },
  { value: "football", emoji: "⚽", label: "Football" },
  { value: "basketball", emoji: "🏀", label: "Basketball" },
  { value: "tennis", emoji: "🎾", label: "Tennis / padel" },
  { value: "golf", emoji: "⛳", label: "Golf" },
  { value: "natation", emoji: "🏊", label: "Natation" },
  { value: "cyclisme", emoji: "🚴", label: "Cyclisme" },
  { value: "course_a_pied", emoji: "🏃", label: "Course à pied" },
  { value: "yoga", emoji: "🧘", label: "Yoga" },
  { value: "escalade", emoji: "🧗", label: "Escalade" },
  { value: "randonnee", emoji: "🥾", label: "Randonnée" },
  // Cuisine & gastronomie
  { value: "cuisine", emoji: "🍳", label: "Cuisine" },
  { value: "gastronomie", emoji: "🍷", label: "Gastronomie" },
  { value: "patisserie", emoji: "🧁", label: "Pâtisserie" },
  { value: "oenologie", emoji: "🍇", label: "Œnologie / vin" },
  { value: "cafe_lifestyle", emoji: "☕", label: "Café / lifestyle" },
  { value: "mixologie", emoji: "🍸", label: "Mixologie / cocktails" },
  // Culture & loisirs
  { value: "lecture", emoji: "📚", label: "Lecture" },
  { value: "films_series", emoji: "🎬", label: "Films et séries" },
  { value: "musique", emoji: "🎵", label: "Musique" },
  { value: "instruments", emoji: "🎸", label: "Instruments" },
  { value: "jeux_societe", emoji: "🎲", label: "Jeux de société" },
  { value: "apprentissage_culture", emoji: "🧠", label: "Apprentissage / culture" },
  { value: "photo_video", emoji: "📸", label: "Photo / vidéo" },
  // Maison & création
  { value: "decoration", emoji: "🏠", label: "Décoration" },
  { value: "creation_artistique", emoji: "🎨", label: "Création artistique" },
  { value: "artisanat", emoji: "🧶", label: "Artisanat" },
  { value: "bricolage", emoji: "🔨", label: "Bricolage" },
  { value: "jardinage", emoji: "🌿", label: "Jardinage" },
  // Mode & beauté
  { value: "mode", emoji: "👗", label: "Mode" },
  { value: "beaute", emoji: "💄", label: "Beauté" },
  { value: "bijoux", emoji: "💍", label: "Bijoux" },
  // Voyage & aventure
  { value: "voyage", emoji: "✈️", label: "Voyage" },
  { value: "nature", emoji: "🌱", label: "Nature" },
  { value: "camping", emoji: "⛺", label: "Camping / plein air" },
  // Véhicules
  { value: "automobile", emoji: "🚗", label: "Automobile" },
  { value: "moto", emoji: "🏍", label: "Moto" },
  // Animaux
  { value: "animaux", emoji: "🐶", label: "Animaux" },
  // Bien-être & luxe
  { value: "bien_etre", emoji: "🕯️", label: "Bien-être / relaxation" },
  { value: "luxe", emoji: "👑", label: "Luxe" },
  // Technologie
  { value: "technologie", emoji: "🔌", label: "Technologie / gadgets" },
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
  {
    value: "minimaliste",
    emoji: "⚪",
    label: "Minimaliste",
    subtitle: "Aime le style épuré, les objets essentiels, la simplicité.",
  },
  {
    value: "sportif",
    emoji: "🏃",
    label: "Sportif(ve)",
    subtitle: "Aime bouger, se dépasser, l'énergie du sport.",
  },
  {
    value: "ecolo",
    emoji: "🌍",
    label: "Écolo engagé(e)",
    subtitle: "Attentif(ve) à l'environnement, préfère le durable et le local.",
  },
  {
    value: "amateur_luxe",
    emoji: "💎",
    label: "Amateur de luxe",
    subtitle: "Aime les belles matières, l'exclusivité, le raffinement.",
  },
  {
    value: "fashion_addict",
    emoji: "👗",
    label: "Fashion addict",
    subtitle: "Suit les tendances, adore la mode et les nouvelles pièces.",
  },
  {
    value: "boheme",
    emoji: "🌸",
    label: "Bohème",
    subtitle: "Style libre, imprimés, esprit voyageur et décontracté.",
  },
  {
    value: "epicurien",
    emoji: "🍷",
    label: "Épicurien(ne)",
    subtitle: "Aime les bons moments, la table, profiter de la vie.",
  },
  {
    value: "gourmet",
    emoji: "🍽️",
    label: "Gourmet",
    subtitle: "Passionné(e) de cuisine et de belles découvertes culinaires.",
  },
  {
    value: "intellectuel",
    emoji: "🧐",
    label: "Intellectuel(le)",
    subtitle: "Aime les idées, la culture, les débats et les livres exigeants.",
  },
  {
    value: "vintage_nostalgique",
    emoji: "📻",
    label: "Fan de vintage",
    subtitle: "Nostalgique, aime les objets rétro et les belles histoires.",
  },
  {
    value: "entrepreneur",
    emoji: "🚀",
    label: "Entrepreneur(euse)",
    subtitle: "Ambitieux(se), ne s'arrête jamais, aime ce qui fait gagner du temps.",
  },
  {
    value: "manuel_bricoleur",
    emoji: "🔧",
    label: "Manuel(le) / bricoleur(se)",
    subtitle: "Aime réparer, construire, bricoler de ses mains.",
  },
  {
    value: "passionne_musique",
    emoji: "🎧",
    label: "Passionné(e) de musique",
    subtitle: "Vit au rythme de la musique, concerts et playlists.",
  },
  {
    value: "fan_cinema_series",
    emoji: "🎬",
    label: "Fan de cinéma et séries",
    subtitle: "Toujours une série en cours, cinéphile dans l'âme.",
  },
  {
    value: "gamer",
    emoji: "🎮",
    label: "Gamer",
    subtitle: "Passionné(e) de jeux vidéo, aime le matériel gaming.",
  },
  {
    value: "nature_randonnee",
    emoji: "🥾",
    label: "Nature / randonnée",
    subtitle: "Se ressource dehors, aime marcher et prendre l'air.",
  },
  {
    value: "original_insolite",
    emoji: "🦄",
    label: "Original(e)",
    subtitle: "Aime les objets insolites, sortir des sentiers battus.",
  },
  {
    value: "traditionnel",
    emoji: "🕰️",
    label: "Traditionnel(le)",
    subtitle: "Attaché(e) aux valeurs classiques et aux belles habitudes.",
  },
  {
    value: "romantique",
    emoji: "💌",
    label: "Romantique",
    subtitle: "Sensible aux attentions, aux gestes doux et aux souvenirs.",
  },
  {
    value: "collectionneur",
    emoji: "🗃️",
    label: "Collectionneur(euse)",
    subtitle: "Aime compléter une collection, chiner la pièce rare.",
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
  { value: "vetements", emoji: "👕", label: "Beaucoup de vêtements" },
  { value: "chaussures", emoji: "👟", label: "Beaucoup de chaussures" },
  { value: "bijoux", emoji: "💍", label: "Beaucoup de bijoux" },
  { value: "beaute", emoji: "💄", label: "Beaucoup de produits de beauté" },
  { value: "livres", emoji: "📚", label: "Beaucoup de livres" },
  { value: "technologie", emoji: "🔌", label: "Beaucoup de gadgets high-tech" },
  { value: "decoration", emoji: "🏠", label: "Beaucoup d'objets de décoration" },
  { value: "plantes", emoji: "🪴", label: "Beaucoup de plantes" },
  { value: "cuisine", emoji: "🍳", label: "Beaucoup d'ustensiles de cuisine" },
  { value: "accessoires_voyage", emoji: "🧳", label: "Beaucoup d'accessoires de voyage" },
  { value: "equipement_sport", emoji: "🏋️", label: "Beaucoup d'équipements de sport" },
  { value: "jeux", emoji: "🎮", label: "Beaucoup de jeux vidéo / consoles" },
  { value: "vin_spiritueux", emoji: "🍷", label: "Beaucoup de vin ou spiritueux" },
  { value: "materiel_creatif", emoji: "🎨", label: "Beaucoup de matériel créatif" },
  { value: "objets_collection", emoji: "🗃️", label: "Beaucoup d'objets de collection" },
  { value: "accessoires_mode", emoji: "👜", label: "Beaucoup d'accessoires de mode" },
  { value: "objets_connectes", emoji: "📱", label: "Beaucoup d'objets connectés" },
  { value: "souvenirs_voyage", emoji: "🗺️", label: "Beaucoup de souvenirs de voyage" },
  { value: "sais_pas", emoji: "❓", label: "Rien de particulier / je ne sais pas" },
];
