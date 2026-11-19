import SimplePicture from "./SimplePicture";

export default function Photographia({ size, children, url, date }: { size: number, children: React.ReactNode, url: string, date?: string }) {
    return <div className="flex flex-col p-8 bg-white shadow rounded-md">
        <SimplePicture size={size} url={url} />
        {children}
        {date && <span className="shadow-2xl absolute right-4 -bottom-4 p-4 py-2 bg-[#dfcaea] rounded-4xl font-extralight text-white">
            {date}
        </span>}
    </div>
}