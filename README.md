# DRAFT !!!!!

# APIGen

`APIGen` est une librairie *Node* permettant d'accélérer le développement d'une *API REST Node*.

## Get Started

	$ git clone "https://github.com/sbenning42/api-gen-starter"
	$ cd api-gen-starter
	$ npm install

Ce starter contient 2 programmes *Node* `./src/main.ts` et `./src/gen.ts`

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

Pour obtenir un *token*, il faut tout d'abord utiliser le *Web Service* `POST /users`.
Vous pouvez ensuite obtenir un *token* sur le *Web Service* `POST /auth/signin`

Le *swagger* n'expose pas encore le module **Auth**,  utilisez plutôt *Postman* ou *CuRL*.
Exemple avec CuRL:


	$ curl -X POST "http://localhost:4266/auth/signin" \
	    > -H "Content-Type: application/json" \
	    > -d '{"username":"<USERNAME>", "password":"<PASSWORD>"}'

> Remplacez \<USERNAME> et \<PASSWORD> par ceux utilisés lors de la création de l'**User**

Copiez le *token* et authentifiez-vous sur *swagger*.

Vous pouvez maintenant accéder à tous les *Web Services*.

> Vous remarquerez peut-être que certains *Web Service*  du type `/users/:id` renvoient une erreur si l'`:id` utilisé, n'est pas celui de l'**User** authentifié.
> Ces *Web Services* utilisent en fait le *middleware* `self` du **PassportService**.
> J'y reviendrai plus loin.


## Extends

Pour étendre l'*API*, nous allons définir et enregistrer  des **schémas d'entités**.
Ces **schémas** seront *parsé* par le programme `./src/gen.ts` de manière à générer les *types TypeScripts* utiles pour manipuler l'**entité**. De plus il générera un **Router** *CRUD express* pouvant être utilé dans l'*API* `./src/main.ts`.

## Exemple - Todos

Nous allons définir et enregistrer l'entité **Todo**. Un **Todo** sera composé d'un titre `title: string` et d'un flag `done: boolean`.

Créez le fichier `todo.ts` dans le répertoire `./src/config/entities/`
Voici comment définir l'entité **Todo**:

	// ./src/config/entities/todo.ts
	
	import { APISchemaEntity } from  '../../common/api-gen/types';
	
	export const todo: APISchemaEntity = {
		properties: {
			title: {
				type: String,
				required: true,
				unique: true
			},
			done: Boolean
		}
	}; 

La *propriété* `properties` de l'interface `APISchemaEntity` est assez proche de l'objet que l'on peut donner à `new mongoose.Schema({...})` ; La liste des *validation* et *options* accepté par l'interface `APISchemaEntity` est donnée plus loin en référence.
Les *types* acceptés sont: `Boolean | String | Number | Date | Object | '<Model Name>'` . Nous verrons plus tard comment le type `'<Model Name>'` permet de mettre des **entités** en **relation**.

Une fois l'**entité Todo** définie, il faut maintenant l'enregistrer de manière à la faire connaître de `./src/gen.ts`.

Allez dans  `./src/config/entities/index.ts` et ajoutez `todo` à la suite de `user`:

	// ./src/config/entities/index.ts
	
	import { user } from  './user';
	import { todo } from  './todo';

	export  const  entities:  any  = {
		user,
		todo,
	};

> On remarque ici que l'*entité* **User** est elle-même une *entité* générée par **APIGen**

On peut maintenant générer les *types* et le *Router*:

	$ # On coupe le server: ( CTRL+C ), puis:
	$ npm run gen

Le fichier `./src/generated/types` a été édité, et il exporte maintenant les *types TypeScript* utiles pour manipuler l'entité **Todo** (Notamment son **mongoose.Schema** et un **mongoose.model('Todo', ...)** par défaut)
.
De plus le dossier  `./src/generated/todo/todo.ts` a été créé est *export* les *classes* `TodoService`, `TodoControllers` et `TodoRouter`. Il *export* également la *fonction* `applyTodoAPI(...)`.

