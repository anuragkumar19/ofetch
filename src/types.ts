// --------------------------
// $fetch API
// --------------------------

export interface InternalApi {
  "/api/v1": {
    get: {
      response: { user: string; method: "get" };
      request: { body: { name: string } };
    };
    post: {
      response: { user: string; method: "post" };
      request: {
        query: {
          limit: number;
        };
        body: {
          text: string;
        };
        params: {
          id: string;
        };
      };
    };
  };
  "/api/v1/me": {
    default: { response: { ram: string } };
  };
}

export type ExtendedFetchRequest =
  | keyof InternalApi // Don't remove underscore prefixed path in ofetch, need to be discussed
  | Exclude<FetchRequest, string>
  // eslint-disable-next-line @typescript-eslint/ban-types
  | (string & {});

export interface $Fetch<
  DefaultT = unknown,
  DefaultR extends ExtendedFetchRequest = ExtendedFetchRequest,
  DefaultQ = Record<string, any>,
  DefaultB = any,
  DefaultP = Record<string, any>,
> {
  <
    T = DefaultT,
    R extends ExtendedFetchRequest = DefaultR,
    M extends ExtractedRouteMethod<R> | Uppercase<ExtractedRouteMethod<R>> =
      | ExtractedRouteMethod<R>
      | Uppercase<ExtractedRouteMethod<R>>,
    Q extends TypedInternalQuery<
      R,
      DefaultQ,
      Lowercase<M>
    > = TypedInternalQuery<R, DefaultQ, Lowercase<M>>,
    B extends TypedInternalBody<R, DefaultB, Lowercase<M>> = TypedInternalBody<
      R,
      DefaultB,
      Lowercase<M>
    >,
    P extends TypedInternalParams<
      R,
      DefaultP,
      Lowercase<M>
    > = TypedInternalParams<R, DefaultP, Lowercase<M>>,
    S extends TypedInternalResponse<R, T, Lowercase<M>> = TypedInternalResponse<
      R,
      T,
      Lowercase<M>
    >,
  >(
    request: R,
    opts?: FetchOptions<
      "json",
      {
        method: M;
        query: Q;
        body: B;
        params: P;
      }
    >
  ): Promise<S>;
  raw<
    T = DefaultT,
    R extends ExtendedFetchRequest = DefaultR,
    M extends ExtractedRouteMethod<R> | Uppercase<ExtractedRouteMethod<R>> =
      | ExtractedRouteMethod<R>
      | Uppercase<ExtractedRouteMethod<R>>,
    Q extends TypedInternalQuery<
      R,
      DefaultQ,
      Lowercase<M>
    > = TypedInternalQuery<R, DefaultQ, Lowercase<M>>,
    B extends TypedInternalBody<R, DefaultB, Lowercase<M>> = TypedInternalBody<
      R,
      DefaultB,
      Lowercase<M>
    >,
    P extends TypedInternalParams<
      R,
      DefaultP,
      Lowercase<M>
    > = TypedInternalParams<R, DefaultP, Lowercase<M>>,
    S extends TypedInternalResponse<R, T, Lowercase<M>> = TypedInternalResponse<
      R,
      T,
      Lowercase<M>
    >,
  >(
    request: R,
    opts?: FetchOptions<
      "json",
      {
        method: M;
        query: Q;
        body: B;
        params: P;
      }
    >
  ): Promise<FetchResponse<S>>;
  create<T = DefaultT, R extends ExtendedFetchRequest = DefaultR>( // TODO: allow to pass internal API
    defaults: FetchOptions
  ): $Fetch<T, R>;
}

// --------------------------
// Context
// --------------------------

export interface FetchContext<
  T = any,
  R extends ResponseType = ResponseType,
  // eslint-disable-next-line @typescript-eslint/ban-types
  O extends object = {},
> {
  request: FetchRequest;
  // eslint-disable-next-line no-use-before-define
  options: FetchOptions<R, O>;
  response?: FetchResponse<T>;
  error?: Error;
}

// --------------------------
// Options
// --------------------------

export interface FetchOptions<
  R extends ResponseType = ResponseType,
  // eslint-disable-next-line @typescript-eslint/ban-types
  O extends object = {},
> extends Omit<RequestInit, "body"> {
  method?: O extends { method: infer M } ? M : RequestInit["method"];
  baseURL?: string;
  body?: O extends { body: infer B }
    ? B
    : RequestInit["body"] | Record<string, any>;
  ignoreResponseError?: boolean;
  params?: O extends { params: infer P } ? P : Record<string, any>;
  query?: O extends { query: infer Q } ? Q : Record<string, any>;
  parseResponse?: (responseText: string) => any;
  responseType?: R;

  /**
   * @experimental Set to "half" to enable duplex streaming.
   * Will be automatically set to "half" when using a ReadableStream as body.
   * https://fetch.spec.whatwg.org/#enumdef-requestduplex
   */
  duplex?: "half" | undefined;

  /** timeout in milliseconds */
  timeout?: number;

  retry?: number | false;
  /** Delay between retries in milliseconds. */
  retryDelay?: number;
  /** Default is [408, 409, 425, 429, 500, 502, 503, 504] */
  retryStatusCodes?: number[];

  onRequest?(context: FetchContext<any, R, O>): Promise<void> | void;
  onRequestError?(
    context: FetchContext<any, R, O> & { error: Error }
  ): Promise<void> | void;
  onResponse?(
    context: FetchContext<any, R, O> & { response: FetchResponse<R> }
  ): Promise<void> | void;
  onResponseError?(
    context: FetchContext<any, R, O> & { response: FetchResponse<R> }
  ): Promise<void> | void;
}

