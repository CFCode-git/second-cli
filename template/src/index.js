import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import rux from 'ruxjs'
import './assets/styles/common.scss'


ReactDOM.render(
    rux.create({}, () => React.createElement(App,{})),
    document.getElementById('app')
)

