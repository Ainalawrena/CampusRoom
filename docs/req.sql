-- 1. UTILISATEURS
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'etudiant',
    remember_token VARCHAR(100),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- 2. SALLES
CREATE TABLE salles (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    capacite INTEGER NOT NULL CHECK (capacite >= 0),
    batiment VARCHAR(255),
    statut VARCHAR(50) NOT NULL DEFAULT 'disponible',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- 3. EQUIPEMENTS
CREATE TABLE equipements (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- 4. TABLE PIVOT equipement_salle (relation many-to-many POSSEDER)
CREATE TABLE equipement_salle (
    salle_id BIGINT NOT NULL REFERENCES salles(id) ON DELETE CASCADE,
    equipement_id BIGINT NOT NULL REFERENCES equipements(id) ON DELETE CASCADE,
    PRIMARY KEY (salle_id, equipement_id)
);

-- 5. RESERVATIONS
CREATE TABLE reservations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    salle_id BIGINT NOT NULL REFERENCES salles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    heure_debut TIME NOT NULL,
    heure_fin TIME NOT NULL,
    motif VARCHAR(255),
    statut VARCHAR(50) NOT NULL DEFAULT 'en_attente',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);


INSERT INTO equipements (nom, created_at, updated_at) VALUES
('Projecteur', NOW(), NOW()),
('Tableau blanc', NOW(), NOW()),
('Climatisation', NOW(), NOW()),
('Ordinateur', NOW(), NOW()),
('Vidéoprojecteur interactif', NOW(), NOW()),
('Système audio', NOW(), NOW()),
('Connexion Wi-Fi', NOW(), NOW()),
('Microphone', NOW(), NOW());

INSERT INTO salles (nom, capacite, batiment, statut, created_at, updated_at) VALUES
('R101', 30, 'Bloc A', 'disponible', NOW(), NOW()),
('R102', 40, 'Bloc A', 'disponible', NOW(), NOW()),
('L201', 25, 'Bloc B', 'disponible', NOW(), NOW()),
('L202', 60, 'Bloc B', 'maintenance', NOW(), NOW()),
('Amphi 1', 120, 'Bloc C', 'disponible', NOW(), NOW()),
('Salle Informatique', 35, 'Bloc D', 'disponible', NOW(), NOW());

INSERT INTO equipement_salle (salle_id, equipement_id) VALUES

-- R101
(1,1),
(1,2),
(1,8),

-- R102
(2,1),
(2,2),
(2,4),
(2,8),

-- L201
(3,2),
(3,8),

-- L202
(4,1),
(4,2),
(4,4),
(4,7),
(4,8),

-- Amphi 1
(5,1),
(5,2),
(5,4),
(5,7),
(5,9),
(5,8),

-- Salle Informatique
(6,5),
(6,2),
(6,4),
(6,8);
