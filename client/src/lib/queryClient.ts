import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

<<<<<<< HEAD
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
=======
// Unified apiRequest function for both queries and mutations
export async function apiRequest(url: string, options?: RequestInit): Promise<any> {
  const res = await fetch(url, {
    credentials: "include",
    ...options,
  });

  await throwIfResNotOk(res);
  return await res.json();
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
<<<<<<< HEAD
    const res = await fetch(queryKey.join("/") as string, {
=======
    const res = await fetch(queryKey[0] as string, {
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
<<<<<<< HEAD
});
=======
});
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
