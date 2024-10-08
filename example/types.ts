export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  URL: { input: any; output: any; }
};

export type Admin = {
  __typename?: 'Admin';
  lastModifiedAt?: Maybe<Scalars['Date']['output']>;
};

export type AttributeInput = {
  key?: InputMaybe<Scalars['String']['input']>;
  val?: InputMaybe<Scalars['String']['input']>;
};

export enum ButtonComponentType {
  Button = 'BUTTON',
  Submit = 'SUBMIT'
}

export type ComponentInput = {
  child?: InputMaybe<ComponentInput>;
  childrens?: InputMaybe<Array<InputMaybe<ComponentInput>>>;
  event?: InputMaybe<EventInput>;
  name: Scalars['String']['input'];
  type: ButtonComponentType;
};

export type DropDownComponentInput = {
  dropdownComponent?: InputMaybe<ComponentInput>;
  getEvent: EventInput;
};

export type EventArgumentInput = {
  favorites: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  nickname?: InputMaybe<Scalars['String']['input']>;
  value: Scalars['String']['input'];
};

export type EventInput = {
  arguments: Array<EventArgumentInput>;
  options?: InputMaybe<Array<EventOptionType>>;
};

export enum EventOptionType {
  Reload = 'RELOAD',
  Retry = 'RETRY'
}

export type Guest = {
  __typename?: 'Guest';
  lastLoggedIn?: Maybe<Scalars['Date']['output']>;
};

export type HttpInput = {
  method?: InputMaybe<HttpMethod>;
  url: Scalars['URL']['input'];
};

export enum HttpMethod {
  Get = 'GET',
  Post = 'POST'
}

export type LayoutInput = {
  dropdown?: InputMaybe<DropDownComponentInput>;
};

export type Mutation = {
  __typename?: 'Mutation';
  hello?: Maybe<Scalars['String']['output']>;
};


export type MutationHelloArgs = {
  message: Scalars['String']['input'];
};

export type MyType = {
  __typename?: 'MyType';
  foo?: Maybe<Scalars['String']['output']>;
};


export type MyTypeFooArgs = {
  a?: InputMaybe<Scalars['String']['input']>;
  b: Scalars['Int']['input'];
  c?: InputMaybe<Scalars['Boolean']['input']>;
  d: Scalars['Float']['input'];
};

export type Node = {
  id?: Maybe<Scalars['ID']['output']>;
};

export type PageInput = {
  attributes?: InputMaybe<Array<AttributeInput>>;
  date?: InputMaybe<Scalars['Date']['input']>;
  height: Scalars['Float']['input'];
  id: Scalars['ID']['input'];
  layout: LayoutInput;
  pageType: PageType;
  postIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
  /**
   * 表示設定
   * true: 表示する
   */
  show: Scalars['Boolean']['input'];
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** タイトル */
  title: Scalars['String']['input'];
  width: Scalars['Int']['input'];
};

export enum PageType {
  BasicAuth = 'BASIC_AUTH',
  Lp = 'LP',
  Restricted = 'RESTRICTED',
  Service = 'SERVICE'
}

export type User = Node & {
  __typename?: 'User';
  createdAt?: Maybe<Scalars['Date']['output']>;
  /** Eメールアドレス */
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  kind?: Maybe<UserKind>;
  /** ユーザ名 */
  name?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type UserKind = Admin | Guest;
