import { isParent } from "@/helpers";
import { QuizState } from "@/types";

const resetRemainingFeatureIds = (
  rootId: string,
  allFeatures: QuizState,
): Set<string> => {
  const remainingFeatureIds = new Set<string>();

  const addDirectChildren = (featureId: string) => {
    const featureState = allFeatures.get(featureId);

    if (featureState && isParent(featureState)) {
      const shuffledSubfeatureIds = [...featureState.childIds];

      // Fisher-Yates shuffle for randomness
      for (let i = shuffledSubfeatureIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledSubfeatureIds[i], shuffledSubfeatureIds[j]] = [
          shuffledSubfeatureIds[j],
          shuffledSubfeatureIds[i],
        ];
      }

      shuffledSubfeatureIds.forEach((subfeatureId) => {
        remainingFeatureIds.add(subfeatureId);
      });

      shuffledSubfeatureIds.forEach((subfeatureId) => {
        addDirectChildren(subfeatureId);
      });
    }
  };

  addDirectChildren(rootId);

  return remainingFeatureIds;
};

export { resetRemainingFeatureIds };