export interface CreateFetchOptions {
  // eslint-disable-next-line no-use-before-define
  defaults?: FetchOptions;
  fetch?: Fetch;
  Headers?: typeof Headers;
  AbortController?: typeof AbortController;
}

export type GlobalOptions = Pick<
  FetchOptions,
  "timeout" | "retry" | "retryDelay"
>;

// --------------------------
// Response Types
// --------------------------

export interface ResponseMap {
  blob: Blob;
  text: string;
  arrayBuffer: ArrayBuffer;
  stream: ReadableStream<Uint8Array>;
}

export type ResponseType = keyof ResponseMap | "json";

export type MappedResponseType<
  R extends ResponseType,
  JsonType = any,
> = R extends keyof ResponseMap ? ResponseMap[R] : JsonType;

export interface FetchResponse<T> extends Response {
  _data?: T;
}

// --------------------------
// Error
// --------------------------

export interface IFetchError<T = any> extends Error {
  request?: FetchRequest;
  options?: FetchOptions;
  response?: FetchResponse<T>;
  data?: T;
  status?: number;
  statusText?: string;
  statusCode?: number;
  statusMessage?: string;
}

// --------------------------
// Other types
// --------------------------

export type Fetch = typeof globalThis.fetch;

export type FetchRequest = RequestInfo;

export interface SearchParameters {
  [key: string]: any;
}

export type HTTPMethod =
  | "GET"
  | "HEAD"
  | "PATCH"
  | "POST"
  | "PUT"
  | "DELETE"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE";

export type RouterMethod = Lowercase<HTTPMethod>;

// An interface to extend in a local project
export type TypedInternalResponse<
  Route,
  Default = unknown,
  Method extends RouterMethod = RouterMethod,
> = Default extends string | boolean | number | null | void | object
  ? // Allow user overrides
    Default
  : Route extends string
    ? MiddlewareOf<Route, Method> extends never
      ? MiddlewareOf<Route, "default"> extends never
        ? // Bail if only types are Error or void (for example, from middleware)
          Default
        : MiddlewareOf<Route, "default"> extends { response: infer T }
          ? T
          : Default
      : MiddlewareOf<Route, Method> extends { response: infer T }
        ? T
        : Default
    : Default;

export type TypedInternalQuery<
  Route,
  Default = unknown,
  Method extends RouterMethod = RouterMethod,
> = Route extends string
  ? MiddlewareOf<Route, Method> extends undefined
    ? MiddlewareOf<Route, "default"> extends undefined
      ? // Bail if only types are Error or void (for example, from middleware)
        Default
      : MiddlewareOf<Route, "default"> extends { request: { query: infer T } }
        ? T
        : Default
    : MiddlewareOf<Route, Method> extends { request: { query: infer T } }
      ? T
      : Default
  : Default;

export type TypedInternalBody<
  Route,
  Default = unknown,
  Method extends RouterMethod = RouterMethod,
> = Route extends string
  ? MiddlewareOf<Route, Method> extends undefined
    ? MiddlewareOf<Route, "default"> extends undefined
      ? // Bail if only types are Error or void (for example, from middleware)
        Default
      : MiddlewareOf<Route, "default"> extends { request: { body: infer T } }
        ? T
        : Default
    : MiddlewareOf<Route, Method> extends { request: { body: infer T } }
      ? T
      : Default
  : Default;

export type TypedInternalParams<
  Route,
  Default = unknown,
  Method extends RouterMethod = RouterMethod,
> = Route extends string
  ? MiddlewareOf<Route, Method> extends undefined
    ? MiddlewareOf<Route, "default"> extends undefined
      ? // Bail if only types are Error or void (for example, from middleware)
        Default
      : MiddlewareOf<Route, "default"> extends { request: { params: infer T } }
        ? T
        : Default
    : MiddlewareOf<Route, Method> extends { request: { params: infer T } }
      ? T
      : Default
  : Default;

// Extracts the available http methods based on the route.
// Defaults to all methods if there aren't any methods available or if there is a catch-all route.
export type AvailableRouterMethod<R extends ExtendedFetchRequest> =
  R extends string
    ? keyof InternalApi[MatchedRoutes<R>] extends undefined
      ? RouterMethod
      : Extract<
            keyof InternalApi[MatchedRoutes<R>],
            "default"
          > extends undefined
        ? Extract<RouterMethod, keyof InternalApi[MatchedRoutes<R>]>
        : RouterMethod
    : RouterMethod;

