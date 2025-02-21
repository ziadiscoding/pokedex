# Pokédex (Frontend)

Une interface web moderne pour gérer un Pokédex, permettant aux dresseurs de gérer leur collection de Pokémon. Développée avec React, Vite et Tailwind CSS.

## Fonctionnalités

- Authentification complète (JWT)
- Gestion des rôles (USER/ADMIN)
- Interface responsive et moderne
- Visualisation 2D des Pokémon
- Gestion de la collection personnelle
- Recherche et filtres avancés
- Thème sombre personnalisé
- Animations et transitions fluides

## Prérequis

- Node.js (v22.x)
- Backend Pokédex API
- npm ou yarn

## Installation

1. Cloner le repository
```bash
git clone https://github.com/ziadiscoding/pokedex.git
cd project
```

2. Installer les dépendances
```bash
npm install
```

3. Lancer l'application
```bash
# Mode développement
npm run dev
```

## Scripts disponibles

- `npm run dev` : Lance en mode développement
- `npm run build` : Compile pour la production
- `npm run preview` : Prévisualise la version de production
- `npm run lint` : Vérifie le code avec ESLint

## Structure du projet

```
src/
├── components/
│   ├── auth/         # Composants d'authentification
│   ├── pokemon/      # Composants des Pokémon
│   ├── trainer/      # Composants du profil dresseur
│   └── partials/     # Composants partagés
├── contexts/         # Contextes React
├── services/         # Services API
└── assets/          # Ressources statiques
    ├── ico/         # Icônes
    ├── img/         # Images
    └── models/      # Modèles 3D
```

## Composants principaux

- `LoginForm` : Gestion de la connexion
- `PokemonList` : Liste et recherche des Pokémon
- `PokemonCard` : Affichage détaillé d'un Pokémon
- `TrainerProfile` : Profil et statistiques du dresseur
- `Discover` : Mode découverte des Pokémon

## Services

- `authService` : Gestion de l'authentification
- `pokemonService` : Interactions avec les Pokémon
- `trainerService` : Gestion du profil dresseur

## Styles et Thème

Le projet utilise Tailwind CSS avec un thème personnalisé :

```javascript
colors: {
  primary: {
    dark: '#1A103C',
    DEFAULT: '#2D1B69',
    light: '#392082'
  },
  accent: {
    purple: '#9D3FFF',
    pink: '#FF3FF2',
    blue: '#3F83FF'
  }
}
```

## Configurations

- Port de développement : 5173
- Proxy API : http://localhost:3000
- Environnements supportés : 
  - Development
  - Production

## Dépendances principales

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^7.1.5",
  "axios": "^1.7.9",
  "@react-three/fiber": "^8.17.14",
  "tailwindcss": "^3.3.5"
}
```

## Valeurs par défaut

- URL API : /api
- Compte admin :
  - Username : admin
  - Password : admin123

## Responsive Design

- Mobile : ≥ 320px
- Tablet : ≥ 768px
- Desktop : ≥ 1024px
- Large : ≥ 1280px

## Compatibilité navigateurs

- Chrome (dernières versions)
- Firefox (dernières versions)
- Safari (dernières versions)
- Edge (dernières versions)

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.