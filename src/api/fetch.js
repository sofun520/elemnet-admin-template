import axios from 'axios'//引入axios

export default {
  fetch: function (options) {
    var _this = this
    return new Promise((resolve, reject) => {
      const instance = axios.create({  //instance创建一个axios实例，可以自定义配置，可在 axios文档中查看详情
        //所有的请求都会带上这些配置，比如全局都要用的身份信息等。
        headers: {
          'Content-Type': 'application/json',
          'token':localStorage.getItem("token"),
          'timestamp':(new Date()).getTime()
          // 'token_in_header': global_.token,//token从全局变量那里传过来
        },
        timeout: 30 * 1000 // 30秒超时
      })
      instance(options)
        .then(response => { //then 请求成功之后进行什么操作
          //拦截请求，根据errCode来进行不同的操作

          resolve(response)//把请求到的数据发到引用请求的地方

          /*if (response.data.success) {
            resolve(response)//把请求到的数据发到引用请求的地方
          } else {
            if ('1001005' == response.data.errorCode) {
              //如果是没有登录，则跳到登录页面
              window.location.href = '/console/#/'
            } else {
              console.log('>>>>>>>>>>>>>>>>>>>>');
              console.log(response.data.errorMsg);
              //其他异常则弹出异常框
              //_this.$Message.error(response.data.errorMsg)
            }
          }*/
        })
        .catch(error => {
          console.log('请求异常信息：' + error)
          reject(error)
        })
    })
  }
}
