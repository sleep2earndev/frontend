import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavLink } from "react-router";
import { motion } from "motion/react";
import { useProfile } from "@/hooks/account-provider";
import IconEthereum from "@/components/icon/ethereum";
import { useAccount, useBalance } from "wagmi";
import { useMemo } from "react";

export default function ProfileBar() {
  const { profile } = useProfile();
  const { address } = useAccount()

  const { data, isLoading } = useBalance({
    address: address,
  })

  const balance = useMemo(() => {
    const formatted = Number(data?.value) / 10 ** (data?.decimals || 0);

    const displayValue = formatted.toFixed(4);
    return displayValue
  }, [data])

  return (
    <motion.div
      initial={{ y: -200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      exit={{ y: -200, opacity: 0, transition: { duration: 0.5 } }}
      className={cn("sticky top-0 flex items-center p-4 justify-between bg-background/30 z-10 backdrop-blur-sm")}
    >
      <Avatar>
        <AvatarImage src={profile?.extractedParameters?.avatar} />
        <AvatarFallback>{profile?.extractedParameters?.displayName?.[0]}</AvatarFallback>
      </Avatar>
      <NavLink
        to={"/play/wallet"}
        className={cn("bg-white p-1 rounded-full text-background text-xs flex items-center", {
          'opacity-60': !address
        })}
        role="button"
      >
        {address ? <span className="px-1">{isLoading ? "..." : balance}</span> : <span className="px-1">Connect Now</span>}
        <div className="bg-white rounded-full p-1 border border-background">
          <IconEthereum className="w-4 h-4" />
        </div>
      </NavLink>
    </motion.div>
  );
}

