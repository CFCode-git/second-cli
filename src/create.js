const fs = require('fs')
const utils = require('../utils/index')
const npm = require('./npm')
const path = require('path')

let fileCount = 0 // 文件数量
let dirCount = 0 // 文件夹数量
let flat = 0 // readdir 数量
let isInstall = false

// 拷贝文件
/**
 *
 * @param sourcePath template 绝对路径
 * @param currentPath 创建项目的目标路径下，当前拷贝的文件/文件夹所在的绝对路径
 * @param callbackFn copy完成后的回调, 此处接受的是 npm()
 */
function copy(sourcePath, currentPath, callbackFn) {
  console.log('--copy--')
  flat++
  // 读取文件夹下面的文件 回调可以得到目录中文件的名称数组
  fs.readdir(sourcePath, (error, allFilesName) => {
    flat--
    if (error) throw error
    // console.log(allFilesName)
    allFilesName.forEach(name => {
      if (name !== '.git' && name !== 'package.json') fileCount++
      const newSourcePath = path.resolve(sourcePath, name)
      const newCurrentPath = path.resolve(currentPath, name)
      // 判断 源-模板文件 信息 newSourcePath 每个文件的绝对路径, 得到的 fs.stat 对象包含文件的基本信息
      fs.stat(newSourcePath, (error, stat) => {
        if (error) throw error
        // 判断是文件 且不是package.json
        if (stat.isFile() && name !== 'package.json') {
          utils.green('创建文件' + newCurrentPath)
          // 创建读写流, createReadStream 和 createWriteStream 返回 fs.ReadStream 和 fs.WriteStream 继承 stream.Readable 类
          // readable.pipe( 数据写入目标 [,选项] ) 绑定 可写流 到 可读流，将 readStream 的所有数据通过 pipe 推送到 writeStream
          // 每次写完后判断是否克隆完成
          const readStream = fs.createReadStream(newSourcePath)
          const writeSteam = fs.createWriteStream(newCurrentPath)
          readStream.pipe(writeSteam)
          fileCount--
          completeControl(callbackFn)
          // 判断是文件夹,对文件夹单独进行 dirExist 操作
        } else if (stat.isDirectory()) {
          if (name !== '.git' && name !== 'package.json') {
            dirCount++
            dirExist(newSourcePath, newCurrentPath, copy, callbackFn)
          }
        }
      })
    })
  })
}

// 遍历查看 文件夹是否已存在
/**
 * 判断文件夹是否已经存在（已经复制过了）
 * @param sourcePath 模板的文件夹路径
 * @param currentPath 创建的项目的相应文件夹路径
 * @param copyCallback 此处是copy函数，用于处理该文件夹下的子文件。
 * @param callbackFn 此处是 npm()
 */
function dirExist(sourcePath, currentPath, copyCallback, callbackFn) {
  console.log('--dirExist--',currentPath)
  // fs.access(path[,mode],callback)
  // path 指定的目录或者文件
  // mode 可选值： F_OK 表明文件对调用进程可见，用于判断文件是否存在 (默认值)
  // R_OK 表明调用进程可以读取文件 // W_OK 表明调用进程可以写入文件 // X_OK 表明调用进程可以执行文件，在window上无效
  // callback 只有一个参数，传入可能的错误参数, 任何可访问性检查失败，都会得到 error 对象给 callback
  fs.access(currentPath,(error)=>{
    if(error){
      console.log(2222,'error, 文件夹不存在,创建文件夹',currentPath)
      // fs.mkdir(path[,options],callback)
      // path 文件夹路径
      // options 对象，{recursive：默认为false，mode：window上不支持}
      // recursive: 表示递归的， 比如 fs.mkdir('/a/b/c',{recursive:true},(err)=>{if(err)throw err}) 表示不管 /a/b 是否存在，都会创建 /a/b/c
      // callback 会传入可能的异常以及创建的第一个目录的路径
      // 异步创建目录, 同时拷贝对应模板目录下的文件

      fs.mkdir(currentPath, () => {
        utils.yellow('创建文件夹: ' + currentPath)
        fileCount--
        dirCount--
        copyCallback(sourcePath, currentPath, callbackFn)
        completeControl(callbackFn)
      })

    }else{
      console.log(1111,'文件夹存在,copy里面的文件')
      // 递归调用 copy 函数
      copyCallback(sourcePath, currentPath, callbackFn)
    }
  })
}

// 检查是否 copy 完成, 并执行回调, 回调就是运行项目
/**
 * 检查是否深克隆完成，检查fileCount， dirCount, flat
 * @param callbackFn 此处的回调是 npm()
 */
function completeControl(callbackFn) {
  // console.log('---- 检查是否 copy 完成 ----')
  if (fileCount === 0 && dirCount === 0 && flat === 0) { // 全部 copy 完成 执行回调, 回调就是下载依赖
    utils.green('----------构建完成----------')
    if (callbackFn && !isInstall) {
      isInstall = true
      utils.blue('---------开始install--------')
      callbackFn(() => {
        // npm install 后执行这里的回调
        utils.blue('--------完成install--------')
        // 判断是否存在webpack
        runProject()
      })
    }
  }
}

// 运行项目
function runProject() {
  try {
    const doing = npm(['start'])
    doing()
  } catch (error) {
    utils.red('自动启动失败,请尝试手动 npm start 启动项目')
  }
}

// 修改 package.json
/**
 * 修改 template 模板下的 package.json
 * @param answer 收集的用户信息
 * @param sourcePath template 的绝对路径
 * @returns {Promise<unknown>}
 */
function revisePackageJson(answer, sourcePath) {
  console.log('--revisePackageJson--')
  return new Promise((resolve) => {
    // 读取文件
    fs.readFile(sourcePath + '/package.json', 'utf8', (error, data) => {
      if (error) throw error
      const {author, name} = answer
      let json = JSON.parse(data)
      // 替换 package.json 配置项
      json.name = name
      json.author = author
      // process.cwd() 为 创建项目的目标路径
      const path = process.cwd() + '/package.json'
      // 将修改后的 package.json 的内容写入
      // json.stringify(value, fn, space) fn:序列化过程中被序列化的值每个属性都会经过fn处理； space: 指定用于缩进的空白字符串，用于美化输出。
      // fs.writeFile(file，data，options，callback)
      // file - 文件名或文件描述符：string、URL、Buffer、integer
      // 当 file 为 文件名： 异步写入数据文件，当 file 为文件描述符，则其行为类似直接调用 fs.write()
      fs.writeFile(path, JSON.stringify(json, null, 2), 'utf8', () => {
        utils.green('创建文件:' + path)
        resolve()
      })
    })
  })
}


module.exports = function (answer) {
  console.log('result: ', answer)
  utils.green('----------开始构建----------')
  // 找到 template文件夹下的模板项目
  // const sourcePath = __dirname.slice(0, -3) + 'template'

  let sourcePath
  answer.state === 'redux' ?
    sourcePath = path.resolve(__dirname, '../', 'template', 'reduxTemplate') :
    sourcePath = path.resolve(__dirname, '../', 'template', 'hooksTemplate')

  // console.log(__dirname)
  // console.log(__dirname.slice(0, -3))
  // console.log(sourcePath)
  utils.blue('当前路径:' + process.cwd())
  // 修改 package.json

  revisePackageJson(answer, sourcePath).then(() => {
    copy(sourcePath, process.cwd(), npm())
  })
}



