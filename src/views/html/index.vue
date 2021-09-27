
<template>
  <div class="iframe-main">
    <!-- <my-html :url.sync="url1" /> -->
    <div @click="sendMessage">向iframe发送信息</div>
    <iframe id="myHtml" ref="iframe" :src="url1" frameborder="0" height="100%" width="100%" name="www" />

  </div>
</template>

<script>
// import myHtml from './html'
export default {
  // components: { myHtml },
  data() {
    return {
      url1: 'http://www.cccaonline.org.cn/home',
      iframeWin: {}
    }
  },

  mounted() {
    if (this.$router.currentRoute.meta.url) {
      this.url1 = this.$router.currentRoute.meta.url
      console.log(this.$router.currentRoute.meta.url, 'ddd')
    }
    console.log(this.$refs.iframe)
    console.log(this.$refs.iframe.contentWindow)
    // 在外部vue的window上添加postMessage的监听，并且绑定处理函数handleMessage
    window.addEventListener('message', this.handleMessage)
    this.iframeWin = this.$refs.iframe.contentWindow
  },
  methods: {
    sendMessage() {
      alert(1)
      // 向iframe内部传数据
      this.iframeWin.postMessage({
        cmd: 'getFormJson',
        params: {}
      }, '*')
    },
    handleMessage(event) {
      console.log('%c 🍣 event: ', 'font-size:20px;background-color: #42b983;color:#fff;', event)
      // 根据上面制定的结构来解析iframe内部发回来的数据
      const data = event.data
      console.log('%c 🍸 data: ', 'font-size:20px;background-color: #2EAFB0;color:#fff;', data)
      // switch (data.cmd) {
      //   case 'returnFormJson':
      //   // 业务逻辑
      //     break
      //   case 'returnHeight':
      //   // 业务逻辑
      //     break
      // }
    }
  }
}
</script>
 <style lang="scss">
.iframe-main{
    // height: calc(100vh - 150px);
    // width: calc(100% + 25px);
    // margin: -10px;
    height: 100%;
    width: 100%;
    overflow: hidden;
}
 </style>
