import React from 'react'
import { Button } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import styles from './index.scss'

const PageB = ({ history }: RouteComponentProps) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div>PageB</div>
                <Button type="primary" onClick={() => history.push('/')}>
                    Go To PageA
                </Button>
            </div>
            <p> Hi, Welcome to Page B !!</p>
        </div>
    )
}

export default withRouter(PageB)
