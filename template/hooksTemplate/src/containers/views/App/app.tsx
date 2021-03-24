import React, { Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import routerMap from './routerMap'
import styles from './app.scss'
import logo from '../../../assets/cat.png'

const App = () => {
    return (
        <div className={styles.appWrapper}>
            <div className={styles.logo}>
                <img src={logo} alt="logo" />
                <p>欢迎使用 second-cli </p>
            </div>
            <div className={styles.view}>
                <Suspense fallback={<div>loading</div>}>
                    <Router>
                        <Switch>
                            {routerMap.map((item) => {
                                return <Route exact path={item.path} key={item.path} component={item.component} />
                            })}
                        </Switch>
                    </Router>
                </Suspense>
            </div>
        </div>
    )
}

export default App
