import FadeWrapper from "@/components/animation/fade";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Swipe from "@/components/ui/swipe";
// import { motion } from "motion/react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import abi from "@/abi/claim.json";
import { useEffect } from "react";
import { useLoading } from "@/components/loading-provider";
import { toast } from "sonner";

// import { useAccount } from '@wagmi'

export default function Sleep() {
  const { setLoading } = useLoading();
  const { address } = useAccount();
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  function handleClaim() {
    writeContract({
      abi,
      address: import.meta.env.VITE_ADDRESS_CONTRACT,
      functionName: "rewardUser",
      args: [address, 1],
    });
  }

  useEffect(() => {
    if (isSuccess) toast.success("Success claim reward");
  }, [isSuccess]);

  const currentTime = "00:00";

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isLoading]);

  return (
    <div className="p-6 fixed inset-0 bg-primary">
      <div className="play-layout__container">
        <div className="pt-12 flex flex-col gap-10 relative z-10">
          <FadeWrapper delay={0.3}>
            <h2 className="text-2xl font-bold text-center">
              Good Night, Mori!
            </h2>
          </FadeWrapper>
          <FadeWrapper delay={0.4}>
            <h2 className="text-6xl font-bold text-center">{currentTime}</h2>
          </FadeWrapper>
          <FadeWrapper delay={0.4}>
            <div className="flex justify-center">
              <Badge variant="outline" className="border-white rounded-md">
                Earning: +0
              </Badge>
            </div>
          </FadeWrapper>
          <FadeWrapper delay={0.5}>
            <Card className="border-2 border-white bg-primary">
              <CardContent>
                <div className="pt-6">
                  <div className="p-12 flex justify-center items-center flex-col gap-2">
                    <p className="text-white/30">NFT Pillow</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeWrapper>
          <FadeWrapper className="fixed flex justify-center left-6 right-6 bottom-6">
            <Swipe className="flex-1" onSwipe={handleClaim}>
              Swipe to Wake Up!
            </Swipe>
          </FadeWrapper>
        </div>
      </div>
    </div>
  );
}
