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
  AddedLocation = "addedLocation",
  SelectedBuilderLocation = "selectedBuilderLocation",
  UpdatedLocationIsRenaming = "updatedLocationIsRenaming",
  UpdatedLocationIsOpen = "updatedLocationIsOpen",
  UpdatedLocationIsAdding = "updatedLocationIsAdding",
  ReorderedSublocations = "reorderedSublocations",
  RenamedLocation = "renamedLocation",
  DeletedLocation = "deletedLocation",
  SelectedTakerLocation = "selectedTakerLocation",
  IncrementedTakerLocation = "incrementedTakerLocation",
}
