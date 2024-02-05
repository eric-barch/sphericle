import { AreaSearch, useAreaSearch } from "./use-area-search.hook";
import { PointSearch, usePointSearch } from "./use-point-search.hook";

function useFeatureSearches(parentFeatureId: string): {
  areaSearch: AreaSearch;
  pointSearch: PointSearch;
} {
  const areaSearch = useAreaSearch(parentFeatureId);
  const pointSearch = usePointSearch(parentFeatureId);
  return { areaSearch, pointSearch };
}

export { useFeatureSearches };
