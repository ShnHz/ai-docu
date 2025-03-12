const path = require('path')
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin')
const plugins = []

// gzip
if (process.env.NODE_ENV === 'production') {
    plugins.push(
        new CompressionPlugin({
            // gzip压缩配置
            test: /\.js$|\.html$|\.css/, // 匹配文件名
            threshold: 10240, // 对超过10kb的数据进行压缩
            deleteOriginalAssets: false, // 是否删除原文件
        })
    )
}

//! 配置
module.exports = {
    devServer: {
        disableHostCheck: true,
        port: 8080, // 端口
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        proxy: {
            'devapi': {
                target: 'http://10.219.98.22:99', //API服务器的地址
                ws: true, //代理websockets
                changeOrigin: true, // 是否跨域，虚拟的站点需要更管origin
                pathRewrite: {
                    '^devapi': '',
                }
            },
        }
    },
    css: {
        extract: true, // 是否使用css分离
        loaderOptions: {
            sass: {
                prependData: `@import "src/assets/css/varuables.scss";`
            }
        }
    },
    chainWebpack: config => {
        // 文件夹别名
        config.resolve.alias
            .set('@static', path.join(__dirname, 'public/static'))
            .set('@img', path.join(__dirname, 'src/assets/img'))
            .set('@css', path.join(__dirname, 'src/assets/css'))


        // svg配置
        const svgRule = config.module.rule('svg')
        svgRule.uses.clear()
        svgRule
            .test(/\.svg$/)
            .include.add(path.resolve(__dirname, 'public/static/svg'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
        const fileRule = config.module.rule('file')
        fileRule.uses.clear()
        fileRule
            .test(/\.svg$/)
            .exclude.add(path.resolve(__dirname, 'public/static/svg'))
            .end()
            .use('file-loader')
            .loader('file-loader').options({
                esModule: false
            })

        config
            .when(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prep' || process.env.NODE_ENV === 'online', // 配置生产环境生效
                config => {
                    config.optimization.splitChunks({
                        chunks: 'all', // 将对什么类型的代码进行分割，三种值：all: 全部 ｜ async: 异步，按需加载的代码 ｜ initial: 入口代码块
                        cacheGroups: { // 缓存组
                            // 定义 libs 缓存组，分割从 node_modules 中引入的代码
                            libs: {
                                name: 'chunk-libs', // 分割成的文件名
                                test: /[\\/]node_modules[\\/]/, // 匹配 node_modules 中模块
                                priority: 10, // 优先级，当模块同时命中多个缓存组的规则时，分配到优先级高的缓存组
                                chunks: 'initial' // 这里覆盖上面的 chunks: 'all'，仅打包最初依赖的第三方库
                            },
                            elementUI: {
                                name: 'chunk-elementUI',
                                priority: 20, // 优先级 20，命中 element-ui 代码时，优先分割到此组里
                                test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // 匹配 element-ui 代码
                            }
                        }
                    })
                }
            )
    },
    configureWebpack: {
        optimization: {
            minimizer: [new TerserPlugin({
                terserOptions: {
                    ecma: undefined,
                    warnings: false,
                    parse: {},
                    compress: {
                        drop_console: true,
                        drop_debugger: false,
                        pure_funcs: ['console.log'] // 移除console           
                    }
                }
            })]
        },
        plugins: plugins,
    }
}