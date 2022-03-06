<template>
  <div class="top-list" v-loading="loading">
    <scroll class="top-list-content">
      <ul>
        <li
          class="item"
          v-for="item in topList"
          :key="item.id"
          @click="onSelect(item)"
        >
          <div class="icon">
            <img :src="item.pic" width="100" height="100" />
          </div>
          <div class="song-list">
            <div
              class="song"
              v-for="(song, sIndex) in item.songList"
              :key="song.id"
            >
              {{ sIndex + 1 }}·{{ item.name }}
            </div>
          </div>
        </li>
      </ul>
    </scroll>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedTop"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getTopList } from '@/service/top-list'
import Scroll from '@/components/wrap-scroll/index'
import { TOP_KEY } from '@/assets/js/constant'
import storage from 'good-storage'
export default {
  name: 'top-list',
  components: {
    Scroll
  },
  data() {
    return {
      topList: [],
      loading: true,
      selectedTop: null
    }
  },
  methods: {
    onSelect(top) {
      this.selectedTop = top
      this.cacheTop(top)
      this.$router.push({ path: `/top-list/${top.id}` })
    },
    cacheTop(top) {
      storage.session.set(TOP_KEY, top)
    }
  },
  async created() {
    const { topList = [] } = await getTopList()
    this.topList = topList
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.top-list {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .top-list-content {
    overflow: hidden;
    height: 100%;
    .item {
      display: flex;
      height: 100px;
      margin: 0 20px;
      margin-top: 20px;
      .icon {
        width: 100px;
        height: 100px;
      }
      .song-list {
        display: flex;
        flex: 1;
        justify-content: center;
        flex-direction: column;
        padding: 0 20px;
        font-size: $font-size-small;
        color: $color-text-d;
        background-color: $color-highlight-background;
        .song {
          @include no-wrap();
          line-height: 26px;
        }
      }
      &:last-of-type {
        padding-bottom: 20px;
      }
    }
  }
}
</style>
