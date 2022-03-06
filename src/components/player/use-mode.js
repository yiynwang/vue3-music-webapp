import { PLAY_MODE } from "@/assets/js/constant";
import { useStore } from "vuex";
import { computed } from "vue";
export default function useMode() {
  const store = useStore();
  const playMode = computed(() => store.state.playMode);
  const modeMap = {
    [PLAY_MODE.sqeuence]: {class:"icon-sequence",label:'顺序播放'},
    [PLAY_MODE.loop]: {class:"icon-loop",label:'单曲循环'},
    [PLAY_MODE.random]: {class:"icon-random",label:'随机播放'},
  };
  const modeIcon = computed(() => {
    return modeMap[playMode.value].class;
  });
  const modeText = computed(() => {
    return modeMap[playMode.value].label
  })
  function changeMode() {
    const mode = (playMode.value + 1) % 3;
    console.log(mode);
    store.dispatch("changeMode",mode);
  }
  return { modeIcon, changeMode,modeText };
}
