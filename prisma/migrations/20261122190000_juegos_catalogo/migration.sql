CREATE TABLE "cosxs_game_catalog" (
    "id" VARCHAR(60) NOT NULL,
    "nombre" VARCHAR(120) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "emoji" VARCHAR(20) NOT NULL,
    "color" VARCHAR(20) NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cosxs_game_catalog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "cosxs_game_card_catalog" (
    "id" SERIAL NOT NULL,
    "group_id" VARCHAR(60) NOT NULL,
    "texto" TEXT NOT NULL,
    "categoria" VARCHAR(60) NOT NULL,
    "emoji" VARCHAR(20) NOT NULL,
    "color" VARCHAR(20) NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cosxs_game_card_catalog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "cosxs_game_card_catalog_group_id_idx" ON "cosxs_game_card_catalog"("group_id");

INSERT INTO "cosxs_game_catalog" ("id", "nombre", "descripcion", "emoji", "color", "orden", "activa") VALUES
('viajes', 'Escapadas', 'Salir de la rutina y perderse un poco.', '🧳', '#7fe3b9', 0, true),
('retos', 'Retos', 'Cosas que quizá no harían solos.', '🎯', '#ffb978', 1, true),
('citas', 'Citas', 'Planes para mirarse distinto.', '💞', '#ff8fa3', 2, true),
('casa', 'Plan casero', 'Para quedarse sin salir.', '🏠', '#7fb1c7', 3, true),
('comida', 'Comida', 'Para probar y compartir.', '🍜', '#ffd36b', 4, true),
('aventura', 'Aventura', 'Un poco de improvisación.', '🎒', '#7fb1c7', 5, true),
('picante', '+18', 'Para cuando estén solos y con ganas.', '🔥', '#ff6f91', 6, true);

INSERT INTO "cosxs_game_card_catalog" ("id", "group_id", "texto", "categoria", "emoji", "color", "activa") VALUES
(5, 'viajes', 'Escapada a un pueblo que no conocemos', 'Viajes', '🏞️', '#7fe3b9', true),
(17, 'viajes', 'Hacer una lista de 10 sitios para conocer', 'Viajes', '🗺️', '#7fb1c7', true),
(28, 'viajes', 'Un viaje de un día a la playa', 'Viajes', '🏖️', '#7fb1c7', true),
(47, 'viajes', 'Hacer una escapada de dos días a un lugar cercano', 'Viajes', '🧳', '#ff8fa3', true),
(58, 'viajes', 'Un viaje en tren sin destino fijo', 'Viajes', '🚆', '#7fe3b9', true),
(59, 'viajes', 'Conocer un pueblo costero', 'Viajes', '⛵', '#6bb8e8', true),
(4, 'retos', 'Aprender a bailar una canción juntos', 'Retos', '💃', '#b579d4', true),
(14, 'retos', 'Clase de cerámica o algo hecho con las manos', 'Retos', '🏺', '#ffb978', true),
(15, 'retos', 'Un día entero sin teléfonos', 'Retos', '📵', '#b579d4', true),
(21, 'retos', 'Hacer ejercicio juntos una semana', 'Retos', '🏃', '#ffb978', true),
(27, 'retos', 'Aprender algo nuevo en una clase de una hora', 'Retos', '🧠', '#ffb978', true),
(32, 'retos', 'Hacer un reto de 24 horas sin redes sociales', 'Retos', '📴', '#ff8fa3', true),
(42, 'retos', 'Escoger un sueño y dar el primer paso este mes', 'Retos', '✨', '#ff8fa3', true),
(46, 'retos', 'Aprender una palabra nueva del idioma del otro', 'Retos', '🗣️', '#ffb978', true),
(1, 'citas', 'Una cena sorpresa sin mirar el menú', 'Citas', '🕯️', '#ff8fa3', true),
(7, 'citas', 'Un picnic al atardecer', 'Citas', '🧺', '#ff8fa3', true),
(13, 'citas', 'Ver el amanecer desde un lugar bonito', 'Citas', '🌅', '#ff8fa3', true),
(18, 'citas', 'Una tarde de fotos en la ciudad', 'Citas', '📷', '#ff8fa3', true),
(24, 'citas', 'Escribirnos una carta para abrir en un año', 'Citas', '💌', '#ff8fa3', true),
(26, 'citas', 'Ir a un museo y elegir la obra favorita del otro', 'Citas', '🖼️', '#7fe3b9', true),
(30, 'citas', 'Una noche de confesiones sin filtro', 'Citas', '🌌', '#b579d4', true),
(35, 'citas', 'Ver una película en un cine al aire libre', 'Citas', '🎬', '#7fb1c7', true),
(43, 'citas', 'Una cita temática: cada uno elige la sorpresa', 'Citas', '🎭', '#b579d4', true),
(45, 'citas', 'Ver las estrellas en un lugar sin luces', 'Citas', '🌠', '#7fb1c7', true),
(3, 'casa', 'Noche de pelis malas con palomitas', 'Casa', '🍿', '#ffd36b', true),
(6, 'casa', 'Cocinar una receta nueva sin discutir', 'Casa', '🍳', '#ffb978', true),
(8, 'casa', 'Karaoke en casa hasta quedarnos sin voz', 'Casa', '🎤', '#b579d4', true),
(9, 'casa', 'Una noche de juegos de mesa y apuestas', 'Casa', '🎲', '#7fb1c7', true),
(11, 'casa', 'Desayuno en la cama un domingo', 'Casa', '🥐', '#ffd36b', true),
(20, 'casa', 'Un maratón de una serie entera en un fin de semana', 'Casa', '📺', '#7fe3b9', true),
(25, 'casa', 'Una noche de spa casero', 'Casa', '🛁', '#b579d4', true),
(31, 'casa', 'Plantar algo y cuidarlo entre los dos', 'Casa', '🌱', '#7fe3b9', true),
(36, 'casa', 'Hacer un álbum con nuestras fotos favoritas', 'Casa', '📸', '#ff8fa3', true),
(39, 'casa', 'Un plan de lluvia: mantita, música y charla', 'Casa', '🌧️', '#b579d4', true),
(16, 'comida', 'Probar un restaurante de otra cultura', 'Comida', '🍜', '#ffd36b', true),
(22, 'comida', 'Un asado o comida al aire libre', 'Comida', '🍖', '#ffd36b', true),
(29, 'comida', 'Cocinar juntos el plato favorito del otro', 'Comida', '🍝', '#ffd36b', true),
(34, 'comida', 'Un desayuno o merienda en un sitio nuevo', 'Comida', '☕', '#ffd36b', true),
(38, 'comida', 'Tomar una clase de cocina juntos', 'Comida', '👩‍🍳', '#ffd36b', true),
(44, 'comida', 'Un día de campo con comida hecha en casa', 'Comida', '🥗', '#7fe3b9', true),
(2, 'aventura', 'Un finde improvisado sin planear destino', 'Aventura', '🎒', '#7fb1c7', true),
(10, 'aventura', 'Ir a un concierto de alguien que no conocemos', 'Aventura', '🎶', '#ffb978', true),
(12, 'aventura', 'Una caminata larga sin mirar el reloj', 'Aventura', '🥾', '#7fe3b9', true),
(19, 'aventura', 'Dormir una noche fuera de casa sin avisar', 'Aventura', '🌙', '#b579d4', true),
(23, 'aventura', 'Conocer un barrio de nuestra ciudad como turistas', 'Aventura', '🏙️', '#7fb1c7', true),
(33, 'aventura', 'Ir a un karaoke público y cantar una canción', 'Aventura', '🎙️', '#ffb978', true),
(37, 'aventura', 'Una ruta en bicicleta o patines', 'Aventura', '🚲', '#7fe3b9', true),
(40, 'aventura', 'Ir juntos a una feria o parque de atracciones', 'Aventura', '🎡', '#ffb978', true),
(50, 'aventura', 'Elegir juntos el próximo plan sin pensarlo demasiado', 'Aventura', '🎟️', '#7fe3b9', true),
(51, 'picante', 'Una noche entera de sexo sin mirar el reloj', 'Picante', '🔥', '#ff6f91', true),
(52, 'picante', '¿Qué postura te gustaría probar conmigo esta noche?', 'Picante', '💃', '#ff8fa3', true),
(53, 'picante', 'Sexo oral hasta que uno de los dos no aguante más', 'Picante', '🕯️', '#b579d4', true),
(54, 'picante', 'Un juego de confesiones sexuales sin filtro', 'Picante', '🤫', '#ff6f91', true),
(55, 'picante', 'Que me digas exactamente qué te excita y hacerlo', 'Picante', '🙈', '#ffb978', true),
(56, 'picante', 'Una noche de dominación suave: tú decides el ritmo', 'Picante', '🌙', '#b579d4', true),
(57, 'picante', 'Cumplir una fantasía sexual tuya este fin de semana', 'Picante', '🎭', '#ff6f91', true);

SELECT setval(
    pg_get_serial_sequence('"cosxs_game_card_catalog"', 'id'),
    (SELECT MAX("id") FROM "cosxs_game_card_catalog")
);
