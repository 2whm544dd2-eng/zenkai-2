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

## Mise à jour du 14/10 (index.html, admin.html, access.js, members.js)
- Logo : icône et manifeste posés dès l'ouverture (avant, seulement après l'écran du code et jusqu'à 4 s plus tard → pas de logo sur l'écran du code et pour « Sur l'écran d'accueil »).
- iPhone : le bandeau ne dit plus « Installe l'app AVANT de commencer » (Safari est un vrai choix) ; bandeau masquable (✕) partout.
- Synchro : une copie serveur nettement plus ancienne que l'appareil n'écrase plus ses données ; la copie écartée est restaurable (Réglages → Données → Sauvegarde auto).
- Lien ouvert dans Instagram / TikTok / Snapchat : écran « ouvre-le dans Safari / Chrome » (bouton Chrome sur Android, ⋯ → navigateur externe sur iPhone, copier le lien) AVANT d'utiliser le code — plus d'appareil gaspillé.
- Lien ouvert dans Instagram alors que l'accès était déjà mémorisé : l'écran « ouvre dans Safari / Chrome » s'affiche aussi (avant, Instagram se réenregistrait en silence et prenait une place).
- Admin : chaque appareil est listé (« iPhone · Safari », « iPhone · Instagram », « Android · App installée »…) avec un ✕ pour en retirer un seul. Les appareils enregistrés avant cette mise à jour reçoivent leur nom à leur prochaine ouverture.
- Routine certains jours (demande bêta) : choix des jours L M M J V S D (raccourcis Lun-ven / Week-end) pour une routine quotidienne. Jour non prévu : « repos aujourd'hui », pas de pénalité, la série continue.
- Eau : plus de pénalité de nuit pour qui n'a jamais noté son eau (un nouveau testeur perdait de l'XP chaque jour sans comprendre).

## Mise à jour du 18/10 : simplification (loi de Hick), version validée — index.html seul
Rien n'est supprimé, tout est rangé.
- Écran Jour : panneau Objectifs vide et carte « Quêtes à heure fixe » vide masqués ; ils reviennent dès qu'il y a quelque chose dedans.
- Onglet Journal : apparaît dès qu'il y a une première journée dans l'historique (le lendemain).
- Initiation : seule la prochaine quête est détaillée, avec un « Montre-moi » violet ; les autres sont en gris et restent touchables.
- Stats : gestion des compétences derrière « ⚙ Gérer mes compétences ».
- Routine : compétence toujours visible ; heure, fréquence, matinale et pénalité dans « + Plus d'options » (ouvert automatiquement en modification si réglé).
- Quête : compétence toujours visible ; priorité, échéance, heure, répétition et sous-tâches dans « + Plus d'options ».
- Séance : « Annuler » (texte) · « ⏸ Plus tard » (encadré) · « ✓ Terminer » (bouton principal, le plus large). Toucher à côté de la fenêtre ferme aussi.
- Réglages : « Fermer » en bouton texte.
- Bandeau d'installation : n'apparaît plus sur l'écran tout neuf, mais dès la première action (premier XP gagné), le jour même.
- Inchangé par rapport à avant : bandeau « Bienvenue / Valide ta première action », succès « Initié », boutons violets de l'onglet Quêtes, 6 cases de difficulté des objectifs.
- Retour arrière : renvoyer le zip zenkai-maj-14oct.zip (version précédente, données compatibles).

