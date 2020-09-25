<template>
  <section class="app-main">
    <div class="app-basic-container">
      <transition
        name="fade-transform"
        mode="out-in"
      >
        <router-view :key="key" />
      </transition>
    </div>

  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar 34=tagsView   topbar =56*/
  /*140 = tagsView34 + navbar 50 + topbar 56  */
  min-height: calc(100vh - 140px);
  width: 100%;
  position: relative;
  overflow: hidden;
  .app-basic-container{
    margin: 5px;
    padding: 10px;
    border-radius: 5px;
    background: #ffffff;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    height: calc(100vh - 150px);
  }
}
.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 140 = navbar + tags-view+ topbar = 50 + 34 + 56 */
    min-height: calc(100vh - 140px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
