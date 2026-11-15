# ZENKAI — build 78 (mise en ligne du 14/10/2026)

## 15/11 — Boss et faiblesses (bêta) — index.html
- 9 boss au lieu de 4, chacun avec une faiblesse que l'app mesure seule : la Flemme (session lancée avant 10 h), le Brouillard (session de 45 min ou plus), le Seigneur du Scroll (focus strict sans quitter l'app plus de 20 s), le Lendemain (lancée à l'heure de ta plage à 10 min près, ou dans les 5 min après avoir ouvert l'app), l'Hydre aux Onglets (intention écrite ou quête liée), le Briseur de Chaînes (2e session d'un combo), le Doute (session qui tient ta journée), le Voleur de Matins (session sur une non-négociable du jour).
- Coup critique : une session qui exploite la faiblesse donne +1 rareté à l'ombre (jusqu'à épique ; la légendaire reste réservée au coup final). Affiché sur la carte de révélation, sous la barre du boss et dans sa fenêtre.
- Boss final, le Roi des Excuses : verrouillé dans le bestiaire (« ? ») tant que les 8 autres n'ont pas été battus au moins une fois. PV +30 %. Faiblesse : frapper chaque jour de la semaine, sans exception.
- Chaque lundi, une fenêtre présente le nouveau boss (dessin, faiblesse, PV, règles expliquées la 1re fois), en affichage Complet seulement.
- Écran de victoire en plein écran quand le boss tombe : coup final (flash, entaille, barre à 0 PV, vibration), le boss se brise en particules, « VICTOIRE », bilan qui défile (jours de combat, heures de focus infligées, coups critiques). Puis « Maintiens : LÈVE-TOI » : en gardant le doigt appuyé, l'ombre du boss se relève en violet et rejoint ton armée comme général. Butin (général + ombre légendaire) et silhouette noire du boss de lundi. Toucher l'écran passe l'animation.
- Nouveaux dessins pour l'Hydre, le Briseur, le Doute, le Voleur et le Roi (3 formes chacun).
- Bug corrigé : sur certains appareils, la bêta se désactivait toute seule après une synchro (la version du serveur effaçait le réglage). Le réglage est maintenant aussi gardé sur l'appareil et réappliqué après chaque synchro.

## 14/11 (4) — Tout le nouveau passe en BÊTA (visible seulement sur ton compte) — index.html
- Tout ce qui a été ajouté depuis le 08/11 (« Se mettre au travail », armée et boss, révisions, plages qui se lancent, routines évolutives, ton pourquoi, calendrier des journées) n'est visible que sur les comptes où la bêta est activée. Les autres comptes gardent l'app d'avant, sans rien perdre.
- Activer : ouvrir l'app une fois avec ?beta=1 à la fin de l'adresse, ou bouton « 🧪 Activer la bêta sur ce compte » dans Réglages → Synchro → Admin (appareil admin). Le réglage suit le compte sur tous les appareils synchronisés. Désactiver : ?beta=0 ou le même bouton.
- Pour sortir de la bêta (tout le monde), il suffira de changer une ligne (zkBeta).

