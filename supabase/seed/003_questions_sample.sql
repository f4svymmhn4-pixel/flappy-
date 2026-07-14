-- Sample question bank: 4 questions per category (easy/easy/medium/hard),
-- fact-checked against well-established, non-disputed trivia so every
-- correct_option is unambiguous. This is a seed, not the target scale —
-- see supabase/README.md for the bulk-import path used to reach the tens
-- of thousands of rows needed for production.
insert into questions (
  category_id, difficulty, prompt, option_a, option_b, option_c, option_d, correct_option,
  validation_status, validated_at, source
)
select c.id, v.difficulty::difficulty_level, v.prompt, v.option_a, v.option_b, v.option_c, v.option_d,
  v.correct_option::smallint, 'approved', now(), 'seed'
from (values
  -- animaux
  ('animaux', 'easy', 'Quel est le plus grand animal terrestre ?', 'Le rhinocéros', 'L''éléphant d''Afrique', 'La girafe', 'L''hippopotame', '1'),
  ('animaux', 'easy', 'Combien de pattes a une araignée ?', '6', '8', '10', '4', '1'),
  ('animaux', 'medium', 'Quel est le seul mammifère capable de voler activement ?', 'L''écureuil volant', 'La chauve-souris', 'Le colugo', 'Le phalanger', '1'),
  ('animaux', 'hard', 'Quel est l''animal terrestre le plus rapide sur courte distance ?', 'Le lion', 'Le guépard', 'L''antilope', 'Le zèbre', '1'),

  -- sciences
  ('sciences', 'easy', 'Quelle planète est surnommée la planète rouge ?', 'Vénus', 'Mars', 'Jupiter', 'Saturne', '1'),
  ('sciences', 'easy', 'Quel gaz les plantes absorbent-elles pour la photosynthèse ?', 'Oxygène', 'Azote', 'Dioxyde de carbone', 'Hydrogène', '2'),
  ('sciences', 'medium', 'Combien d''os compte le squelette d''un adulte humain ?', '186', '206', '226', '246', '1'),
  ('sciences', 'hard', 'Quel est le symbole chimique de l''or ?', 'Ag', 'Au', 'Fe', 'Pb', '1'),

  -- geographie
  ('geographie', 'easy', 'Quelle est la capitale de la France ?', 'Lyon', 'Marseille', 'Paris', 'Toulouse', '2'),
  ('geographie', 'easy', 'Quel est le plus grand océan du monde ?', 'Atlantique', 'Indien', 'Arctique', 'Pacifique', '3'),
  ('geographie', 'medium', 'Quel est le plus grand désert chaud du monde ?', 'Le Sahara', 'Le désert de Gobi', 'Le Kalahari', 'Le désert d''Atacama', '0'),
  ('geographie', 'hard', 'Dans quel pays se trouve le mont Kilimandjaro ?', 'Kenya', 'Tanzanie', 'Ouganda', 'Éthiopie', '1'),

  -- histoire
  ('histoire', 'easy', 'En quelle année a eu lieu la Révolution française ?', '1789', '1815', '1900', '1750', '0'),
  ('histoire', 'medium', 'Qui a peint la Joconde ?', 'Michel-Ange', 'Léonard de Vinci', 'Raphaël', 'Donatello', '1'),
  ('histoire', 'medium', 'Quel empereur français a été exilé sur l''île de Sainte-Hélène ?', 'Louis XIV', 'Napoléon III', 'Napoléon Bonaparte', 'Charlemagne', '2'),
  ('histoire', 'hard', 'En quelle année le mur de Berlin est-il tombé ?', '1985', '1989', '1991', '1993', '1'),

  -- sport
  ('sport', 'easy', 'Combien de joueurs une équipe de football aligne-t-elle sur le terrain ?', '9', '10', '11', '12', '2'),
  ('sport', 'easy', 'Tous les combien d''années ont lieu les Jeux Olympiques d''été ?', '2 ans', '3 ans', '4 ans', '5 ans', '2'),
  ('sport', 'medium', 'Dans quel sport utilise-t-on un volant ?', 'Le tennis', 'Le badminton', 'Le squash', 'Le tennis de table', '1'),
  ('sport', 'hard', 'Combien de sets faut-il gagner pour remporter un match de tennis en 5 sets ?', '2', '3', '4', '5', '1'),

  -- cinema
  ('cinema', 'easy', 'Qui a réalisé la saga Star Wars originale ?', 'Steven Spielberg', 'George Lucas', 'James Cameron', 'Ridley Scott', '1'),
  ('cinema', 'medium', 'Quel studio a produit le film ''Toy Story'' ?', 'DreamWorks', 'Illumination', 'Pixar', 'Disney Animation', '2'),
  ('cinema', 'medium', 'Quel acteur incarne Iron Man dans l''univers cinématographique Marvel ?', 'Chris Evans', 'Chris Hemsworth', 'Robert Downey Jr.', 'Mark Ruffalo', '2'),
  ('cinema', 'hard', 'Quel réalisateur a mis en scène ''Titanic'' (1997) ?', 'James Cameron', 'Steven Spielberg', 'Peter Jackson', 'Ridley Scott', '0'),

  -- series
  ('series', 'easy', 'Dans quelle ville se déroule la série ''Friends'' ?', 'Los Angeles', 'New York', 'Chicago', 'Boston', '1'),
  ('series', 'medium', 'Dans ''Game of Thrones'', quelle maison a pour emblème un loup ?', 'Lannister', 'Targaryen', 'Stark', 'Baratheon', '2'),
  ('series', 'medium', 'Combien d''amis composent le groupe principal de la série ''Friends'' ?', '4', '5', '6', '7', '2'),
  ('series', 'hard', 'Dans quelle ville fictive se déroule la série ''The Simpsons'' ?', 'Quahog', 'Springfield', 'South Park', 'Bedrock', '1'),

  -- musique
  ('musique', 'easy', 'Combien de cordes possède une guitare classique ?', '4', '5', '6', '7', '2'),
  ('musique', 'easy', 'Quel groupe britannique a chanté ''Bohemian Rhapsody'' ?', 'The Beatles', 'Queen', 'Pink Floyd', 'The Rolling Stones', '1'),
  ('musique', 'medium', 'Combien de touches compte un piano standard ?', '76', '88', '92', '100', '1'),
  ('musique', 'hard', 'Quel compositeur est devenu sourd à la fin de sa vie ?', 'Mozart', 'Bach', 'Beethoven', 'Chopin', '2'),

  -- art
  ('art', 'easy', 'Dans quelle ville se trouve le musée du Louvre ?', 'Lyon', 'Paris', 'Marseille', 'Nice', '1'),
  ('art', 'medium', 'Quel peintre est célèbre pour ses tableaux de tournesols ?', 'Claude Monet', 'Vincent van Gogh', 'Paul Cézanne', 'Edgar Degas', '1'),
  ('art', 'medium', 'À quel mouvement artistique Pablo Picasso est-il associé ?', 'L''impressionnisme', 'Le cubisme', 'Le surréalisme', 'Le pointillisme', '1'),
  ('art', 'hard', 'Quel sculpteur a créé ''Le Penseur'' ?', 'Auguste Rodin', 'Camille Claudel', 'Constantin Brâncuși', 'Alberto Giacometti', '0'),

  -- jeux_video
  ('jeux_video', 'easy', 'Quel plombier moustachu est le héros de nombreux jeux Nintendo ?', 'Luigi', 'Mario', 'Wario', 'Yoshi', '1'),
  ('jeux_video', 'easy', 'Dans quelle licence incarne-t-on le héros Link ?', 'The Legend of Zelda', 'Final Fantasy', 'Metroid', 'Kirby', '0'),
  ('jeux_video', 'medium', 'Quel studio a créé le jeu ''Minecraft'' ?', 'Epic Games', 'Mojang', 'Valve', 'Ubisoft', '1'),
  ('jeux_video', 'hard', 'En quelle année la première console PlayStation est-elle sortie ?', '1992', '1994', '1996', '1998', '1'),

  -- technologie
  ('technologie', 'easy', 'Que signifie le sigle ''GPS'' ?', 'Global Positioning System', 'General Public Service', 'Global Phone Signal', 'Ground Position Sensor', '0'),
  ('technologie', 'medium', 'Quelle entreprise a créé le système d''exploitation Android ?', 'Apple', 'Microsoft', 'Google', 'Samsung', '2'),
  ('technologie', 'medium', 'Quel langage de programmation utilise l''extension de fichier ''.py'' ?', 'Java', 'Python', 'PHP', 'Ruby', '1'),
  ('technologie', 'hard', 'Qui a co-fondé Apple aux côtés de Steve Jobs ?', 'Bill Gates', 'Steve Wozniak', 'Elon Musk', 'Larry Page', '1'),

  -- cuisine
  ('cuisine', 'easy', 'Quel ingrédient principal compose une omelette ?', 'La farine', 'Les œufs', 'Le lait', 'Le beurre', '1'),
  ('cuisine', 'easy', 'De quel pays la pizza margherita est-elle originaire ?', 'France', 'Espagne', 'Italie', 'Grèce', '2'),
  ('cuisine', 'medium', 'Quel fromage est traditionnellement fondu pour une raclette ?', 'Le camembert', 'Le comté', 'Le raclette', 'Le roquefort', '2'),
  ('cuisine', 'hard', 'Quelle épice est extraite du pistil de la fleur de crocus ?', 'Le curcuma', 'Le safran', 'La cannelle', 'Le paprika', '1'),

  -- nature
  ('nature', 'easy', 'Combien de saisons compte une année ?', '2', '3', '4', '5', '2'),
  ('nature', 'medium', 'Quel est le plus haut sommet du monde ?', 'Le K2', 'L''Everest', 'Le Mont Blanc', 'Le Kilimandjaro', '1'),
  ('nature', 'medium', 'Quel phénomène est la principale cause des marées ?', 'Le vent', 'L''attraction de la Lune', 'La rotation terrestre', 'La température de l''eau', '1'),
  ('nature', 'hard', 'Quelle est la plus grande forêt tropicale du monde ?', 'La forêt du Congo', 'La forêt amazonienne', 'La forêt de Bornéo', 'La forêt de Sumatra', '1'),

  -- culture_generale
  ('culture_generale', 'easy', 'Combien de continents compte-t-on selon le modèle le plus enseigné en France ?', '5', '6', '7', '8', '2'),
  ('culture_generale', 'easy', 'Quelle est la langue ayant le plus de locuteurs natifs au monde ?', 'L''anglais', 'Le mandarin', 'L''espagnol', 'L''hindi', '1'),
  ('culture_generale', 'medium', 'Combien de jours compte une année bissextile ?', '364', '365', '366', '367', '2'),
  ('culture_generale', 'hard', 'Quel est le plus petit État du monde par sa superficie ?', 'Monaco', 'Le Vatican', 'Saint-Marin', 'Le Liechtenstein', '1')
) as v(category_slug, difficulty, prompt, option_a, option_b, option_c, option_d, correct_option)
join categories c on c.slug = v.category_slug;
