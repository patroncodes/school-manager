import {
  cacheExchange,
  createClient,
  fetchExchange,
  ssrExchange,
} from "@urql/core";

export function createUrqlClient(req?: Request, initialState?: any) {
  const isServerSide = typeof window === "undefined";

  const ssr = ssrExchange({
    isClient: !isServerSide,
    initialState: initialState ?? undefined,
  });

  const client = createClient({
    url: isServerSide
      ? process.env.NEXT_PUBLIC_BASE_URL + "/api/graphql"
      : "/api/graphql",

    exchanges: [cacheExchange, ssr, fetchExchange],

    requestPolicy: "cache-first",

    preferGetMethod: false,
    fetchOptions: () => {
      if (isServerSide && req) {
        return {
          credentials: "include",
          headers: {
            cookie: req.headers.get("cookie") ?? "",
          },
        };
      }

      return {
        credentials: "include",
      };
    },
  });

  return {
    client,
    ssr,
  };
}
