import { ref } from "vue";
export default function useMiddleInteractive() {
  const currentShow = ref("cd");
  const middeLStyle = ref(null);
  const middeRStyle = ref(null);
  let currentView = "cd";
  const touch = {};
  function onMiddleTouchStart(e) {
    touch.startX = e.touches[0].pageX;
    this.touchY = e.touches[0].pageY
  }

  function onMiddleTouchMove(e) {
    const deltaX = e.touches[0].pageX - touch.startX;
    const left = currentView === "cd" ? 0 : -window.innerWidth;
    const offsetWidth = Math.min(
      0,
      Math.max(-window.innerWidth, left + deltaX)
    );
    touch.percent = Math.abs(offsetWidth / window.innerWidth);
    if (currentView === "cd") {
      if (touch.percent > 0.3) {
        currentShow.value = "lyric";
      } else {
        currentShow.value = "cd";
      }
    } else {
      if (touch.percent < 0.7) {
        currentShow.value = "cd";
      } else {
        currentShow.value = "lyric";
      }
    }

    middeLStyle.value = {
      opacity: 1 - touch.percent,
      transitionDuration: "0ms",
    };
    middeRStyle.value = {
      transitionDuration: "0ms",
      transform: `translate3d(${offsetWidth}px,0,0)`,
    };
  }

  function onMiddleTouchEnd(e) {
    let offsetWidth;
    let opacity;
    if (currentShow.value === "cd") {
      currentView = "cd";
      offsetWidth = 0;
      opacity = 1;
    } else {
      currentView = "lyric";
      offsetWidth = -window.innerWidth;
      opacity = 0;
    }
    const duration = 300
    console.log();

    middeLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`,
    };
    middeRStyle.value = {
      transitionDuration: `${duration}ms`,
      transform: `translate3d(${offsetWidth}px,0,0)`,
    };
  }

  return {
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd,
    currentShow,
    middeLStyle,
    middeRStyle,
  };
}
