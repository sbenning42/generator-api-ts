import gql from "graphql-tag";
import { Injectable } from "@angular/core";
import * as Apollo from "apollo-angular";
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Mutation = {
  __typename?: "Mutation";
  /** sample description */
  post_users: User;
  /** sample description */
  put_users_id: User;
  /** sample description */
  delete_users_id: User;
  /** sample description */
  post_todos: Todo;
  /** sample description */
  put_todos_id: Todo;
  /** sample description */
  delete_todos_id: Todo;
};

export type MutationPost_UsersArgs = {
  body?: Maybe<UserCreateBodyInput>;
};

export type MutationPut_Users_IdArgs = {
  id: Scalars["String"];
  body?: Maybe<UserUpdateBodyInput>;
};

export type MutationDelete_Users_IdArgs = {
  id: Scalars["String"];
};

export type MutationPost_TodosArgs = {
  body?: Maybe<TodoCreateBodyInput>;
};

export type MutationPut_Todos_IdArgs = {
  id: Scalars["String"];
  body?: Maybe<TodoUpdateBodyInput>;
};

export type MutationDelete_Todos_IdArgs = {
  id: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  /** sample description */
  get_users: Array<User>;
  /** sample description */
  get_users_id: User;
  /** sample description */
  get_users_id_todos: Array<Todo>;
  /** sample description */
  get_todos: Array<Todo>;
  /** sample description */
  get_todos_id: Todo;
  /** sample description */
  get_todos_id_owner: User;
};

export type QueryGet_Users_IdArgs = {
  id: Scalars["String"];
};

export type QueryGet_Users_Id_TodosArgs = {
  id: Scalars["String"];
};

export type QueryGet_Todos_IdArgs = {
  id: Scalars["String"];
};

export type QueryGet_Todos_Id_OwnerArgs = {
  id: Scalars["String"];
};

export type Todo = {
  __typename?: "Todo";
  title?: Maybe<Scalars["String"]>;
  done?: Maybe<Scalars["Boolean"]>;
  tags?: Maybe<Array<Scalars["String"]>>;
  owner?: Maybe<Scalars["String"]>;
};

export type TodoChangesBodyInput = {
  title?: Maybe<Scalars["String"]>;
  done?: Maybe<Scalars["Boolean"]>;
  tags?: Maybe<Array<Scalars["String"]>>;
};

export type TodoCreateBodyInput = {
  title?: Maybe<Scalars["String"]>;
  done?: Maybe<Scalars["Boolean"]>;
  tags?: Maybe<Array<Scalars["String"]>>;
};

export type TodoPullBodyInput = {
  tags?: Maybe<Array<Scalars["String"]>>;
};

export type TodoPushBodyInput = {
  tags?: Maybe<Array<Scalars["String"]>>;
};

export type TodoUpdateBodyInput = {
  id?: Maybe<Scalars["String"]>;
  changes?: Maybe<TodoChangesBodyInput>;
  push?: Maybe<TodoPushBodyInput>;
  pull?: Maybe<TodoPullBodyInput>;
};

export type User = {
  __typename?: "User";
  username?: Maybe<Scalars["String"]>;
  password?: Maybe<Scalars["String"]>;
  roles?: Maybe<Array<Scalars["String"]>>;
  json?: Maybe<User_Json>;
  todos?: Maybe<Array<Scalars["String"]>>;
};

export type User_Json = {
  __typename?: "User_json";
  /** default field */
  empty?: Maybe<Scalars["String"]>;
};

export type UserChangesBodyInput = {
  username?: Maybe<Scalars["String"]>;
  password?: Maybe<Scalars["String"]>;
  json?: Maybe<UserChangesBodyInput_JsonInput>;
};

export type UserChangesBodyInput_JsonInput = {
  /** default field */
  empty?: Maybe<Scalars["String"]>;
};

export type UserCreateBodyInput = {
  username?: Maybe<Scalars["String"]>;
  password?: Maybe<Scalars["String"]>;
  json?: Maybe<UserCreateBodyInput_JsonInput>;
};

export type UserCreateBodyInput_JsonInput = {
  /** default field */
  empty?: Maybe<Scalars["String"]>;
};

export type UserPullBodyInput = {
  /** default field */
  empty?: Maybe<Scalars["String"]>;
};

export type UserPushBodyInput = {
  /** default field */
  empty?: Maybe<Scalars["String"]>;
};

export type UserUpdateBodyInput = {
  id?: Maybe<Scalars["String"]>;
  changes?: Maybe<UserChangesBodyInput>;
  push?: Maybe<UserPushBodyInput>;
  pull?: Maybe<UserPullBodyInput>;
};
export type GetTodosQueryVariables = {};

export type GetTodosQuery = { __typename?: "Query" } & {
  get_todos: Array<
    { __typename?: "Todo" } & Pick<Todo, "title" | "done" | "owner">
  >;
};

export const GetTodosDocument = gql`
  query GetTodos {
    get_todos {
      title
      done
      owner
    }
  }
`;

@Injectable({
  providedIn: "root"
})
export class GetTodosGQL extends Apollo.Query<
  GetTodosQuery,
  GetTodosQueryVariables
> {
  document = GetTodosDocument;
}
