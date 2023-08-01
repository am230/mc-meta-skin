"use client"
import styles from './FileButton.module.css'
import {useRef} from "react";


const getFileData = (item: DataTransferItem): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (item.kind !== "file") {
            reject(`${item.kind} is not a file`)
            return
        }
        const file = item.getAsFile()!
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            resolve(reader.result!.toString())
        }
        reader.onerror = reject
        reader.onabort = reject
    })
}

const FileButton = (props: { label: string, hint: string, icon: JSX.Element, callback: (data: string) => any }) => {
    const ref = useRef<HTMLInputElement>(null)
    return <div className="flex flex-col gap-4 items-center">
        <input
            type="file"
            accept=".png, .jpeg, .jpg "
            ref={ref}
            onChange={async (e) => {
                console.log(e.target.value)
                const files = e.target.files!
                const file = files[0]!
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = () => {
                    props.callback(reader.result!.toString())
                }
                e.target.value = "";
            }}
            hidden
        />
        <div
            className={styles.big_button}
            onDrop={async (e) => {
                e.preventDefault()
                props.callback(await getFileData(e.dataTransfer.items[0]))
            }}
            onDragOver={(e) => {
                e.preventDefault()
            }}
            onClick={() => {
                ref.current!.click()
            }}
        >
            <div className={styles.label}>
                {props.label}
            </div>
            <div className={styles.icon}>
                {props.icon}
            </div>
        </div>
        {props.hint}
    </div>
}

export default FileButton