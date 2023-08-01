import styles from './Button.module.css'

const Button = (props: { children: any, callback: () => void }) => {
    return <div className={styles.button} onClick={() => {
        props.callback()
    }}>
        {props.children}
    </div>
}

export default Button
