# API-GEN

## Paradigme

`api-gen` est une librairie de développement d'API Node.

Elle regroupe:

 - Un programme de génération de code typescript et de documentation `swagger`
 - Un starter extensible.
 - Un service d'authentification `local` + `JWT`
 - `req: express.Request` accessible n'importe où, même dans les fonctions `mongoose.Schema.default`

Son objectif principale, est de mettre à disposition du développeur, une sorte de langage de description de l'API qu'il veut implémenter. Ce langage est en fait un plain javascript object de configuration. 

> Il est possible, mais compliquer, de typer fortement du code typescript, uniquement via des directives évaluées au run-time. 
> Pour s'affranchir de cette complexité, `api-gen`, met à disposition un programme de génération de code  typescript.
> Ce code utilise des fonctions génériques, non-fortement typés, dans des classes spécifiques, fortement typées.

## $ npm run (gen | dev | sync)

Le repo Github d'`api-gen` contient 3 scripts npm principaux. (Au moyen de son `package.json@scripts`).

 - `$ npm run gen`
 - `$ npm run dev`
 - `$ npm run sync` 

# gen

Le script `gen` permet d'invoquer le programme définit dans `./src/gen.ts`. Ce programme analyse l'object de type `ApiSchema` exporté par `./src/apis/index.ts`. Puis, il génère les fichiers suivants:

- `./src/generated-code/schema.yml` (1)
- `./src/generated-code/types.ts` (2)
- `./src/generated-code/<api>/<api>.ts` (3)

Un répertoire `<api>` est créé pour chaque clef de la propriété `apis` de l'object de configuration de type `ApiSchema`, exporté par `./src/apis/index.ts`.

(1) - Le `swagger` de l'API décrite.
(2) - Les types typescript utiles à l'API.
(3) - Les classes typescript, spécifiques à une entité de l'API.

# dev

Le script `dev` permet d'invoquer le programme définit dans `./src/main.ts`. Ce programme analyse l'object de type `ApiSchema` exporté par `./src/apis/index.ts`.  Puis il instancie un server Express sur le port `4266`, et sert le `swagger` généré par `gen` sur le *endpoint* `/docs`.

# sync

Le script `sync` permet d'invoquer successivement, les scripts `gen` puis `dev`. Utile lorsque l'on met à jour une API existante. Il re-génère ainsi le code impacté, et re-lance le server Express.

# Etendre le starter ./src/main.ts


 # ./src/apis

Ce répertoire est l'endroit idéal où définir les *schémas d'APIs*. `api-gen` considère qu'une API est définit par:

- le model de ses entités.
- les web services exposés pour requêter / muter ses entités.

Pour définir une API, créer un fichier typescript au nom de l'API dans le répertoire `./src/apis`.

Exemple: 
	// ./src/apis/user.ts
	export const user: ApiEntitySchema = {
		model: {},
		ws: {},
	};

Voici le minimum requis pour définir une API. En fait, la propriété `ws` aka: Web Service, n'est pas requise.
Bon, pour le moment cette API n'est pas très utile.

On va commencer par définir le model des entités de type `user`.
Pour ça, on utilise la propriété `model` de notre schéma d'API de type `ApiEntitySchema`.

Exemple: 
	// ./src/apis/user.ts
	export const user: ApiEntitySchema = {
		model: {
			username: {
				type: String,
				required: true,
				unique: true
			},
			password: {
				type: String,
				required: true
			}
		},
		ws: {},
	};

Seul la propriété `type` des champs de type `ApiEntityModelFieldSchema` (aka: `username`, `password`) est requise.
Cependant, `api-gen` expose quelques options de configuration pouvant être utiles: 
	type ApiEntityModelFieldTypeUnion = String
		| Number
		| Boolean
		| Date
		| Object // aka: any
		| string // aka: relations. Exemples: 'User', 'Product', ['Tag']
		| [String]
		| [Number]
		| [Boolean]
		| [Date]
		| [Object]
		| [string];
	
	interface ApiEntityModelFieldSchema {
		type:  ApiEntityModelFieldTypeUnion;
		required?:  boolean;
		unique?:  boolean;
		select?:  boolean; // true if field should only appears in `create` aka: POST / response
		default?:  any; // 42, function () { return this.foo = 'bar' }, () => ctx().req.user.id, ...
		populate?:  boolean; // if this field is a relation, true to automatically populate the field on queries.
		reverse?:  string; // if this field is a relation, set it to the name of the field in the related model. `create` and `delete` operations on this API will be automatically reversed to that related API on it's model field `reverse`. Exemple: 'todos', 'author'  
		guards?:  ApiEntityModelFieldGuards; // function to guard this specific field against the context (aka: req: Request) on `select`, 'create' and 'update' operations (or all via `all`)
		validators?:  ApiEntityModelFieldValidators; // function to validate the value of this field in the body of the incoming request on `create` and `update` operations (or both via `all`)
	}

