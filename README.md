

# Stay tuned for official doc to release soon !

  
  

# api-gen

  

`api-gen` est une librairie *Node* permettant d'accélérer le développement d'une *API REST Express*.

  
## Paradigme

`api-gen` prend un **schéma d'API** en entrée et génère les classes et les types *typescript* permettant de manipuler cette API. Il génère également le **swagger** associé à l'API.

Le **schéma d'API** est un object de *type* `ApiSchema`. 


## Get Started
  

	$ git clone "https://github.com/zto-sbenning/node-api-starter"
	$ cd node-api-starter/server
	$ npm install

  

Ce starter contient 2 programmes *Node*  `./src/main.ts` et `./src/gen.ts`

  `./src/gen.ts` permet de générer le swagger et une partie du code de l'application.
  `./src/main.ts` est le programme de l'API Node.

> Pour exécuter `./src/main.ts` exécutez la commande `$ npm run dev`
> Pour exécuter `./src/gen.ts` exécutez la commande `$ npm run gen`
> Pour exécuter `./src/gen.ts` puis `./src/main.ts` exécutez la commande `$ npm run sync`

  

Pour commencer on peut simplement exécuter:

  

	$ npm run dev

  
Le starter contient uniquement un model **User** permettant le support de `passport.js`

Dans le navigateur, aller sur `http://localhost:4266/docs` pour accéder au **swagger** de l'API.

  

