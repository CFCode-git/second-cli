import React from 'react'
import { useTestStore } from '@store/index'
import styles from './index.scss'

const ShowCount = () => {
    const {
        state: { count },
    } = useTestStore()
    return <div className={styles.showCount}>{count}</div>
}

export default ShowCount
