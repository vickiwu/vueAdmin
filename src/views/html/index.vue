
<template>
  <div class="iframe-main">
    <!-- <my-html :url.sync="url1" /> -->
    <div @click="sendPage">向iframe发送信息</div>
    <iframe id="myHtml" ref="iframe" :src="url1" frameborder="0" height="100%" width="100%" name="www" />

  </div>
</template>

<script>
export default {
  data() {
    return {
      url1: 'http://www.cccaonline.org.cn/home',
      iframeWin: {}
    }
  },
  watch: {
    '$route': {
      handler: (val) => {
        console.log('%c 🍟 val: ', 'font-size:20px;background-color: #33A5FF;color:#fff;', val)
      },
      immediate: true
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
    const win = document.getElementById('myHtml').contentWindow
    console.log('%c 🍿 win: ', 'font-size:20px;background-color: #93C0A4;color:#fff;', win, this.iframeWin)
    window.addEventListener('message', function(event) {
      console.log('%c 🥤 event: ', 'font-size:20px;background-color: #FCA650;color:#fff;', event, event.data)
    })
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
    sendPage() {
      const win = document.getElementById('myHtml').contentWindow
      win.postMessage('信息', '*')
    },
    handleMessage(event) {
      // console.log('%c 🍣 event: ', 'font-size:20px;background-color: #42b983;color:#fff;', event)
      // 根据上面制定的结构来解析iframe内部发回来的数据
      // const data = event.data
      // console.log('%c 🍸 data: ', 'font-size:20px;background-color: #2EAFB0;color:#fff;', data)
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
