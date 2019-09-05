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
        ],
        "plugins": [
            [
                "import",
                {
                    "libraryName": "antd",
                    "libraryDirectory": "lib",
                    "style": "css"
                },
                "ant"
            ],
            [
                "import",
                {
                    "libraryName": "antd-mobile",
                    "libraryDirectory": "lib",
                    "style": "css"
                },
                "antd-mobile"
            ]
        ]
    };
    
    ```
