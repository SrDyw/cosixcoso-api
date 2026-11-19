import { PictureProps } from "@/types/ui/types";
import { motion } from 'framer-motion'

export default function SimplePicture({ size = 32, url, className }: PictureProps) {
    return <picture className={`bg-white rounded-2xl overflow-hidden shadow-2xl relative ${className}`}>
        <img src={url} className="rounded-2xl object-cover w-full" alt="" />
    </picture>
}