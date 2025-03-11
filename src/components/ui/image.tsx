import React, { useState } from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

interface CustomImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export default function Image({
  src,
  fallback = "/placeholder.svg",
  ...props
}: CustomImageProps) {
  const [loadingImage, setLoadingImage] = useState(true);
  return (
    <div className="relative inline-block w-full h-full">
      <img
        src={src || fallback}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = fallback;
        }}
        onLoad={() => setLoadingImage(false)}
        {...props}
      />
      {loadingImage && (
        <motion.div
          className="w-full flex flex-col items-center justify-center absolute inset-0 mx-auto"
          exit={{ opacity: 0 }}
        >
          <Loader2 className="animate-spin" />
        </motion.div>
      )}
    </div>
  );
}
