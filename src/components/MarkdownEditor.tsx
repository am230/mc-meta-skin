import ReactMarkdown from "react-markdown";

const MarkdownEditor = (props: { value: string, setValue: (value: string) => void }) => {
    return <div className="flex flex-col sm:flex-row-reverse gap-4 content-stretch">
        <div className="flex flex-col items-end w-full">
            <textarea className="w-full h-full" value={props.value} onChange={(event) => {
                props.setValue(event.target.value)
            }} placeholder={`説明文をここに入力（Markdown形式使えるよ）`} />
        </div>
        <div className="w-full overflow-x-hidden flex flex-col">
            <ReactMarkdown children={props.value} />
        </div>
    </div >
}

export default MarkdownEditor