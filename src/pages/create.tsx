import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ProfileCardEditor from "@/components/ProfileCardEditor";
import SkinResult from "@/components/SkinResult";
import { encodeJson } from "@/lib/skin-processor";

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
                const encodedSkin = await encodeJson(skin!, {
                    name: name,
                    author: author,
                    content: content,
                })
                setImage(encodedSkin)
            }} />
            {image && <SkinResult skin={image} close={() => {
                setImage(null)
            }} />}
        </main>
    </>
}

export default CreatePage