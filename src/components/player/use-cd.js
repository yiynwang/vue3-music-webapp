import { useStore } from "vuex";
import { computed, watch, ref } from "vue";
export default function useCd() {
  const cdRef = ref(null);
  const cdImageRef = ref(null);
  const store = useStore();
  const playing = computed(() => store.state.playing);
  const cdCls = computed(() => (playing.value ? "playing" : ""));
  watch(playing, () => {
    if (!playing.value) {
      syncTransform(cdRef.value, cdImageRef.value);
    }
  });
  function syncTransform(warpper, inner) {
    const innerTransform = getComputedStyle(inner).transform; // 获取cd图片的transform
    const warpperTransform = getComputedStyle(warpper).transform;
    const transform =
      warpperTransform === "none"
        ? innerTransform
        : warpperTransform.concat(" ", innerTransform);
    warpper.style.transform = transform;
  }
  return {
    cdCls,
    cdRef,
    cdImageRef,
  };
}
