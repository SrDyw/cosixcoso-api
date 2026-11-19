export default function BgDecoration({ children }: { children: React.ReactNode }) {
    return <div className="absolute top-0 left-0 size-full  ">
        {children}
    </div>
}