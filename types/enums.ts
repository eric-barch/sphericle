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
  SelectedBuilderLocation = "selectedBuilderLocation",
}

export enum ParentLocationDispatchType {
  AddedSublocation = "addedSublocation",
  UpdatedIsOpen = "updatedIsOpen",
  UpdatedIsAdding = "updatedIsAdding",
}
