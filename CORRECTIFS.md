# ZENKAI — build 78 (mise en ligne du 14/10/2026)

## Fichiers
- index.html (app), admin.html (nouveau : /admin.html), sw.js, netlify.toml, badges/ (nouveaux écussons)
- netlify/functions : access.js (nouveau), sync-state.js, members.js, oath.js, zapier-webhook.js, subscribe.js, send-reminders.js, broadcast.js, pomo-notify.js, pomo-timer.js, vapid-key.js

## Variables Netlify
- ADMIN_SECRET : mot de passe de /admin.html
- ACCESS_MODE=closed : bêta privée (codes d'invitation, 2 appareils par code). Absente = app ouverte.
- ZAPIER_WEBHOOK_SECRET : automatisation Skool (facultatif)

## Principaux changements depuis le build 77
- Bêta privée : codes, liens d'invitation, page admin, suivi d'usage (niveau, jours actifs), classement réservé aux membres, écusson Pionnier.
- iPhone : lien d'invitation dans Safari → « Utiliser ZENKAI dans Safari » (par défaut) ou installer l'app ; Safari et l'app installée comptent comme 2 appareils. Mac Safari fonctionne comme un ordinateur normal.
- Objectifs : création en 2 étapes, poids, jours de routine, km de course, examens par chapitres, nouveau barème d'XP (jusqu'à 1200 XP + paliers).
- Sport : séance en cours sans XP, refaire la dernière, cases « fait », XP par séries (rendement décroissant), course (min:s, records par distance, fractionné, km/semaine), XP par sport.
- Objectif sportif : champ « Ton record actuel / Ton max actuel / Ton temps actuel » (facultatif) ; la barre part de ce niveau. Séance : résumé « Aujourd'hui · type · durée » (modifier), objectifs en tête des exercices.
- Paliers pour tous les objectifs : valeur affichée (« 5 000 € », « 115 kg », « 26:45 »), « Prochain palier » sous la barre, XP à chaque palier, récompense perso facultative par palier ; objectifs à étapes : chaque étape paie sa part (30 % de l'XP). Fiche objectif (toucher le nom ou la barre) : paliers + courbe de progression jusqu'à l'échéance ; saisie d'un montant (+ 350 €) pour les compteurs à grosse cible. Séance : « 🏆 Nouveau record » et « 🎯 50 % → 63 % » affichés pendant la saisie. Palier franchi (objectifs chiffrés et ressenti) : fenêtre animée (paliers I-II-III, XP, récompense, prochain palier), après la fenêtre de record s'il y en a une ; étape cochée : simple bandeau. Paliers arrondis lisibles (7 300 € → 1 800 · 3 600 · 5 400), pas de doublon pour les petites cibles, paliers perso (nom de phase, valeur, récompense) dans « Plus d'options » ; un palier est franchi quand la valeur affichée est atteinte.
- Initiation en 3 étapes, Journée tenue, modules activables, récap hebdo, agenda (plages + routines du jour).
- Sauvegarde : bandeau si le stockage est plein, 3 sauvegardes automatiques.
- Anti-triche : chaque annulation reprend son XP, plafonds journaliers (séances, objectifs, quêtes à volonté).
- Rappels serveur : non-négociables à partir de 7 h ; sw.js : seule l'app sert de copie hors ligne.

## Retour arrière
- Accès bloqué : retirer ACCESS_MODE et redéployer.
- Problème dans l'app : renvoyer le zip du build 77 (les sauvegardes v78 restent lisibles par la v77).
