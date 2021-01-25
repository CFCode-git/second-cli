#!/usr/bin/env node

const program = require('commander')
const inquirer = require('inquirer')
const utils = require('../utils/index')
const question = [
  {
    name: "conf",
    type: 'confirm',
    message: '是否创建新的项目?'
  }, {
    name: 'name',
    message: '请输入项目名称:',
    when: res => Boolean(res.conf)
  }, {
    name: 'author',
    message: '请输入作者:',
    when: res => Boolean(res.conf)
  }, {
    name: 'state',
    type: 'list',
    message: '请选择公共管理状态:',
    choices: ['mobx', 'redux'],
    filter: function (val) {
      return val.toLowerCase()
    },
    when: res => Boolean(res.conf)
  }]
const create = require('../src/create')
const start = require('../src/start')

program
  .version('0.0.1')
  .parse(process.argv)

program
  .command('create')
  .description('create a project')
  .action(function () {
    console.log('3333')
    utils.cyan('欢迎使用secli,这是我的第二个脚手架~')
    inquirer.prompt(question).then(answer => {
      if(answer.conf){
        // 创建文件
        create(answer)
      }
      console.log('answer=', answer)
    })
  })

program
  .command('start')
  .description('start a project')
  .action(function () {
    utils.green('----------------运行项目-------------------')
    console.log('start 了 傻缺')
    start('start').then(()=>{
      utils.green('---------------运行完成-----------------')
    })
  })

program
  .command('build')
  .description('build a project')
  .action(function () {
    utils.green('----------------构建项目-------------------')
    console.log('build 了 傻缺')
    start('build').then(()=>{
      utils.green('----------------构建完成-------------------')
    })
  })


program.parse(process.argv)
