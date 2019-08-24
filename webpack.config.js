const manifest = require('./src/manifest')
const path = require('path')
const plugins = {
  clean: (() => {
    const { CleanWebpackPlugin } = require('clean-webpack-plugin')
    return CleanWebpackPlugin
  })(),
  extractCSS: require('mini-css-extract-plugin'),
  makeJSON: require('generate-json-webpack-plugin'),
  copy: require('copy-webpack-plugin'),
  html: require('html-webpack-plugin'),
  zip: require('zip-webpack-plugin'),
  fixStyleOnlyEntries: require('webpack-fix-style-only-entries')
}

module.exports = (env = {}, argv) => {
  const isProduction = argv.mode === 'production'

  const config = {
    context: path.resolve(__dirname, 'src'),

    entry: {
      background: './scripts/background.js',
      inject: [
        './scripts/inject.js',
        './styles/inject.scss'
      ],
      popup: [
        './scripts/popup.js',
        './styles/popup.scss'
      ],
      welcome: [
        './styles/welcome.scss'
      ]
    },

    output: {
      path: path.resolve(__dirname, 'dist'),
      // publicPath: '',
      filename: 'scripts/[name].js'
    },

    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            plugins.extractCSS.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: !isProduction
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                sourceMap: !isProduction,
                plugins: (() => [
                  require('autoprefixer')(),
                  ...isProduction ? [
                    require('cssnano')({
                      preset: ['default', {
                        minifySelectors: false
                      }]
                    })
                  ] : []
                ])
              }
            },
            {
              loader: 'sass-loader',
              options: {
                implementation: require('sass'),
                outputStyle: 'expanded',
                sourceMap: !isProduction
              }
            }
          ]
        },
        // {
        //   test: /\.js$/,
        //   exclude: /node_modules/,
        //   use: {
        //     loader: 'babel-loader',
        //     options: {
        //       presets: ['@babel/preset-env']
        //     }
        //   }
        // },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name].[ext]',
                publicPath: '..'
              }
            },
            {
              loader: 'image-webpack-loader',
              options: {
                disable: !isProduction,
                mozjpeg: {
                  progressive: true,
                  quality: 80
                },
                optipng: {
                  enabled: false
                },
                pngquant: {
                  quality: '80-90',
                  speed: 5
                },
                gifsicle: {
                  interlaced: false
                }
              }
            }
          ]
        },
        {
          test: /\.pug$/,
          use: {
            loader: 'pug-loader',
            options: {
              pretty: !isProduction
            }
          }
        }
      ]
    },

    plugins: (() => {
      let common = [
        new plugins.clean(),
        new plugins.copy([
          {
            from: 'icons/**/*.png'
          }
        ]),
        new plugins.html({
          template: 'popup.pug',
          filename: 'popup.html',
          inject: false,
          minify: {
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
          }
        }),
        new plugins.html({
          template: 'welcome.pug',
          filename: 'welcome.html',
          inject: false,
          minify: {
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
          }
        }),
        new plugins.makeJSON('manifest.json', manifest, null, isProduction ? null : 2),
        new plugins.extractCSS({
          filename: 'styles/[name].css'
        })
      ]

      let production = [
        new plugins.fixStyleOnlyEntries(),
        new plugins.zip({
          path: path.resolve(__dirname),
          filename: 'build.zip'
        })
      ]

      return isProduction ? common.concat(production) : common
    })(),

    devtool: (() => {
      return isProduction
        ? ''
        : 'source-map'
    })(),

    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
        '@': path.resolve(__dirname, 'src/scripts')
      }
    }
  }

  return config
}
