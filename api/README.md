# Pokédex API

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
git clone https://github.com/votre-username/pokedex.git
cd pokedex
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env
# Modifier les valeurs dans .env selon votre configuration
```

4. Créer un compte administrateur
```bash
npm run init-admin
```

5. Lancer le serveur
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## Structure de l'API

### Points d'entrée principaux

| Route | Description |
|-------|-------------|
| `/api/auth/*` | Routes d'authentification |
| `/api/pkmn/*` | Routes de gestion des Pokémon |
| `/api/trainer/*` | Routes de gestion des dresseurs |

### Documentation détaillée des routes

La documentation complète de l'API est disponible via Swagger UI à l'adresse :
```
http://localhost:3000/api-docs
```

### Authentification

- POST `/api/auth/register` : Inscription
- POST `/api/auth/login` : Connexion
- GET `/api/auth/me` : Profil utilisateur

### Pokémon

- GET `/api/pkmn/types` : Liste des types de Pokémon
- POST `/api/pkmn` : Création d'un Pokémon (Admin)
- GET `/api/pkmn/search` : Recherche de Pokémon
- GET `/api/pkmn` : Détails d'un Pokémon
- PUT `/api/pkmn` : Modification d'un Pokémon (Admin)
- DELETE `/api/pkmn` : Suppression d'un Pokémon (Admin)
- POST `/api/pkmn/region` : Ajout d'une région (Admin)
- DELETE `/api/pkmn/region` : Suppression d'une région (Admin)

### Dresseur

- POST `/api/trainer` : Création d'un profil dresseur
- GET `/api/trainer` : Récupération du profil
- PUT `/api/trainer` : Modification du profil
- DELETE `/api/trainer` : Suppression du profil
- POST `/api/trainer/mark` : Marquer un Pokémon comme vu/capturé

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

## Structure du projet

```
src/
├── controllers/     # Contrôleurs de l'application
├── middlewares/    # Middlewares (auth, etc.)
├── models/         # Modèles Mongoose
├── routes/         # Définition des routes
├── services/       # Logique métier
└── tests/          # Tests unitaires et d'intégration

public/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx        
│   │   │   └── RegisterForm.jsx     
│   │   ├── pokemon/
│   │   │   ├── PokemonCard.jsx      
│   │   │   ├── PokemonList.jsx      
│   │   │   └── PokemonSearch.jsx    
│   │   └── trainer/
│   │       ├── TrainerProfile.jsx   
│   │       └── PokemonCollection.jsx 
│   ├── services/
│   │   ├── api.service.js          
│   │   ├── auth.service.js  
│   │   ├── pokemon.service.js  
│   │   └── trainer.service.js  
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
└── assets/
    └── images/
        ├── pokemon/    
        ├── trainers/   
        └── types/
```

## Rôles et Permissions

- `USER` : Peut voir les Pokémon et gérer son profil de dresseur
- `ADMIN` : Peut créer/modifier/supprimer des Pokémon

## Front du projet

### Structure de base

- Une barre de navigation claire avec : Connexion/Inscription, Pokédex, Mon Profil
- Un design épuré avec les couleurs classiques Pokémon (rouge, blanc, noir)

### Pages essentielles

- Page d'accueil simple avec la liste des Pokémon et une barre de recherche
- Formulaires de connexion/inscription basiques
- Page de profil dresseur montrant les statistiques principales
- Vue détaillée d'un Pokémon avec ses informations essentielles

### Fonctionnalités clés

- Filtrage simple par type et recherche par nom
- Boutons "Vu" et "Capturé" facilement accessibles
- Affichage clair des Pokémon vus/capturés dans le profil
- Pagination ou infinite scroll pour la liste des Pokémon

### Interface utilisateur

- Cartes Pokémon simples avec image, nom et types
- Icônes distinctes pour indiquer le statut (vu/capturé)
- Design responsive basique pour mobile et desktop

## License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.