<template>
  <div class="player" v-show="playList.length">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-play" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.pic" />
        </div>
        <div class="top">
          <div class="back">
            <i class="icon-back" @click="closeFullScreen"></i>
          </div>
          <div class="title">{{ currentSong.name }}</div>
          <div class="subtitle">{{ currentSong.album }}</div>
        </div>
        <div class="middle" @touchstart.prevent="onMiddleTouchStart" @touchmove.prevent="onMiddleTouchMove" @touchend.prevent="onMiddleTouchEnd">
          <div class="middle-l" :style="middeLStyle">
            <div class="cd-warpper" ref="cdWarpperRef">
              <div class="cd" ref="cdRef">
                <img :src="currentSong.pic" class="cd-image" :class="cdCls" ref="cdImageRef" />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricScrollRef" :style="middeRStyle">
            <div class="lyric-warpper">
              <div v-if="currentLyric" ref="lyricListRef">
                <p class="text" :class="{ current: currentLineNum === index }" v-for="(line, index) in currentLyric.lines" :key="line.num">
                  {{ line.txt }}
                </p>
              </div>
            </div>
            <div v-show="purMusicLyric">
              <p>{{ purMusicLyric }}</p>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-warpper">
            <div class="dot" :class="{ active: currentShow === 'cd' }"></div>
            <div class="dot" :class="{ active: currentShow === 'lyric' }"></div>
          </div>
          <div class="progress-warpper">
            <span class="time time-l">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-warpper">
              <progress-bar
                ref="barRef"
                :progress="progress"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
              ></progress-bar>
            </div>
            <span class="time time-r">{{ formatTime(currentSong.duration) }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="modeIcon" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disabledCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disabledCls">
              <i @click="togglePlay" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disabledCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <mini-player :progress="progress" :togglePlay="togglePlay"></mini-player>
    <audio ref="audioRef" @pause="pause" @canplay="ready" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script>
import { computed, watch, ref, nextTick } from "vue";
import { useStore } from "vuex";
import useMode from "./use-mode";
import useFavorite from "./use-favorite";
import progressBar from "./progress-bar.vue";
import { formatTime } from "@/assets/js/utils";
import { PLAY_MODE } from "@/assets/js/constant";
import useCd from "./use-cd";
import useLyirc from "./use-lyric";
import usePlayHistory from "./use-play-history";

import useMiddleInteractive from "./use-middle-interactive";
import Scroll from "@/components/base/scroll/scroll.vue";
import miniPlayer from "./nimi-player.vue";
import useAnimation from "./use-animation";
export default {
  name: "player",
  components: {
    progressBar,
    scroll: Scroll,
    miniPlayer,
  },
  setup() {
    // 自定义变量
    const audioRef = ref(null);
    const songReady = ref(false);
    const currentTime = ref(0);
    const progressChanging = ref(false);
    const barRef = ref(null);
    // store的数据
    const store = useStore();
    const fullScreen = computed(() => store.state.fullScreen);
    const playing = computed(() => store.state.playing);
    const currentSong = computed(() => store.getters.currentSong);
    const playIcon = computed(() => (playing.value ? "icon-pause" : "icon-play"));
    const currentIndex = computed(() => store.state.currentIndex);
    const playList = computed(() => store.state.playList);
    const playMode = computed(() => store.state.playMode);

    const disabledCls = computed(() => (!songReady.value ? "disable" : ""));
    const progress = computed(() => {
      return currentTime.value / currentSong.value.duration;
    });
    // hooks
    const { modeIcon, changeMode } = useMode();
    const { getFavoriteIcon, toggleFavorite } = useFavorite();
    const { cdCls, cdRef, cdImageRef } = useCd();
    const { onMiddleTouchStart, onMiddleTouchMove, onMiddleTouchEnd, currentShow, middeLStyle, middeRStyle } = useMiddleInteractive();
    const { currentLyric, currentLineNum, playLyric, lyricScrollRef, lyricListRef, stopLyric, purMusicLyric, playingLyric } = useLyirc({
      songReady,
      currentTime,
    });
    const { savePlay } = usePlayHistory();

    const { cdWarpperRef, enter, afterEnter, leave, afterLeave } = useAnimation();
    const togglePlay = () => {
      if (!songReady.value) return;
      store.commit("setPlayingState", !playing.value);
    };
    watch(fullScreen, async (newFullScreen) => {
      if (newFullScreen) {
        await nextTick();
        barRef.value.setOffset(progress);
      }
    });
    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return;
      }
      songReady.value = false;
      currentTime.value = 0;
      const audioEl = audioRef.value;
      audioEl.src = newSong.url;
      audioEl.play();
      store.commit("setPlayingState", true);
    });
    watch(playing, (newPlaying) => {
      if (!songReady.value) return;
      const audioEl = audioRef.value;
      if (newPlaying) {
        audioEl.play();
      } else {
        audioEl.pause();
        stopLyric();
      }
    });
    // 监听播放非认为暂停
    const pause = () => {
      store.commit("setPlayingState", false);
    };

    function loop() {
      const audioEl = audioRef.value;
      audioEl.crrentTime = 0;
      audioEl.play();
      store.commit("setPlayingState", true);
    }

    function prev() {
      const list = playList.value;
      if (!list.length || !songReady.value) return;
      let index = currentIndex.value - 1;
      if (list.length === 1) {
        loop();
      } else if (index === -1) {
        index = list.length - 1;
      }
      store.commit("setCurrentIndex", index);
    }
    function next() {
      const list = playList.value;
      if (!list.length || !songReady.value) return;
      let index = currentIndex.value + 1;
      if (list.length === 1) {
        loop();
      } else if (index === list.length) {
        index = 0;
      }
      store.commit("setCurrentIndex", index);
    }
    function ready() {
      if (songReady.value) {
        return;
      }
      songReady.value = true;
      playLyric();
      savePlay(currentSong.value);
    }

    function updateTime(e) {
      if (!progressChanging.value) {
        currentTime.value = e.target.currentTime;
      }
    }

    // 进度条拖拽中
    function onProgressChanging(progress) {
      progressChanging.value = true;
      currentTime.value = currentSong.value.duration * progress;
      playLyric();
      stopLyric();
    }
    // 进度条放开
    function onProgressChanged(progress) {
      const audioEl = audioRef.value;
      audioEl.currentTime = currentSong.value.duration * progress;
      if (!playing.value) {
        store.commit("setPlayingState", true);
      }
      playLyric();
      progressChanging.value = false;
    }

    function closeFullScreen() {
      store.commit("setFullScreen", false);
    }

    function end() {
      currentTime.value = 0;
      if (playMode.value === PLAY_MODE.loop) {
        loop();
      } else {
        next();
      }
    }
    return {
      audioRef,
      currentSong,
      fullScreen,
      playing,
      playIcon,
      togglePlay,
      pause,
      prev,
      next,
      ready,
      disabledCls,
      modeIcon,
      changeMode,
      getFavoriteIcon,
      toggleFavorite,
      // progress
      progress,
      updateTime,
      formatTime,
      currentTime,
      onProgressChanging,
      onProgressChanged,
      barRef,
      end,
      playList,
      // cd
      cdCls,
      cdRef,
      cdImageRef,
      // lyric
      currentLyric,
      currentLineNum,
      lyricScrollRef,
      lyricListRef,
      purMusicLyric,
      playingLyric,
      // middle-interactiue
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
      currentShow,
      middeLStyle,
      middeRStyle,
      // fullscreen
      closeFullScreen,
      // animation
      cdWarpperRef,
      enter,
      afterEnter,
      leave,
      afterLeave,
    };
  },
};
</script>

