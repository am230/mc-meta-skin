import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { CreateSkinInfoResponse } from "./api/create";
import SkinResult from "@/components/SkinResult";
import ProfileCard from "@/components/ProfileCard";
import { ReadSkinInfoResponse } from "./api/read";

const CreatePage = () => {
    const router = useRouter()
    const [skin, setSkin] = useState<string | null>(null)
    const [info, setInfo] = useState<ReadSkinInfoResponse | null>(null)

    useEffect(() => {
        const skinData = router.query.skin_data as string
        if (!skinData) {
            router.push('/')
            return
        }
        const skin = atob(skinData)
        setSkin(skin)
        axios.post<ReadSkinInfoResponse>('/api/read', {
            skin
        }).then(res => {
            setInfo(res.data)
        })
    }, [])

    return <>
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            {info && <ProfileCard skin={skin!} name={info.name} author={info.author} content={info.content} />}
        </main>
    </>
}

export default CreatePage