<template>
  <div class="top-detail">
    <music-list
      :rank="true"
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></music-list>
  </div>
</template>

<script>
import { getTopDetail } from '@/service/top-list'
import createDetailComponent from '@/assets/js/create-detail-component'
import { TOP_KEY } from '@/assets/js/constant'
export default createDetailComponent({
  name: 'top-detail',
  key: TOP_KEY,
  featch: getTopDetail
})
</script>
<style lang="scss" scoped>
.top-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
