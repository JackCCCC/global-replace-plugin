// 一个js具名函数
function GlobalReplacePlugin(options) {
    this.options = options
}

// 再函数的protoyupe上定义一个apply方法
GlobalReplacePlugin.prototype.apply = function(compiler) {
    const emit = async(compilation, callback) => {
        Object.keys(compilation.assets).forEach((data) => {
            let content = compilation.assets[data].source() // 获取处理的文本
            if (typeof content === 'string') {
                content = content.replace(this.options.regExp, this.options.text)
                compilation.assets[data] = {
                    source() {
                        return content
                    },
                    size() {
                        return content.length
                    }
                }
            }
        })
        if (callback) callback()
    }

    if (compiler.hooks) {
        compiler.hooks.emit.tapPromise('globalReplacePlugin', emit)
    } else {
        compiler.plugin('emit', emit)
    }
}

module.exports = GlobalReplacePlugin