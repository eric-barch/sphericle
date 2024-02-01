import useAreaSearch, { AreaSearch } from "./use-area-search.hook";
import usePointSearch, { PointSearch } from "./use-point-search.hook";

export default function useFeatureSearches(parentFeatureId: string): {
  areaSearch: AreaSearch;
  pointSearch: PointSearch;
} {
  const areaSearch = useAreaSearch(parentFeatureId);
  const pointSearch = usePointSearch(parentFeatureId);
  return { areaSearch, pointSearch };
}
