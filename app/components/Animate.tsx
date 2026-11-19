import { AnimateProps } from '@/types/animation/types'
import { motion } from 'framer-motion'

export default function Animate({ children, props }: AnimateProps) {
    return <motion.div>
        {children}
    </motion.div>
}