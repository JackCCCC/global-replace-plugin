# global-replace-plugin
### [Webpack](https://webpack.github.io/) 打包过程全局替换插件

### Install

`
npm i --save global-replace-plugin
`
### API

- **regExp** 匹配全局所需要替换内容的一个正则表达式
- **text** 替换为指定的内容
### Example

### 案例1：将注释//123456789替换为test函数的调用
```javascript
//webpack.config.js
var GlobalReplacePlugin = require('global-replace-plugin');
var config = {
  ...
  plugins: [
    new GlobalReplacePlugin({
      regExp: /\/\/123456789/,
      text: 'test()'
    })
  ]
  ...
};
module.exports = config;
```
```javascript
//index.js
const test = () => {
  console.log(123456789)
}
//123456789

//打包之后//123456789将被替换为test()
//运行时test函数将会被调用，控制台会打印出123456789
```

### 案例2：埋点上报
功能叙述：埋点上报逻辑与现有逻辑解耦
[正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions#%E4%BD%BF%E7%94%A8%E6%8B%AC%E5%8F%B7%E7%9A%84%E5%AD%90%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%8C%B9%E9%85%8D)
```javascript
//webpack.config.js
var GlobalReplacePlugin = require('global-replace-plugin');
var config = {
  ...
  plugins: [
    new GlobalReplacePlugin({
      regExp: /\/\/>>>(\w+),(\w+)/g,
      //加`号，打包之后$1的值作为字符串处理，不加`号，打包之后$1的值将作为变量处理，那么须提前申明该变量
      //不明白$1,$2可点击上方正则表达式
      text: 'report(`$1`,`$2`)' 
    })
  ]
  ...
};
module.exports = config;
```
```javascript

//report.js
const report = (type, code) => {
  console.log(type, ',', code)
  ...
}
export default report
```
```javascript
//index.vue
import report from './report'
...
const handleClick = () => {
  //>>>page,1
  
}
...
  <template>
    ...
    <div @click="handleClick">查看</div>
    ...
  </template>
...


//打包之后注释 //>>>page,1 将被替换为report('page', '1')
//点击查看report将会被调用，控制台会打印出page,1
//也可以在入口将report挂载到window上，这样就不用导入，report可全局调用
```
