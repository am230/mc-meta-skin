import styles from './SkinResult.module.css'
import SubmitButton from "@/components/SubmitButton";

const SkinResult = (props: { skin: string, close: () => void }) => {
    const boundingBox = [0, 0, 0, 0]
    return <div className={styles.overlay} onClick={(event) => {
        // if outside of the bounding box then close
        if (event.clientX < boundingBox[0] || event.clientX > boundingBox[2] || event.clientY < boundingBox[1] || event.clientY > boundingBox[3]) {
            props.close()
        }
    }}>
        <div className={styles.result} ref={(element) => {
            if (!element) return
            const rect = element.getBoundingClientRect()
            boundingBox[0] = rect.left
            boundingBox[1] = rect.top
            boundingBox[2] = rect.right
            boundingBox[3] = rect.bottom
        }}>
            <img className={styles.skin} src={props.skin} />
            <SubmitButton callback={() => {
                const link = document.createElement('a')
                link.href = props.skin
                link.download = 'skin.png'
                link.click()
            }}>
                保存
            </SubmitButton>
        </div>
    </div>
}

export default SkinResult