// Argumented fetch options to include the correct request methods.
// This overrides the default, which is only narrowed to a string.
// export interface ExtendedFetchOptions<
//   R extends ExtendedFetchRequest,
//   M extends AvailableRouterMethod<R> = AvailableRouterMethod<R>,
// > extends FetchOptions {
//   method?: Uppercase<M> | M;
// }

// Extract the route method from options which might be undefined or without a method parameter.
export type ExtractedRouteMethod<R extends ExtendedFetchRequest> =
  R extends keyof InternalApi
    ? keyof InternalApi[R] extends RouterMethod
      ? keyof InternalApi[R]
      : keyof InternalApi[R] extends "default"
        ? RouterMethod
        : "get"
    : RouterMethod;

type MatchResult<
  Key extends string,
  Exact extends boolean = false,
  Score extends any[] = [],
  catchAll extends boolean = false,
> = {
  [k in Key]: { key: k; exact: Exact; score: Score; catchAll: catchAll };
}[Key];

type Subtract<
  Minuend extends any[] = [],
  Subtrahend extends any[] = [],
> = Minuend extends [...Subtrahend, ...infer Remainder] ? Remainder : never;

type TupleIfDiff<
  First extends string,
  Second extends string,
  Tuple extends any[] = [],
> = First extends `${Second}${infer Diff}`
  ? Diff extends ""
    ? []
    : Tuple
  : [];

type MaxTuple<N extends any[] = [], T extends any[] = []> = {
  current: T;
  result: MaxTuple<N, ["", ...T]>;
}[[N["length"]] extends [Partial<T>["length"]] ? "current" : "result"];

type CalcMatchScore<
  Key extends string,
  Route extends string,
  Score extends any[] = [],
  Init extends boolean = false,
  FirstKeySegMatcher extends string = Init extends true ? ":Invalid:" : "",
> = `${Key}/` extends `${infer KeySeg}/${infer KeyRest}`
  ? KeySeg extends FirstKeySegMatcher // return score if `KeySeg` is empty string (except first pass)
    ? Subtract<
        [...Score, ...TupleIfDiff<Route, Key, ["", ""]>],
        TupleIfDiff<Key, Route, ["", ""]>
      >
    : `${Route}/` extends `${infer RouteSeg}/${infer RouteRest}`
      ? `${RouteSeg}?` extends `${infer RouteSegWithoutQuery}?${string}`
        ? RouteSegWithoutQuery extends KeySeg
          ? CalcMatchScore<KeyRest, RouteRest, [...Score, "", ""]> // exact match
          : KeySeg extends `:${string}`
            ? RouteSegWithoutQuery extends ""
              ? never
              : CalcMatchScore<KeyRest, RouteRest, [...Score, ""]> // param match
            : KeySeg extends RouteSegWithoutQuery
              ? CalcMatchScore<KeyRest, RouteRest, [...Score, ""]> // match by ${string}
              : never
        : never
      : never
  : never;

type _MatchedRoutes<
  Route extends string,
  MatchedResultUnion extends MatchResult<string> = MatchResult<
    keyof InternalApi
  >,
> = MatchedResultUnion["key"] extends infer MatchedKeys // spread union type
  ? MatchedKeys extends string
    ? Route extends MatchedKeys
      ? MatchResult<MatchedKeys, true> // exact match
      : MatchedKeys extends `${infer Root}/**${string}`
        ? MatchedKeys extends `${string}/**`
          ? Route extends `${Root}/${string}`
            ? MatchResult<MatchedKeys, false, [], true>
            : never // catchAll match
          : MatchResult<
              MatchedKeys,
              false,
              CalcMatchScore<Root, Route, [], true>
            > // glob match
        : MatchResult<
            MatchedKeys,
            false,
            CalcMatchScore<MatchedKeys, Route, [], true>
          > // partial match
    : never
  : never;

export type MatchedRoutes<
  Route extends string,
  MatchedKeysResult extends MatchResult<string> = MatchResult<
    keyof InternalApi
  >,
  Matches extends MatchResult<string> = _MatchedRoutes<
    Route,
    MatchedKeysResult
  >,
> = Route extends "/"
  ? keyof InternalApi // root middleware
  : Extract<Matches, { exact: true }> extends never
    ?
        | Extract<
            Exclude<Matches, { score: never }>,
            { score: MaxTuple<Matches["score"]> }
          >["key"]
        | Extract<Matches, { catchAll: true }>["key"] // partial, glob and catchAll matches
    : Extract<Matches, { exact: true }>["key"]; // exact matches

export type KebabCase<
  T extends string,
  A extends string = "",
> = T extends `${infer F}${infer R}`
  ? KebabCase<R, `${A}${F extends Lowercase<F> ? "" : "-"}${Lowercase<F>}`>
  : A;

export type MiddlewareOf<
  Route extends string,
  Method extends RouterMethod | "default",
> = Method extends keyof InternalApi[MatchedRoutes<Route>]
  ? Exclude<InternalApi[MatchedRoutes<Route>][Method], Error | void>
  : never;
