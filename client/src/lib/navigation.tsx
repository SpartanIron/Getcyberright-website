"use client";

import NextLink from "next/link";
import {
  usePathname,
  useParams as useNextParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { forwardRef, useCallback, useMemo } from "react";

type LinkProps = Omit<React.ComponentProps<typeof NextLink>, "href"> & {
  href?: string;
  to?: string;
};

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, href, ...props },
  ref,
) {
  return <NextLink ref={ref} href={to || href || "/"} {...props} />;
});

function useLocation(): [string, (to: string, options?: { replace?: boolean }) => void] {
  const pathname = usePathname();
  const router = useRouter();
  const navigate = useCallback(
    (to: string, options?: { replace?: boolean }) => {
      if (options?.replace) {
        router.replace(to);
      } else {
        router.push(to);
      }
    },
    [router],
  );
  return [pathname, navigate];
}

function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  const params = useNextParams();
  return (params || {}) as T;
}

function useSearch(): string {
  const searchParams = useSearchParams();
  const str = searchParams?.toString() || "";
  return str ? `?${str}` : "";
}

function useRoute(
  pattern: string,
): [boolean, Record<string, string> | null] {
  const pathname = usePathname();

  return useMemo(() => {
    const regexStr = pattern.replace(/:([^/]+)/g, "(?<$1>[^/]+)");
    const regex = new RegExp(`^${regexStr}$`);
    const match = pathname.match(regex);
    if (match) {
      return [true, (match.groups || {}) as Record<string, string>];
    }
    return [false, null];
  }, [pattern, pathname]);
}

export { Link, useLocation, useParams, useSearch, useRoute };