Nous allons utiliser cette fonction  `applyTodoAPI(...)` pour appliquer le *Router* généré à notre *instance* d'*express*. 

Dans le fichier `./src/modules/use/service.ts`, ajouter l'*invocation* de `applyTodoAPI` à la fin de la fonction `use`. Le fichier devrait être:

	// ./src/modules/use/service.ts
	
	import  passport  from  'passport';
	import { Application } from  'express';
	// ...
	
	import { applyTodoAPI } from  '../../generated/todo/todo';


	export  class  UseService  extends  Singleton {

		// ... 

		async  use(app:  Application) {
			
			// ...

			/**
			* You can add other `Application` handlers here
			*/

			applyTodoAPI(app);

		}

	}

	export  const  mainUseService  =  new  UseService({});

Voilà! On peut maintenant relancer le serveur:

	$ npm run dev

Et se rendre sur `http://localhost:4266/docs` pour jouer avec ces nouveaux *Web Services*.

> Le *swagger* généré ne reflète pas encore l'aspect *required* des propriétés des objects. Néanmoins, ceux-ci sont réellement pris en compte dans le code TypeScript généré.  Donc les *Web Services* remontent des erreurs uniquement si les champs *requis* ne sont pas fournis.

## Middlewares

On remarque que par défaut les *Web Services* **Todo** ne sont pas protégés par l'authentification.
Pour appliquer le *middleware* **passport-jwt** sur les entités générés, il faut modifier le **schéma** de notre **entité Todo**.

On utilise pour ça, la propriété `routes` de l'interface `APISchemaEntity`.

Pour *cibler* un *Web Service* et lui appliquer des *middlewares*, `APISchemaEntity` propose 4 moyens:

 1. `APISchemaEntity.routes.all.middlewares` applique les *middlewares* à tous les *Web Services* du *Router*
 2. `APISchemaEntity.routes.query.middlewares` applique les *middlewares* à tous les *Web Services* *GET* du *Router*
 3. `APISchemaEntity.routes.mutation.middlewares` applique les *middlewares* à tous les *Web Services* *POST | PUT | DELETE* du *Router*
 4. `APISchemaEntity.routes[<endpoint pattern>].middlewares` applique les *middlewares* au seul *Web Service* du *Router* qui *match* l'expression `<endpoint pattern>`


> `<endpoint pattern>` doit respecter l'*expression régulière*  `/(?:GET|POST|PUT|DELETE) \/[\w\/]*/`.

> Pour exclure certains *middlewares* de certaines *routes* vous pouvez utiliser la propriété `excludeMiddleware` d' `APISchemaEntity.routes[<endpoint pattern>]`

> Par exemple `User` est définit comme tel:
	routes: { all: { middlewares: ['jwt'] }, 'POST /':  { excludeMiddleware: ['jwt'] } },
 
Privatisons les opération POST, PUT et DELETE de l'entité:

	// ./src/config/entities/todo.ts
	
	import { APISchemaEntity } from  '../../common/api-gen/types';
	
	export const todo: APISchemaEntity = {
		properties: {
			title: {
				type: String,
				required: true,
				unique: true
			},
			done: Boolean
		},
		routes: {
			mutation: {
				middlewares: ['jwt']
			}
		}
	}; 
 


On peut re-générer les *Web Services* pour appliquer la modification et relancer le serveur:

	$ npm run sync


## Relations

Ajoutons maintenant une relation entre nos *entités* **User** et **Todo**.

`PassportService` propose un *middleware* spécifique à la notion d'*appartenance*. Le *middleware* `owner`. Quand il est appliqué à un *Web Service*, ce *middleware* s'assure de **filtrer** les documents **mongoose** sur lesquelles l'utilisateur **authentifié** essaie d'agir. (Pour ça, il utilise les *middlewares* `<mongoose.Schema Instance>.pre` et `<mongoose.Schema Instance>.post`. Lors des events `validate|save` il *set* le champ `owner` du model (par défaut) , à l'`id` de l'**User** *authentifié*).

