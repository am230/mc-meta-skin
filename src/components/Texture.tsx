import styles from "./Texture.module.css"

const Texture = (props: { src: string }) => {
    return <img className={styles.texture} src={props.src} alt={"texture"}/>
}

export default Texture