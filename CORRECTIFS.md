# Correctifs appliqués — 28/09/2026, révisé le 29/09/2026 (build 76)

**Rectification du 29/09 (à lire en premier).** Les points 2 à 6 de la première
version de ce fichier étaient faux. Ils partaient des fonctions serveur contenues
dans le zip de travail du 28/09, en supposant que c'étaient celles en ligne. Ce
n'était pas le cas : le dépôt GitHub (téléchargé le 29/09) contient d'autres
versions de `sync-state.js`, `subscribe.js` et `send-reminders.js`, qui
fonctionnent, et ne contient pas du tout `members.js`, `oath.js`, `broadcast.js`
ni `zapier-webhook.js`. Ta synchro n'a donc jamais été « cassée de bout en bout ».
Pire, les « corrections » du 28/09 auraient cassé la production si elles avaient
été poussées : elles appelaient `getStore()` sans nom de store (erreur à chaque
requête, vérifié avec la vraie librairie `@netlify/blobs`) et lisaient d'autres
stores que ceux où sont tes données. Tout est détaillé au point 15.

---

## 1. Notifications push cassées — `index.html` + nouveau `sw.js`

**Avant** : le service worker était créé dynamiquement en JS et enregistré via
`navigator.serviceWorker.register(URL.createObjectURL(swBlob))`. Chrome et Firefox
refusent d'enregistrer un service worker dont le script est une `blob:` URL
(erreur `SecurityError`), et le `.catch(()=>{})` avalait l'erreur silencieusement.
Conséquence : aucun rappel n'arrivait jamais app fermée.

**Après** : le code du service worker est sorti dans un fichier statique `sw.js`,
enregistré via `register('/sw.js')`. Doit être déployé **à la racine du repo**,
à côté de `index.html` (pas dans `netlify/functions/`).

**Vérifier** : F12 → Application → Service Workers → `sw.js` doit apparaître
`activated and is running`. Puis test réel app fermée après avoir activé les
notifications.

---

## 2 à 6. Remplacés par le point 15

Diagnostic du 28/09 erroné (voir la rectification en tête de fichier). Le détail
correct de ce qui a été fait sur les fonctions serveur est au point 15.

---

## 7. Amélioration UI — streak visible + en-tête allégé — `index.html`

Pas un bug, une amélioration issue de l'analyse d'interface : le streak (série de
jours consécutifs) n'était affiché nulle part sur le tableau de bord — il fallait
aller dans Succès → faire défiler jusqu'au 12e chiffre d'un panneau "Analyse du
joueur" pour le voir. C'est pourtant le chiffre qui coûte le plus cher à perdre,
donc celui qui doit être le plus visible.

**Changé** : le streak actuel (🔥 Xj) apparaît maintenant en permanence dans
l'en-tête, sur tous les écrans. En profitant du changement, le bloc d'en-tête
complet (qui se répétait à l'identique sur les 7 onglets, ~450px sur un écran de
téléphone) est maintenant réduit à rang + streak + barre XP partout sauf sur
l'onglet "Aujourd'hui", où il reste complet. Les icônes son/réglages restent
accessibles partout (elles ne l'étaient qu'à cet endroit).

