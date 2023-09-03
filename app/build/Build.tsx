import Root from "@/components/QuizBuilder/Root";
import { LocationStateTreeNode as LocationState } from "@/components/QuizBuilder/Location";

export default function Build() {
  const children = new Array<LocationState>();

  return (
    <div className="p-3">
      <Root state={{ children }} />
    </div>
  );
}
