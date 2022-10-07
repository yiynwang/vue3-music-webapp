import { useStore } from "vuex";
import { computed, watch, ref } from "vue";
import { getLyric } from "@/service/song";
import Lyric from "lyric-parser";
export default function useLyirc({ songReady, currentTime }) {
  const currentLyric = ref(null);
  const lyricScrollRef = ref(null);
  const lyricListRef = ref(null);
  const currentLineNum = ref(0);
  const purMusicLyric = ref("");
  const playingLyric = ref("");
  const store = useStore();
  const currentSong = computed(() => store.getters.currentSong);
  watch(currentSong, async (newSong) => {
    if (!newSong.url || !newSong.id) {
      return;
    }
    stopLyric();
    currentLyric.value = null;
    currentLineNum.value = 0;
    playingLyric.value = "";
    purMusicLyric.value = "";
    const lyric = await getLyric(newSong);
    store.commit("addSongLyric", { song: newSong, lyric });
    if (currentSong.value.lyric !== lyric) return;
    currentLyric.value = new Lyric(lyric, handleLyric);
    const hasLyric = currentLyric.value.lines.length;
    if (hasLyric) {
      if (songReady) {
        playLyric();
      }
    } else {
      purMusicLyric.value = lyric.replce(/(\d{2}):(\d{2}):(\d{2})/g, "");
    }
  });
  function handleLyric({ lineNum, txt }) {
    currentLineNum.value = lineNum;
    playingLyric.value = txt;
    const scrollCom = lyricScrollRef.value;
    const listEl = lyricListRef.value;
    if (!listEl) {
      return;
    }
    if (lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5];
      scrollCom.scroll.scrollToElement(lineEl, 1000);
    } else {
      scrollCom.scroll.scrollTo(0, 0, 0);
    }
  }
  function stopLyric() {
    const currentILyricValue = currentLyric.value;
    if (currentILyricValue) {
      currentILyricValue.stop();
    }
  }
  function playLyric() {
    const currentILyricValue = currentLyric.value;
    if (currentILyricValue) {
      currentILyricValue.seek(currentTime.value * 1000);
    }
  }
  return {
    currentLyric,
    currentLineNum,
    playLyric,
    lyricScrollRef,
    lyricListRef,
    stopLyric,
    purMusicLyric,
    playingLyric,
  };
}
