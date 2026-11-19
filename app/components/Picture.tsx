import { PictureProps } from "@/types/ui/types";
import { motion } from 'framer-motion'

export default function Picture({ size = 32, url, children, animation }: PictureProps) {
    return <motion.div
        initial={{ scale: 0.5, rotateZ: animation?.initialRotation }}
        animate={{ scale: 1, rotateZ: animation?.targetRotation }}
        style={{ height: size + "px", width: size + "px" }}
        className="relative">
        <picture className={` bg-white rounded-2xl overflow-hidden shadow-2xl relative`}>
            <img src={url} className="rounded-2xl object-cover w-full" alt="" />
        </picture>
        {children}
    </motion.div>
}