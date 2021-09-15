
<template>
  <div class="iframe-main">
    <!-- <my-html :url.sync="url1" /> -->
    <iframe :src="url1" frameborder="0" height="100%" width="100%" name="www" />
  </div>
</template>

<script>
// import myHtml from './html'
export default {
  // components: { myHtml },
  data() {
    return {
      url1: 'http://www.cccaonline.org.cn/home'
    }
  },
  mounted() {
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
