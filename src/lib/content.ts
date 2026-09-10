import { queryOptions, useQuery } from "@tanstack/react-query";
import { getPublicContent, type PublicContent } from "./public-content.functions";
import { siteSettings as fallbackSettings } from "./site-content";
import type { SiteSettings } from "./types";

export const publicContentQuery = queryOptions({
  queryKey: ["public-content"],
  queryFn: () => getPublicContent(),
  staleTime: 30_000,
});

export const emptyContent: PublicContent = {
  settings: null,
  categories: [],
  items: [],
  gallery: [],
  events: [],
  offers: [],
  faqs: [],
};

/** Live cafe details, falling back to the values the cafe supplied originally. */
export function useSiteSettings(): SiteSettings {
  const { data } = useQuery(publicContentQuery);
  return data?.settings ?? fallbackSettings;
}
