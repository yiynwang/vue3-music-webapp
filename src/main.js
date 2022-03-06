import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router/index";
import lazyPlugin from "vue3-lazy";
import store from "@/store";
import "@/assets/scss/index.scss";
const app = createApp(App);
import loadingImg from "@/assets/images/default.png";
import loadingDirective from "@/components/base/loading/directive";
import onResultDirective from "@/components/base/no-result/directive";
import { load, saveAll } from "@/assets/js/array-store";
import { FAVORITE_KEY, PLAY_KEY } from "@/assets/js/constant";
import { processSongs } from "@/service/song";

const favoriteSongs = load(FAVORITE_KEY);
if (favoriteSongs.length > 0) {
  processSongs(favoriteSongs).then((songs) => {
    store.commit("setFavoriteList", songs);
    saveAll(songs, FAVORITE_KEY);
  });
}

const historySongs = load(PLAY_KEY);
if (historySongs.length > 0) {
  processSongs(historySongs).then((songs) => {
    store.commit("setPlayHistory", songs);
    saveAll(songs, PLAY_KEY);
  });
}

app.use(router);
app.directive("loading", loadingDirective);
app.directive("no-result", onResultDirective);
app.use(store);
app.use(lazyPlugin, {
  loading: loadingImg,
});
app.mount("#app");
