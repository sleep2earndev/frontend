import FadeWrapper from "@/components/animation/fade";
import ChooseCategory from "@/pages/play/sleep/components/ChooseCategory";
import { useSleep } from "@/hooks/sleep-provider";
// import ConfirmSleep from "@/pages/play/sleep/components/ConfirmSleep";
import FailedClaim from "@/pages/play/sleep/components/FailedClaim";
import NewConfirmSleep from "@/pages/play/sleep/components/NewConfirmSleep";
import NewSleep from "@/pages/play/sleep/components/NewSleep";
import NewSuccessClaim from "@/pages/play/sleep/components/NewSuccessClaim";
import ChatWithAi from "@/pages/play/sleep/components/ChatWithAi";

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
      return <NewConfirmSleep {...props} />;
    case "sleep":
      return <NewSleep {...props} />;
    case "success":
      return <NewSuccessClaim {...props} />;
    case "failed":
      return <FailedClaim {...props} />;

    case "chat-ai":
      return <ChatWithAi {...props} />;
    default:
      return <ChooseCategory {...props} />;
  }
}