## Mise à jour du 21/10 — index.html seul
- Prochaine quête : 1re ligne du bloc « Il te reste aujourd'hui » (quête non-négociable, puis routine ou quête à heure fixe la plus proche). Bouton ✓ (routine simple → écran « Un pas de plus ») ou ▶ (routine à étapes).
- Tout est fait : quand plus rien n'est à faire aujourd'hui → bilan du jour + choix de la quête non-négociable de demain. Les plages de l'agenda ne bloquent pas, elles sont annoncées (« Encore au planning : 23:00 Révisions »).
- Routines guidées : « Étapes guidées » dans le formulaire (modèles Soin du visage, soir, cheveux, Échauffement), une étape à la fois (Passer / Fait), validée si au moins la moitié des étapes est faite. Compétence Apparence créée au besoin.
- Séance guidée : « ▶ Mode guidé · série par série » dans la séance : reps et charge −/+, record en direct, repos 2:00 (+30 s, Prêt), écran de fin, puis « Terminer la séance » (records et XP comme avant).
- Hydratation : tes contenants (jusqu'à 3 boutons, réglables : ex. 500 seul), bouton « ↶ » qui annule le dernier ajout exact, rythme « en avance / en retard / dans le rythme » selon ta journée d'eau (8 h–22 h réglable), frise des verres du jour et « dernier verre il y a… » dans l'onglet.

## Mise à jour du 21/10 (suite) — index.html seulement
- Eau : les 6 boutons d'avant sont rétablis (+25, +50, +100, +250, +500, −100 ml) sur Jour et dans Quêtes. En plus : rythme de la journée, frise et heure du dernier verre, jusqu'à 3 contenants perso en boutons supplémentaires (⚙ Réglages de l'eau).
- Nutrition (module facultatif, désactivé par défaut : Réglages ⚙ → Mes modules → 🍽 Nutrition) : 4 repas en quêtes (estimer Léger/Normal/Copieux + protéines Peu/Une main/Deux mains, ou aliment précis au gramme), raccourcis en un tap, « Comme hier », base de ~33 aliments courants + aliments perso, mode « Protéines seulement », barres de la semaine. Objectifs saisis par l'utilisateur (aucune recommandation calculée). XP : +10 par repas (4 max), +20 à l'objectif protéines ; retirer un aliment reprend l'XP. Carte sur Jour, entrée dans le bouton +, repas du moment proposé en « Prochaine quête ».
- Thème Ombre et or (Réglages → Style visuel) : la mise en page Monarque en noir chaud et or.
- Record : bouton « 📤 Partager ce record » → image story 1080×1920 (sans nom de l'app), partage natif ou téléchargement.
- Nutrition (retours du 21/10) : « une main / deux mains » remplacé par Peu / Une portion / Double portion avec les grammes et un exemple (« 1 steak ou 3 œufs »). Réglages : tu choisis ce qui est mis en avant sur Jour (cercle : calories, protéines, glucides ou lipides) et ce qui s'affiche en plus (barres), avec aperçu en direct ; objectifs tous facultatifs. Le détail complet (les 4 valeurs) reste visible dans la fenêtre Nutrition. Raccourcis et semaine suivent la valeur mise en avant.
- Repas prévus (facultatif) : depuis la fenêtre Nutrition (« 📅 Prévoir » sur un repas, « Prévoir le même » s'il est déjà noté, ou « 📅 Prévoir un repas »). Nom, repas, aujourd'hui / demain / chaque semaine (jours au choix), heure facultative, aliments précis ou raccourcis, total kcal/prot./gluc./lip. en direct. Le repas apparaît dans l'Agenda (Ma journée, ligne orange, aussi les jours suivants), en Prochaine quête et sur la carte Nutrition. « ✓ Mangé » (ou la case dans l'Agenda) ajoute tous ses aliments d'un coup avec leurs valeurs ; « Pas cette fois » le masque pour la journée. Retirer les aliments reprend l'XP.
- Correctif : un raccourci touché sur Jour ne rouvre plus la fenêtre Nutrition fermée.
- 21/10 (v79) : eau — « Annuler le dernier ajout » retiré (le −100 ml reste). Agenda — bouton « 🍽 + Repas » pour prévoir un repas le jour affiché (aussi sur l'écran d'accueil de l'agenda) ; après l'enregistrement on revient sur ce jour ; toucher un repas dans l'agenda l'ouvre pour le modifier. Nutrition — seuls calories et protéines sont proposés comme objectifs ; glucides et lipides passent derrière « + Objectif glucides ou lipides » (leurs valeurs restent visibles dans la fenêtre Nutrition).
- 21/10 (v80) : nutrition — une valeur sans objectif s'affiche quand même en barre (pointillés) avec un lien « objectif ? » qui ouvre les réglages.
- 21/10 (v81) — le style des écrans guidés étendu au reste de l'app :
  - A « Validé » : écran de fin court (1,8 s, un toucher le ferme, ne bloque rien) pour une quête accomplie, un objectif atteint, l'eau à 100 %, un repas prévu validé, une session Focus terminée, une routine/quête créée. Si un autre écran est déjà affiché (record, palier, rang), on garde le bandeau.
  - B Pomodoro : seul le mode plein écran change (grand cercle qui se vide, segments des sessions, Arrêter / Démarrer-Pause, passe au vert pendant la pause). L'onglet normal est inchangé.
  - C Listes vivantes : barre à segments (routines du jour) sur Jour et dans Quêtes ; la case cochée « pop » avec une onde.
  - D Création guidée : « + Ajouter une routine », « + Nouvelle quête » et le bouton + ouvrent 4 écrans (nom/idées, compétence, difficulté avec les 6 cases, jours ou date). « Tout sur un écran » ouvre le formulaire complet pré-rempli. La modification garde le formulaire.
  - Correctif Ombre et or : les écrans guidés (routine, séance) ne s'affichaient pas dans ce thème ; les règles recolorées ne copient plus que les couleurs.
  - Nutrition : glucides et lipides sans objectif = valeur seule (sans barre ni lien).
- 21/10 (v82) — objectifs : la prochaine étape s'affiche sous chaque objectif à étapes ou examen, avec « ✓ Fait » (plus besoin d'ouvrir l'objectif). La case d'un objectif à étapes valide l'étape suivante. Étape franchie → écran Validé doré avec la barre des étapes (au lieu du bandeau) ; examen : une étape = l'onde, un chapitre entièrement fait ou maîtrisé = écran « Chapitre terminé / maîtrisé ». Correctif : la ligne ne fait plus déborder la page sur petit écran.
- 21/10 (v83) — règle des couleurs des écrans Validé : couleur du thème pour le quotidien (quête, routine, étape d'objectif, chapitre terminé, Focus, séance sans record — nouvel écran « Séance terminée ») ; bleu = eau ; orange = nutrition ; or + rayons + lueur = victoire rare (objectif atteint, chapitre maîtrisé ; le record garde son écran doré). En Ombre et or, l'or rare est plus clair que l'or du thème.
- 21/10 (v84) — l'or est réservé aux records et à l'objectif atteint : « Chapitre maîtrisé » passe dans la couleur du thème ; la ligne « Prochaine étape » et son bouton « ✓ Fait » aussi (ils étaient dorés).
- 21/10 (v85) — correctif : la ligne « Prochaine étape » réutilisait par erreur le nom de classe de la ligne « Prochain palier » (objectifs chiffrés), qui s'affichait en encadré depuis la v82 ; classe renommée (zk-gstep), affichage d'origine rétabli.
- 21/10 (v86) — examens : « Prochaine étape » en version compacte (une ligne : état · chapitre — étape · ✓ Fait).
- 21/10 (v87) — écran de fin de séance avec record : la coche passe en or (elle était violette). Correctif : dans les écrans de fin guidés (« Un pas de plus », fin de séance), le bouton principal s'écrasait en fine barre ; il a retrouvé sa hauteur.

## Audit complet du 21/10 (v88) — corrigé
- Nutrition : aliment perso de nouveau sélectionnable dans la recherche ; un aliment ajouté après avoir fermé « Prévoir un repas » va bien dans la journée (et plus dans un brouillon fantôme) ; changer la compétence Nutrition déplace l'XP du jour au lieu de la reprendre sur une autre (plus de transfert d'XP en boucle) ; l'XP du jour est rangée par date (deux appareils ne mélangent plus deux jours) ; aliments perso et raccourcis ont un identifiant (plus de perte à la synchro) ; « repas estimé » et quantités conservés (« Comme hier », « Prévoir le même ») ; le lien « objectif ? » de l'aperçu ne remet plus les réglages à zéro ; annuler la suppression d'un repas prévu garde les modifications ; bandeau « repas prévu » avec la bonne date ; repas hebdo absents des semaines avant leur création, ponctuels passés retirés de la liste ; quantité bornée à 2000 g ; fenêtre restée ouverte après minuit protégée ; repas prévu sur un créneau déjà noté → confirmation (plus de double comptage) ; suppression d'une compétence réassigne aussi la Nutrition.
- Prochaine quête : ne propose plus que les repas PRÉVUS dans leur créneau (avant : bloquée sur le repas du moment, « Tout est fait » jamais affiché) ; une quête non-négociable répétable déjà faite, expirée ou « à volonté » ne bloque plus la carte (avant : 2e toucher = XP reprise).
- Séance guidée : les exercices de distance (course…) ne disparaissent plus à l'enregistrement ; fermer pendant un repos garde les séries faites.
- Records : au-delà de la limite de séances du jour, plus de « +XP bonus » affiché à tort ; l'écran « Objectif atteint » ne se superpose plus à la carte record ; image de partage préparée à l'avance (le partage fonctionne sur iPhone), secours : image affichée (appui long pour l'enregistrer) ; textes de l'image limités à la largeur.
- Écran Validé : le toucher qui le ferme ne coche plus rien en dessous ; XP affichée = XP réellement donnée (examen, eau qui franchit palier + objectif).
- Objectifs : décocher une étape reprend son XP.
- Création guidée : une idée n'active plus en cachette la pénalité de retard ; heure et date lues aussi sur iPhone (événement change).
- Pomodoro : le titre de l'onglet revient après le plein écran.
- Mise en page : plus de débordement horizontal de la page Quêtes sur petit écran (320–360 px), dans tous les thèmes.
- 21/10 (v89) — Pomodoro : plus d'écran « Validé » à la fin de chaque session de 25 min (retour au petit bandeau « POMODORO TERMINÉ »). Le plein écran reste.
- 21/10 (v90) — Pomodoro : l'écran « Validé » revient une seule fois par jour, quand le cycle est bouclé (objectif de sessions atteint, ex. 4/4), avec les segments des sessions et l'XP session + bonus ; les autres sessions gardent le petit bandeau.
- 21/10 (v91) — Passage de rang « Sceau » : l'ancien écusson flotte au-dessus d'un sceau posé au sol (le cadran à graduations, dans la couleur de l'ancien rang) qui tourne de plus en plus vite et aspire l'énergie ; l'écusson s'y enfonce, le sceau prend la couleur du nouveau rang, une colonne de lumière monte, le nouvel écusson descend et se pose (flash coloré, onde), puis le sceau se redresse derrière lui et continue de tourner (1 tour en 12 s). Boutons au bout de 3,7 s. Animation pilotée image par image (plus fluide sur iPhone), sons et vibration recalés ; « animations réduites » : état final direct.
- 21/10 (v92) — Examen réussi : l'XP dépend des jours de révision (jours différents où une étape avance ou un pomodoro lié est fait) et plus de l'âge de l'objectif. XP complète après 1 (E), 2 (D), 3 (C), 5 (B), 7 (A), 10 (S) jours ; « 📅 x/5 jours de révision » affiché dans la fiche. Avant : un examen ajouté peu avant la date rapportait presque 0 XP, et un examen créé il y a longtemps rapportait tout sans révision. Les examens créés avant cette version gardent le meilleur des deux calculs.
- 21/10 (v92) — Anneaux (protéines/calories, pomodoro plein écran, routine guidée) : la lueur est appliquée à l'anneau entier ; sur iPhone elle ne dessine plus un rectangle autour du cercle.
- 21/10 (v95) — Démarrage : quitter l'app (changer d'app, verrouiller l'écran) PENDANT le chargement écrivait une sauvegarde vide (« null ») à la place des données ; au lancement suivant l'app restait bloquée sur « CONNEXION AU SYSTÈME… » (bug présent depuis longtemps, vu en préprod). Corrigé : aucune sauvegarde tant que les données ne sont pas chargées, une sauvegarde vide est refusée, et une sauvegarde illisible est remplacée par la dernière sauvegarde automatique. En cas d'erreur au démarrage, le message s'affiche au lieu d'un écran figé.
- 22/10 (v96) — Retours de test de Moustapha :
  - Séance guidée : les exercices de distance (course…) font partie du guidé : distance (±0,5 km) et temps (±1 min) préremplis avec la dernière sortie, « ✓ Fait » ; le fractionné est affiché tel quel. Écran de fin « 2 séries · 1 sortie ».
  - Examens dans la liste : la case ne sert plus qu'à VALIDER, le jour de l'examen (ou après) → « Comment s'est passé l'examen ? » Réussi / Pas cette fois / Plus tard. Avant la date, un simple 📚 (plus de fausse case à cocher) ; la fiche s'ouvre par « ouvrir › ». Les jours de révision (« 📅 2/5 j ») sont affichés dans la ligne.
  - Création guidée d'une routine : 5e étape « Des étapes à suivre ? » (modèles Soin du visage, Échauffement…, ou ses propres étapes) ; une idée comme « Soin du visage » préremplit ses étapes.
  - Focus : cycles. Réglages : sessions par cycle (1 à 8) et grande pause (1 à 45 min), préréglages 25/5 ×4 (grande pause 15), 50/10 ×2 (20), 90/20 ×1. Après chaque cycle : grande pause et écran « Cycle terminé » ; l'objectif du jour garde son bonus. Plein écran : « Cycle 2 · 3/4 ».
  - Nutrition : 14 repas types dans « Prévoir un repas » (petit-déj., déjeuner/dîner, collation), sans porc ni alcool, valeurs calculées depuis la table d'aliments (ex. poulet 150 g, riz 200 g, brocoli 150 g, huile 10 g = 648 kcal, 56 g de protéines).
  - Plusieurs examens (rubrique « Mes examens ») : chaque examen dont la date est arrivée a son bouton « ✓ Déclarer le résultat » (il n'existait que pour un examen seul) ; les jours de révision sont affichés sur chaque ligne.
  - Course en mode guidé : distance et temps se tapent aussi exactement (5,37 km · 31:45 · 1:02:10) en touchant le chiffre ; les boutons − / + restent (±0,5 km, ±1 min).
- 22/10 (v99) — Guide de l'app : 28 fonctions en 8 rubriques (journée, routines, quêtes, objectifs, sport, focus, eau/nutrition/agenda, toi et l'app), une phrase chacune et un bouton « Essayer » qui ouvre l'endroit exact ; un module coupé propose « Activer ». Accès : carte « Tout ce que l'app sait faire » sur Jour (une fois, masquable), bouton dans Réglages, et un « ? » à côté des titres (Routines, Quêtes, Objectifs, Séances, Gourde, Pomodoro, Semaine type, Compétences…) qui ouvre la bonne rubrique.
- 22/10 (v99) — Pomodoro sur une quête : possible aussi pour les quêtes répétables ; le temps passé s'affiche lisiblement (⏱ 1h15).
- 22/10 (v100) — Boutons « ? » à côté des titres retirés pour l'instant (à remettre plus tard) ; le guide reste accessible par la carte de Jour et le bouton des Réglages.
