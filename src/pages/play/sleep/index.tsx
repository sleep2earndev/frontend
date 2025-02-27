import FadeWrapper from "@/components/animation/fade";
import ChooseCategory from "@/pages/play/sleep/components/ChooseCategory";
import {
  SleepProvider,
  useSleep,
} from "@/pages/play/sleep/hooks/sleep-provider";
import ConfirmSleep from "@/pages/play/sleep/components/ConfirmSleep";
import Sleep from "@/pages/play/sleep/components/Sleep";
export default function SleepPage() {
  return (
    <SleepProvider>
      <FadeWrapper className="p-4 flex-1 flex flex-col">
        <StepComponent />
      </FadeWrapper>
    </SleepProvider>
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
    default:
      return <ChooseCategory {...props} />;
  }
}