Nous utiliserons ce *middleware* plus tard,  commençons par définir la relation:
  
	// ./src/config/entities/todo.ts
	
	import { APISchemaEntity } from  '../../common/api-gen/types';
	
	export const todo: APISchemaEntity = {
		properties: {
			title: {
				type: String,
				required: true,
				unique: true
			},
			done: Boolean,
			tags: [{
				type: String,
				default: []
			}],
			owner: {
				type:  'User',
				required:  true,
			},
		},
		routes: {
			mutation: {
				middlewares: ['jwt']
			}
		}
	}; 

Pour définir une **relation**, il suffit de donner le nom  d'un **model** en **type** d'une propriété d'un autre. (`//eg: type: 'User'`).
J'ai aussi ajouté une propriété `tags` à notre **Todo**, nous verrons ainsi l'utilité des propriétés `pull` et `push` du *type* `TodoUpdateBody` .

>**TL;DR**: `tags: [{ type: String, default: [] }]` sera remplacé par `tags: { type: Array, default: [], item: { type: String }|String }` dans une **future** mise à jour d'**APIGen**.
>
> Les puristes **Mongo** auront remarqué une *déviance* entre les manières qu'ont **mongoose** et **APIGen** de définir le `default` du tableau `tags`. **mongoose** permet d'écrire `tags: { type: [{ type: String }|String], default: [] }`.
> Bien qu'**APIGen** comprenne la notation `tags: [String]` il ne **permet pas** *d'imbriquer* des types composés.
> 
> Cette décision entraîne une erreur *sémantique* entre `type` et `typeof default`. Une futur mise à jour d'**APIGen** permettra de définir la propriété **équivalente** de cette manière: `tags: { type: Array, default: [], item: { type: String }|String }`

De nouveau:

	$ npm run sync

3 nouveaux *Web Services* ont été générés.  Ils permettent respectivement de *lire*, *définir* ou *supprimer* une relation, en utilisant l'`id` du document *relié*.

> Si la relation avaient été un tableau, ils auraient permis respectivement de *lire (toutes)*, *ajouter* ou *retirer*  un ou plusieurs document *relié* .

Cependant, notre *API* possède actuellement plusieurs *défauts* de *design*:
 - Le *Web Service* `POST /todos` expose le champ `owner` -- Il faudrait que celui soit automatiquement *set* à la valeur de l'`ìd` de l'**User** **authentifié** qui fait la requête.
 - Les *WS* `PUT /todos/:id/owner/add` et  `PUT /todos/:id/owner/remove` ne devraient pas être générés / exposés .
 - Le *WS* `PUT /todos/:id`expose le champ `owner` -- celui-ci ne devrait pas être modifiable après sa création.
 - Optionnellement, l'**User** **authentifié** ne devrait pouvoir utiliser les *WS* `PUT /todos/:id` et `DELETE /todos/:id` uniquement sur **ses** **Todo**s (ceux dont il est l'*owner*).
- Le *WS* `GET /todos/:id/owner` est *public* alors que les *WS GET*s **User** sont privés. 

Apportons les modification nécessaires pour corriger ces défauts:

 
	// ./src/config/entities/todo.ts
	
	import { APISchemaEntity } from  '../../common/api-gen/types';
	
	export const todo: APISchemaEntity = {
		properties: {
			title: {
				type: String,
				required: true,
				unique: true
			},
			done: Boolean,
			tags: [{
				type: String,
				default: []
			}],
			owner: {
				type:  'User',
				required:  true,
				skipCreate: true, // (1)
				skipChanges: true, // (1)
				skipAdd: true, // (2)
				skipRemove: true, // (2)
			},
		},
		routes: {
			mutation: {
				middlewares: ['jwt', 'todoOwner' /* (3) */]
			},
			'GET /:id/owner': { // (4)
				middlewares: ['jwt']
			}
			
			/**
			* Equivalent for `todo.properties.owner.skipRemove = true`:

			'PUT /:id/owner/remove': { //(2)
				skip: true
			},

			*/
		}
	}; 


