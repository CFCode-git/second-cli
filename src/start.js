// 启动项目 start / build
'use strict'

const child_process = require('child_process')
const fs = require('fs')
const path = require('path')
const utils = require('../utils/index')

// 找到 secli-react-webpack-plugin 的路径
// const currentPath = process.cwd() + '/node_modules/mycli-react-plugin'
const currentPath = path.resolve(process.cwd(), 'node_modules', 'secli-react-plugin')

console.log(currentPath)

/**
 *
 * @param type type === start 本地启动项目; type === build 线上打包项目
 * @returns {Promise<unknown>}
 */
module.exports = (type) => {
  console.log(type)
  console.log(currentPath)
  return new Promise((resolve, reject) => {
    // 判断 secli-react-plugin 是否存在
    // 如果存在 就启动 plugin 下的 index.js 作为子进程
    // 否则抛错
    // 绑定子进程事件message,向子进程发送指令 是 start 还是 build
    // 由 secli 完成 项目配置 和 构建
    fs.access(currentPath, (error) => {
      if (error) { // 不存在 抛出警告,下载
        console.log('不存在')
        utils.red('secli-react-webpack-plugin does not exist , please install secli-react-webpack-plugin')
      } else { // 存在
        console.log('存在')
        // 开启子进程
        // child_process.fork(modulePath[,args][,options])
        // modulePath 要在子进程中执行的模块 currentPath -- secli plugin 的入口文件 index.js
        const children = child_process.fork(path.resolve(currentPath, 'index.js'))
        // 监听子进程的信息
        children.on('message', (message) => {
          const msg = JSON.parse(message)
          console.log(111,msg)
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
