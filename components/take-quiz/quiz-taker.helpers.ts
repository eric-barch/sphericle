import { isParent } from "@/helpers";
import { QuizState } from "@/types";

const getNewQuizSequence = (rootId: string, quiz: QuizState): Set<string> => {
  const quizSequence = new Set<string>();

  const addImmediateChildren = (featureId: string) => {
    const feature = quiz.get(featureId);

    if (feature && isParent(feature)) {
      const childIds = [...feature.childIds];

      /**Fisher-Yates shuffle */
      for (let i = childIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [childIds[i], childIds[j]] = [childIds[j], childIds[i]];
      }

      childIds.forEach((subfeatureId) => {
        quizSequence.add(subfeatureId);
      });

      childIds.forEach((subfeatureId) => {
        addImmediateChildren(subfeatureId);
      });
    }
  };

  addImmediateChildren(rootId);

  return quizSequence;
};

export { getNewQuizSequence };
