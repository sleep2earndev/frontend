import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import IconWallet from "../icon/wallet";
import { NavLink } from "react-router";

export default function ProfileBar() {
  return (
    <div className={cn("sticky top-0 flex items-center p-4 justify-between")}>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <NavLink to={'/play/wallet'} className="bg-white p-1 rounded-full text-background text-xs flex items-center" role="button">
        <span className="px-1">1000</span>
        <div className="bg-background rounded-full p-1">
          <IconWallet className="text-white w-4 h-4"/>
        </div>
      </NavLink>
    </div>
  );
}