Même si la propriété `ws` de notre schéma est vide, `api-gen` va générer les 5 web services CRUD de l'API.
Par défaut, ces web services sont publics.

Imaginons que l'on veuille protéger tous ceux induisant des accès en écriture sur notre server. Pour ça on peut utiliser la propriété *spéciale* (aka: qui ne respecte pas `endpointPattern`) `mutation`: 

Exemple: 
	// ./src/apis/user.ts
	import { mainPassportService } from '../../modules/passport/service';

	export const user: ApiEntitySchema = {
		model: {
			username: {
				type: String,
				required: true,
				unique: true
			},
			password: {
				type: String,
				required: true
			}
		},
		ws: {
			mutation: {
				middlewares: [mainPassportService.jwt()]
			}
		},
	};

Cependant, il serait plus utile de ne pas protéger le web service POST / aka: create, en tout cas pour une API `user` (eg: `jwt` encode une instance d'un entité `user`, il faut donc avoir créé un `user` au préalable pour pouvoir passer le middleware `jwt` avec succès).

Pour ça, on utilise la propriété `excludes` pour exclure des middlewares appliqués à un niveau au dessus (aka: via `all`, `query` and `mutation`)
	
	// ./src/apis/user.ts

	import { mainPassportService } from '../../modules/passport/service';

	export const user: ApiEntitySchema = {
		model: {
			username: {
				type: String,
				required: true,
				unique: true
			},
			password: {
				type: String,
				required: true
			}
		},
		ws: {
			mutation: {
				middlewares: [mainPassportService.jwt()]
			},
			'POST /': {
				excludes: {
					0: true, // index of the middlewares to exclude
				}
			}
		},
	};

Les middlewares sont appliqués dans l'ordre `[...all, ...(query|mutation), ...'endpointPattern']`.
Les 5 web services générés correspondent aux patterns `GET /`, `POST /`, `GET /:id`, `PUT /:id` et `DELETE /:id`.



 # ./src/apis/index.ts 

Une fois qu'une API est définit, on peut l'enregistrer pour `./src/gen.ts`.

Exemple: 
	
	// ./src/apis/index.ts
	
	import { user } from  "./user";
	
	export  const  apis  = {
		/* Register APIs here */
		user:  user,
	};

> En général, cest maintenat le moment idéal pour exécuter `$ npm run gen`.

 # ./src/modules/use/service.ts @ UseService.use(app)

Use fois le code et le *swagger* généré par `./src/gen.ts`, il ne reste plus qu'à appliquer le Router Express généré pour l'API à notre application Express.

La fonction `use` du service `UseService`, présent dans le fichier ` ./src/modules/use/service.ts` est l'endroit idéal pour invoquer, dans le programme `./src/main.ts`, le code généré par le programme `./src/gen.ts` (et dont l'API correspond, au `swagger` également généré).

Exemple:

	// ./src/modules/use/service.ts @ UseService.use(app) method

	import { UserRouter } from '../../../generated-code/user/user.ts';
	import { RoleRouter } from '../../../generated-code/role/role.ts';
	import { ProductRouter } from '../../../generated-code/product/product.ts';
	import { CategoryRouter } from '../../../generated-code/category/category.ts';

	export class UseService {
		use(app: Application) {
			/*
			 * Here is the good place to use generated code.
			 * By now, this is mostly done with:
			 *
			 *    `import { <api>Router } from '../../../generated-code/<api>/<api>.ts';`
			 *     ...
			 *     ...
			 *    `new <api>Router().apply(app);`
			 */
			new UserRouter().apply(app);
			new RoleRouter().apply(app);
			new ProductRouter().apply(app);
			new CategoryRouter().apply(app);
		}
	}

Le programme `./src/main.ts` invoque cette fonction en lui donnant l'instance de l'Application Express, après lui avoir appliqué quelques *middlewares* de bases (cors, bodyParser, morgan, helmet, ...).

> **Feel free to PR the Github repo for more, or just ask support at sben.code.42@gmail.com** 


# Sécurité

## 1 - Les Middlewares : Stopper la chaîne d'exécution
## 2 - Les Guards : Cacher des propriétés -- les rendre invisibles et/ou invulnérables
## 3 - Les validators : Valider req.body ou stopper la chaîne d'exécution


# Automates

## 1 - Auto Populate Relations
## 2 - Auto Reverse Create and Deletion on related models

# Samples

