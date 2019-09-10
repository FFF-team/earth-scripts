项目根目录下创建 tsconfig.json 文件,文件内容如下：
```$xslt
{
    "compilerOptions": {
        "baseUrl": ".",
        "module": "esnext",
        "target": "es6",
        "lib": [
            "dom",
            "es5",
            "scripthost",
            "es2015.promise"
        ],
        "sourceMap": true,
        "strict": true,
        "allowJs": true,
        "jsx": "react",
        "allowSyntheticDefaultImports": true,
        "moduleResolution": "node",
        "rootDir": "src",
        "forceConsistentCasingInFileNames": true,
        "noImplicitReturns": true,
        "noImplicitThis": true,
        "noImplicitAny": false,
        "strictNullChecks": true,
        "suppressImplicitAnyIndexErrors": true,
        "noUnusedLocals": true,
        "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
        "emitDecoratorMetadata": true,
        "paths":{
            "commons/*": ["./src/components_common/*"],
            "tools/*": ["./src/tools/*"],
            "api/*": ["./src/api/*"],
            "config/*": ["./src/config/*"],
            "public/*": ["./public/*"],
            "scss/*": ["./src/scss_mixin/scss/*"],
            "scss_mixin/*": ["./src/scss_mixin/*"],
            "style_common/*": ["./src/style_common/*"]
        }
    },
    "exclude": [
        "node_modules",
        "build",
        "config",
        "mock"
    ]
}

```