## 14/11 (3) — Retours de Moustapha : feuille blanche, ton pourquoi, agenda — index.html
- « Je me lance » retiré de l'onglet Jour. La relance démarrage dit maintenant « lance une session, même courte ».
- Calendrier « Mes journées » (tenue / à moitié / ratée) déplacé dans l'Agenda. Il reste dans le Journal seulement si l'Agenda est coupé. « Ce que disent tes soirs » reste dans le Journal.
- Agenda : bouton Pomodoro à côté de chaque quête du jour (dans les plages et dans la chronologie).
- Feuille blanche + révision espacée : bouton « 📄 Réviser » sur chaque chapitre d'un examen, bouton « Feuille blanche » dans le Focus quand un examen est choisi, et « ▶ Réviser » dans « À revoir aujourd'hui ». Écran en 3 étapes (sans le cours → compléter avec le cours → « Ça allait » / « J'ai galéré »), puis la session se lance. Le chapitre est replanifié tout seul (1, 3, 7, 14, 30 j) et la prochaine date s'affiche sous le chapitre.
- Ton pourquoi : une phrase, écrite dans Mes rappels (« ✍ Mon pourquoi »). Elle s'ajoute au dernier appel du soir et s'affiche sur l'onglet Jour quand la série est en danger (journée ratée hier, pas encore tenue aujourd'hui).
- Bug corrigé : au stade « Brume », l'ombre était une image floue qui faisait penser à un bug d'affichage. Elle se forme maintenant de bas en haut au rythme de la session, avec sa silhouette en filigrane.
- Boss de la 1re semaine (commencée en cours de semaine) : au moins 2 h de PV (avant : parfois 1 h, battu en une session).
- Agenda : panneau « Mes révisions » avec tous les chapitres planifiés (à revoir aujourd'hui, cette semaine, plus tard), « ▶ Réviser » ou « Avancer », ✕ pour retirer un chapitre, et un raccourci « 📄 » par examen.
- Mode Masqué de l'armée : la question « Tu as bossé sur quel chapitre ? » s'affiche quand même après une session liée à un examen. Après une feuille blanche, elle n'est plus posée en double.
- Routine évolutive : l'option « 📈 Monter petit à petit » n'apparaît que si le nom contient un nombre, avec l'exemple exact (« 20 pompes » → « 22 pompes »). Une heure (« Debout à 7 h », « 6h30 ») n'est jamais évolutive.

## 14/11 (2) — Armée des ombres, boss, révisions espacées, plages qui se lancent, routines évolutives — index.html
- Focus : avant la session, tu choisis la classe de l'ombre à invoquer (Mage, Guerrier, Archer, Assassin, Gardien). Pendant la session, elle apparaît en 4 stades (Brume, Forme, Armure, Éveil). En plein écran aussi.
- 1 session terminée = 1 ombre. Rang selon la durée : moins de 45 min = soldat, 45 min = chevalier, 90 min = élite. Rareté sans hasard : 3e session de 25 min ou plus dans la journée = rare, 4e = épique, 90 min = +1, boss de la semaine vaincu = légendaire.
- Fin de session : carte de révélation (rareté, n° de l'ombre, prochaine rareté). Session lâchée (Arrêter après plus d'une minute, ou « j'ai lâché » en focus strict) : l'ombre se dissipe. Rien de déjà acquis n'est retiré.
- Boss de la semaine : PV = heures de focus visées, calculées sur tes 2 dernières semaines (+10 %), jamais au-dessus de ta meilleure semaine. 1re semaine au prorata des jours restants. 1 min de focus = 1 PV, barre en direct pendant la session, phases à 50 % et 20 %. Battu : il rejoint ton armée comme général et revient plus tard un rang au-dessus (nouvelle forme). Pas battu : il s'échappe, le suivant garde le même objectif. 4 boss qui tournent : Seigneur du Scroll, Flemme, Lendemain, Brouillard.
- Sbire du jour : PV = ton objectif de sessions du jour. Battu : l'ombre de cette session est au moins rare.
- Carte « Armée des ombres » sous le minuteur, fenêtre « Mon armée » (classes, raretés, généraux, dernières invocations) et fenêtre « Boss » (dégâts par jour, bestiaire).
- Révision espacée automatique : session liée à un examen → un toucher sur le chapitre travaillé. L'app le ressort à J+1, J+3, J+7, J+14, J+30 dans « À revoir aujourd'hui » (onglet Jour), avec « ▶ Réviser ». Fin de la révision : « Ça allait » (étape suivante) ou « J'ai galéré » (on repart à J+1).
- Planning : la plage en cours (Étude, Travail, Projet) a un bouton « ▶ Lancer » qui ouvre le Focus avec la quête ou l'examen de la plage. Option « Début de plage » dans Mes rappels (coupée par défaut).
- Routines évolutives : option choisie à la création (ou en modifiant) la routine, coupée par défaut, routines quotidiennes avec un nombre dans le nom (pas d'heure). Après 2 semaines tenues à 85 % : proposition discrète sur l'onglet Jour (« 20 pompes » → « 22 pompes »), une fois toutes les 2 semaines au plus.
- Affichage de l'armée au choix (Réglages du Pomodoro ⚙, ou fenêtre « Mon armée ») : Complet (grande ombre, révélation), Discret (une ligne : classe, stade, PV du boss ; pas d'effets lourds, plus léger pour la batterie) ou Masqué (le Focus comme avant ; les ombres et les dégâts sont quand même comptés).
- Nouveaux dessins des ombres (5 classes) et des 4 boss (3 formes chacun, une par rang), détourés depuis les planches de Moustapha. Visages entièrement noirs. Plus légers à afficher que les anciens effets de fumée (environ 400 Ko d'images dans index.html).
- Rien de nouveau côté serveur.

## 14/11 — Se mettre au travail — index.html
- Onglet Jour : « Je me lance » (2 min, sur une routine ou une quête du jour) tant que rien n'est lancé, et « Reset 2 min » (respiration guidée, compte comme une action de la journée, une fois par jour).
- Focus strict (option) : si tu quittes l'app plus de 20 s pendant une session, au retour : « Écran éteint, je continue » ou « J'ai lâché · on recommence la session ».
- Heures par compétence automatiques (« Mes heures » sous le minuteur), avec paliers.
- Bilan du soir (à partir de 20 h) : note de la journée, ce qui a freiné, pourquoi une routine a raté. +5 XP une fois par jour.
- Journal : calendrier « Mes journées » (tenue, à moitié, ratée) et « Ce que disent tes soirs ».
- Mes rappels : « Relance démarrage » (seulement si rien n'est lancé à l'heure choisie).

## 08/11 (3) — Toucher la gourde : tes 7 derniers jours — index.html
- Toucher la gourde (Jour ou Quêtes) ouvre « Mon eau · 7 derniers jours » : une petite gourde par jour avec les litres, dorée quand l'objectif est atteint, celle d'aujourd'hui entourée. En dessous : jours à 100 %, moyenne, jours d'affilée à 100 %.
- Rien de nouveau à enregistrer : les données viennent de l'historique (waterMl, waterGoalHit). Les jours sans donnée affichent « — ».
- Vérifier : toucher la gourde sur Jour.

## 08/11 (2) — Relance eau dans « Mes rappels » — index.html
- Nouveau rappel « 💧 Relance eau » (désactivé par défaut, Réglages → Notifications → Mes rappels) : part seulement si rien n'est noté depuis 2 h, 2 h 30 ou 3 h (au choix) ET si tu es en retard sur ton rythme, entre 10 h et 19 h, 2 fois par jour au plus. Même app fermée (canal des objectifs, aucun changement serveur). Noter un verre décale la relance.
- Les jours où l'app n'est pas ouverte : « Pas encore d'eau notée aujourd'hui ».
- Quand la relance est activée, l'ancien rappel local de 18 h ne part plus.
- Vérifier : activer la relance, régler 2 h, noter un verre, fermer l'app : la notification arrive 2 h plus tard si tu es en retard (jusqu'à 10 min de décalage).

## 08/11 — Écrans guidés : plus de bandeaux par-dessus — index.html
- Pendant une routine guidée ou une séance guidée (étapes, puis « Un pas de plus »), les bandeaux (niveau, succès) et l'XP flottant ne recouvrent plus l'écran. L'XP est déjà affiché sur l'écran de fin ; les bandeaux de niveau et de succès s'affichent un par un après « Continuer » (3 au plus).
- Vérifier : routine avec étapes → toutes les étapes → l'écran « Un pas de plus » est net ; après « Continuer », les éventuels « Succès débloqué » apparaissent.

## 07/11 (4) — Bugs de l'analyse du 07/11, « Mes rappels », un seul rappel le soir — index.html
- Une seule série : l'en-tête affiche la série de journées tenues (avant : la meilleure série de routine, « 12 j » à côté de « série de 26 j »).
- Journée tenue avec les pastilles Focus : « 🔥 26 j » au lieu de « série de 26 j » (les pastilles sortaient de la carte à 390 px).
- Ligne Prière repliée : « 1 h 27 » au lieu de « dans … » coupé.
- Le bouton + s'efface quand on fait défiler vers le bas et revient dès qu'on remonte (il cachait le ✓ de la Prochaine quête, ✎, ✕ et « Meilleur combo ») ; un peu plus de marge en bas de page.
- Quêtes → Routines : le nom sur sa ligne, fréquence, heure et série en dessous (les noms étaient coupés).
- APP_VERSION passe à 131 (toujours pas affiché).
- Prière : rappel « à l'heure », « 5 min avant » ou « 10 min avant » (réglages Prière et Mes rappels).
- Réglages → Notifications → « 🔔 Mes rappels… » : tous les rappels au même endroit, chacun activable (prières, tahajjud, heure fixe, ne rate pas deux fois, objectifs, journée type, relance Focus, fin de session Focus, dernier appel, non-négociables de demain), avec le nombre de rappels qui peuvent encore sonner aujourd'hui (avertissement au-delà de 6).
- Dernier appel (20:30 par défaut, réglable) : une seule notification le soir. Journée pas tenue : « Journée 1/3 · il te reste : … · 2 actions pour la tenir », plus le choix des non-négociables de demain s'il le faut. Journée tenue : seulement le choix de demain, ou rien. Il remplace le rappel du soir de 20:00 (le serveur ne l'envoie plus : hasPendingTasks = false). Les jours où l'app n'est pas ouverte, un dernier appel générique part quand même.
- Relance Focus (désactivée par défaut, 14:00) : seulement si tu as moins de sessions que ton objectif.
- Tout passe par le canal des objectifs (aucun changement serveur). La liste envoyée est triée par jour pour que les rappels du jour ne soient jamais coupés. Le serveur est remis à jour quand la journée devient tenue et à chaque pomodoro.
- Vérifier : Réglages → Notifications → Mes rappels ; régler le dernier appel 2 min plus tard, fermer l'app sans tenir la journée : une notification « Journée x/3 · il te reste … » arrive (jusqu'à 10 min de décalage).

