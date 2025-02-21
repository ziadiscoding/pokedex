# API Pokédex (Backend)

Une API RESTful pour gérer un Pokédex, permettant de manipuler des Pokémon et des dresseurs. Développée avec Node.js, Express et MongoDB.

## Fonctionnalités

- Authentification des utilisateurs (JWT)
- Gestion des rôles (USER/ADMIN)
- CRUD complet pour les Pokémon
- Gestion des dresseurs et de leurs Pokémon vus/capturés
- Documentation Swagger intégrée
- Tests unitaires et d'intégration

## Prérequis

- Node.js (v22.x)
- MongoDB
- npm ou yarn

## Installation

1. Cloner le repository
```bash
git clone https://github.com/ziadiscoding/pokedex.git
cd api
```

2. Installer les dépendances
```bash
npm install
```

3. Créer un compte administrateur
```bash
npm run init-admin
```

4. Lancer le serveur
```bash
# Mode développement
npm run dev
```

## Scripts disponibles

- `npm start` : Lance en mode production
- `npm run dev` : Lance en mode développement avec rechargement à chaud
- `npm test` : Exécute tous les tests
- `npm run test:watch` : Exécute les tests en mode watch
- `npm run test:coverage` : Exécute les tests avec rapport de couverture
- `npm run init-admin` : Initialise le compte administrateur

## Structure du projet

```
src/
├── controllers/     # Contrôleurs de l'application
├── middlewares/    # Middlewares (auth, etc.)
├── models/         # Modèles Mongoose
├── routes/         # Définition des routes
├── services/       # Logique métier
└── tests/          # Tests unitaires et d'intégration
```

## Rôles et Permissions

- `USER` : Peut voir les Pokémon et gérer son profil de dresseur
- `ADMIN` : Peut créer/modifier/supprimer des Pokémon

## Documentation de l'API

La documentation complète de l'API est disponible via Swagger UI à l'adresse :
```
http://localhost:3000/api-docs
```

## Tests

Le projet inclut des tests unitaires et d'intégration. Pour les exécuter :

```bash
# Exécuter tous les tests
npm test

# Exécuter les tests avec couverture
npm run test:coverage

# Mode watch pour le développement
npm run test:watch
```

## Valeurs par défaut

L'application utilise les configurations par défaut suivantes :
- Port du serveur : 3000
- URL MongoDB : mongodb://localhost:27017/pokedex
- Compte admin par défaut :
  - Username : admin
  - Email : admin@pokemon.com
  - Password : admin123

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.