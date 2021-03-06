"use strict";

const fs = require('fs')
const path = require('path');
const webpack = require('webpack');

const { VueLoaderPlugin } = require('vue-loader');

const RemovePlugin = require('remove-files-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// Custom variables
let isProduction = true;
const applicationBasePath = './VueApp/';

// We search for app.js or app.ts files inside VueApp/{miniSpaName}/{language} folder and make those as entries. Convention over configuration
var appEntryFiles = {}
fs.readdirSync(applicationBasePath).forEach(function (spaName) {
    fs.readdirSync(applicationBasePath + spaName).forEach(function (lang) {
        let name = spaName + '/' + lang;
        let spaEntryPoint = applicationBasePath + name + '/app.ts'
        if (fs.existsSync(spaEntryPoint)) {
            appEntryFiles[name] = spaEntryPoint;
        }
    })
})

// Add main global.scss file with Bulma(or any other source by choice)
appEntryFiles['vendor'] = [
    path.resolve(__dirname, 'VueApp/shared/design/_layout.scss'),
]

module.exports = function (env, argv) {
    if (argv.mode === "production") {
        isProduction = true;
    }

    return {
        entry: appEntryFiles,
        output: {
            path: path.resolve(__dirname, "wwwroot/dist"),
            filename: "js/[name]/bundle.js",
            chunkFilename: "js/[name]/bundle.js?v=[chunkhash]",
            publicPath: "/dist/"
        },
        resolve: {
            extensions: [".ts", ".js", ".vue", ".json", "scss", "css"],
            alias: {
                vue$: "vue/dist/vue.esm.js",
                "@": path.join(__dirname, applicationBasePath)
            },
            modules: [
                path.join(__dirname, './node_modules')
            ]
        },
        devtool: "source-map",
        devServer: {
            historyApiFallback: true,
            noInfo: true,
            overlay: true
        },
        module: {
            rules: [
                /* config.module.rule('vue') */
                {
                    test: /\.vue$/,
                    loader: "vue-loader",
                    options: {
                        preserveWhitespace: false,
                        loaders: {
                            scss: "vue-style-loader!css-loader!sass-loader", // <style lang="scss">
                            sass: "vue-style-loader!css-loader!sass-loader?indentedSyntax" // <style lang="sass">
                        }
                    }
                },
                /* config.module.rule('js') */
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: "babel-loader",
                    exclude: /node_modules/,
                },
                /* config.module.rule('ts') */
                {
                    test: /\.ts$/,
                    loader: "ts-loader",
                    options: {
                        appendTsSuffixTo: [/\.vue$/],
                        transpileOnly: true
                    }
                },
                /* config.module.rule('sass') */
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '/dist/',
                                // only enable hot in development
                                hmr: process.env.NODE_ENV === 'development',
                                // if hmr does not work, this is a forceful method.
                                reloadAll: true
                            },
                        },
                        'css-loader',
                        'postcss-loader',
                        'sass-loader',
                    ],
                },
                /* config.module.rule('css') */
                {
                    test: /\.css$/,
                    loader: "css-loader"
                },
                /* config.module.rule('images') */
                {
                    test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 4096,
                                esModule: false,
                                fallback: {
                                    loader: 'file-loader',
                                    options: {
                                        // https://stackoverflow.com/questions/59114479/when-using-file-loader-and-html-loader-in-webpack-the-src-attr-of-image-is-obj/59115624#59115624
                                        esModule: false,
                                        name: 'img/[name].[hash:8].[ext]'
                                    }
                                }
                            }
                        }
                    ]
                },
                /* config.module.rule('svg') */
                {
                    test: /\.(svg)(\?.*)?$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'img/[name].[hash:8].[ext]'
                            }
                        }
                    ]
                },
                /* config.module.rule('media') */
                {
                    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 4096,
                                fallback: {
                                    loader: 'file-loader',
                                    options: {
                                        name: 'media/[name].[hash:8].[ext]'
                                    }
                                }
                            }
                        }
                    ]
                },
                /* config.module.rule('fonts') */
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 4096,
                                fallback: {
                                    loader: 'file-loader',
                                    options: {
                                        name: 'fonts/[name].[hash:8].[ext]'
                                    }
                                }
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new VueLoaderPlugin(),
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: isProduction ? '"production"' : '""'
                }
            }),
            new webpack.ProvidePlugin({
                Promise: "es6-promise-promise",
                Vue: ["vue/dist/vue.esm.js", "default"]
            }),
            new webpack.HotModuleReplacementPlugin(),
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
                uglifyOptions: {
                    compress: {
                        // https://github.com/mishoo/UglifyJS/tree/harmony#compress-options
                        drop_console: isProduction
                    },
                    output: {
                        comments: false
                    }
                }
            }),
            new MiniCssExtractPlugin({
                filename: "css/[name]/main.css"
            }),
            new OptimizeCSSAssetsPlugin({
                // https://github.com/NMFR/optimize-css-assets-webpack-plugin#configuration
            }),
            new RemovePlugin({
                before: {
                    // parameters for "before normal compilation" stage.
                    include: [
                        './wwwroot/dist'
                    ]
                }
            })
        ]
    };
};
