import React from "react";
import { motion } from "framer-motion";
type Props = {
  children: any;
};

const FadeUp = (props: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 100 }}
      transition={{ ease: "easeOut", duration: 0.3 }}
      exit={{ opacity: 0 }}
    >
      {props.children}
    </motion.div>
  );
};

export default FadeUp;
