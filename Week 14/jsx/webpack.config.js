module.exports = {
  entry:'./main.js',  // 配置入口
  module:{  // 配置模块
    rules: [
      {
        test:/\.js$/,  // 正则，需要打包的文件（这里是全部的js文件）
        use:{
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [["@babel/plugin-transform-react-jsx", {pragma:"creatElement"}]]  // 为了能使用jsx
          }
        }
      }
    ]
  },
  mode: "development"
}