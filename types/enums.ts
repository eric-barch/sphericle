export enum FeatureType {
  EARTH = "EARTH",
  AREA = "AREA",
  POINT = "POINT",
}

export enum QuizDispatchType {
  ADD_CHILD,
  SET_CHILDREN,
  RENAME,
  DELETE,
}

export enum QuizBuilderDispatchType {
  SET_SEARCH_OPTION,
  SET_SELECTED,
  SET_RENAMING,
  SET_ADDING,
  SET_IS_OPEN,
}

export enum QuizTakerDispatchType {
  RESET,
  MARK_CORRECT,
  MARK_INCORRECT,
}

export enum SearchStatus {
  INITIALIZED,
  SEARCHING,
  SEARCHED,
}
