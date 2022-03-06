<template>
  <div class="singer-detail">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></music-list>
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer.js'
import createDetailComponent from '@/assets/js/create-detail-component'
import { SINGER_KEY } from '@/assets/js/constant'
export default createDetailComponent({
  name: 'singer-detail',
  key: SINGER_KEY,
  featch: getSingerDetail
})
</script>
<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
