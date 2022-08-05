<template>
  <div class="dashboard-container">
    <div class="index-bg">欢迎使用{{ title }}</div>
  </div>
</template>

<script>
import defaultSettings from '@/settings'
export default {
  name: 'BgIndex',
  components: {},
  data() {
    return {
      title: defaultSettings.title
    }
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
  font-size: 26px;
  color: #39aef7;
}
</style>
