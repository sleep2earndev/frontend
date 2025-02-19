import * as motion from "motion/react-client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function FadeWrapper({ children, ...props }: { children: React.ReactNode, [key: string]: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