## Twitter

	import { ctx } from  "../common/api-gen";
	import { MINLENGTH, Pr, NEVER, MAXLENGTH } from  "../common/api-gen/core/constantes";
	import { mainPassportService } from  "../modules/passport/service";
	  
	export  const  user  = {
		model: {
			username: {
				type:  String,
				required:  true,
				unique:  true,
				validators: {
					all: [MINLENGTH(5)]
				}
			},
			password: {
				type:  String,
				required:  true,
				validators: {
					all: [MINLENGTH(8)]
				}
			},
			roles: {
				type: [String],
				required:  true,
				default: ['user'],
				guards: {
					create:  NEVER,
					update: [
						(ctx:  any) =>  Pr(ctx.user.roles.includes('admin') ?  null  : { unauthorized:  'unauthorized' }),
					]
				},
				validators: {
					update: [
						(roles:  string[]) =>  Pr(roles.every(role  => ['user', 'admin'].includes(role)) ?  null  : { unknow:  `Unknow role in ${roles}` }),
					]
				}
			},
			tags: {
				type: ['Tag'],
				default: [],
				guards: {
					create:  NEVER,
					update:  NEVER,
				},
				reverse:  'creator',
			},
			tweets: {
				type: ['Tweet'],
				default: [],
				guards: {
					create:  NEVER,
					update:  NEVER,
				},
				reverse:  'author',
			},
			comments: {
				type: ['Comment'],
				default: [],
				guards: {
					create:  NEVER,
					update:  NEVER,
				},
				reverse:  'author',
			}
		},
		ws: {
			all: {
				middlewares: [
					mainPassportService.jwt(),
				]
			},
			mutation: {
				middlewares: [
					mainPassportService.hasRole(['self', 'admin']),
				]
			},
			'POST /': {
				excludes: {
					0:  true,
					1:  true,
				}
			},
			'DELETE /:id': {
				middlewares: [
					mainPassportService.hasRole(['admin']),
				],
				excludes: {
					1:  true
				}
			}
		}

	};

	export  const  tweet  = {
		model: {
			title: {
				type:  String,
				required:  true,
				unique:  true,
			},
			content: {
				type:  String,
				required:  true,
				validators: {
					all: [MAXLENGTH(140)]
				}
			},
			tags: {
				type: ['Tag'],
				default: [],
				reverse:  'tweets',
			},
			comments: {
				type: ['Comment'],
				default: [],
				guards: {
					create:  NEVER,
					update:  NEVER,
				},
				reverse:  'tweets'
			},
			author: {
				type:  'User',
				required:  true,
				default: () =>  ctx().req.user.id,
				guards: {
					create:  NEVER,
					update:  NEVER,
				},
				reverse:  'tweets'
			}
		},
		ws: {
			all: {
				middlewares: [
					mainPassportService.jwt(),
				]
			},
			mutation: {
				middlewares: [
					mainPassportService.hasRole(['owner', 'admin']),
				]
			},
			'DELETE /:id': {
				middlewares: [
					mainPassportService.hasRole(['admin']),
				],
				excludes: {
					1:  true
				}
			}
		}
	};
	
	export  const  tag  = {
		model: {
			title: {
				type:  String,
				required:  true,
				unique:  true,
			},
			creator: {
				type:  'User',
				required:  true,
				default: () =>  ctx().req.user.id,
				guards: {
					create:  NEVER,
					update:  NEVER,
				},
				reverse:  'tags'
			},
			tweets: {
				type: ['Tweet'],
				default: [],
				guards: {
					create:  NEVER,
					update:  NEVER,
				},
			}
		},
		ws: {
			all: {
				middlewares: [
					mainPassportService.jwt(),
				]
			},
			mutation: {
				middlewares: [
					mainPassportService.hasRole(['owner', 'admin']),
				]
			},
			'DELETE /:id': {
				middlewares: [
					mainPassportService.hasRole(['admin']),
				],
				excludes: {
					1:  true
				}
			}
		}
	};

	export  const  comment  = {
		model: {
			content: {
				type:  String,
				required:  true,
			},
			tweet: {
				type:  'Tweet',
				required:  true,
					guards: {
					update:  NEVER,
				},
				reverse:  'comments'
			},
			author: {
				type:  'User',
				required:  true,
				default: () =>  ctx().req.user.id,
				guards: {
					create:  NEVER,
					update:  NEVER,
				},
				reverse:  'comments'
			}
		},
		ws: {
			all: {
				middlewares: [
					mainPassportService.jwt(),
				]
			},
			mutation: {
				middlewares: [
					mainPassportService.hasRole(['owner', 'admin']),
				]
			},
			'DELETE /:id': {
				middlewares: [
					mainPassportService.hasRole(['admin']),
				],
				excludes: {
					1:  true
				}
			}
		}
	};


