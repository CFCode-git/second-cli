'use strict'

const child_process = require('child_process')
const fs = require('fs')
const path = require('path')
const utils = require('../utils/index')

// 找到 secli-react-webpack-plugin 的路径
// const currentPath = process.cwd() + '/node_modules/mycli-react-plugin'
const currentPath = path.resolve(process.cwd(), 'node_modules', 'mycli-react-plugin')

console.log(currentPath)


module.exports = (type) => {
  console.log(type)
  console.log(currentPath)
  return new Promise((resolve, reject) => {
    // 判断 mycli-react-plugin 是否存在
    fs.access(currentPath, (error) => {
      if (error) { // 不存在 抛出警告,下载
        console.log('不存在')
        utils.red('mycli-react-webpack-plugin does not exist , please install mycli-react-webpack-plugin')
      } else { // 存在
        console.log('存在')
        const children = child_process.fork(path.resolve(currentPath, 'index.js'))
        // 监听子进程的信息
        children.on('message', (message) => {
          const msg = JSON.parse(message)
          if (msg.type === 'end') {
            // 关闭子进程
            children.kill()
            resolve()
          } else if (msg.message === 'error') {
            children.kill()
            reject()
          }
        })
        // 发送 cwd 路径, 和操作类型 : start / build
        children.send(JSON.stringify({
          cwdPath: process.cwd(),
          type: type || 'build'
        }))
      }
    })
  })
}
