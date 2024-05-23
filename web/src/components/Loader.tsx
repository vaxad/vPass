import styles from "./Loader.module.css"

export default function Loader({size=50}:{size?:number}) {
    return (
        <div className=" w-full flex justify-center items-center" style={{padding:size/4}}>
            <svg
                className={styles.container}
                viewBox={`0 0 ${size} ${size}`}
                height={size}
                width={size}
            >
                <rect
                    className={styles.track}
                    x="2.5"
                    y="2.5"
                    fill="none"
                    stroke-width={size/10}
                    width={size}
                    height={size}
                />
                <rect
                    className={styles.car}
                    x="2.5"
                    y="2.5"
                    fill="none"
                    stroke-width={size/10}
                    width={size}
                    height={size}
                    pathLength="100"
                />
            </svg>
        </div>
    )
}