(1) - `skipCreate` et `skipChanges` peuvent être présentes sur n'importe quels propriétés. `skipCreate` permet de ne pas *exposer* la propriété lors de la création de l'*entité*. `skipChanges` permet de ne pas *exposer* la propriété lors de l'*update* de l'*entité*. (aka: Les propriété *marquée* skip\<Create|Changes>, ne sont pas prisent en compte dans le *body* de leurs requête). `skipChanges` retire également la propriété des *types* `TodoPushBody` et `TodoPullBody`

(2) - `skipAdd` et `skipRemove` sont spécifiques aux propriétés *reliés* . Elle permettent respectivement de ne pas générer les *WS* `PUT /todos/:id/<relation>/add` et  `PUT /todos/:id/<relation>/remove`.
Notez le comportement équivalent via `skip: true` sur le *WS* associé. `skip: true` peut être utilisé sur toutes les propriétés d'`APISchemaEntity.routes`, incluant les propriété spéciales `all`, `query` et `mutation`

(3) - Le *middleware* `todoOwner` est une *configuration* du *middleware* `PassportService.owner({...})`. Pour le définir, et permettre à **APIGen** de l'appliquer au *Router*, il faut l'instancier dans notre `UseService` et le donner (sous forme d'une *map*) en second argument d'`applyTodoAPI`:

(4) - On applique le *middleware* `jwt` sur `GET /:id/owner` pour rester cohérent avec l'*API* **User**.

	// ./src/modules/use/service.ts
	
	import  passport  from  'passport';
	import { Application } from  'express';
	// ...
	
	import { mainPassportService } from  '../passport/service';
	
	import { TodoSchema } from  '../../generated/types';
	import { applyTodoAPI, mainTodoService } from  '../../generated/todo/todo';


	export  class  UseService  extends  Singleton {

		// ... 

		async  use(app:  Application) {
			
			// ...

			/**
			* You can add other `Application` handlers here
			*/
			
			const  todoOwnerConfig  = {
				on:  mainTodoService.utils, // The object witch holds the model we want to patch with pre and post hooks
				key: 'Todo', // the name of the property in `on` witch holds the model we want to patch with pre and post hooks
				name: 'todos', // the name of the collection
				// field: 'owner', // optional, default to 'owner' // the field in `on[key]` witch point to the owner id
			};
			const  todoOwner  =  mainPassportService.owner(TodoSchema, todoOwnerConfig); // (5)

			applyTodoAPI(app, { todoOwner });

		}

	}

	export  const  mainUseService  =  new  UseService({});


OK! 

	$ npm run sync

Et voilà! L'*API* génère d'elle même le champ `owner` lors du *POST* et on peut toujours essayer de le modifier via *PUT*, mais rien à faire, il ne change pas **:)** .
De plus nous ne pouvons *modifier / supprimer* que nos propres **Todo** !

