

# Stay tuned for official doc to release soon !

  
  

# api-gen

  

`api-gen` est une librairie *Node* permettant d'accélérer le développement d'une *API REST Node*.

  

## Get Started

  

$ git clone "https://github.com/zto-sbenning/node-api-starter"

$ cd node-api-starter/server

$ npm install

  

Ce starter contient 2 programmes *Node*  `./src/main.ts` et `./src/gen.ts`

  `./src/gen.ts` permet de générer le swagger et le code des routers Express de l'application.
  `./src/main.ts` est le programme de l'api Node.

> Pour exécuter `./src/main.ts` exécutez la commande `$ npm run dev`

> Pour exécuter `./src/gen.ts` exécutez la commande `$ npm run gen`

> Pour exécuter `./src/gen.ts` puis `./src/main.ts` exécutez la commande `$ npm run sync`

  

Pour commencer on peut simplement exécuter:

  

$ npm run dev

  

Dans le navigateur, aller sur `http://localhost:4266/docs` pour accéder au *swagger* de l'API.

  

Le starter contient uniquement un model **User** permettant le support de `passport.js`

  

Vous devriez arriver sur une page de ce genre:

  

![enter image description here](https://lh3.googleusercontent.com/sUBvHmcDjLisyIoOs4uSLMSugfqpmA3jmWER2ybsA7Rf8Yd4_Ch_6XLQczUOpy6l4tRowv6q4vjX)

  

On peut noter tout d'abord les cadenas sur la droite des *Web Services* qui indique que le *Web Service* nécessite un JSON Web token pour être utilisé.

  

Le bouton **Authorize** permet de coller un *JWT* de la forme `Bearer <token>` pour *débloquer* les *Web Service*.

  

Pour obtenir un *token*, il faut tout d'abord utiliser le *Web Service*  `POST /users` afin de créer un utilisateur.

Vous pouvez ensuite obtenir un *token* sur le *Web Service*  `POST /auth/signin`

  

Le *swagger* n'expose pas encore le module **Auth**, utilisez plutôt *Postman* ou *CuRL*.

Exemple avec CuRL:

  
  

$ curl -X POST "http://localhost:4266/auth/signin" \

> -H "Content-Type: application/json" \

> -d '{"username":"<USERNAME>", "password":"<PASSWORD>"}'

  

> Remplacez \<USERNAME> et \<PASSWORD> par ceux utilisés lors de la création de l'**User**

  

Copiez le *token* et authentifiez-vous sur *swagger*, en l'inscrivant sous la forme `Bearer <token>`.

  

Vous pouvez maintenant accéder à tous les *Web Services*.


   

## Extends

  

Pour étendre l'*API*, nous allons définir et enregistrer des **schémas d'entités**.

Ces **schémas** seront *parsé* par le programme `./src/gen.ts` de manière à générer les *types TypeScripts* utiles pour manipuler l'**entité**. De plus il générera un **Router**  *CRUD express* pouvant être utilé dans le programme `./src/main.ts`.

  

## Exemple - Todo Entity

  


  

# @TODO: Correct. Continue. Improve