## 07/11 (3) — Sport en premier dans Quêtes, séances types, une liste par séance — index.html
- Onglet Quêtes : Sport en haut, puis Quêtes, Objectifs, Routines, Hydratation. Les routines (cochées dans Jour) passent en liste compacte de gestion : nom, fréquence, heure, série ; toucher = fiche des 30 jours, ✎ = modifier, « + Ajouter une routine ».
- Mes séances : plus de découpages proposés (Full body A · B, Push · Pull, Upper · Lower · Full, Pecs+Dos · Épaules+Bras · Jambes, un muscle par jour, Street workout), en plus de Push · Pull · Legs, Upper · Lower, Full body.
- Séance type : quand les séances sont réglées, « Enregistrer comme modèle » est remplacé par « 💾 Enregistrer comme ma séance Push type · sans la faire ». Les exercices sont gardés (STATE.workouts.splitTpl), le brouillon est vidé, aucune XP, rien n'est compté comme fait. La carte affiche « prête · N exos » et « ▶ Lancer », qui ouvre la séance avec ces exercices. Une séance déjà faite repart de sa dernière fois.
- Une liste par séance dans le formulaire : passer de Push à Pull ne garde plus les exercices de Push. Chaque puce (y compris « Autre ») retrouve ce qui a été saisi pour elle, sinon sa dernière fois, sinon sa séance type, sinon rien.
- Boutons plus clairs : « ✓ Push faite » (ou « ✓ Séance faite ») au lieu de « Terminer », avec une ligne qui dit à quoi sert chacun (Faite = enregistrée avec XP, Plus tard = elle t'attend sans XP, Annuler = rien n'est gardé).
- « + Nouvelle séance » avec des séances réglées ouvre directement la suivante dans l'ordre, avec ses exercices.
- Vérifier : régler Push · Pull · Legs ; Push → ajouter 2 exercices → 💾 → la carte Push dit « prête · 2 exos » et il n'y a aucune séance dans l'historique ; ouvrir Pull, ajouter Tractions, toucher Push puis Pull : chaque puce garde sa propre liste.

