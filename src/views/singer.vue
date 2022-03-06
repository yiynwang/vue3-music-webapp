<template>
  <div class="singer">
    <index-list :data="singers" @select="onSelect"></index-list>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer.js'
import IndexList from '@/components/index-list/index-list.vue'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
export default {
  name: 'singer',
  components: {
    IndexList
  },
  data() {
    return {
      singers: [],
      selectedSinger: null
    }
  },
  methods: {
    async onSelect(singer) {
      this.selectedSinger = singer
      storage.session.set(SINGER_KEY, singer)
      this.$router.push({
        path: `/singer/${singer.mid}`
      })
    }
  },
  async created() {
    const { singers = [] } = await getSingerList()
    this.singers = singers
  }
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
