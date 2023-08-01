import styles from './SubmitButton.module.css'

const SubmitButton = (props: { children: any, callback: () => void }) => {
    return <div className={styles.submit_button} onClick={() => {
        props.callback()
    }}>
        {props.children}
    </div>
}

export default SubmitButton
