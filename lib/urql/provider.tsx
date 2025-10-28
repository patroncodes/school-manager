"use client";

import { Provider } from "urql";
import { createUrqlClient } from "@/lib/urql/client";
import { ReactNode, useMemo } from "react";

export function UrqlProvider({
  children,
  urqlState,
}: {
  children: ReactNode;
  urqlState?: any;
}) {
  const { client } = useMemo(() => {
    const initialState =
      urqlState ??
      (typeof window !== "undefined"
        ? JSON.parse(document.getElementById("urql-data")?.textContent || "{}")
        : undefined);

    return createUrqlClient(undefined, initialState);
  }, [urqlState]);

  return <Provider value={client}>{children}</Provider>;
}
