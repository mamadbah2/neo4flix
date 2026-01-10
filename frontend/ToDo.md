# Petits détails à corriger pour ce projet

## 1. Authentification
- Rendre possible l'inscription via Keycloak.
- Implémenter la 2FA.

## 2. Sécurité
- Augmenter la durée de vie d'un refresh token à 1 mois.

## 3. Intégration Neo4j
- Lorsqu'on accède à la page détail d'un film, l'ajouter automatiquement dans Neo4j.
- Ou, lors du partage d'un film, vérifier qu'il est bien ajouté dans Neo4j avant de partager (sinon ça ne fonctionne pas).
- Prévoir une requête rapide pour l'ajout, idéalement juste en visitant la page, pour faciliter les recommandations.

## 4. Amélioration de la page sociale
- Revoir l'esthétique de la page sociale.
- Implémenter une requête `/batch` pour récupérer toutes les infos à afficher (le backend ne renvoie actuellement que ceci) :

```json
[
  {
    "tmdbId": 81,
    "title": "Nausicaä de la vallée du vent",
    "overview": null,
    "posterPath": "/sIcv6IiaL6Ad2KGUOdRyJHIZpgC.jpg",
    "voteAverage": null,
    "genres": null
  },
  {
    "tmdbId": 372058,
    "title": "Your Name.",
    "overview": null,
    "posterPath": "/zyHjvVRgKOt9wgVx4ikp2kGArGF.jpg",
    "voteAverage": null,
    "genres": null
  },
  {
    "tmdbId": 274,
    "title": "Le Silence des agneaux",
    "overview": null,
    "posterPath": "/sSQDxwm4r28YpJSQVyVOtpYVs0E.jpg",
    "voteAverage": null,
    "genres": null
  },
  {
    "tmdbId": 1311031,
    "title": "Demon Slayer : Kimetsu no Yaiba - Le film : La Forteresse infinie",
    "overview": null,
    "posterPath": "/wXTU3AFmlUPbqjH68MZ989uHd6k.jpg",
    "voteAverage": null,
    "genres": null
  }
]
```

## 5. Correction bug ajout d'ami (page sociale)
- Après avoir ajouté un premier ami, une erreur apparaît :
  ```
  ERROR TypeError: Cannot read properties of undefined (reading 'username')
  at SocialComponent_Conditional_42_Conditional_0_Template (social.component.html:189:21)
  ...
  ```
- Vérifier le fonctionnement en local (test .http), puis corriger le problème.

## 6. UI sociale
- Enlever le bloc rouge à droite "challenge du mois".

## 7. Navigation
- Dans le header, cliquer sur l’avatar puis sur "mon profil" doit rediriger vers la page sociale.

## 8. Notation de film
- Rendre le commentaire obligatoire lors du rating d’un film (modif frontend).

## 9. Documentation
- Rédiger un README pour le backend.

## 10. Audit Recommendation Microservice
- Vérifier si le projet répond à ces questions :
  - Spring Data Neo4j (ou autre) est-il utilisé pour l’interaction Spring Boot/Neo4j ?
  - Neo4j OGM est-il utilisé pour mapper les objets Java ?
  - Un algorithme de la Neo4j Graph Algorithms Library (content-based, collaborative filtering, etc.) est-il utilisé pour les recommandations ?
  - Maîtrise du Cypher Query Language pour la logique de recommandation ?
  - Le microservice génère-t-il des recommandations précises basées sur les notes et films liés ?

## 11. Déploiement
- Déployer le projet en HTTPS sur le VPS.

---

**X. Finaliser le projet et réaliser les audits**
