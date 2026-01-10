Voici votre feuille de route détaillée pour mettre en place la **2FA** avec une page **custom** :

---

### Partie 1 : Configuration de la 2FA dans Keycloak

L'objectif est de forcer Keycloak à demander un code OTP (One Time Password) après le mot de passe.

1. **Activer l'OTP au niveau du flux :**
* Allez dans **Authentication** > onglet **Flows**.
* Sélectionnez le flux **Browser**.
* Cherchez la ligne **OTP Form** (souvent sous "Browser - Conditional OTP").
* Passez son statut de `Optional` à **Required**.


2. **Régler la politique de sécurité :**
* Allez dans **Realm Settings** > onglet **OTP Policy**.
* Vérifiez que le type est bien **TOTP** et le nombre de chiffres à **6**.


3. **Mettre à jour le Client :**
* Allez dans **Clients** > **neo4flix-app**.
* Dans l'onglet **Settings**, assurez-vous que **Standard flow enabled** est sur **On**.
* **Important :** Désactivez à terme *Direct access grants* (le flux password que vous utilisiez) pour plus de sécurité.



---

### Partie 2 : Création d'un Thème Custom (Design)

Pour que l'utilisateur ne voie pas l'interface par défaut de Keycloak, vous allez créer un thème qui imite votre application Angular.

#### 1. Structure des fichiers (sur votre serveur Keycloak)

Accédez au dossier d'installation de Keycloak et créez la structure suivante dans le dossier `/themes` :

```text
themes/
  neo4flix-theme/
    login/
      theme.properties
      resources/
        css/
          custom-login.css
        img/
          logo.png
      messages/
        messages_fr.properties (optionnel pour traduire)

```

#### 2. Configuration du thème (`theme.properties`)

Ce fichier indique à Keycloak d'utiliser les bases de son thème par défaut mais d'y ajouter vos fichiers.

```properties
parent=keycloak
import=common/keycloak
styles=css/custom-login.css

```

#### 3. Personnalisation du CSS (`custom-login.css`)

C'est ici que vous injectez le design de votre Angular.

```css
/* Exemple pour masquer le fond Keycloak et mettre le vôtre */
body {
    background-color: #1a1a1a; /* Votre couleur de fond Angular */
    color: white;
}
.card-pf {
    background: #2d2d2d;
    border: 1px solid #444;
    border-radius: 8px;
}
#kc-login {
    background-color: #e50914; /* Rouge style Netflix */
}

```

#### 4. Appliquer le thème

* Allez dans **Realm Settings** > onglet **Themes**.
* Sélectionnez `neo4flix-theme` dans **Login theme**.
* Sauvegardez.

---

### Partie 3 : Adaptation du Frontend Angular

Votre `AuthService` ne doit plus envoyer de requêtes `POST` manuelles. Il doit désormais rediriger l'utilisateur vers Keycloak.

1. **Installation de la librairie officielle :**
```bash
npm install keycloak-angular keycloak-js

```


2. **Modification du Login dans Angular :**
Au lieu de votre ancien code, vous appelez simplement la méthode de login de la librairie :
```typescript
// Dans votre composant de login ou votre header
this.keycloakService.login({
  redirectUri: window.location.origin + '/dashboard' 
});

```


3. **Le Flux complet :**
* Angular détecte que l'utilisateur n'est pas connecté.
* Il redirige vers `keycloak4flix.duckdns.org`.
* L'utilisateur voit **votre page custom** (CSS neo4flix).
* Il entre son mot de passe, puis scanne son **QR Code 2FA**.
* Keycloak le redirige vers votre Angular avec le jeton.



---

### ⚠️ Résumé des bénéfices

* **Zéro gestion de mot de passe :** Votre application Angular ne "voit" plus jamais les mots de passe des utilisateurs, ce qui est bien plus sécurisé.
* **2FA native :** Keycloak s'occupe de l'affichage du QR Code et de la vérification sans aucun code complexe de votre côté.
* **Identité visuelle :** Grâce au thème, l'utilisateur a l'impression d'être toujours sur votre site.

**Souhaitez-vous que je vous aide à rédiger le fichier `keycloak-init.ts` pour configurer correctement la librairie dans votre application Angular ?**