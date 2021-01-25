const fs = require('fs')
const utils = require('../utils/index')
const npm = require('./npm')
const path = require('path')

let fileCount = 0 // 文件数量
let dirCount = 0 // 文件夹数量
let flat = 0 // readdir 数量
let isInstall = false

// 拷贝文件
function copy(sourcePath, currentPath, callbackFn) {
  // console.log('------copy-------')
  // console.log('-- flat ',flat)
  // console.log('-- dirCount ',dirCount)
  // console.log('-- fileCount ',fileCount)
  // console.log('------copy-------')
  flat++
  // 读取文件夹下面的文件
  fs.readdir(sourcePath, (error, allFilesName) => {
    // console.log('------readdir-------')
    // console.log('-- flat ',flat)
    // console.log('-- dirCount ',dirCount)
    // console.log('-- fileCount ',fileCount)
    // console.log('------readdir-------')
    flat--
    if (error) throw error

    // console.log(allFilesName)
    allFilesName.forEach(name => {
      if (name !== '.git' && name !== 'package.json') fileCount++
      // const newSourcePath = sourcePath + '/' + name
      // const newCurrentPath = currentPath + '/' + name

      const newSourcePath = path.resolve(sourcePath, name)
      const newCurrentPath = path.resolve(currentPath, name)
      // console.log('===============================')
      // console.log('-- sourcePath: ', sourcePath)
      // console.log('-- currentPath: ', currentPath)
      // console.log('-- newSourcePath: ', newSourcePath)
      // console.log('-- new currentPath: ', newCurrentPath)
      // console.log('===============================')

      // 判断 源-模板文件 信息
      fs.stat(newSourcePath, (error, stat) => {
        if (error) throw error
        // console.log('======stat=======')
        // console.log(stat)
        // console.log('======stat=======')

        // 判断是文件 且不是package.json
        if (stat.isFile() && name !== 'package.json') {
          // console.log(8888,'stat 是文件')
          // 创建读写流
          const readStream = fs.createReadStream(newSourcePath)
          const writeSteam = fs.createWriteStream(newCurrentPath)
          readStream.pipe(writeSteam)
          utils.green('创建文件' + newCurrentPath)
          fileCount--
          completeControl(callbackFn)

          // 判断是文件夹,对文件夹单独进行 dirExist 操作
        } else if (stat.isDirectory()) {
          // console.log(8888,'stat 是文件夹')
          if (name !== '.git' && name !== 'package.json') {
            // console.log(4444,'stat 是文件夹,准备检查了')
            dirCount++
            dirExist(newSourcePath, newCurrentPath, copy, callbackFn)
          }
        }

      })
    })
  })
}

// 遍历查看 文件夹是否已存在
function dirExist(sourcePath, currentPath, copyCallback, callbackFn) {
  // console.log('-- 检查文件夹 --')
  // fs.exists(currentPath, (isExist => {
  //   console.log(11111111111111111111,'开始检查')
  //   console.log(isExist)
  //   if (isExist) {
  //     console.log(1111,'ext存在,copy里面的文件')
  //     // 递归调用 copy 函数
  //     copyCallback(sourcePath, currentPath, callbackFn)
  //   } else {
  //     console.log(2222,'ext存在,创建文件夹')
  //     fs.mkdir(currentPath, () => {
  //       fileCount--
  //       dirCount--
  //       copyCallback(sourcePath, currentPath, callbackFn)
  //       utils.yellow('创建文件夹: ' + currentPath)
  //       completeControl(callbackFn)
  //     })
  //   }
  // }))
  //
  fs.access(currentPath,(error)=>{
    if(error){
      // console.log(error)
      // console.log(2222,'不存在,创建文件夹')
      fs.mkdir(currentPath, () => {
        fileCount--
        dirCount--
        copyCallback(sourcePath, currentPath, callbackFn)
        utils.yellow('创建文件夹: ' + currentPath)
        completeControl(callbackFn)
      })
    }else{
      // console.log(1111,'存在,copy里面的文件')
      // 递归调用 copy 函数
      copyCallback(sourcePath, currentPath, callbackFn)
    }
  })
}

// 检查是否 copy 完成, 并执行回调, 回调就是运行项目
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
function revisePackageJson(res, sourcePath) {
  return new Promise((resolve) => {
    // 读取文件
    fs.readFile(sourcePath + '/package.json', 'utf8', (error, data) => {
      if (error) throw error
      const {author, name} = res
      let json = JSON.parse(data)
      // 替换模板
      json.name = name
      json.author = author
      const path = process.cwd() + '/package.json'
      // 写入文件
      fs.writeFile(path, JSON.stringify(json, null, 2), 'utf8', () => {
        utils.green('创建文件:' + path)
        resolve()
      })
    })
  })
}


module.exports = function (result) {
  // console.log('result: ', result)
  utils.green('----------开始构建----------')
  // 找到 template文件夹下的模板项目
  const sourcePath = __dirname.slice(0, -3) + 'template'
  utils.blue('当前路径:' + process.cwd())
  // 修改 package.json
  revisePackageJson(result, sourcePath).then(() => {
    copy(sourcePath, process.cwd(), npm())
    // copy(sourcePath, process.cwd(), ()=>{console.log('copy完了,弟弟')})
  })
}



