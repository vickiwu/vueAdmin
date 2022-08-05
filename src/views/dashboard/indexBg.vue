<template>
  <div class="dashboard-container">
    <div class="index-bg">欢迎使用XXX管理系统</div>
  </div>
</template>

<script>
export default {
  name: 'BgIndex',
  components: {},
  data() {
    return {}
  },

  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  height: 100%;
  // padding-top: 18px;
  position: relative;
  .index-bg {
    min-height: 100%;
    width: 100%;
    background: rgba(201, 201, 201, 0.287) url('~@/assets/index-bg.jpg') center
      fixed no-repeat;
    background-size: cover;
    background-blend-mode: multiply;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 29px;
    color: #39aef7;
  }
}
</style>
