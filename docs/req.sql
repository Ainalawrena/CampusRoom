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
