<template>
  <teleport to="body">
    <transition name="list-fade">
      <div class="playlist" v-show="visible && playlist.length" @click="hide">
        <div class="list-wrapper">
          <div class="list-header">
            <div class="title">
              <i class="icon" :class="modeIcon" @click.stop="changeMode"></i>
              <span class="text">{{ modeText }}</span>
              <span class="clear" @click.stop="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </div>
          </div>
          <scroll class="list-content" ref="scrollRef">
            <transition-group name="list" tag="ul" ref="listRef">
              <li
                class="item"
                v-for="song in sqeuenceList"
                :key="song.id"
                @click.stop="selectSong(song)"
              >
                <i class="current" :class="getCurrentSong(song)"></i>
                <span class="text">{{ song.name }}</span>
                <span class="favorite" @click.stop="toggleFavorite(song)">
                  <i :class="getFavoriteIcon(song)"> </i>
                </span>
                <span
                  class="delete"
                  @click.stop="removeSong(song)"
                  :class="{ disable: removing }"
                >
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </scroll>
          <div class="list-add">
            <div class="add" @click="showAddSong">
              <i class="icon-add"></i>
              <span class="text">添加歌曲到队列</span>
            </div>
          </div>
          <div class="list-footer" @click="hide">
            <span>关闭</span>
          </div>
          <confirm
            ref="confirmRef"
            @confirm="confirmClear"
            text="是否清空播放列表？"
            confirm-btn-text="清空"
          ></confirm>
          <add-song ref="addSongRef"></add-song>
        </div>
      </div>
    </transition>
  </teleport>
</template>
<script>
import Scroll from '@/components/base/scroll/scroll.vue'
import { useStore } from 'vuex'
import { computed, nextTick, ref, watch } from 'vue'
import useMode from './use-mode'
import useFavorite from './use-favorite'
import confirm from '@/components/base/confirm/confirm.vue'
import addSong from '@/components/add-song/add-song.vue'
export default {
  components: {
    Scroll,
    confirm,
    addSong
  },
  name: 'playList',
  setup() {
    const visible = ref(false)
    const scrollRef = ref(null)
    const listRef = ref(null)
    const removing = ref(null)
    const confirmRef = ref(null)
    const addSongRef = ref(null)
    const store = useStore()
    const playlist = computed(() => store.state.playList)
    const sqeuenceList = computed(() => store.state.sqeuenceList)
    const currentSong = computed(() => store.getters.currentSong)
    const { modeIcon, changeMode, modeText } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()

    watch(currentSong, async newSong => {
      if (!visible.value || !newSong.id) {
        return
      }
      await nextTick()
      scrollToSong()
    })

    async function show() {
      visible.value = true
      await nextTick()
      refreshScroll()
      scrollToSong()
    }
    function hide() {
      visible.value = false
    }

    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }
    function getCurrentSong(song) {
      return { 'icon-play': song.id === currentSong.value.id }
    }

    function removeSong(song) {
      let removingVal = removing.value
      if (removingVal) {
        return
      }
      removingVal = true
      store.dispatch('removeSong', song)
      if (!playlist.value.length) {
        hide()
      }
      setTimeout(() => {
        removing.value = false
      }, 300)
    }

    function scrollToSong() {
      const index = sqeuenceList.value.findIndex(song => {
        return currentSong.value.id === song.id
      })
      const target = listRef.value.$el.children[index]
      scrollRef.value.scroll.scrollToElement(target, 300)
    }

    function selectSong(song) {
      const index = sqeuenceList.value.findIndex(item => {
        return song.id === item.id
      })
      if (index > -1) {
        store.commit('setCurrentIndex', index)
        store.commit('setPlayingState', true)
      }
    }

    function showConfirm() {
      confirmRef.value.show()
    }

    function confirmClear() {
      store.dispatch('clearSongList')
      hide()
    }

    function showAddSong() {
      addSongRef.value.show()
    }

    return {
      playlist,
      sqeuenceList,
      visible,
      hide,
      show,
      refreshScroll,
      listRef,
      scrollRef,
      // playmode
      modeIcon,
      modeText,
      changeMode,
      // favoerite
      getFavoriteIcon,
      toggleFavorite,
      // current- playicon
      getCurrentSong,
      removeSong,
      selectSong,
      confirmClear,
      confirmRef,
      showConfirm,
      showAddSong,
      addSongRef
    }
  }
}
</script>

<style lang="scss" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter-from,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .favorite {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
        }
      }
    }
    .list-add {
      width: 140px;
      margin: 20px auto 30px auto;
      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;
        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }
        .text {
          font-size: $font-size-small;
        }
      }
    }
    .list-footer {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
