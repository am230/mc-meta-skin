"use client";
import FileButton from '@/components/FileButton';
import Create from '../../public/create.svg'
import Read from '../../public/read.svg'
import Title from "@/components/Title";
import { useRouter } from "next/router";
import Author from "@/components/Author";

export default function Home() {
    const router = useRouter()

    return <>
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="flex flex-col items-start md:gap-16 lg:gap-44">
                <Title />
                <div className="flex sm:flex-wrap md:flex-col sm:gap-12 md:gap-40 flex-col lg:flex-row lg:gap-80 items-center">
                    <FileButton label="作る" hint="ドラッグアンドドロップしても作れます。" icon={<Create />} callback={(data) => {
                        if (!data) return
                        router.push(`/create?skin_data=${btoa(data)}`)
                    }} />
                    <FileButton label="読み取る" hint="ドラッグアンドドロップしても読み取れます。" icon={<Read />} callback={(data) => {
                        if (!data) return
                        router.push(`/read?skin_data=${btoa(data)}`)
                    }} />
                </div>
            </div>
            <Author/>
        </main>
    </>
}
