import { searchCatalog } from "@/services/organizer";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useCatalogSearch(query: string) {
  return useQuery({
    queryKey: ['catalog', query],
    queryFn: () => searchCatalog(query),
    enabled: query.trim().length >= 2,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  })
}