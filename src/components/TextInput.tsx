import { useState } from "react"
import styles from './TextInput.module.css'

const TextInput = (props: { placeholder: string, value: string, setValue: (value: string) => void }) => {
    const [width, setWidth] = useState<number>(0)
    const [focus, setFocus] = useState<boolean>(false)

    return <>
        {focus && <span className="absolute" style={{ visibility: 'hidden' }} ref={(ref) => {
            if (!ref) return
            setWidth(ref.getBoundingClientRect().width)
        }}>{props.value}</span>}
        <input className={styles.text_input} type="text" value={props.value} onChange={(event) => {
            props.setValue(event.target.value)
        }} onFocus={() => {
            setFocus(true)
        }} onBlur={() => {
            setFocus(false)
        }} style={{ width: Math.max(width, 100) }} placeholder={props.placeholder} />
    </>
}

export default TextInput