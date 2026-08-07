# CampusRoom

CampusRoom est une application web de gestion des réservations de salles destinée à une université. Elle permet aux étudiants, enseignants, logisticiens et administrateurs de gérer efficacement les demandes de réservation.

Projet réalisé dans le cadre de la Licence 3 Informatique et Technologie.

---

# Fonctionnalités

## Étudiant

- Consulter la liste des salles
- Vérifier la disponibilité d'une salle
- Effectuer une demande de réservation
- Consulter ses réservations
- Recevoir une notification lors du changement de statut
- Recevoir un e-mail lors de l'acceptation ou du refus d'une réservation
- Modifier son profil

## Enseignant

- Consulter la liste des salles
- Vérifier la disponibilité d'une salle
- Effectuer une réservation
- Consulter ses réservations
- Recevoir des notifications
- Modifier son profil

## Logistique

- Consulter toutes les demandes
- Rechercher une réservation
- Accepter ou refuser une réservation
- Recevoir une notification lorsqu'une nouvelle demande est créée

## Administrateur

- Tableau de bord
- Gestion des salles
- Gestion des utilisateurs
- Consultation des statistiques

---

# Technologies utilisées

## Frontend

- React
- React Router
- Axios
- CSS

## Backend

- Laravel
- Laravel Sanctum

## Base de données

- PostgreSQL

---

# Architecture du projet

```
CampusRoom
│
├── backend
│   ├── app
│   ├── database
│   ├── routes
│   ├── public
│   └── ...
│
├── frontend
│   ├── src
│   ├── public
│   └── ...
│
└── README.md
```

---

# Installation

## 1. Cloner le projet

```bash
git clone https://github.com/VOTRE_COMPTE/CampusRoom.git

cd CampusRoom
```

---

## 2. Backend

```bash
cd backend

composer install

cp .env.example .env

php artisan key:generate

php artisan migrate

php artisan db:seed

php artisan serve
```

Le backend sera accessible sur :

```
http://127.0.0.1:8000
```

---

## 3. Frontend

```bash
cd frontend

npm install

npm run dev
```

Le frontend sera accessible sur :

```
http://localhost:5173
```

---

# Comptes de démonstration

Créer les utilisateurs via les seeders ou directement dans la base de données.

Rôles disponibles :

- administrateur
- logistique
- enseignant
- etudiant

---

# Fonctionnement

1. Un étudiant ou un enseignant crée une réservation.
2. Le service logistique reçoit une notification.
3. Le logisticien accepte ou refuse la demande.
4. L'utilisateur reçoit :
   - une notification dans l'application ;
   - un e-mail indiquant le nouveau statut de la réservation.

---

# Notifications

Les notifications sont enregistrées dans la base de données et affichées dans l'interface utilisateur.

---

# Envoi d'e-mails

L'application utilise Gmail SMTP pour envoyer automatiquement :

- un e-mail lors de la création d'une réservation ;
- un e-mail lors de l'acceptation ;
- un e-mail lors du refus.

---

# Auteur

Lawrena NyAina

Licence 3 Informatique et Technologie

Université