## 07/11 (2) — Sport : « Mes séances » (Push / Pull / Legs, Upper / Lower, course) — index.html
- Réglage unique (⚙ Sport → « Mes séances », ou « régler › » dans Sport) : choix rapide (Push · Pull · Legs, Upper · Lower, Full body, Aucun), tes propres noms, un interrupteur « mettre en avant la suivante dans l'ordre ». Côté course : « Je cours » ajoute Footing · Fractionné · Sortie longue, avec des noms libres. Stocké dans STATE.workouts.splits.
- Sport : une carte par séance, avec la date et les exercices de la dernière fois, puis « ↻ Refaire » (ou « + Commencer » si elle n'a jamais été faite). La suivante dans l'ordre porte « AUJOURD'HUI » ; une séance faite aujourd'hui porte « FAITE ✓ » et la suivante « PROCHAINE ». La partie Course n'apparaît que si des séances de course sont réglées.
- Formulaire : « QUELLE SÉANCE ? » avec une puce par séance, plus « Autre ». « Refaire » pré-coche la séance de départ ; « + Nouvelle séance » pré-coche la suivante dans l'ordre. Choisir une séance sur un formulaire vide reprend sa dernière fois (exercices, séries, charges). Une séance de course passe le type en « Course à pied » ; un fractionné s'ouvre en mode répétitions. Chaque séance enregistrée garde son nom (w.split, aussi dans le brouillon).
- Sans réglage, rien ne change : cartes « Refaire » d'avant, plus un lien « Push / Pull / Legs ? Règle tes séances ›». Les anciennes séances n'ont pas de nom : les cartes se remplissent au fur et à mesure.

## 07/11 — Écran Jour et objectifs comme avant le 04/11, Prière visible partout — index.html
- Ordre du Jour rétabli comme avant le 04/11 : carte de retour (si absence), initiation, journée tenue, rappel des pénalités, MAINTENANT / ENSUITE (journée type), serment, engagement d'hier soir, rappel du soir, OBJECTIFS, prière, puis AUJOURD'HUI (prochaine quête, routines, eau, pomodoro). Retour demandé par Moustapha après usage réel.
- Cartes d'objectifs rétablies comme avant : case ou +/−, point de priorité, départ et cible, prochain palier, −10 % / +10 %, CT ou MT, compétence, XP, ✎ et ✕. La ligne « Cette semaine : … » est gardée.
- Prière repliée par défaut sur une ligne : 🕌, la prochaine prière et son heure, le temps restant, 5 points (vert = à l'heure, doré = rattrapée) et un bouton rapide pour la dernière prière passée et pas encore notée (« ✓ » tant que la suivante n'a pas commencé, sinon « ↺ » rattrapée). Toucher la ligne ouvre la carte complète ; « Réduire ▴ » la referme ; le choix est gardé. 🌙 apparaît pendant le dernier tiers de la nuit.
- La case Focus (compteur 1/4) essayée à côté de la journée tenue est retirée : elle ne plaisait pas.
- ENSUITE | PRIÈRE : la prochaine prière est dans une petite case à droite de MAINTENANT / ENSUITE (« Icha 18:54 », avec « Maghrib à noter » en vert s'il reste une prière à cocher). Un toucher ouvre la carte complète dans une fenêtre ; après avoir noté, on revient à la fenêtre. Sans plage d'agenda en cours ou à venir, la prière seule reste sur une ligne repliée. Eau et nutrition sont inchangées.
- Focus en pastilles à côté de la journée tenue : « FOCUS » puis une pastille ⏱ par session du jour. Pleine = faite, ▶ sur la suivante (un toucher ouvre Focus et lance la session), un anneau qui se remplit pendant la session, or quand l'objectif est atteint ; « +N » au-delà de 6. Seulement si le module Focus est actif, avec un interrupteur dans les réglages Pomodoro (« Pastilles Focus à côté de la journée tenue ») ; sans pastilles, la journée tenue garde toute la largeur.
- Prière : activée une fois depuis un appareil admin (Réglages → Affichage → Module Prière), elle suit la synchro sur tes autres appareils, app installée comprise. Avant, il fallait que chaque appareil soit reconnu comme admin.

## 05/11 (2) — Fiche routine, « Refaire » une séance, menu + — index.html
- Toucher le nom d'une routine (Jour ou Quêtes) ouvre sa fiche : série, record, cette semaine, et une grille des 30 derniers jours (faite / pas faite / repos / pas encore suivie), avec Modifier et Supprimer. Les jours viennent de doneLog, rempli depuis le 10/10. Record : r.best, nouveau, plus un calcul sur doneLog qui applique la règle « ne rate jamais deux fois ».
- Sport : « + Nouvelle séance » remonte en haut. En dessous : « Refaire en un toucher » (les 2 dernières séances différentes : le formulaire s'ouvre avec les mêmes exercices, le même type et la même durée), puis les 3 dernières séances (un toucher ouvre l'historique). Les cartes « Refaire » sont cachées tant qu'une séance est en cours, et « Refaire » rouvre la séance en cours au lieu de l'écraser.
- Menu + : une grille de choix courts (Routine, Quête, Objectif, Séance, Eau +250 ml, Focus, Repas si le module est actif) à la place des grandes cartes à lire.

## 05/11 — Module Prière (version admin seulement) — index.html
- Visible seulement sur un appareil admin, à activer dans Réglages → Affichage → « Module Prière ». Les autres joueurs ne voient rien.
- Carte sur « Aujourd'hui », au-dessus de la liste du jour : prochaine prière, temps restant, et les 5 prières du jour. Toucher une prière : à l'heure, rattrapée ou pas encore.
- Horaires calculés dans l'app, sans serveur ni API. Ville choisie à la main (Belgique, France, Dakar, Casablanca, Montréal), au choix : méthode (Ligue islamique mondiale, UOIF, ISNA, Égypte), Asr standard ou hanafite, règle d'été pour les hautes latitudes (1/7 de la nuit par défaut), et un décalage par prière pour coller à la mosquée.
- Vérifié pour Bruxelles avec la Ligue islamique mondiale : le 05/11, Fajr 05:48, Dhuhr 12:27, Asr 14:45, Maghrib 17:10, Icha 18:57. Le 21/06, sans la règle d'été, il n'y aurait ni Fajr ni Icha ; avec, Fajr 04:25 et Icha 23:04.
- Rappels à l'heure, même app fermée : canal des objectifs (aujourd'hui + 2 jours), sans changement serveur. Pas de rappel pour une prière déjà notée.
- Aucune XP, aucune pénalité. Ne compte ni pour la journée tenue ni pour le classement. Historique gardé 4 mois (STATE.prayer.log).
- Tahajjud : ligne sous les 5 prières. La nuit est comptée de Maghrib à Fajr ; la fenêtre affiche le milieu de la nuit et le début du dernier tiers (nuit du 5 au 6/11 à Bruxelles : milieu 23:30, dernier tiers dès 01:37, Fajr 05:50). La nuit est rangée à la date du matin qui la termine ; on peut la noter jusqu'à Dhuhr. Rappel au début du dernier tiers, avec un décalage réglable. Désactivable dans les réglages Prière.

## 04/11 (3) — Sécurité et corrections de la revue — index.html, netlify/functions/oath.js, subscribe.js, send-reminders.js, _redirects, .gitignore
- Fichiers du repo plus servis par le site (_redirects) : README.md, CORRECTIFS.md, CLAUDE.md, package.json, netlify.toml, code des fonctions. Vérifier : ouvrir /README.md sur le site → page 404.
- .gitignore : CLAUDE.md, .env, node_modules.
- Classement : l'id public est un HMAC avec la variable Netlify OATH_ID_SECRET (avant : simple hachage du code, retrouvable). Sans la variable, ancien calcul + message d'erreur dans les logs.
- Classement : jour et semaine en vraie heure de Bruxelles (avant : +2 h fixes, remise à zéro le dimanche à 23 h en hiver).
- subscribe : code d'accès obligatoire et vérifié ; refusé → l'abonnement de l'appareil est supprimé et l'app repasse en rappels locaux.
- Routine à heure fixe ratée la dernière fois : plus de 3 notifications. L'avertissement « pas deux » passe dans les rappels 30 min avant et à l'heure (warnDate).
- Synchro : avant d'adopter un remplacement (import, restauration, tout effacer) venu d'un autre appareil, une copie de cet appareil est gardée + message.
- Import d'une vieille sauvegarde : fillMissingState ne court-circuite plus les migrations (thème, XP totale).
- Textes de synchro corrigés : « toutes les 2 min » et « fusionnées ».

## 04/11 (suite) — Rappels app fermée, brouillon de séance, séries exactes — index.html, netlify/functions/send-reminders.js, netlify/functions/subscribe.js
- Rappels : les routines et quêtes à heure fixe partent du serveur, 30 min avant puis à l'heure, app fermée. Il faut avoir activé les notifications. Avec le push actif, l'app n'envoie plus ces rappels elle-même. Limite : une routine cochée sur un appareil peut encore être rappelée sur l'autre.
- Brouillon : la séance en saisie est gardée à chaque changement et après chaque série guidée. Toucher à côté la garde ; « Annuler » demande confirmation.
- Séries guidées : le détail est enregistré (8 × 80, 6 × 80, 4 × 60 kg). sets, reps et kg restent la meilleure série, donc records et XP ne changent pas.
- Charge : gardée au centième (1,25 kg reste 1,25 kg).
- Retour après au moins 3 jours d'absence : aucune pénalité d'XP ce jour-là (eau, pomodoro, série rompue, heure limite), les séries repartent de zéro. Une carte remplace le guide et propose une seule action parmi 3 ; le récap hebdo est sauté cette semaine-là. Avant 3 jours, les règles ne changent pas.
- Démarrage : état incomplet complété au chargement ; si la sauvegarde reste inutilisable, l'app essaie les sauvegardes automatiques, puis affiche un écran de secours (exporter, restaurer, réessayer).
- Import et restauration : testés avant de remplacer ; en cas d'échec, les données actuelles restent. Import, restauration et « tout effacer » passent sur les autres appareils (STATE.syncEpoch), même avec moins d'XP.
- Synchro : pas d'envoi en fermeture au-delà de 60 Ko ; les données partent à la prochaine synchro.
- XP : supprimer une quête ou une routine validée aujourd'hui retire son XP du jour ; 3 créations ou passages en rang A/S par jour au maximum ; XP d'une quête plafonnée à celle de son rang ; décocher retire la journée parfaite ; dette d'XP affichée sur l'écran Jour.
- Platine : Pionnier n'est plus exigé hors bêta.
- Séance guidée : écran gardé allumé (repos compris), à vérifier sur un vrai téléphone.
- Interface : boutons +/− agrandis, champs à 16 px sur tactile (plus de zoom forcé sur iPhone), contraste de --text-faint relevé dans tous les thèmes, numéro de version retiré des réglages, textes des réglages à jour.
- Divers : accents et majuscules ne séparent plus les exercices ; fiche sans « + » ni « charge ajoutée » pour un exercice non lesté ; calendrier : un objectif chiffré ou un examen ouvre sa fiche ; plage « ce jour seulement » : rappel local plus répété toutes les 30 s.
- Écran Jour (validé) : engagements et liste du jour d'abord, puis journée tenue, initiation sur une ligne (la liste s'ouvre au toucher), puis objectifs. La carte du guide est retirée ; le guide reste dans les réglages.
- Fiches d'objectifs (validé) : nom, %, barre, prochain palier, « Cette semaine : … ». Passent dans le détail : départ et cible, terme, XP, récompense, modifier, supprimer, −10 % et « Objectif atteint ». Retirés : la case vide des objectifs automatiques et le point de priorité (le tri par priorité reste).
- Texte : « -X XP GAGNÉE » devient « -X XP AUJOURD'HUI » ; le récap hebdo affiche « XP DE LA SEMAINE » si le total est négatif.

