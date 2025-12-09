<div align="center">
<img width="180" title="SUPINFO" alt="Logo SUPINFO" src="https://github.com/user-attachments/assets/b8a5986f-efc3-4326-b15e-f12073e24739" />
<h1>Spectre</h1>
<p width="120"> Une application web moderne et fonctionnelle qui répond aux besoins réels des amateurs de cinéma. </p>
</div>

----

## Télécharger 

**[Télécharger le code source](https://github.com/lava1879/Spectre/archive/main.zip)**

## Configuration requise

> [!CAUTION]
> Il est nécessaire d'utiliser un serveur pour accéder au site. Vous pourrez utiliser:

<strong><a href="https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer">Live Server</a></strong> par Ritwick Dey, ou <strong> <a href="https://www.npmjs.com/package/http-server">http-server</a></strong> par http-party

> [!NOTE]
> C'est possible d'utiliser des autres serveurs, mais nous ne pouvons pas garantir qu'ils fonctionneront correctement.

> [!WARNING]  
> <strong><a href="https://www.npmjs.com/package/serve">serve</a></strong> par Vercel ne fonctionne pas correctement en raison de sa gestion des URL conviviales (voir les problèmes <a href="https://github.com/vercel/serve/issues/732">**#732**</a> et <a href="https://github.com/vercel/serve-handler/issues/178">**#178**</a>). Nous vous recommandons fortement d'utiliser <strong><a href="https://www.npmjs.com/package/http-server">http-server</a></strong> à la place.

## Installation

1. Obtenez le code source soit en **[téléchargeant le zip](https://github.com/lava1879/Spectre/archive/main.zip)**, soit en faisant `git clone https://github.com/lava1879/Spectre`.
2. Installez les dépendances (soit Live Server depuis le Visual Studio Marketplace, soit http-server en utilisant `npm install --global http-server`).
3. Ouvrez le dossier contenant le code source (ou extraire le zip téléchargé et ouvrer le dossier), puis ouvrez le répertoire du programme dans un terminal.
4. Tapez dans le terminal `http-server` pour lancer l'application web **(situé par défaut à http://localhost:8080)**.

## Comment ça marche ?

### Architecture du projet
```
Spectre/
├── index.html             # Page d'accueil
├── search.html            # Page de recherche
├── movie.html             # Page détails du film
├── about.html             # À propos
├── credits.html           # Crédits
├── privacy-policy.html    # Infos légales
└── data/
    └── keywords.json      # Mots clés 
└── src/
    ├── css/
    │   └── style.css      # Styles CSS avec thème dark/light
    ├── js/
    │   ├── api.js         # Communication avec l'API OMDb
    │   ├── index.js       # Logique page d'accueil
    │   ├── search.js      # Logique page de recherche
    │   ├── movie.js       # Logique page détails
    │   ├── search-overlay.js  # Overlay de recherche
    │   └── theme.js       # Gestion du thème
    └── img/
        └── ico/
            ├── favicon.ico
            └── nopicture.png  # Image par défaut

```

### Fonctionnalités principales

**1. Page d'accueil** `index.html`
- Affiche trois sections de films/séries :
  - Continuer à regarder : 3 films prédéfinis
  - Films populaires : 12 films aléatoires
  - Séries du moment : 12 séries aléatoires
- Bouton **"Charger plus"** pour afficher davantage de contenu
- Les films sont sélectionnés aléatoirement parmi une liste de mots-clés populaires

**2. Recherche**
- **Overlay de recherche** : accessible via l'icône de recherche en haut de page
- **Page dédiée** `search.html` : recherche approfondie avec pagination
- Recherche en temps réel avec debouncing
- Affichage des résultats avec affiche, titre et année

**3. Détails du film `movie.html`**
- Récupération complète des informations via l'ID IMDb
- Affichage : affiche, synopsis, casting, notes, récompenses, etc.
- Formatage des dates DVD en format français

**4. Thème dark/light**
- Détection automatique des préférences système
- Sauvegarde dans `localStorage`
- Basculement manuel via l'icône en haut à droite

### API OMDb

Le site utilise l'API OMDb (The Open Movie Database) :
- **Endpoint** : `https://www.omdbapi.com/`
- **Clé API** : Obtenir depuis <a href="https://www.omdbapi.com/apikey.aspx">le site de l'API OMDb</a>
- **Limites** : 1000 requêtes/jour en version gratuite

### Fonctionnement technique

**Chargement dynamique** :
- Les films sont chargés de manière async via `fetch()`
- Gestion des erreurs et images manquantes
- Images de secours `nopicture.png` si l'affiche n'existe pas

**Performance** :
- Lazy loading des images `loading="lazy"`
- Debouncing sur la recherche pour éviter trop de requêtes API
- Mise en cache du thème dans `localStorage`

### Personnalisation

**Modifier les films affichés** :
Éditez la base de données JSON dans `data/keywords.json` :
```json
"movies": [
    "Inception",
    "Interstellar",
```

**Changer la clé API** :
Modifiez `API_KEY` dans `src/js/api.js` avec vous avez votre propre clé OMDb.

## Technologies utilisées
Ce site utilise **HTML, CSS et JavaScript moderne** pour offrir une expérience utilisateur fluide et responsive. Les données proviennent de **<a href="https://www.omdbapi.com">l'API OMDb</a>**, une base de données complète et fiable.
        
## Pourquoi nous choisir ?

* Base de données complète alimentée par **<a href="https://www.omdb.org">l'OMDb (The Open Movie Database)</a>**
* Interface moderne et intuitive
* Recherche rapide et efficace
* Informations détaillées sur chaque film
* Accessible sur tous vos appareils

## Objectif du projet

Ce projet a été réalisé dans le cadre d'un mini-projet académique à SUPINFO par des étudiants passionnés de développement web.

