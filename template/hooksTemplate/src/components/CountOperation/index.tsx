import React from 'react'
import { Button } from 'antd'
import { useTestStore } from '@store/index'
import styles from './index.scss'

const CountOperation = () => {
    const { dispatch } = useTestStore()
    return (
        <div className={styles.buttonWrapper}>
            <Button onClick={() => dispatch({ type: 'INCREMENT', payload: { num: 5 } })}>+5</Button>
            <Button onClick={() => dispatch({ type: 'DECREMENT', payload: { num: 1 } })}>-1</Button>
        </div>
    )
}

export default CountOperation
