// npm.js 用于下载依赖 启动项目等操作

const which = require('which')

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


// 运行终端命令
function runCmd(cmd, args, fn) { // args npm 运行的参数 比如 -- install / start ...
  args = args || []
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