Vous devriez arriver sur une page de ce genre:
![enter image description here](https://lh3.googleusercontent.com/dmv0lRH76KFyftmC66s8xVEs9UakNfEeqjYr8MxQQKmU35HHur8TwugWRj1M4i7m8IeAqGkVqrw)


  

On peut noter tout d'abord les cadenas sur la droite des *Web Services* qui indique que le *Web Service* nécessite un JSON Web token pour être utilisé.

  

Le bouton **Authorize** (en haut à droite) permet de coller un *JWT* de la forme `Bearer <token>` pour *débloquer* les *Web Service*.

  

Pour obtenir un *token*, il faut tout d'abord utiliser le *Web Service*  `POST /users` afin de créer un utilisateur. Ce *Web Service* est le seul qui n'est pas protégé par un JWT.

Une fois l'utilisateur créé, vous pouvez ensuite obtenir un *token* sur le *Web Service*  `POST /auth/signin`

Le **swagger** n'expose pas encore le module **Auth**, utilisez *Postman* ou *CuRL*  à la place.

> Le starter contient le fichier **http.client** ce fichier permet d'exécuter des requêtes (à la manière de Postman) depuis le *plugin VSCode* **REST-Client**.

Exemple avec CuRL:
  

	$ curl -X POST "http://localhost:4266/auth/signin" \
		> -H "Content-Type: application/json" \
		> -d '{"username":"<USERNAME>", "password":"<PASSWORD>"}
  

> Remplacez \<USERNAME> et \<PASSWORD> par ceux utilisés lors de la création de l'**User**

  

Copiez le *token* et authentifiez-vous sur *swagger*, en l'inscrivant sous la forme `Bearer <token>` -- via le bouton **authorize**.

  

Vous pouvez maintenant accéder à tous les *Web Services*.


   

## Extends

  

Pour étendre l'*API*, nous allons définir et enregistrer des **schémas d'entités**.

Ces **schémas** seront *parsés* par le programme `./src/gen.ts` de manière à générer les *types* et *class* *TypeScripts* utiles pour manipuler l'**API**.


## Exemple - Todo Entity

  Ajoutons l'entité **Todo** à notre **API**.
 
 Un **Todo** aura:
 -  un champ **title** de type **string**,  unique et requis
 -  un champ **done** de type **boolean**,  requis et `false` par défaut.

  Créer le fichier `todo.ts` dans le répertoire `src/apis`.

Le minimum requis pour déclarer une **entité** est un object de *type* `ApiEntitySchema`.

Ajoutons donc l'`ApiEntitySchema` de l'entité `Todo` dans le fichier `src/apis/todo.ts`:

	// ./src/apis/todo.ts
	
	import { ApiEntitySchema } from '../common/api-gen';

	export const todo = {
		model: {
				title: {
				type:  String,
				required:  true,
				unique:  true,
			},
			done: {
				type:  Boolean,
				required:  true,
				default:  false,
			}
		}
	};

La propriété **model** d'`ApiEntitySchema` ressemble à l'object que peut prendre `mongoose.Schema({ ... })` en paramètre:

	
	interface  ApiEntityModelFieldSchema {
		type:  ApiEntityModelFieldTypeUnion;
		required?:  boolean;
		unique?:  boolean;
		select?:  boolean;
		default?:  any;
		guards?:  ApiEntityModelFieldGuards;
		validators?:  ApiEntityModelFieldValidators;
		reverse?:  string;
		populate?:  string;
		relation?:  boolean; # Private api-gen part. Do not use it on your own
		array?:  boolean; # Private api-gen part. Do not use it on your own
		related?:  string; # Private api-gen part. Do not use it on your own
	}
	
	interface  ApiEntityModelSchema {
		[field:  string]:  ApiEntityModelFieldSchema;
	}


Une fois l'object `todo: ApiEntitySchema` définit, il ne manque qu'à l'enregistrer dans l'`index.ts` du répertoire `src/apis`.

	// ./src/apis/index.ts
	
	import { user } from  "./user";
	import { todo } from  "./todo";

	export  const  apis  = {
		user: user,
		todo: todo,
	};

Maintenant que l'*entité* **Todo** est enregistrer, on doit relancer le programme `./src/gen.ts` pour lui permettre de mettre à jour le **swagger** et le code généré.

	$ npm run sync 
  
Si on retourne sur `http://localhost:4266/docs`, on peut voir que l'**API** **Todo** à été générée.

Cependant, tous les *Web Services* retournent une erreur *404*. C'est **normal**, nous avons générer le code et le **swagger**, mais nous n'avons pas encore appliqué ce code à note application.

Pour cela, on utilise la fonction **use** du service `UseService`.

Rendez-vous dans le répertoire `src/modules/use` et éditez le fichier `service.ts`.

	import  passport  from  'passport';
	import { Application } from  'express';
	import { environment } from  '../../environment';
	import { Singleton } from  '../../common/singleton/singleton';
	import { UserRouter } from  '../../generated-code/user/user';

	/*
	 * Ajout (1)
	 * 
	 * On importe le Router Express généré par api-gen.
	 */
	import { TodoRouter } from  '../../generated-code/todo/todo';
	  
	export  class  UseService  extends  Singleton {
		
		constructor(public  config:  UseServiceConfig) {
			super(UseService);
		}

	  

		async  use(app:  Application) {
			app.use(passport.initialize());
			new  UserRouter().apply(app);

			/*
			 * Ajout (2)
			 * 
			 * On applique le Router Express à notre application
			 */
			new  TodoRouter().apply(app);
		}

	}

	export  const  mainUseService  =  new  UseService({});

Voilà ! On peut maintenant relancer l'application:

	$ npm run dev

Les *Web Services* sont maintenant accessibles.

## Sécurité et validation

`api-gen` propose 3 niveaux de sécurité et validation:

- Les middlewares
- Les guards
- Les validators

## Middlewares

Les middlewares sont des functions exécutées à l'invocation d'un *Web Service*, avant d'invoquer son *controller*.
Les middlewares `api-gen` sont exactements équivalents aux middlewares Express et doivent avoir pour signature:

	type ApiMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => void

Si un *middleware* n'invoque **pas** son paramètre `next: NextFunction` alors la chaîne d'exécution s'arrête.

Pour appliquer des middlewares aux *Web Services* générés, on utilise la propriété **ws** d'`ApiEntitySchema`.
Cette propriété est de type `ApiEntityWSsSchema`:

  

	interface  ApiEntityWSSchema {
		middlewares?:  ApiMiddleware[]; // La chaîne d'exécution du WS
		excludes?:  ApiExludes; // Les fonctions à exclure de la chaîne d'exécution de ce WS
		skip?:  boolean; // true pour ne pas générer ce WS
		secure?:  boolean; // true pour signifier à swagger si ce WS nécessite un JWT
		type?:  'query'  |  'mutation'; # Private api-gen part. Do not use it on your own
	}
	
	interface  ApiEntityWSsSchema {
		all?: ApiEntityWSSchema;
		query?: ApiEntityWSSchema;
		mutation?: ApiEntityWSSchema;
		[endpointPattern:  string]:  ApiEntityWSSchema;
	}

Les propriétés `all`, `query` et `mutation` permettent de cibler plusieurs *Web Services* à la fois:

 - `all`: cible tous les *Web Services* de l'**entité**
 - `query`: cible tous les *Web Services* **GET** de l'entité
 - `mutation`: cible tous les *Web Services* **POST**/**PUT**/**DELETE** de l'entité

Les autres propriétés doivent respectés l'expression régulière: `(GET|POST|PUT|DELETE) \/(\w|\/|:)*` et permettent de cibler l'unique *Web Service* qui match le pattern.

`api-gen` génère par défaut **5** *Web Services* par entités:

- `GET /`: fetch l'ensemble de la collection de l'entité 
- `POST /`: créer une nouvelle instance de l'entité
- `GET /:id`: fetch l'instance de l'entité ciblée par **:id**
- `PUT /:id`: modifier l'instance de l'entité ciblée par **:id**
- `DELETE /:id`: supprimer l'instance de l'entité ciblée par **:id**

Vous pouvez ajouter autant de *Web Service* que nécessaire, mais comme il n'y aura pas de *controller* pré-définit pour ces *Web Services* "customs", vous devez implémenter un controller en tant que dernier *middleware* du *Web Service*.

Par exemple:

	const myCustomController = (req: express.Request, res: express.Response) => {
		console.log(`Custom log ${req.params.id}`);
		res.json({ ok: true });
	};

	export const myApi: ApiEntitySchema = {
		model: {
			name: {
				type: string,
			}
		},
		ws: {
			'GET /:id/log': {
				middlewares: [myCustomController]
			}
		}
	}; 

> Note sur l'utilisation d'**excludes**:
> La propriété `excludes` d'un WS lui permet d'exclure des middlewares appliqués via `all`, `query` et `mutation`.
> `exclude` accepte une *map* `{ [idx: number]: boolean }` spécifiant les index du tableau `middlewares` à exclure de ce WS. 
> Pour un WS, les index de ces middlewares respectent toujours `idx@all < idx@query|mutation < idx@[endpointPattern]`.

Exemple: 

	const jwt = (...) => ...;
	const hasRole = (...) => (...) => ...;

	export const myApi: ApiEntitySchema = {
		model: {
			name: {
				type: string,
			}
		},
		ws: {
			all: {
				middlewares: [jwt],
			},
			mutation: {
				middlewares: [hasRole('admin')],
			},
			'POST /': {
				excludes: { 1: true } // comme all.middlewares < mutation.middlewares, `1: true` ecxlue le middleware hasRole 
			},
			'GET /': {
				excludes: { 0: true, 1: true } // exclue les middlewares jwt et hasRole de ce WS
			}
		}
	}; 

## Guards

Les `guards` sont les cousins des middlewares. Ils permettent, eux, de protégé l'accès aux propriétés de l'entité, lors des opération de `lecture` de `création` ou de `mise à jour` des entités.

On utilise pour ça la propriété `guards` de `ApiEntityModelFieldSchema`.

	interface  ApiEntityModelFieldGuards {
		all?:  ApiEntityModelFieldGuard[]; // Toutes les opérations -- GET|POST|PUT
		select?:  ApiEntityModelFieldGuard[]; // lecture -- GET
		create?:  ApiEntityModelFieldGuard[]; // création -- POST
		update?:  ApiEntityModelFieldGuard[]; // mise à jour -- PUT
	}
	
	type  ApiEntityModelFieldGuard  = (ctx:  any) =>  Promise<null  | { [error:  string]:  string }>;

Un *guard* est une fonction asynchrone appliqué au **context***, qui permet, si celle-ci ne resolve **pas** sur `null` de protéger la propriété de l'entité -- Elle est retiré de la `projection mongodb` lors des opérations de `lecture` et elle est retiré du `body` de la requête lors des opérations de `création` et de `mise à jour`.

Les éventuelles erreurs retournées par les `guards` d'une *entité* sont ajoutés dans le champ `guardErrors` du champ `errors` renvoyés par les WS.

## Validators

Les `validators` sont les frères des `guards`. Ils permettent eux, de valider la valeur des champs envoyé dans le `body` de la requête, lors des opérations de `création` et de `mise à jour`.

Cependant, et contrairement aux `guards`, une erreur renvoyées par un `validator` **stop** l'exécution de la requête et renvois l'erreur avec un *status HTTP 400*.

  

	interface  ApiEntityModelFieldValidators {
		all?:  ApiEntityModelFieldValidator[];
		create?:  ApiEntityModelFieldValidator[];
		update?:  ApiEntityModelFieldValidator[];
	}
	
	/*
	 * @params(ctx): le context d'execution de la requete: ctx: { req: Request, res: Response: err: {} }
	 * @params(input): La valeur du champ dans le body de la requête
	 */
	type  ApiEntityModelFieldValidator  = (ctx:  any, input:  any) =>  Promise<null  | { [error:  string]:  string }>;

# @TODO: Correct. Continue. Improve