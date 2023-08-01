import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import ProfileCard from "@/components/ProfileCard";
import { decodeJson } from "@/lib/skin-processor";

const CreatePage = () => {
    const router = useRouter()
    const [skin, setSkin] = useState<string | null>(null)
    const [info, setInfo] = useState<{
        name: string;
        author: string;
        content: string;
    } | null>(null)

    useEffect(() => {
        const skinData = router.query.skin_data as string
        if (!skinData) {
            router.push('/')
            return
        }
        const skin = atob(skinData)
        setSkin(skin)
        decodeJson(skin).then((info) => {
            setInfo(info)
        })
    }, [])

    return <>
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            {info && <ProfileCard skin={skin!} name={info.name} author={info.author} content={info.content} />}
        </main>
    </>
}

export default CreatePage