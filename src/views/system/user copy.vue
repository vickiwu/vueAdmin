<template>
  <div class="">
    系统用户页面
    <div v-permission="['look']">dsaf</div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters([
      'current_permission'
    ])
  },

  created() {
  },
  methods: {}
}
</script>
 <style lang="scss">

 </style>
