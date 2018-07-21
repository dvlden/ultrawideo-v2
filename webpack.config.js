const path = require('path')
const plugins = {
  clean: require('clean-webpack-plugin'),
  extractCSS: require('mini-css-extract-plugin')
}

module.exports = (env = {}, argv) => {
  const isProduction = argv.mode === 'production'

  return {
    context: path.resolve(__dirname, 'src'),

    entry: {
      'background': './scripts/background.js',

      'inject': [
        './scripts/inject.js',
        './styles/inject.scss'
      ],

      'popup': [
        './scripts/popup.js',
        './styles/popup.scss'
      ]
    },

    output: {
      path: path.resolve(__dirname, 'extension/dist'),
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
                sourceMap: ! isProduction
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                sourceMap: ! isProduction,
                plugins: (loader => {
                  return isProduction ? [
                    require('autoprefixer')(),
                    require('cssnano')({
                      preset: ['default', {
                        minifySelectors: false
                      }]
                    })
                  ] : []
                })()
              }
            },
            {
              loader: 'sass-loader',
              options: {
                outputStyle: 'expanded',
                sourceMap: ! isProduction
              }
            }
          ]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          exclude: /fonts/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name].[ext]',
                // publicPath: '..' // use relative urls
              }
            },
            {
              loader: 'image-webpack-loader',
              options: {
                disable: ! isProduction,
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
      ]
    },

    plugins: [
      new plugins.clean(['extension/dist']),

      new plugins.extractCSS({
        filename: 'styles/[name].css'
      })
    ],

    devtool: (() => {
      return isProduction
        ? '' // 'hidden-source-map'
        : 'source-map'
    })(),

    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
        '~': path.resolve(__dirname, 'src/scripts/')
      }
    }
  }
};
