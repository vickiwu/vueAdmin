
<template>
  <div class="iframe-main">
    <my-html :url.sync="url1" />
  </div>
</template>

<script>
import myHtml from './html'
export default {
  components: { myHtml },
  data() {
    return {
      url1: '',
      url2: ''
    }
  },
  mounted() { // http://172.172.0.208:8066/old/login.html
    this.url1 = 'https://cn.vuejs.org/index.html'
    this.url2 = 'http://116.198.205.37:8088/BS-Web//archive/companyCount.jsp?token=6554615015174144'
  },
  methods: {
  }
}
</script>
 <style lang="scss">
.iframe-main{
    height: calc(100vh - 140px);
    width: calc(100% + 80px);
    margin: -40px;
}
 </style>
