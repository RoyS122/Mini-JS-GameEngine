# Mini-JS-GameEngine
 A minimalist js game engine

## Documentation

### Classes

#### Game
Cette classe est la plus importante de ce moteur, elle permet de mettre en place la boucle de jeu et d'imprimer les modifications des instance de [GameObject](#GameObject) à l'ecran.
##### Les methodes 
- `startGameLoop()` : Cette methode initialise la boucle de jeu, celle ci doit être appelé une fois que tout à été ajouté paramétré avec les methodes qui vont suivre.

- `addObject(go, room)` : **"go"** doit être un objet de la classe [GameObject](#GameObject).
**"room"** (WIP) Permetra de choisir dans quelle salle de jeu l'objet doit être present (Dans le cas ou le jeu aurait plusieurs environnements très différents qui devraient être gardé actif en simultané)
    Cette methode ajoute l'objet en question à l'instance de jeu.

- `addTileMap(tm, room)` : **"tm"** doit être un objet de la classe [TileMap](#TileMap)
**"room"** (WIP) Permetra de choisir dans quelle salle de jeu la tilemap doit être presente (Dans le cas ou le jeu aurait plusieurs environnements très différents qui devraient être gardé actif en simultané)
Cette methode ajoute le tilemap en question à l'instance de jeu.

- `keyboardCheck(key)` : "key" doit être une keyvalue en javascript (pour plus d'information voir la liste [ici](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values)) 
Cette methode permet de verifier si une touche est appuyée et retourne un booléen.

#### Room 
WIP

#### GameObject
Cette classe est l'autre fondation du moteur (après la classe game) c'est grace à elle que toute la logique du jeu pourra être codé.

##### Methodes
- `onStep()` : Il est fortement recommandé de ne pas utiliser cette fonction par sois même, laisser cette tache à l'instance de la classe Game auquel il appartient.
Il est cependant possible (et même obligatoire dans la pluspart des cas) de la redefinir afin de créer la la logique de l'objet en question dans le jeu.
Cette methode est appelée à chaque boucle de jeu(60 fois par secondes par defaut.)
- `onCreate()` : Il est fortement recommandé de ne pas utiliser cette fonction par sois même, laisser cette tache à l'instance de la classe Game auquel il appartient.
De la même manière que pour *onStep()* cette methode peut être redefinie pour permettre de creer la logique de l'objet dans le jeu.
ette methode s'execute à l'initialisation de l'objet, on pourra donc y definir tous les attributs non natifs que la logique requiert.
- `CollideWith(box, x, y)` : Box peut être soit une instance de [GameObject](#GameObject) soit une instance de [CollideBox](#CollideBox).
x est la position en abscisse ou l'instance parente doit être testée.
y est la position en ordonée à laquelle l'instance doit être testée.
A noter deux choses:
    - x et y sont en pixels
    - l'origine du repère est dans le coin superieur gauche de l'écran de sorte que si ma fenetre fait 100 pixels par 100 pixels (0, 0) serait le coin superieur gauche et (100, 100) le coin inferieur droit.
Cette methode verifie la superposition de deux elements en se basant sur leur attribut (collision si l'instance à verifiée est un [GameObject](#GameObject) ou les attribut de bases de la classe [CollideBox](#CollideBox) si c'est une instance de celle ci qui est en entré)
- `destroy()` : WIP

##### Attributs
- x : la position en abscisse de l'instance
- y : la position en ordonnée de l'instance
- sprite : l'instance de la classe [Sprite](#Sprite) attribuée à cette instance de la classe [GameObject](#GameObject)
- collision : l'instance de la classe [CollideBox](#CollideBox) attribuée à cette instance de la classe [GameObject](#GameObject)

#### Sprite 
Cette classe est la classe qui permet de creer et afficher les visuels des instances de la classe [GameObject](#GameObject)

##### Methodes
- `setImage(path)` : *"path"* doit être le chemin d'accés à la texture.
    Cette methode defini la texture de l'instance parente.
- `setAnimation(col, row, speed)` : *col* doit être un entier qui indique le nombre de colonnes de la texture.
    *row* doit être un entier qui indique le nombre de lignes de la texture.
    *speed* doit être un entiers, limité au nombre d'image par seconde du jeu il indique la vitesse en image par seconde de l'animation.
    Cette méthode permet d'initialiser l'animation du sprite.
- `getSize()` : cette methode retourne un dictionnaire avec en index "width" la largeur d'une image de l'animation liées à l'instance parente et en index "height" la hauteur d'une image de l'animation liées à l'instance parente.

##### Attributs
- scale : facteur de multiplication de la taille
- z : profondeur d'affichage

#### CollideBox
Cette classe permet d'avoir les attributs nécessaires pour verifier la collision avec un autre élément.
##### Attributs
- x : Position en abscisse de la boxe de collision.
- y : Position en ordonnée de la boxe de collision.
- width : Largeur de la boxe de collision
- height : Hauteur de la boxe de collision 

#### TileMap
Cette class permet d'ajouter un décors en "tuile" à l'instance de[Game](#Game)
##### Attributs et Initialisation
- map : un tableau double entrée avec la valeur en entier qui correspond à l'identifiant de la tuile sur la feuille de texture ("tileset").
- src : chemin d'accés vers le tileset
-name : nom facultatif
- z : profondeur
- col : nombre de colonnes du tileset
- row : nombre de ligne du tileset
- scale : multiplicateur de taille des tuiles.
### How to use it