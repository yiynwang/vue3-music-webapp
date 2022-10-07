import { nextTick, ref, watch, computed } from "vue";
export default function useFixed(props) {
  const TITLE_HEIGHT = 30;
  const groupRef = ref(null);
  const scrollY = ref(0);
  const listHeights = ref([]);
  const currentIndex = ref(0);
  const distance = ref(0);
  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return "";
    }
    const currentGroup = props.data[currentIndex.value];
    return currentGroup ? currentGroup.title : "";
  });

  const fixedStyle = computed(() => {
    const distanceVal = distance.value;
    const diff = distanceVal > 0 && distanceVal < TITLE_HEIGHT ? distanceVal - TITLE_HEIGHT : 0;
    return {
      transform: `translate3d(0,${diff}px,0)`,
    };
  });

  watch(
    () => props.data,
    async () => {
      await nextTick();
      calculate();
    }
  );
  watch(scrollY, (newY) => {
    const listHeightsVal = listHeights.value;
    for (let i = 0; i < listHeightsVal.length - 1; i++) {
      const heightTop = listHeightsVal[i];
      const heightBottom = listHeightsVal[i + 1];
      console.log(listHeightsVal.length, i + 1);
      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = i;
        distance.value = heightBottom - newY;
      }
    }
  });

  function calculate() {
    const childList = groupRef.value.children;
    const listHeightsVal = listHeights.value;
    let height = 0;
    listHeightsVal.length = 0;
    listHeightsVal.push(height);
    for (let i = 0; i < childList.length; i++) {
      const ele = childList[i];
      height += ele.clientHeight;
      listHeightsVal.push(height);
    }
  }
  function onScroll(pos) {
    scrollY.value = -pos.y;
  }

  return { groupRef, onScroll, currentIndex, fixedTitle, fixedStyle };
}
