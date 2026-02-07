'use client';
import { motion } from 'framer-motion';

export const MotionDiv = motion.div;
export const MotionMain = motion.main;
export const MotionSection = motion.section;

export const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
};

export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};
