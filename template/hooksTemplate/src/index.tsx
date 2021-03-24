import React from 'react'
import ReactDOM from 'react-dom'
import styles from './index.scss'
import App from '@views/App/app'
import { Provider } from '@store/index'

const render = () => {
    ReactDOM.render(
        <div className={styles.test}>
            <Provider>
                <App />
            </Provider>
        </div>,
        document.querySelector('#app')
    )
}

render()
