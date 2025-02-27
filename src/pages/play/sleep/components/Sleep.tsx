import FadeWrapper from "@/components/animation/fade";
import { Card, CardContent } from "@/components/ui/card";
import Swipe from "@/components/ui/swipe";
// import { motion } from "motion/react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import abi from "@/abi/sleepnft.json";
import { useEffect, useMemo } from "react";
import { useLoading } from "@/components/loading-provider";
import { toast } from "sonner";
import { useProfile } from "@/hooks/account-provider";
import { NftData } from "@/components/ui/card-nft";
import { Badge } from "@/components/ui/badge";
import { SLEEP_DATA, useSleep } from "../hooks/sleep-provider";

export default function Sleep() {
  const { setLoading } = useLoading();
  const { address } = useAccount();
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const { profile } = useProfile();
  const { data } = useSleep();

  const selectedNFT = useMemo<NftData | null>(() => {
    const selected = localStorage.getItem("nft-selected");
    if (selected) {
      const data = JSON.parse(selected);
      return data as NftData;
    }

    return null;
  }, []);

  function handleClaim() {
    writeContract({
      abi,
      address: import.meta.env.VITE_ADDRESS_NFT,
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
              Happy Sleep,{" "}
              {profile?.extractedParameters?.fullName?.split(" ")?.[0]}!
            </h2>
          </FadeWrapper>
          <FadeWrapper delay={0.4}>
            <h2 className="text-6xl font-bold text-center">{currentTime}</h2>
          </FadeWrapper>
          <FadeWrapper delay={0.4}>
            <div className="flex justify-center">
              <Badge variant="outline" className="border-white rounded-md">
                {SLEEP_DATA?.[data.category as keyof typeof SLEEP_DATA]}
              </Badge>
            </div>
          </FadeWrapper>
          <FadeWrapper delay={0.5}>
            <Card className="border-2 border-white bg-primary">
              <CardContent>
                <div className="pt-6">
                  <div className="flex justify-center items-center flex-col gap-2">
                    <img src={selectedNFT?.media?.[0]?.gateway} />
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
