
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
      url1: 'https://cn.vuejs.org/index.html'
    }
  },
  mounted() { // http://172.172.0.208:8066/old/login.html
    if (this.$router.currentRoute.meta.url) {
      this.url1 = this.$router.currentRoute.meta.url
      console.log(this.$router.currentRoute.meta.url, 'ddd')
    }
  },
  methods: {
  }
}
</script>
 <style lang="scss">
.iframe-main{
    height: calc(100vh - 150px);
    width: calc(100% + 25px);
    margin: -10px;
}
 </style>
