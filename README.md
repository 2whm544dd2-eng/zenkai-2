# Hunter Log — déploiement GitHub + Netlify (notifications push)

Tous les fichiers sont déjà organisés au bon endroit dans ce dossier :

```
index.html                        ← ton app (renommée pour Netlify)
netlify.toml                      ← planifie send-reminders toutes les 10 min
package.json                      ← dépendances (web-push, @netlify/blobs)
netlify/functions/subscribe.js    ← reçoit l'abonnement du téléphone
netlify/functions/send-reminders.js ← envoie les notifications dues
```

Tu n'as rien à déplacer ni renommer, il ne reste que 3 choses à faire.

## 1. Pousser ce dossier sur GitHub

Ouvre un terminal **dans ce dossier** et lance, une commande à la fois :

```
git init
git add .
git commit -m "Hunter Log + notifications push"
```

Va sur https://github.com/new, crée un repo **vide** (ne coche ni README ni .gitignore),
copie son URL (ex: `https://github.com/ton-pseudo/hunter-log.git`), puis :

```
git remote add origin https://github.com/ton-pseudo/hunter-log.git
git branch -M main
git push -u origin main
```

## 2. Connecter le repo à Netlify

1. Va sur https://app.netlify.com
2. **Add new site → Import an existing project → Deploy with GitHub**
3. Autorise Netlify à accéder à GitHub, choisis ton repo `hunter-log`
4. Ne change aucun réglage (pas de build command, publish directory = racine) → **Deploy site**

## 3. Ajouter les clés VAPID (obligatoire, sinon les notifications ne partiront jamais)

Dans Netlify : **Site settings → Environment variables → Add a variable**, ajoute ces 3
(nouvelle paire de clés générée pour ce déploiement — la clé publique est déjà intégrée
dans `index.html`, inutile d'y retoucher) :

| Nom | Valeur |
|---|---|
| `VAPID_PUBLIC_KEY` | `BNB5enwSfarZ2OeKcp-dMWo20GDI501mRkQ4ECeyYDVIZ4sM3O7Q2oq9TfFeC2r9c4cdB5B_6qsTZkOVcejqr0w` |
| `VAPID_PRIVATE_KEY` | `z1giK-LmvC_OTRj_USWFIVsa6saFFIA5qexmRGMoiZA` |
| `VAPID_SUBJECT` | `mailto:ton-email@exemple.com` (mets ta vraie adresse) |

⚠️ Note la `VAPID_PRIVATE_KEY` quelque part en sécurité (gestionnaire de mots de passe,
notes perso) **avant** de pousser ce dossier sur GitHub, puis supprime cette ligne du
README dans ton repo si celui-ci est public. Elle ne doit jamais se retrouver ailleurs
que dans les variables d'environnement Netlify.

Puis force un redéploiement pour que les variables soient prises en compte :
**Deploys → Trigger deploy → Deploy site**.

## 4. Tester

1. Ouvre l'URL de ton site (ex: `https://ton-site.netlify.app`) sur ton téléphone
2. Dans l'app : Réglages → Notifications → **Activer**, accepte la permission
3. Choisis une tâche non-négociable pour demain (ou laisse-toi notifier le soir dès 20h)
4. Dans Netlify : **Functions → send-reminders → Logs**, tu dois voir la fonction
   tourner toutes les 10 minutes

Si un push échoue avec une erreur 410/404 (abonnement expiré), la fonction supprime
automatiquement l'appareil concerné — rien à faire de ton côté, il suffira de réactiver
les notifications sur ce téléphone.
