// npm.js 用于下载依赖 启动项目等操作

const which = require('which')

/**
 * 查找 npm 可执行文件的实例
 * @returns {string}
 */
function findNpm() {
  const npms = process.platform === 'win32' ? ['npm.cmd'] : ['npm']
  // const npms = process.platform === 'win32' ? ['npm'] : ['npm.cmd']
  for (let i = 0; i < npms.length; i++) {
    try {
      // console.log('==================================')
      // console.log('npms[i]')
      // console.log(npms[i])
      which.sync(npms[i])
      // console.log('which1', which.sync(npms[i]))
      // console.log('which2', which.sync('fy'))
      // console.log('==================================')
      console.log('use npm: ' + npms[i])
      return npms[i]
    } catch (error) {
    }
  }
  throw new Error('please install npm')
}


/**
 * 运行终端命令
 * @param cmd  这里的cmd是 npm 的实例
 * @param args 这里是 npm 运行的参数，比如 npm 【install，start，build】
 * @param fn 子进程运行完毕后执行的回调
 */
function runCmd(cmd, args, fn) {
  args = args || []
  // 创建子进程，运行终端命令
  // child_process.spawn(command[,args][,options])
  // command -- 要运行的命令
  // args 字符串列表参数
  // options: cwd-子进程当前工作目录 env-环境变量键值对  stdio-子进程的stdio设置
  // stdio: 'inherit' 选项, 当代码执行时, 子进程继承 主进程的 stdin stdout stderr
  const runner = require('child_process').spawn(cmd, args, {
    stdio: ['inherit', 'inherit', 'inherit']
  })
  // const runner = require('child_process').spawn(which.sync('fy'), ['success'],
  //   {stdio: ['inherit', 'inherit', 'inherit']}
  // )
  // stdio: 'inherit' 选项, 当代码执行时, 子进程继承 主进程的 stdin stdout stderr
  // 造成子进程的数据事件处理器在主进程的 process.stdout 流上被触发. 使脚本立即输入结果

  // 下面四行代码会将 子进程 的 运行日志 输出到 主进程 的标准输出 stdout 事件里
  // runner.stdout.on('data', (data) => {
  //   console.log('11111111111111111111111')
  //   console.log(`child stdout: ${data}`)
  // })
  // 子进程的 close 事件， 在子进程退出时触发， code为子进程退出时的退出码
  runner.on('close', function (code) {
    if(fn){
      fn(code)
    }
    // console.log('ok')
  })
}

module.exports = function (installArg = ['install']) {
  const npm = findNpm()
  // console.log('------- find npm ---------')
  // console.log(npm)
  return function (done) {
    // 执行命令
    runCmd(which.sync(npm), installArg, function () {
      // 执行成功回调
      done && done()
    })
  }
}
