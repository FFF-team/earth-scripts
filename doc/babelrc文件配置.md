升级指南：

1. 删掉项目根目录下的.babelrc文件
2. 在项目根目录下创建 .babelrc.js 文件

    文件内容如下：
    
    ```
    /**
     * 替换掉原来的.babelrc文件
     * js配置更具有灵活性。比如根据不同的环境babel可以有不同的配置
     */
    
    module.exports = {
        "presets": [
            ["@babel/preset-env", {
                "modules": false
            }],
            "react-app"
        ]
    };
    
    ```
    > 这里删除了babel-plugin-import插件，原因是加上该插件打包体积会更大，详见各种[issue](https://github.com/ant-design/babel-plugin-import/issues)
