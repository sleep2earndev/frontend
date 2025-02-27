import FadeWrapper from "@/components/animation/fade";
import ChooseCategory from "@/pages/play/sleep/components/ChooseCategory";
import {
  useSleep,
} from "@/hooks/sleep-provider";
import ConfirmSleep from "@/pages/play/sleep/components/ConfirmSleep";
import Sleep from "@/pages/play/sleep/components/Sleep";
import SuccessClaim from "@/pages/play/sleep/components/SuccessClaim";
import FailedClaim from "@/pages/play/sleep/components/FailedClaim";

export default function SleepPage() {
  return (
    <FadeWrapper className="p-4 flex-1 flex flex-col">
      <StepComponent />
    </FadeWrapper>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StepComponent({ ...props }: { [k: string]: any }) {
  const { step } = useSleep();
  switch (step) {
    case "choose-category":
      return <ChooseCategory {...props} />;
    case "confirm":
      return <ConfirmSleep {...props} />;
    case "sleep":
      return <Sleep {...props} />;
    case "success":
      return <SuccessClaim {...props} />
      case "failed":
      return <FailedClaim {...props} />
    default:
      return <ChooseCategory {...props} />;
  }
}
