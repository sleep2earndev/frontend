import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Button } from "./button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function BackBar() {
    const navigate = useNavigate()
  return (
    <motion.div
      initial={{ y: -200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      exit={{ y: -200, opacity: 0, transition: { duration: 0.5 } }}
      className={cn("sticky top-0 flex items-center p-4 justify-between")}>
      <Button variant="secondary" className="text-white" size={'icon'} onClick={() => {navigate(-1)}}>
        <ChevronLeft size={24} />
      </Button>
    </motion.div>
  );
}