## 04/11 — Classement de la semaine, ce qui te rapproche, démarrage (validé le 04/11) — index.html, netlify/functions/oath.js
- Classement : trié par journées tenues depuis lundi, à la place du niveau. Remise à zéro chaque lundi, même score = même place. Il faut toujours un serment pour y figurer.
- Limite connue : le score vient de l'appareil. Le serveur le plafonne aux jours écoulés, sans le vérifier davantage.
- Ce qui te rapproche : une ligne sur les objectifs reliés à des données (séances, exercice, focus, course, routine, eau). Rien sur les objectifs manuels, au ressenti, à étapes, examen ou poids.
- Démarrage pour un nouveau joueur, après l'éveil : ce qu'il veut changer, son objectif, une habitude et sa première action, tous écrits par lui. Ses modules sont réglés selon son choix ; « Passer » rouvre l'ancien écran des modules.

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
- 22/10 (v101) — Boutons « ? » remis à côté des titres (Il te reste aujourd'hui, Routines, Quêtes, Objectifs, Séances, Gourde, Pomodoro, Ma journée / Semaine type, Compétences) : ils ouvrent directement la bonne rubrique du guide.
- 22/10 (v102) — Lignes d'objectif (Jour et Quêtes) : l'échéance (⏰ J-43) et les boutons ✎ ✕ passent sur la ligne du nom, en plus petit ; la barre, les paliers (départ / cible) et les textes prennent toute la largeur au lieu d'être compressés dans la moitié gauche.

## 25/10 — Ombre et or : chrono du pomodoro invisible
- Le chrono (et le titre CHASSEUR) apparaissait comme un rectangle clair : la règle Ombre et or utilisait `background:` qui annule le découpage du dégradé sur le texte. Remplacé par `background-image:`.


## 27/10 — Fiche de progression par exercice
- Sport → Historique : touche un record pour ouvrir la fiche de l'exercice. Aussi le bouton 📈 à côté d'un exercice déjà pratiqué, pendant la saisie d'une séance.
- Séries : record au poids du corps, le plus lourd, courbe des reps au poids du corps, courbe de la charge ajoutée, meilleur résultat à chaque charge, progression sur 4 semaines.
- Course : tes temps sur 1 km / 5 km / 10 km / semi / marathon (au prorata dans une sortie plus longue), plus longue sortie, meilleure allure. Autres distances : km par séance.
- Aucune donnée nouvelle : tout est calculé à partir des séances déjà enregistrées.

## 27/10 (3) — Records selon la charge
- Deux sortes de records sur un exercice en séries : la charge max (le plus lourd jamais soulevé), et plus de reps qu'avant à la même charge (poids du corps compris, ex. « Tractions · à +5 kg », « Développé couché · à 70 kg »).
- Un record de reps à une charge ne compte que si tu n'as jamais fait autant de reps avec plus lourd. La 1re fois à une charge n'est pas un record.
- Pendant la saisie : « à +5 kg : 8 reps max » sous l'exercice, et l'annonce du record avant de terminer.

## 27/10 (2) — Exercice déjà fait = tes anciennes perfs
- Dès que le nom correspond à un exercice déjà fait (tapé ou choisi dans les suggestions du clavier), la ligne vide se remplit avec ta meilleure perf : séries, reps, kg. Pour un exercice fait au poids du corps et lesté, l'app prend la même sorte que ta dernière séance.
- Rien n'est écrasé : seulement si reps et kg sont vides. Même chose avec les boutons de tes objectifs.
- Bug corrigé : en tapant « Développé », la ligne passait toute seule en mode Distance (« Dévelo » était lu comme « vélo »).

## 02/11 — Séance guidée : repos
- La série suivante affichait « ensuite », qui débordait de sa case. Elle affiche maintenant l'objectif en gris (« → 8 »). Les textes des cases ne débordent plus (points de suspension si besoin).
- Le cercle du repos : la lueur était coupée par des traits droits sur iPhone (filtre CSS rogné par Safari). Elle est maintenant dessinée par le SVG lui-même.
- Charge en séance guidée : la charge peut être tapée exactement (ex. 17,5 ou 1,25 ; vide = poids du corps). Le pas des boutons − et + se change d'un toucher sur « ± 2,5 kg » sous la charge (1 → 2,5 → 5 kg), retenu pour les séances suivantes.
- Repos au choix en séance guidée : entre séries (2 min par défaut) et entre exercices (3 min par défaut). Choix 1 min, 1:30, 2 min, 3 min, 4 min directement sur l'écran de repos, retenu pour les séances suivantes. Boutons −30 s / +30 s. Entre deux exercices, l'écran affiche « Puis : <exercice suivant> ».

## 04/11 — Ne rate jamais deux fois
- Routines : rater UNE occurrence prévue (un jour, un jour prévu, une semaine ou un mois) ne casse plus la série ni ne coûte la pénalité de série rompue. En rater deux d'affilée casse la série (et la pénalité tombe, comme avant).
- La routine affiche « ⚠ raté la dernière fois : pas deux » le jour où il faut la refaire, et un rappel « Ne rate pas deux fois » s'affiche une fois par jour au lancement.
- Série de journées tenues : même règle (un jour non tenu toléré, deux d'affilée cassent la série). Le jour raté ne compte pas dans le nombre.
- Décocher une routine cochée après un raté remet la vraie dernière fois (le raté reste un raté).
- Journée tenue : la fenêtre explique la règle (« Ne rate jamais deux fois »), et l'affichage dit « série de N j » au lieu de « N j d'affilée ».
- Notification « Ne rate pas deux fois » (app fermée, via le canal des rappels déjà en place, aucun changement côté serveur) : le jour où il faut rattraper une routine ratée, 1 h avant son heure (07:00 au plus tôt), sinon à 09:00. Routine avant 8 h (ex. se lever) : rappel la veille à 21:00 si elle n'est pas faite. Cocher la routine met le serveur à jour en quelques secondes, donc pas de faux rappel.
