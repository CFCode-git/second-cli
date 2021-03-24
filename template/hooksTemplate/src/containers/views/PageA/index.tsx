import React from 'react'
import { Button } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import ShowCount from '@components/ShowCount'
import CountOperation from '@components/CountOperation'
import styles from './page-a.scss'

const PageA = ({ history }: RouteComponentProps) => {
    return (
        <div>
            <div className={styles.header}>
                <div>PageA</div>
                <Button type="primary" onClick={() => history.push('/page-b')}>
                    Go To PageB
                </Button>
            </div>
            <div className="calc">
                <ShowCount />
                <CountOperation />
            </div>
        </div>
    )
}

export default withRouter(PageA)
