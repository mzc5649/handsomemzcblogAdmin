<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎您<span class="name"> {{ name }} </span>，进入帅气马哥博客后台</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
    .name {
      color: purple;
    }
  }
}
</style>
