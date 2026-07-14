insert into categories (slug, name, background_key, icon, sort_order) values
  ('culture_generale', 'Culture générale', 'prairie', 'lightbulb', 0),
  ('animaux', 'Animaux', 'forest', 'paw', 1),
  ('nature', 'Nature', 'forest', 'leaf', 2),
  ('sciences', 'Sciences', 'mountain', 'flask', 3),
  ('geographie', 'Géographie', 'mountain', 'globe', 4),
  ('histoire', 'Histoire', 'desert', 'scroll', 5),
  ('sport', 'Sport', 'prairie', 'trophy', 6),
  ('cinema', 'Cinéma', 'jungle', 'clapperboard', 7),
  ('series', 'Séries', 'jungle', 'tv', 8),
  ('musique', 'Musique', 'ocean', 'music-note', 9),
  ('art', 'Art', 'ocean', 'palette', 10),
  ('jeux_video', 'Jeux vidéo', 'snow', 'gamepad', 11),
  ('technologie', 'Technologie', 'snow', 'cpu', 12),
  ('cuisine', 'Cuisine', 'savanna', 'chef-hat', 13)
on conflict (slug) do nothing;
