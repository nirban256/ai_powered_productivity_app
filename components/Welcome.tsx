"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface WelcomeAnimationProps {
    text: string;
}

const WelcomeAnimation = ({ text }: WelcomeAnimationProps) => {
    return (
        <motion.div
            className="flex flex-col items-center justify-center h-screen bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >
            <motion.h1
                className="text-4xl font-bold text-primary mb-4"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {text}
            </motion.h1>
            <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
        </motion.div>
    );
};

export default WelcomeAnimation;
