export default function Chip({ text }: { text: string }) {
    return <div className="absolute -bottom-8 left-[50%] translate-x-[-50%] p-4 py-1 bg-white rounded-4xl text-nowrap">
        {text}
    </div>
}