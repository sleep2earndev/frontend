import FadeWrapper from "@/components/animation/fade";
import { Card, CardContent } from "@/components/ui/card";
import Swipe, { SwipeRef } from "@/components/ui/swipe";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import abi from "@/abi/claim.json";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLoading } from "@/components/loading-provider";
import { useProfile } from "@/hooks/account-provider";
import { NftData } from "@/components/ui/card-nft";
import { Badge } from "@/components/ui/badge";
import { SLEEP_DATA, useSleep } from "@/hooks/sleep-provider";
import useLeaveConfirmation from "@/hooks/use-leave-confirmation";
import useCurrentTime from "@/hooks/use-current-time";
import { useMutation } from "@tanstack/react-query";
import { claimEarn } from "@/api/user";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { getCurrentDate } from "@/lib/utils";


export default function Sleep() {
  const { setLoading } = useLoading();
  const { profile } = useProfile();
  const { data, setData, setStep } = useSleep();

  const currentTime = useCurrentTime()

  useLeaveConfirmation({
    isBlocked: true
  })


  const swipeRef = useRef<SwipeRef>(null)
  const [openNotifWallet, setOpenNotifWallet] = useState(false)

  const { writeContract, data: hash } = useWriteContract({
    mutation: {
      onError(error) {
        console.log('[ERROR WALLET]: ', error)
        toast.error("The transaction has been canceled.")
        swipeRef.current?.reset?.()
        setLoading(false);
      },
      onSuccess() {
        setOpenNotifWallet(false)
      },
    }
  });
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
    retryCount: 0,
    query: {
      retryOnMount: false,
    },

  });

  const selectedNFT = useMemo<NftData | null>(() => {
    const selected = localStorage.getItem("nft-selected");
    if (selected) {
      const data = JSON.parse(selected);
      return data as NftData;
    }

    return null;
  }, []);

  const { mutateAsync } = useMutation({
    retry: false,
    mutationFn: claimEarn,
    onSuccess(data) {
      if (!data.success || !data.earn) {
        setLoading(false)
        setStep('failed')
        return
      }
      setOpenNotifWallet(true)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const extractedParameters = JSON.parse(data.sleep.claimInfo.context) as { extractedParameters: { duration: number, [k: string]: any } }
      setData({
        earning: data.earn,
        duration: extractedParameters.extractedParameters.duration,
      })

      claimReward(data.earn)
    },
    onError(error) {
      console.warn(error)
      toast.error('Get earning data failed, please try again')
      swipeRef.current?.reset?.()
      setLoading(false)
    }
  })

  // function ethToWei(eth: number) {
  //   return BigInt(Math.floor(eth * 10 ** 18));
  // }

  function claimReward(weiAmount: number) {
    // const weiAmount = ethToWei(amount)

    writeContract({
      abi,
      address: import.meta.env.VITE_ADDRESS_CLAIM,
      functionName: "claimReward",
      args: [weiAmount],
    });
  }

  function retryClaim() {
    if (data.earning === 0) {
      toast.warning('There is no reward remaining for you to claim.')
      return
    }
    claimReward(data.earning as number)
  }

  async function handleClaim() {
    setLoading(true)
    const endDate = getCurrentDate()
    await mutateAsync({
      startDate: data.startTime,
      endDate: endDate
    })
    setData({
      endTime: endDate,
    })
  }

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isSuccess) {
      setStep('success')
    }
  }, [isSuccess])



  return (
    <div className="p-6 fixed inset-0 bg-primary">
      <div className="play-layout__container">
        <div className="pt-12 flex flex-col gap-10 relative z-10">
          <Modal open={openNotifWallet} onOpenChange={setOpenNotifWallet} title="Processing Transaction, Please Wait">
            <p>Make sure to accept the transaction in your wallet to get your reward. If you have dismissed the confirmation popup, you can always reclaim your reward by clicking the 'Retry Claim Reward' button.</p>
            <Button className="w-full mt-8" onClick={retryClaim}>Retry Claim Reward</Button>
          </Modal>
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
            <Swipe ref={swipeRef} className="flex-1" onSwipe={handleClaim}>
              Swipe to Wake Up!
            </Swipe>
          </FadeWrapper>
        </div>
      </div>
    </div>
  );
}
