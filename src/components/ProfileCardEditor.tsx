import styles from './ProfileCard.module.css'
import SkinViewer from "@/components/SkinViewer";
import { useState } from 'react';
import TextInput from './TextInput';
import MarkdownEditor from './MarkdownEditor';
import SubmitButton from './SubmitButton';
import { availablePixels, zip } from '@/lib/skin-processor';

const ProfileCardEditor = (props: { skin: string, callback: (name: string, author: string, content: string) => void }) => {
    const [name, setName] = useState<string>('')
    const [author, setAuthor] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [message, setMessage] = useState<string>('')

    const submit = () => {
        if (!name) {
            setMessage('名前を入力してください')
            return
        }
        if (!author) {
            setMessage('作者を入力してください')
            return
        }
        setMessage('')
        props.callback(name, author, content)
    }

    const dataLeft = availablePixels - zip({
        name: name,
        author: author,
        content: content,
    }).length


    return <>
        <div className={`flex flex-col sm:flex-row p-12 overflow-y-scroll items-center w-[80vw] max-w-[960px] ${styles.profile_card}`}>
            <SkinViewer skinPath={props.skin} />
            <div className="flex flex-col w-full h-96 mr-4 gap-4">
                <div className={`flex flex-col sm:flex-row items-end gap-16 flex-wrap mt-4 justify-around ${styles.author}`}>
                    <div className="flex items-end">
                        名前：<h2>
                            <TextInput placeholder="名前" value={name} setValue={setName} />
                        </h2>
                    </div>
                    <div className="flex items-end">
                        作者：<h2>
                            <TextInput placeholder="作者" value={author} setValue={setAuthor} />
                        </h2>
                    </div>
                </div>
                <MarkdownEditor value={content} setValue={setContent} />
            </div>
        </div>
        {<div className={`p-4 ${styles.message} ${dataLeft < 0 ? 'text-red-500' : 'text-green-700'}`}>
            残りデータ量：{dataLeft}
        </div>}
        <SubmitButton callback={submit}>
            完成
        </SubmitButton>
        {message && <div className={`text-red-500 p-4 ${styles.message}`}>
            {message}
        </div>}
    </>
}

export default ProfileCardEditor