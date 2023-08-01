import styles from "./Title.module.css"
import Image from "next/image";

const Title = () => {
    return <>
        <div className={`sm:mb-12 ${styles.title}`}>
            <Image src={"/title.png"} alt={"title"} width={579} height={72} quality={100}/>
            <div className={styles.info}>
                あなたのスキンに情報を埋め込み、
                <br/>
                あとから見ることができます。
            </div>
        </div>
    </>
}

export default Title
