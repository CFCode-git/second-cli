// secli 脚手架 借助 secli-plugin 创建子进程, 用于管理/操控 webpack, 比如合并配置项, 以及 运行 webpack-dev-server
// 启动项目 start / build
'use strict'

const child_process = require('child_process')
const fs = require('fs')
const path = require('path')
const utils = require('../utils/index')

// 找到 secli-react-webpack-plugin 的路径
// const currentPath = process.cwd() + '/node_modules/mycli-react-plugin'
// process.cwd() 为 secli 创建的项目路径, 要找到该路径下面 node_modules/secli-react-plugin
const currentPath = path.resolve(process.cwd(), 'node_modules', 'secli-react-webpack-plugin')

/**
 *
 * @param type type === start 本地启动项目; type === build 线上打包项目
 * @returns {Promise<unknown>}
 */

module.exports = (type) => { // type: start or build
  // console.log(type)
  // console.log(currentPath)
  return new Promise((resolve, reject) => {
    // 先判断 secli-react-plugin 是否存在
    // 如果存在 就启动该 plugin 下的 index.js 作为子进程
    // 否则就抛错
    // 绑定子进程事件 message, 监听 end 或者 error报错
    // children.send()向子进程发送指令 包括 start/build 以及当前的项目路径
    // 由该 plugin 完成 项目配置 和 构建
    fs.access(currentPath, (error) => {
      if (error) {
        // 不存在 抛出警告,提示下载
        // console.log('不存在')
        utils.red('secli-react-webpack-plugin does not exist , please install secli-react-webpack-plugin')
      } else {
        // 存在  开启子进程
        // console.log('存在')
        // child_process.fork(modulePath[,args][,options])
        // modulePath 要在子进程中执行的模块
        // 此处的 currentPath -- secli plugin 的入口文件 index.js
        // child_process.fork() 是 child_process.spawn() 的特例，专门用于衍生新的Node.js进程。
        // 与 child_process。spawn() 一样返回 ChildProcess 对象。 返回的 ChildProcess 会内置额外的通信通道，运行消息在父子进程件传递。

        const children = child_process.fork(path.resolve(currentPath, 'index.js'))

        // console.log(path.resolve(currentPath, 'index.js'))
        // 监听子进程的信息
        // http://nodejs.cn/api/child_process.html#child_process_child_process

        // ChildProcess 类
        // 监听子进程回传的 message， 如果 message 为 end 则关闭子进程，
        children.on('message', (message) => {
          const msg = JSON.parse(message)
          // console.log(111,msg)
          if (msg.type === 'end') {
            // 关闭子进程
            children.kill()
            resolve()
          } else if (msg.message === 'error') {
            children.kill()
            reject()
          }
        })
        // 向子进程 发送 cwd 路径, 和 操作类型 : start / build
        children.send(JSON.stringify({
          cwdPath: process.cwd(),
          type: type || 'build'
        }))
      }
    })
  })
}
