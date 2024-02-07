import { isParentFeatureState } from "@/helpers/state.helpers";
import { AllFeatures } from "@/types";

function resetRemainingFeatureIds(
  rootId: string,
  allFeatures: AllFeatures,
): Set<string> {
  const remainingFeatureIds = new Set<string>();

  function addDirectChildren(featureId: string) {
    const featureState = allFeatures.get(featureId);

    if (featureState && isParentFeatureState(featureState)) {
      const shuffledSubfeatureIds = [...featureState.subfeatureIds];

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
  }

  addDirectChildren(rootId);

  return remainingFeatureIds;
}

export { resetRemainingFeatureIds };