![enter image description here](https://lh3.googleusercontent.com/8ISE2CoQRyLGcHF3PxUeiCqkJOBTaEnDeesChUa896DOyc2KiIeLDCxgXOX72LDN3orlBrzeSJjL)

![enter image description here](https://lh3.googleusercontent.com/5sDv4e_DVwqIXQnM6LQBsu0_x0UuL_eb0ThioyVynYRFezvzK93xPotmw6CRMza_gOSZVLk_9Bwp)

*Note* sur `TodoPushBody` et `TodoPullBody`:

Lors d'un *update* via *PUT*, la propriété `changes` de `TodoBodyUpdate` effectue l'opération **mongoose** `{ $set: todoUpdateBody.changes }`. Ceci induit que pour modifier une propriété  `Array` (enlever ou ajouter des éléments), il faut envoyer la totalité du tableau modifié.. Pas très pratique..

**mongoose**  possède les opérateurs  `{ $push: { { prop: { $each: [items] } } } }` et `{ $pull: { { prop: { $in: [items] } } } }` pour ajouter un ou plusieurs éléments à un tableau.
**APIGen** expose quant à lui les opérateurs `{ push: [items] }` et `{ pull: [items] }` qui seront *mergé* avec `{ changes: {...} }` lors de l'*update*.

> So far so good!

Cool, on peut retrouver le propriétaire d'un **Todo** si l'on est authentifié. Mais comment retrouver tous les todos d'un **User** en particulier?

Pour ça, deux nouvelles modifications à apporter.

- Premièrement il va falloir modifier le *schéma* **User** pour lui ajouter un propriété *liée* `todos`. Et, comme pour l'`owner` des **Todo**, il faudra s'assurer que ce champ ne soit pas exposé.
-  Ensuite, il faudra automatiser (*via un middleware*) l'ajout du **Todo** à son propriétaire lors de se création. Ainsi que sa suppression automatique lors de de sa suppression.

Directions `./src/config/entities/user.ts`, on ajoute la `.properties`:

	todos: [{
		type:  'Todo',
		skipCreate:  true,
		skipChanges:  true,
		skipAdd:  true,
		skipRemove:  true,
	}]

Et dans `./src/config/entities/todo.ts` on ajoute les `.routes`:

	'POST /': {
		middlewares: ['reverseAddTodoOwner']
	},
	'DELETE /:id': {
		middlewares: ['reverseRemoveTodoOwner']
	},


Il va nous falloir *implémenter* ces *middlewares*. Ajoutons un *module* `todo` avec une *class* `Service` et une *class* `Middlewares`:

	$ mkdir ./src/modules/todo
	$ touch ./src/modules/todo/service.ts
	$ touch ./src/modules/todo/middlewares.ts

Dans `./src/modules/todo/service.ts`:

	// ./src/modules/todo/service.ts
	
	import { Singleton } from  '../../common/singleton/singleton';
	import { ID } from  '../../generated/types';
	import { mainUserService } from  '../../generated/user/user';

	export  class  TodoServiceExt  extends  Singleton {

		constructor() {
			super(TodoServiceExt);
		}
		
		reverseAddTodoOwner(userId:  ID, id:  ID) {
			const { utils } =  mainUserService;
			return  utils.addTodosTo(userId, id);
		}
  
		reverseRemoveTodoOwner(userId:  ID, id:  ID) {
			const { utils } =  mainUserService;
			return  utils.removeTodosFrom(userId, id);

		}

	}
	
	export  const  mainTodoServiceExt:  TodoServiceExt  =  new  TodoServiceExt();
	

Dans `./src/modules/todo/middlewares.ts`:

	// ./src/modules/todo/middlewares.ts
	
	import { Request, Response, NextFunction } from  'express';
	import { ObjectID } from  'mongodb';
	import { Singleton } from  '../../common/singleton/singleton';
	import { mainTodoServiceExt } from  './service';

	export  class  TodoMiddlewares  extends  Singleton {
		constructor() {
			super(TodoMiddlewares);
		}
		
		reverseAddTodoOwner() {
			return  async (req:  Request, res:  Response, next:  NextFunction) => {
				const  todoId  =  new  ObjectID();
				req.body._id  =  todoId;
				await  mainTodoServiceExt.reverseAddTodoOwner(req.user.id, todoId);
				next();
			};
		}
		  
		reverseRemoveTodoOwner() {
			return  async (req:  Request, res:  Response, next:  NextFunction) => {
				await  mainTodoServiceExt.reverseRemoveTodoOwner(req.user.id, req.params.id);
				next();
			};
		}
	}
	  
	export  const  mainTodoMiddlewares:  TodoMiddlewares  =  new  TodoMiddlewares();

Et enfin dans `./src/modules/use/service.ts` on ajoute les deux nouveaux *middlewares*:
	
	// ...

	import { mainTodoMiddlewares } from  '../todo/middlewares';
	
	// ...
	
		const  todoOwner  =  mainPassportService.owner(TodoSchema, todoOwnerConfig);
		const  reverseAddTodoOwner  =  mainTodoMiddlewares.reverseAddTodoOwner();
		const  reverseRemoveTodoOwner  =  mainTodoMiddlewares.reverseRemoveTodoOwner();
	
		applyTodoAPI(app, { todoOwner, reverseAddTodoOwner, reverseRemoveTodoOwner });
	
	// ...


On met à jour, et on relance:

	$ npm run sync

Pratique!