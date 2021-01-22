const chalk = require('chalk')

const colors = ['cyan', 'green', 'blue', 'yellow', 'red']

const utils = {
  cyan: '',
  blue: '',
  green: '',
  yellow: '',
  red: '',
}
/* console color */
colors.forEach(color => {
  utils[color] = function (text, isConsole = true) {
    return isConsole ? console.log(chalk[color](text)) : chalk[color](text)
  }
})

module.exports = utils
