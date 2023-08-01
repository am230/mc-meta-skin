import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ProfileCardEditor from "@/components/ProfileCardEditor";
import SubmitButton from "@/components/SubmitButton";
import axios from "axios";
import { CreateSkinInfoResponse } from "./api/create";
import SkinResult from "@/components/SkinResult";

const CreatePage = () => {
    const router = useRouter()
    const [skin, setSkin] = useState<string | null>(null)
    const [image, setImage] = useState<string | null>(null)

    useEffect(() => {
        const skinData = router.query.skin_data as string
        if (!skinData) {
            router.push('/')
            return
        }
        setSkin(atob(skinData))
    }, [])

    return <>
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <ProfileCardEditor skin={skin!} callback={async (name, author, content) => {
                console.log(name, author, content)
                const res = await axios.post<CreateSkinInfoResponse>('/api/create', {
                    name, author, content, skin
                })
                console.log(res.data)
                setImage(res.data.skin)
            }} />
            {image && <SkinResult skin={image} close={() => {
                setImage(null)
            }} />}
        </main>
    </>
}

export default CreatePage