Vérifié par rendu réel (capture d'écran) sur chaque onglet avant livraison — pas
de reformatage cassé, la vérification a servi à ça.

---

## 8. En-tête compact/complet réglable, avertissement sur les compétences de base — `index.html`

Deux décisions qui étaient en attente (voir le plan) sont maintenant tranchées côté
code, sans qu'aucune des deux ne soit imposée à l'utilisateur.

**En-tête compact vs complet.** Le passage à l'en-tête compact (point 7 ci-dessus)
était une hypothèse de design, pas un résultat testé — remis en question à raison.
Au lieu de trancher unilatéralement, un réglage a été ajouté : `STATE.settings.
fullHeaderEverywhere` (Réglages généraux → « En-tête complet sur tous les écrans »,
désactivé par défaut). Activé, l'en-tête complet réapparaît sur les 7 onglets comme
avant le correctif précédent. La logique dans `render()` est passée de `currentTab
=== 'today'` à `currentTab === 'today' || STATE.settings.fullHeaderEverywhere`.

**Compétences personnalisables, avec avertissement sur les 5 de base.** Le système
de compétences (Focus/Force/Apprentissage/Nutrition/Discipline) était déjà éditable
dans le code — renommer, supprimer, ajouter une compétence fonctionnait déjà
(`renameSkill`, `deleteSkill`, `modalAddSkill`, onglet Stats → panneau « Compétences
— gestion »). Ce qui manquait : rien ne distinguait les 5 compétences de base des
compétences ajoutées, donc rien n'avertissait avant de renommer ou supprimer une
des 5 d'origine.

**Ajouté** : une constante `BASE_SKILLS` liste les 5 clés d'origine. Dans la liste
des compétences, chacune des 5 de base porte maintenant un petit repère « ● base ».
La renommer ouvre un avertissement visible dans la fenêtre (pas juste un `confirm()`
qu'on ferme sans lire) expliquant que ça casse la structure d'origine — rien n'est
bloqué, c'est un signal, pas une contrainte. La supprimer déclenche un `confirm()`
au texte renforcé pour les 5 de base (contre un message neutre pour une compétence
ajoutée). Une compétence personnalisée (ex. « Créativité ») n'affiche aucun de ces
avertissements.

Vérifié par script Playwright dédié : capture des deux fenêtres d'avertissement
(rename sur « Focus » = avertissement visible, rename sur une compétence
personnalisée = pas d'avertissement), et capture des deux textes de `confirm()` à
la suppression (base vs personnalisée, textes différents comme prévu). Bascule du
réglage d'en-tête testée dans les deux sens sur l'onglet Quêtes — le contenu
change bien entre version complète et compacte sans rien casser autour.

---

## 9. Avatar chibi remplacé par un sceau de rang abstrait — `index.html`

Pas un bug, un remplacement demandé : l'ancien avatar était une image chibi du
personnage (6 PNG encodés en base64, un par rang, ~1,3 Mo au total dans le
fichier). Deux problèmes indépendants avec cette approche : (1) une image figée
ne peut jamais vraiment être "tiktokable" au-delà de ce qui a été dessiné à
l'avance, et (2) une figure humaine pose une question religieuse que tu m'as
soulevée toi-même (représentation de personnages, argent halal) — question sur
laquelle je n'ai pas d'autorité et que tu dois trancher avec quelqu'un de
qualifié, mais qui rend une image de personnage risquée à garder comme pièce
centrale de l'app en attendant.

**Changé** : les 6 images sont supprimées et remplacées par un sceau généré en
SVG (`buildSigil()`), un hexagone géométrique abstrait — anneaux concentriques,
nœuds lumineux en périphérie, lettre de rang au centre — dont la complexité
augmente avec le rang (E = un seul hexagone ; D = deux anneaux ; C = anneaux +
nœuds ; B/A = ajout de flèches latérales ; S = tout + éclair + couleur or). Les
effets déjà en place (halo, particules flottantes, éclair au rang S, séquence
de transformation au rank-up) sont conservés à l'identique — ils étaient déjà
non figuratifs, seule l'image centrale a changé. La config par rang
(`AVATAR_CONFIG` : couleurs, nombre de particules, etc.) n'a pas bougé, donc le
lien rang → apparence reste cohérent avec ce qui existait.

**Effet secondaire notable** : en supprimant les 1,3 Mo d'images, le fichier
`index.html` est passé d'environ 1,7 Mo à 419 Ko — l'app se chargera nettement
plus vite, surtout sur mobile en réseau faible.

Vérifié par script Playwright dédié : capture d'écran du sceau aux 6 paliers de
rang (niveaux 1/5/12/22/35/50) et de la séquence de rank-up (E→D) — progression
visuelle cohérente, aucune image cassée, aucun texte "undefined", transformation
toujours fonctionnelle.

---

## 10. Badges de succès redessinés + faille XP sur les séances de sport — `index.html`

**Badges "cheap".** Chaque succès (onglet Succès) affichait juste un emoji nu
posé dans une ligne de liste, sans cadre — plat visuellement, sans lien avec le
reste de l'identité graphique de l'app. **Changé** : chaque icône est
maintenant encadrée dans un hexagone SVG (`achBadgeIcon()`), le même langage
visuel que le sceau de rang du point 9 — cadre bleu lumineux + icône nette si le
succès est débloqué, cadre terne + icône grisée sinon. Aucune donnée touchée,
uniquement l'affichage dans `tabAchievements()`.

**Faille XP — séances de sport.** Le réglage sport laissait modifier librement
le taux "XP / minute" (jusqu'à 10 XP/min) sans aucune limite couplée à la durée
d'une séance loguée (jusqu'à 600 min). Combinés, ces deux champs permettaient de
générer une seule séance à plusieurs milliers d'XP (ex: 600 min × 10 = 6000 XP)
en une saisie, ce qui casse tout l'équilibrage XP/niveau du reste de l'app.
**Changé** : le champ "XP / minute" n'est plus éditable dans Réglages sport — il
s'affiche en lecture seule ("1.3 (fixe)"), et `submitWorkoutSettings()` ne
l'écrase plus. Le taux reste donc fixe pour tout le monde. Plafond réel restant
sur une séance : 600 min × 1.3 = 780 XP — un ordre de grandeur en dessous de
l'ancienne faille, et cohérent avec les autres sources d'XP de l'app. Le champ
"Durée" (jusqu'à 600 min) n'a pas été touché — seule la modification du taux a
été retirée, comme demandé ; à revoir si 780 XP en une saisie reste jugé trop
haut.

Vérifié par script Playwright dédié : capture des badges (mix débloqué/verrouillé)
et de la fenêtre Réglages sport (confirmation que le champ input a disparu),
plus un test direct — `submitWorkoutSettings()` puis `logWorkout(..., 600, ...)`
donne bien 780 XP et non un nombre modifiable.

---

## 11. Passe d'amélioration interface — confirmations natives, barre d'onglets — `index.html`

Deux incohérences visuelles repérées en repassant sur l'ensemble de l'app.

**Fenêtres `confirm()`/`alert()` du navigateur.** Huit endroits (suppression de
routine, de compétence, réinitialisation de l'eau, restauration de sauvegarde,
remplacement des données par la synchro, notifications non supportées,
sauvegarde corrompue, fichier d'import invalide) ouvraient la fenêtre système du
navigateur — police par défaut, aucun style, complètement hors charte au milieu
d'une interface travaillée. Une seule fenêtre du genre existait déjà en interne,
utilisée uniquement pour "Réinitialiser le système" (`confirmResetAll()`,
Réglages) : titre rouge, message, boutons Annuler/danger — jamais généralisée.

**Changé** : `confirmModal(message, opts)` généralise ce motif existant en une
fonction réutilisable (retourne une Promise, `if(!(await confirmModal(...)))
return;` remplace exactement `if(!confirm(...)) return;`). Les 5 `confirm()`
sont remplacés par cette fenêtre stylée (titre rouge + bouton contour rouge,
cohérent avec la suppression déjà existante) ; les 3 `alert()`, purement
informatifs (pas de choix à faire), sont remplacés par le système de toast déjà
en place (`showToast(..., 'penalty')`, déjà utilisé pour l'erreur de synchro)
plutôt que par une seconde fenêtre modale à fermer.

**Barre d'onglets sans indice de défilement.** 7 onglets dans une barre qui
défile horizontalement (`overflow-x:auto`), sans aucun signe visuel qu'il y a
du contenu caché de part et d'autre — plusieurs onglets (Planning, Pomodoro,
Succès, Historique) étaient invisibles sans deviner qu'il fallait glisser.
**Changé** : un fondu (dégradé vers le fond) apparaît sur le bord droit tant
qu'il reste des onglets à droite, sur le bord gauche dès qu'on a scrollé —
recalculé à chaque rendu via `setupTabbarScrollFade()`, écouteur sur le scroll
de la barre.

Vérifié par script Playwright dédié : capture de la barre d'onglets en position
de départ (fondu droit visible, gauche invisible) et after scroll jusqu'au bout
(inverse) ; capture des deux nouvelles fenêtres stylées (suppression de routine,
suppression d'une compétence de base) et du toast d'erreur remplaçant l'alert ;
test direct du flux Annuler (l'élément n'est pas supprimé, la Promise se résout
bien à `false`) et Confirmer (l'élément est supprimé) sur routine et compétence.
Aucune erreur console liée au changement (la seule erreur relevée est un
chargement de police externe bloqué par le réseau de test, sans rapport).

---

## 12. Refonte visuelle — système de design, pas juste des retouches — `index.html`

Demande explicite : un vrai changement visuel, pas des ajustements ponctuels.
Plutôt que retoucher chaque écran un par un (7 onglets + les fenêtres), le
changement porte sur le système de design partagé par toute l'app — les
tokens (`:root`) et les classes CSS réutilisées partout (`.panel`, `.btn`,
`.tab-btn`, les barres de progression, les champs, la modale, le toast). Comme
tous les écrans utilisent ces mêmes classes, le changement se répercute
automatiquement sur les 7 onglets sans avoir eu à toucher leur HTML.

**Avant** : tout à angle droit (0 rayon partout), panneaux plats à bordure fine
unique, boutons en aplat de couleur uni, barres de progression rectangulaires.
Look "fenêtre de terminal" — fonctionnel mais plat, jugé "cheap" (retour direct
sur les badges de succès, généralisable au reste).

**Après** :
- Panneaux : légèrement arrondis (8px), ombre portée en profondeur, liseré
  lumineux en haut (effet "sheen"), coins-crochets existants gardés mais avec
  un point lumineux à la pointe (plus "HUD avancé" que simple trait).
- Boutons, badges, puces, cases à cocher, cellules de calendrier : rayon
  cohérent (4px) partout au lieu de 0 — lit immédiatement comme un système
  différent, pas juste une couleur changée.
- Barres de progression (XP, compétences, pomodoro, rang) : bouts arrondis au
  lieu de rectangulaires.
- Barre d'onglets : passée en pilules arrondies avec halo actif en dégradé
  (au lieu du simple bloc à bordure).
- Badge de rang (RANG D, etc.) : fond en dégradé teinté de sa couleur au lieu
  de texte nu bordé.
- Boutons : dégradé au lieu d'aplat, glow au survol, léger effet d'appui au
  clic (`:active{transform:scale(.97-.98)}`).
- Modale : ombre profonde + coins arrondis + petite animation d'apparition.
- Fond général : dégradés radiaux un peu plus marqués (dont une touche dorée
  en haut à droite) pour moins de plat.

**Pas touché** : aucune structure HTML, aucune logique JS, aucun texte —
seulement les tokens et les classes CSS partagées. Le risque de casse
fonctionnelle est donc faible, mais c'est un changement d'identité visuelle
assez marqué pour être discuté avant d'être considéré comme acquis.

**Réversible sans effort** : une copie du fichier d'avant refonte est gardée
de mon côté (`index.html.before-redesign`). Si tu préfères l'ancien look —
en tout ou en partie — dis-le et je renvoie cette version, ou on garde
certains éléments (ex. les pilules d'onglets) et on revient sur d'autres.

Vérifié par script Playwright dédié : capture de tous les onglets (Aujourd'hui,
Quêtes, Stats, Planning, Pomodoro, Succès, Historique), de la barre d'onglets en
gros plan, de la fenêtre de réglages, d'une fenêtre de confirmation et d'un
toast — aucune erreur JS, aucun élément cassé ou mal aligné, rendu cohérent sur
tous les écrans testés.

---

## 13. Les deux styles visuels cohabitent (réglable) + réglages triés par section — `index.html`

Deux demandes après la refonte du point 12 : pouvoir garder les deux styles et
choisir plutôt que trancher pour tout le monde, et ranger la fenêtre Réglages
généraux (jusque-là une seule longue liste plate).

**Deux styles, un seul fichier.** Réglages → Affichage → « Style visuel » :
MODERNE (coins arrondis, dégradés, profondeur — le point 12) ou CLASSIQUE (le
look d'origine, à angles droits). Bascule instantanée, sans rien recharger ni
perdre. Techniquement : une classe `theme-classic` posée sur `<body>`
(`STATE.settings.visualTheme`, `applyVisualTheme()` appelée à chaque `render()`)
fait basculer un bloc de règles CSS qui restaure fidèlement les anciennes
valeurs (couleurs, rayons à 0, ombres, dégradés retirés) pour chaque élément
touché par la refonte — panneaux, boutons, onglets, barres de progression,
badge de rang, modale, toast. Rien d'autre ne change : même structure HTML,
même logique, aucune donnée affectée par le choix.

**Réglages triés par section.** La fenêtre Réglages généraux mélangeait tout
(son, pénalités, en-tête, synchro, notifications, export, reset) sans aucun
regroupement — repéré comme un vrac difficile à parcourir. Découpée en 6
sections avec en-tête visuel (même style que les en-têtes de panneau ailleurs
dans l'app — carré coloré + petites majuscules espacées) : AFFICHAGE (style
visuel, en-tête complet, titres d'identité), GAMEPLAY (sons, pénalités),
SYNCHRONISATION MULTI-APPAREILS, NOTIFICATIONS, DONNÉES (export/import,
sauvegarde auto), ZONE DE DANGER (réinitialiser tout — en-tête rouge pour
que ce bloc reste visuellement à part). Aucun réglage supprimé ni déplacé de
fonction, uniquement regroupé et étiqueté.

Vérifié par script Playwright dédié : capture des réglages en mode moderne
(3 zones de scroll pour couvrir les 6 sections), bascule vers classique
(`setVisualThemePref('classic')`) puis capture des onglets Aujourd'hui et
Stats (sceau de rang) en classique — confirmation visuelle que tout redevient
plat et anguleux comme avant la refonte — puis retour en moderne, confirmation
que `document.body` reprend l'état correct dans les deux sens sans traînée
visuelle. Aucune erreur JS.

---

## 14. Réglages en onglets (et non plus juste des sections) — `index.html`

Précision après le point 13 : « trier » voulait dire de vrais onglets à
l'intérieur de la fenêtre Réglages, pas seulement des en-têtes de section dans
un long défilement.

**Changé** : la fenêtre Réglages généraux a maintenant sa propre mini barre
d'onglets (Affichage / Gameplay / Synchro / Notifs / Données), même style que
la barre principale mais en plus petit (`.tab-btn.small`). Seul le contenu de
l'onglet actif est affiché — plus besoin de faire défiler toute la fenêtre pour
trouver un réglage. « Zone de danger » (réinitialiser tout) est maintenant dans
l'onglet Données, avec son étiquette rouge pour rester visuellement à part.
Cliquer un onglet régénère juste le contenu de la fenêtre (`switchSettingsTab()`
→ `modalGeneralSettings()`), la fenêtre reste ouverte au même endroit.

**Bug intercepté en testant** : dans les tests, `setVisualThemePref()` plantait
si on l'appelait depuis un autre onglet que « Affichage » (les boutons
MODERNE/CLASSIQUE n'existent alors pas dans le DOM). En usage réel ce cas ne se
présente pas (le bouton qui appelle cette fonction n'existe que dans cet
onglet), mais la fonction a été rendue défensive (`?.classList`) pour ne
jamais planter si jamais elle est un jour appelée d'ailleurs.

**Bug visuel intercepté en testant** : en mode Classique, la mini barre
d'onglets débordait légèrement (le 4e onglet "Notifs" coupé, sans indice de
défilement) — le rayon plus grand du mode Classique gonflait le padding des
boutons juste assez pour dépasser la largeur de la fenêtre. Corrigé en forçant
le padding compact (`.tab-btn.small{padding... !important}`) à s'appliquer
dans les deux modes.

Vérifié par script Playwright dédié : capture des 5 onglets de réglages en mode
moderne, puis de l'onglet Affichage en mode classique (barre d'onglets tenant
bien sans coupure après le correctif ci-dessus) — aucune erreur JS.

**Correctif immédiat** : la barre de 5 onglets réutilisait le style de la barre
principale (défilement horizontal + fondu), ce qui suppose qu'on peut glisser
pour voir la suite. Sur l'usage réel, deux problèmes : pas assez de place pour
voir les 5 d'un coup, et le geste de glissement horizontal dans une fenêtre qui
défile déjà verticalement ne fonctionnait pas de façon fiable. **Changé** : la
barre passe en `flex-wrap:wrap` — les 5 onglets sont tous visibles d'emblée,
répartis sur deux lignes (3 puis 2), sans aucun défilement ni geste requis.

---

## 15. Relecture complète avant mise en ligne — 29/09/2026

### Fonctions serveur (`netlify/functions/`)

Point de départ : les versions **en production sur GitHub**, pas celles du zip.
Même format (fonctions Netlify « classiques » `exports.handler`), mêmes stores,
mêmes clés, même méthode de connexion (`NETLIFY_SITE_ID` + `NETLIFY_AUTH_TOKEN`,
déjà configurées puisque ta synchro marche). Ajout d'un filet de sécurité
(`connectLambda`) pour que ça marche même si ces deux variables disparaissaient.

- `sync-state.js` : mêmes données (`hunter-log-state`, clé = code). **Testé** : un
  état écrit par l'ancienne version est relu par la nouvelle, et inversement (retour
  arrière possible sans perte). Ajouts : codes mal formés refusés proprement, raison
  du refus renvoyée à l'app (`disabled` / `not_member`), et un interrupteur
  `SYNC_MEMBERS_ONLY=true` (variable Netlify, **désactivé par défaut**) pour le jour
  où la synchro devient réservée aux membres payants : les codes déjà utilisés
  restent acceptés, un code inventé est refusé.
- `members.js` (nouveau sur GitHub) : écrit dans `hunter-log-members`, le store que
  `sync-state.js` consultait déjà en production pour les révocations — désactiver un
  membre coupe donc réellement sa synchro. **Faille corrigée** : si `ADMIN_SECRET`
  n'était pas défini sur Netlify, une requête sans mot de passe passait
  (`undefined === undefined`). Désormais tout est refusé tant que la variable manque.
- `zapier-webhook.js` (nouveau) : même faille corrigée avec `ZAPIER_WEBHOOK_SECRET`
  (avant : n'importe qui pouvait se créer des codes gratuits). Un membre qui se
  réabonne récupère son ancien code (et donc ses données) au lieu d'en recevoir un
  nouveau vide.
- `oath.js`, `broadcast.js` (nouveaux) : mêmes corrections de stores ; `broadcast`
  vérifie les clés VAPID avant d'envoyer. Rappel : aucun bouton de l'app n'appelle
  encore le Serment Inné (décision produit en attente).
- `send-reminders.js` : une clé VAPID manquante faisait planter la fonction au
  chargement sans message ; un fuseau horaire invalide envoyé par un seul appareil
  arrêtait les rappels de tout le monde ; `hour12:false` peut donner « 24h » à minuit.
  Les trois corrigés.
- `subscribe.js` : identique à la production, durci (JSON invalide).

**Vérifié** : les 7 fonctions passées dans le vrai bundler de Netlify
(`@netlify/zip-it-and-ship-it`) sans erreur ; puis exécutées sur un serveur local
avec le vrai stockage Netlify Blobs (`BlobsServer`) : synchro, révocation,
inscription/annulation Zapier, liste admin, serment, abonnement push, diffusion.

### Application (`index.html`, build 69)

- **Texte mensonger corrigé** (onglet Notifs) : il disait que les rappels ne
  marchaient pas app fermée « faute de serveur de notifications push ». Le serveur
  existe. Le texte explique maintenant les deux types de rappels et la condition
  iPhone (app ajoutée à l'écran d'accueil, iOS 16.4+).
- **Notifications bloquées** : cliquer « ACTIVER » ne faisait rien sans rien dire.
  Maintenant : message + explication pour les réautoriser dans le navigateur.
- **Suppression de tâches et d'objectifs** : confirmation ajoutée (seules les
  routines en avaient une). Depuis l'historique des tâches, la fenêtre d'historique
  se rouvre après la suppression.
- **Premier lancement** : la bannière de bienvenue ne s'affichait jamais (condition
  impossible, puisque l'app livre 2 routines d'exemple), et le tout premier écran
  d'un nouveau joueur était un « récap de la semaine » vide. Corrigé : bannière
  qui explique XP / rang / pénalités, fermable ; récap seulement s'il y a une
  semaine à résumer. Les joueurs existants ne voient pas la bannière.
- **Outils admin masqués** : « Gérer les membres » n'est plus visible par tous.
  Pour les afficher : ouvrir l'app une fois avec `?admin` à la fin de l'adresse,
  entrer le mot de passe — ils restent visibles sur cet appareil.
- **Synchro** : « Dernière synchro réussie » affichée ; messages distincts pour code
  invalide / inconnu / désactivé (avant : « impossible de contacter le serveur » pour
  tout) ; règle en cas de conflit hors ligne expliquée.
- **Installation** : consigne adaptée à iPhone / Android / ordinateur (avant : la
  même phrase Android pour tout le monde).
- **Radar des compétences** : les noms à gauche/droite étaient coupés
  (« DISCIPLINE » affiché « LINE »). Marge ajoutée, noms longs tronqués proprement.
- `confirmModal` : une confirmation remplacée par une autre fenêtre restait en
  suspens pour toujours ; elle vaut maintenant « Annuler ».

**Vérifié** : script Playwright de 31 contrôles sur l'app servie avec les vraies
fonctions (2 appareils qui se synchronisent, admin qui crée puis désactive un
membre, suppressions, notifications bloquées…) — 31/31 ; 7 onglets × 2 styles
visuels sans erreur JavaScript.

---

## 16. Serment Inné câblé, écussons refaits, refonte « Monarque » — 29/09/2026 (build 70)

### Serment Inné (gardé, maintenant utilisable)
Avant : tout le code existait (app + serveur) mais aucun bouton n'y menait.
- Onglet **Succès** : panneau « Serment Inné » en tête — prêter / modifier son
  serment (pseudo + objectif), voir le **classement**.
- Classement **trié par niveau de chasseur**, avec rang et niveau de chacun, sa propre
  ligne en évidence. Son niveau est remis à jour à chaque ouverture du classement.
- Onglet **Aujourd'hui** : rappel compact du serment (touchable → onglet Succès).
- Nouveau succès « Serment prêté ». Admin : bouton « Annoncer un Serment » (notification
  à tous les appareils abonnés).
- Serveur `oath.js` : stocke niveau + rang, trie, limite à 100 entrées.

### Écussons de succès
Avant : un hexagone + un emoji (rendu différent selon le téléphone, d'où l'aspect
« cheap »). Maintenant : de vrais écussons (boucliers) dont **le métal dit la
difficulté** — bronze, argent, or, platine — avec pictogrammes dessinés en SVG.
Les succès verrouillés sont en fer sombre, liseré du métal visé, avec une **barre de
progression** (« 88 / 100 »). Grille en 3 colonnes, compteur par métal, détail au
toucher. Les succès cachés gardent leur secret (« ? ») jusqu'au déblocage. Valable
dans les trois styles visuels.

### Refonte « Monarque » (style visuel n°3)
Violet des Ombres, panneaux en verre dépoli, titres en Cinzel / texte en Sora,
statistiques de l'en-tête en tuiles, **barre de navigation fixe en bas** avec
pictogrammes (plus besoin de faire défiler les 7 onglets), boutons pleins, champs et
fenêtres arrondis. Entièrement confiné à `body.theme-monarch` : Moderne et Classique
sont inchangés.
- **Pour annuler** : Réglages ⚙ → Affichage → Moderne (instantané, sans perte).
- Les joueurs existants basculent **une seule fois** en Monarque avec un message
  « NOUVEAU STYLE » ; s'ils reviennent en Moderne, ce n'est jamais réimposé. Les
  nouveaux joueurs démarrent en Monarque.

### Bug trouvé au passage
- Graphiques « 7 derniers jours » (Historique) : avec un seul jour d'historique, la
  barre unique était étirée sur toute la largeur (un « 0 » géant) et un jour sans
  ouverture de l'app disparaissait. Toujours 7 colonnes maintenant, jours vides
  estompés.

**Vérifié** : 31 contrôles de la relecture précédente toujours OK (en style Monarque),
+ 13 contrôles dédiés (bascule unique puis retour Moderne conservé, 7 boutons de la
barre du bas en vrais clics, bas de page non masqué, détail d'écusson, serment de deux
joueurs + tri du classement, rappel sur Aujourd'hui), captures de tous les onglets
dans les trois styles, zéro erreur JavaScript.

---

## 17. Sept styles visuels + badge de rang avec ton personnage — 29/09/2026 (build 71)

### Styles (Réglages ⚙ → Affichage)
Les 5 propositions comparées sur maquette sont toutes dans l'app, et les deux anciens
styles sont gardés dans la famille « Système » :
MONARQUE · SYSTÈME (nouveau, fenêtres bleues du manhwa) · SYSTÈME · MODERNE (ancien
« Moderne ») · SYSTÈME · CLASSIQUE (ancien « Classique ») · MANHWA (clair, encre et
papier) · DONJON (dark fantasy) · ÉPURÉ (minimaliste). Les 5 nouveaux ont la barre de
navigation en bas ; les deux anciens gardent les onglets en haut. Les polices d'un style
ne sont téléchargées que lorsqu'il est choisi.

### Badge de rang
Cadre en arche dont l'ornement grandit avec le rang : fer (E), bronze + ailes (D),
argent + laurier (C), or + gemmes (B), platine + rayons + couronne (A), obsidienne et or
+ flammes (S). Affiché dans l'onglet Stats et en petit dans l'en-tête d'« Aujourd'hui ».
- **Ton personnage** (les 6 avatars pixel art d'origine) : réglage « Badge de rang : mon
  personnage », visible **uniquement sur un appareil admin** (`?admin`). Les autres
  utilisateurs voient l'emblème.
- Images sorties d'`index.html` : dossier `avatars/` (WebP, ~600 Ko au total, chargées
  seulement si le réglage est activé).
- **Petit trait noir au-dessus du personnage : corrigé.** C'était un reste de découpe
  dans les images d'origine (quelques pixels noirs isolés sur les premières lignes, et
  une fine ligne verticale sur le bord gauche de l'avatar S). Retirés pixel par pixel,
  le reste de l'image est intact.
- **Version publique** : supprimer le dossier `avatars/` suffit, l'emblème revient tout
  seul (vérifié en simulant le dossier absent).
- Rappel : le dépôt GitHub est public, donc les images de `avatars/` restent
  téléchargeables par qui connaît l'adresse, même si elles ne s'affichent pas.

**Vérifié** : les 31 + 13 contrôles précédents toujours OK ; 12 nouveaux (réglage
caché pour un utilisateur normal / visible pour l'admin, personnage chargé, retour à
l'emblème sans le dossier, barre du bas cliquable et bas de page visible dans chaque
nouveau style, badge des 6 rangs) ; captures des 7 styles × 4 onglets ; zéro erreur JS.

---

## 18. Chaque style a sa propre mise en page (et plus seulement ses couleurs) — build 72

Retour de Moustapha sur le build 71 : les styles avaient été « uniformisés ». C'était
vrai : ils changeaient les couleurs, les polices et la barre du bas, mais gardaient
tous la même structure d'écran, alors que les maquettes avaient chacune la leur.
Corrigé en reprenant les maquettes :
- **Monarque** : portrait arrondi avec l'onglet de rang, puces « Niv. » et « série ».
- **Système** : fenêtre [ STATUT ] clé/valeur (NOM, NIVEAU, RANG, SÉRIE, XP) ; la carte
  « Il te reste aujourd'hui » devient la fenêtre **QUÊTE QUOTIDIENNE** (lignes
  cliquables `[0/1]` → `[TERMINÉ]`, hydratation, pomodoro, avertissement de pénalité).
- **Manhwa** : case de BD avec étoile de rang, titres de panneaux en bandeau noir,
  Serment en bulle.
- **Donjon** : portrait en arche, sceau de cire, titres ornés de filets, cases en
  losange, Serment centré en italique.
- **Épuré** : « Bonjour, Chasseur » avec la date, anneau d'XP autour de l'avatar,
  3 grands chiffres.
Système · Moderne et Système · Classique gardent l'en-tête d'origine.

**Personnage** : il n'est plus dans le portail évolutif. Il s'affiche dans l'en-tête
d'« Aujourd'hui » des 5 nouveaux styles (réglage admin « Mon personnage dans
l'en-tête ») ; le portail de l'onglet Stats garde toujours l'emblème.

Bug trouvé au passage : dans les nouveaux en-têtes, la barre d'XP avait une hauteur
nulle (`flex:1` dans une colonne flex) — corrigé.

**Vérifié** : 31 + 13 + 13 contrôles Playwright + 2 sur la fenêtre QUÊTE QUOTIDIENNE,
captures des 7 styles × 4 onglets, zéro erreur JS.

---

## 19. Personnage dans l'onglet Stats (version admin) — builds 73-74

Build 73 : le personnage placé à l'intérieur du portail évolutif. Retour de Moustapha :
pas harmonieux — un sprite en pixel art dans un cadre vectoriel lisse détonne.
**Build 74** : avec le réglage admin « Mon personnage (en-tête + Stats) », le personnage
**remplace** le portail dans l'onglet Stats, présenté comme un sprite de jeu sur son
cercle d'invocation : halo, sol lumineux, particules et pastille de rang aux couleurs
du rang (anneau de rayons en plus à partir du rang B). Sans le réglage, et pour tous
les autres utilisateurs, le portail avec l'emblème reste affiché. Si le dossier
`avatars/` est supprimé, le portail revient tout seul. Seul `index.html` change.

**Vérifié** : 31 + 13 + 14 + 2 contrôles Playwright (dont « personnage à la place du
portail » et « le portail revient sans avatars/ »), captures des 6 rangs et de l'onglet
Stats dans les 5 nouveaux styles, zéro erreur JS.

---

## 20. Pomodoro : anti-triche, combo, intention, plein écran, notif app fermée — build 75

### Triche corrigée
- L'XP par session n'est plus réglable (avant : jusqu'à 500 XP, avec une session de
  1 min). Elle vaut 0,8 XP par minute de focus : 25 min = 20 XP (comme avant par défaut),
  50 min = 40, 90 min = 72. La durée de focus est bornée à 10–90 min, la pause à 1–30 min.
  Les anciens réglages sont ramenés dans ces bornes au premier lancement.
- Le cycle ne repart plus tout seul après la pause : il s'arrête et attend « DÉMARRER ».
  Avant, laisser l'app ouverte des heures créditait des sessions sans personne devant.
- La pénalité « objectif manqué » suit la même XP (75 % d'une session, minimum 8).
- Limite connue : les données vivent sur l'appareil. Quelqu'un qui modifie le stockage du
  navigateur à la main peut toujours tricher ; ce correctif ferme la triche *dans l'app*.

### Combo de focus
- Chaque session terminée dans la foulée de la précédente (pause + 15 min de marge) fait
  monter le combo : XP ×1,1 au 2e, ×1,2 au 3e… plafonné à ×1,5 (6e session).
- Abandonner une session entamée (RESET après plus d'une minute) remet le combo à zéro,
  sans autre pénalité. Un RESET dans la première minute ne coûte rien.
- Meilleur combo gardé dans les stats (`bestPomoCombo`).

### Intention de session (optionnelle)
- Champ « Cette session, je vais… » avec tes quêtes en suggestion ; pré-rempli quand tu
  lances un pomodoro depuis une quête. Affiché pendant la session.
- À la fin : « Fait / À moitié / Pas fait » (ou ✕ pour passer). Gardé dans
  `STATE.pomo.log` (100 dernières). Aucune XP liée à ce bilan déclaratif.

### Plein écran
- Bouton ⛶ : minuteur géant, tout le reste masqué (vrai plein écran sur Android/PC,
  affichage couvrant sur iPhone où Safari n'autorise pas le plein écran). ✕ pour sortir.

### Notification de fin même app fermée
- Un téléphone suspend l'app écran éteint : elle ne peut pas sonner elle-même. L'app confie
  maintenant l'heure de fin (session puis pause) au serveur (`pomo-timer`), et une fonction
  planifiée (`pomo-notify`, chaque minute) envoie le push. Jusqu'à ~1 min de retard.
- Si l'app est à l'écran ou a déjà affiché la notif, le push arrive en silence (pas de
  double sonnerie).
- **Nécessite** les notifications activées dans l'app ET les variables Netlify
  `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` (voir « À surveiller »).
- Le minuteur survit à la fermeture de l'app : en rouvrant, la session finie entre-temps
  est créditée (avant : fermer l'app effaçait la session en cours).

### Bug corrigé au passage
- « ▶ Pomodoro » depuis une quête ouvrait un onglet inexistant (`'pomo'` au lieu de
  `'pomodoro'`) : écran vide.

### Coût Netlify estimé
- `pomo-notify` tourne 43 200 fois par mois ; sans minuteur en cours il s'arrête après une
  seule lecture. Estimation : 10 à 25 crédits/mois (confiance moyenne : dépend de la façon
  dont Netlify compte les exécutions planifiées). Pour diviser par deux : `schedule =
  "*/2 * * * *"` dans `netlify.toml` (retard max 2 min).

## 21. Éveil, progression en accéléré, carte de chasseur — build 76

### Éveil (premier lancement)
- Fenêtre « système » qui s'écrit lettre par lettre, puis ACCEPTER / Passer. Montrée une
  seule fois aux nouveaux joueurs (pas aux joueurs existants). Réglages → Affichage → Revoir.

### Ma progression (onglet Stats)
- Animation plein écran : niveau 1 → ton niveau, emblème qui évolue à chaque rang (flash),
  jour 1 → aujourd'hui. Fin : bouton vers la carte.

### Carte de chasseur (onglet Stats)
- Image 1080×1920 : emblème, nom (celui du Serment), rang, niveau, série, XP totale,
  quêtes, heures de focus, compétences, serment, adresse du site. Partager (menu de
  partage du téléphone) ou Télécharger.

### Nouveaux badges de rang (images de Moustapha)
- Les 6 badges E → S viennent de l'illustration fournie par Moustapha : découpés, fond noir
  retiré, dossier `badges/` (6 fichiers .webp, 670 Ko au total ; seul le badge du rang
  affiché est chargé). Légère lévitation et halo qui pulse. Utilisés dans Stats,
  « Ma progression » et la carte de chasseur. Si une image manque, l'ancien badge dessiné
  revient tout seul.
- En-tête d'« Aujourd'hui » (5 styles) : le portrait devient un module de rang, un anneau
  en 6 segments (un par rang E → S : passés pleins, rang en cours rempli selon les niveaux
  faits), la lettre au centre et le prochain palier dessous (« B dans 8 niv. »). Ajout de
  l'XP gagnée aujourd'hui dans l'en-tête. Le badge illustré reste dans l'onglet Stats.
- Objectifs : les types « BINAIRE / QUANTIFIÉ » deviennent « EN % / CHIFFRÉ », avec une
  ligne d'explication (les données enregistrées ne changent pas).
- Résolution de départ : environ 340 × 600 px par badge, un peu juste sur les écrans très
  denses. Des versions 1024 px séparées sur fond noir amélioreraient la netteté.

### XP qui s'envole
- Quand une quête, une routine ou un objectif donne de l'XP, un « +N XP » avec le nom de la
  compétence s'envole depuis l'endroit touché (comme LifeChapter).

### Retirés à la demande de Moustapha
- Boss de la semaine et attributs (codés puis retirés avant mise en ligne : les compétences
  montent déjà avec les actions, les attributs faisaient doublon).

### Tests
- `window.__skipAwaken` : seulement pour les tests automatiques (saute l'éveil).

## 22. Synchro PC ↔ téléphone fiable, pomodoro des quêtes refait — build 77

### Synchro : le PC n'écrase plus les changements du téléphone
- Bug : changements faits sur le téléphone PC éteint/en veille → au réveil du PC, une
  ancienne version revenait. Cause : au réveil, un minuteur du PC (changement de jour,
  rappels…) enregistrait AVANT d'avoir récupéré la version du téléphone ; l'app comparait
  alors l'horloge du PC à celle du serveur et la vieille version gagnait, puis était envoyée.
  Même chose si le Wi-Fi n'était pas encore connecté à l'allumage.
- Correctif serveur (`sync-state.js`) : chaque envoi dit de quelle version il part. Si le
  serveur a reçu entre-temps une version plus récente (autre appareil), il refuse (409) et
  renvoie cette version au lieu d'écraser. Les anciennes versions de l'app gardent l'ancien
  comportement tant qu'elles ne sont pas rechargées.
- Correctif app : sur refus, fusion champ par champ (le côté qui a changé depuis la
  dernière version commune l'emporte ; quêtes, routines, objectifs, historique fusionnés
  élément par élément ; si les deux ont changé la même valeur, l'appareil en main
  l'emporte). L'état d'avant fusion est gardé à part (clé `…-sync-backup`).
- Resynchro aussi au retour du réseau et au retour sur un onglet mis en veille.
- Testé à deux appareils simulés : réveil du PC, PC allumé sans réseau, modifications
  croisées (eau sur le PC + serment sur le téléphone : les deux gardées), ancien client.

### Pomodoro depuis une quête
- Le bouton 🍅 des quêtes devient le même pictogramme que l'onglet Focus.
- L'ouverture remonte en haut de page (avant, depuis le bas d'une longue liste, l'écran
  restait sous le minuteur : page vide ; sur le build 74 en ligne, l'onglet n'existait pas).
- Carte « QUÊTE EN COURS » (nom, compétence, temps de focus déjà fait) au lieu de la ligne
  « 🎯 Quête liée ». Le champ « intention » disparaît quand une quête est liée (c'est elle).
- « XP VERS : compétence » indique où va l'XP (la compétence de la quête liée).
- Fin de session liée : « c'est fini ? » → « Quête validée ✓ » coche la quête (son XP) et la
  détache, ou « Pas encore ».

## À surveiller au moment du transfert (pas un bug de code)

**Clés VAPID** (mis à jour au build 75) : l'app demande désormais la clé publique au
serveur (fonction `vapid-key`, qui lit `VAPID_PUBLIC_KEY`). Il suffit donc que les
deux variables Netlify forment une paire valide ; la constante `PUSH_VAPID_PUBLIC_KEY`
d'`index.html` ne sert plus que de secours hors ligne. Un appareil abonné avec une
autre clé se réabonne tout seul à la réouverture de l'app.

**Variables Netlify à ajouter** (Site settings → Environment variables) :
`ADMIN_SECRET` (outils admin et diffusion), `ZAPIER_WEBHOOK_SECRET` (le jour où tu
branches Skool), `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` (rappels push et fin de pomodoro app fermée —
une paire générée ensemble).
Ne pas toucher à `NETLIFY_SITE_ID` / `NETLIFY_AUTH_TOKEN`. `SYNC_MEMBERS_ONLY` :
ne l'ajoute que le jour où la synchro devient payante.

**Email des comptes GitHub/Netlify** : le conseil d'utiliser "un email qui ne
t'appartient pas" reste un risque réel de perte d'accès à tes propres comptes —
utilise une adresse que tu contrôles réellement.
