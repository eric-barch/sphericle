export enum LocationType {
  Quiz = "Quiz",
  Area = "Area",
  Point = "Point",
}

export enum SearchStatus {
  Searching = "Searching",
  Searched = "Searched",
}

export enum QuizDispatchType {
  Added = "added",
  Selected = "selected",
  SetIsRenaming = "setIsRenaming",
  SetIsOpen = "setIsOpen",
  SetIsAdding = "setIsAdding",
  ReorderedSublocations = "reorderedSublocations",
  Renamed = "renamed",
  Deleted = "deleted",
}
