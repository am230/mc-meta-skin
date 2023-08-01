import styles from './ProfileCard.module.css'
import SkinViewer from "@/components/SkinViewer";
import ReactMarkdown from "react-markdown";

const ProfileCard = (props: { skin: string, name: string, author: string, content: string }) => {
    return <>
        <div className={`flex flex-col sm:flex-row p-12 overflow-y-scroll items-center w-[80vw] max-w-[960px] ${styles.profile_card}`}>
            <SkinViewer skinPath={props.skin} />
            <div className="flex flex-col w-full h-96 mr-4 gap-4">
                <div className={`flex flex-col sm:flex-row items-end gap-16 flex-wrap mt-4 justify-around ${styles.author}`}>
                    <div className="flex items-end">
                        名前：<h2>{props.name}</h2>
                    </div>
                    <div className="flex items-end">
                        作者：<h2>{props.author}</h2>
                    </div>
                </div>
                <ReactMarkdown>
                    {props.content}
                </ReactMarkdown>
            </div>
        </div>
    </>
}

export default ProfileCard