<template>
  <div class="app-main">
    <my-html :url.asyc="url1" />
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
    this.url1 = 'http://116.198.205.37:8088/BS-Web//archive/companyCount.jsp?token=6554615015174144'
    this.url2 = 'http://116.198.205.37:8088/BS-Web//archive/companyCount.jsp?token=6554615015174144'
  },
  methods: {
  }
}
</script>
 <style lang="scss">

 </style>