<style lang="scss" scoped>
.player {
  .normal-play {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #222;
    z-index: 150;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 20;
      transform: translateZ(2px);
      .icon-back {
        display: block;
        padding: 10px;
        font-size: 22px;
        color: $color-theme;
        transform: rotate(-90deg);
      }
    }
    .title {
      width: 70%;
      margin: 0 auto;
      line-height: 40px;
      text-align: center;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-size: 18px;
      color: $color-text;
    }
    .subtitle {
      line-height: 20px;
      text-align: center;
      font-size: 14px;
      color: $color-text;
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-warpper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            .cd-image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid hsla(0, 0%, 100%, 0.1);
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: 14px;
            color: hsla(0, 0%, 100%, 0.5);
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-warpper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
        }
        .text {
          color: hsla(0, 0%, 100%, 0.5);
          line-height: 32px;
          font-size: 14px;
        }
        .current {
          color: $color-text;
        }
      }
    }
    .progress-warpper {
      display: flex;
      align-items: center;
      width: 80%;
      margin: 0 auto;
      padding: 10px 0;
    }
    .time {
      color: $color-text;
      font-size: 12px;
      flex: 0 0 40px;
      line-height: 30px;
      &.time-l {
        text-align: left;
      }
      &.time-r {
        text-align: right;
      }
    }
    .progress-bar-warpper {
      flex: 1;
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-warpper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: hsla(0, 0%, 100%, 0.5);
          &.active {
            width: 20px;
            border-radius: 5px;
            background: hsla(0, 0%, 100%, 0.8);
          }
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          font-size: 30px;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          font-size: 40px;
        }
        .i-left {
          text-align: right;
        }
        .i-right {
          text-align: left;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}

.playing {
  animation: rotate 20s linear infinite;
}
</style>
