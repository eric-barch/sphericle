export enum FeatureType {
  ROOT = "ROOT",
  AREA = "AREA",
  POINT = "POINT",
}

export enum AllFeaturesDispatchType {
  ADD_SUBFEATURE,
  SET_SUBFEATURES,
  RENAME,
  DELETE,
}

export enum QuizBuilderStateDispatchType {
  SET_FEATURE_ADDER_SELECTED,
  SET_SELECTED,
  SET_IS_OPEN,
  SET_IS_ADDING,
  SET_IS_RENAMING,
}

export enum QuizTakerStateDispatchType {
  RESET,
  MARK_CORRECT,
  MARK_INCORRECT,
}

export enum SearchStatus {
  SEARCHING,
  SEARCHED,
}

export enum DisplayMode {
  QUIZ_BUILDER,
  QUIZ_TAKER,
}
