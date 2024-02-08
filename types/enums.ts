export enum FeatureType {
  ROOT = "ROOT",
  AREA = "AREA",
  POINT = "POINT",
}

export enum AllFeaturesDispatchType {
  ADD_CHILD,
  SET_CHILDREN,
  RENAME,
  DELETE,
}

export enum QuizBuilderDispatchType {
  SET_FEATURE_ADDER,
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
