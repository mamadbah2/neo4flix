# 🚀 Guide de Déploiement Vercel - Neo4flix

## ✅ Modifications effectuées

### 1. Nettoyage de l'authentification
- ✅ Suppression des composants `login.component.ts` et `register.component.ts`
- ✅ Suppression des routes `/login` et `/register`
- ✅ Mise à jour de la landing page pour rediriger directement vers Keycloak
- ✅ Le bouton "S'identifier" appelle maintenant `authService.login()` qui redirige vers Keycloak

### 2. Gestion de la session
Votre `AuthService` gère déjà correctement :
- ✅ **Expiration du token** : `refreshToken()` actualise automatiquement le token avant expiration
- ✅ **Déconnexion** : `logout()` nettoie la session et redirige vers Keycloak
- ✅ **Redirection après login** : Utilise `returnUrl` pour revenir à la page d'origine

---

## 📋 Checklist avant déploiement

### 1. Configuration Keycloak
Vous devez ajouter l'URL Vercel dans les **Valid Redirect URIs** de votre client Keycloak :

```
1. Connectez-vous à Keycloak Admin : https://keykloak.freeddns.org
2. Allez dans : Clients > neo4flix-app > Settings
3. Ajoutez dans "Valid Redirect URIs" :
   - https://votre-app.vercel.app/*
   - https://*.vercel.app/* (pour les preview deployments)
4. Ajoutez dans "Valid Post Logout Redirect URIs" :
   - https://votre-app.vercel.app/*
5. Ajoutez dans "Web Origins" :
   - https://votre-app.vercel.app
   - https://*.vercel.app
6. Sauvegardez
```

### 2. Variables d'environnement Vercel
Dans le dashboard Vercel, ajoutez ces variables :

```bash
# Ne PAS exposer le clientSecret côté frontend !
# Retirez-le d'environment.prod.ts si vous ne l'utilisez pas côté client
```

⚠️ **IMPORTANT** : Le `clientSecret` ne doit **jamais** être dans le code frontend. Il est actuellement dans `environment.prod.ts` mais devrait être géré côté backend uniquement.

### 3. HTTPS obligatoire
Keycloak nécessite HTTPS en production. Vercel fournit automatiquement HTTPS, donc ✅ OK.

---

## 🛠️ Déploiement sur Vercel

### Option A : Via l'interface Web (recommandé)

1. **Connectez-vous à Vercel** : https://vercel.com
2. **Importez votre projet GitHub/GitLab**
3. **Configuration du projet** :
   - Framework Preset : `Angular`
   - Build Command : `npm run build`
   - Output Directory : `dist/frontend/browser`
4. **Déployez** 🚀

### Option B : Via CLI

```bash
# Installez Vercel CLI
npm i -g vercel

# Depuis le dossier frontend
cd /home/mamadbah/Java/neo4flix/frontend

# Login
vercel login

# Premier déploiement (preview)
vercel

# Déploiement en production
vercel --prod
```

---

## 🔧 Mise à jour de environment.prod.ts

Après le déploiement, mettez à jour l'`apiUrl` :

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://votre-backend-url.com', // Remplacez par l'URL de votre backend Spring Boot
  keycloak: {
    url: 'https://keykloak.freeddns.org',
    realm: 'neo4flix',
    clientId: 'neo4flix-app',
    // ⚠️ Retirez clientSecret si non utilisé côté client
    tokenEndpoint: 'https://keykloak.freeddns.org/realms/neo4flix/protocol/openid-connect/token',
    adminUrl: 'https://keykloak.freeddns.org/admin/realms/neo4flix'
  }
};
```

---

## ⚠️ Points de sécurité critiques

### 1. Client Secret
Le `clientSecret` est actuellement exposé dans le code. Solutions :

**Option A** : Utiliser un client public (recommandé pour SPA)
```
Dans Keycloak :
- Client Authentication : OFF
- Retirez clientSecret du code
```

**Option B** : Gérer le secret côté backend
```
- Créez un endpoint backend pour l'enregistrement
- Le backend utilise le clientSecret
- Le frontend appelle votre backend, pas directement Keycloak Admin API
```

### 2. CORS
Assurez-vous que votre backend Spring Boot autorise l'origine Vercel :

```java
@CrossOrigin(origins = {
    "http://localhost:4200",
    "https://votre-app.vercel.app",
    "https://*.vercel.app"
})
```

---

## 🧪 Test après déploiement

1. ✅ Accédez à `https://votre-app.vercel.app`
2. ✅ Cliquez sur "S'identifier" → Redirige vers Keycloak
3. ✅ Connectez-vous → Revient sur `/home`
4. ✅ Testez l'expiration du token (attendez 5 min)
5. ✅ Testez la déconnexion

---

## 🐛 Dépannage

### Erreur "Invalid redirect URI"
→ Vérifiez que l'URL Vercel est dans les Valid Redirect URIs de Keycloak

### CORS error
→ Ajoutez l'URL Vercel dans Web Origins de Keycloak

### Token refresh ne fonctionne pas
→ Vérifiez que `enableBearerInterceptor: true` est dans `keycloak-init.ts`

### L'app ne charge pas
→ Vérifiez les logs Vercel : `vercel logs <deployment-url>`

---

## 📚 Ressources

- [Vercel Angular Deployment](https://vercel.com/docs/frameworks/angular)
- [Keycloak OIDC Configuration](https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter)
- [keycloak-angular Docs](https://github.com/mauriciovigolo/keycloak-angular)

---

## 🎯 Prochaines étapes recommandées

1. ⚠️ **Retirez clientSecret du frontend** (critique)
2. 🔒 Configurez un client public dans Keycloak
3. 🌐 Déployez le backend (Spring Boot) sur Render/Railway/Fly.io
4. 🔗 Mettez à jour `apiUrl` dans environment.prod.ts
5. 📊 Configurez des logs (Sentry, LogRocket)
6. 🚀 Activez le cache Vercel pour les assets statiques

---

Bon déploiement ! 🎉
