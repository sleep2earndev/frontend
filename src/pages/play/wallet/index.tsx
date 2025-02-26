import FadeWrapper from "@/components/animation/fade";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function WalletPage() {
  return (
    <FadeWrapper className="flex-1 flex">
      <div className="flex-1 flex justify-center items-center">
        <ConnectButton />
      </div>
    </FadeWrapper>
  );
}
