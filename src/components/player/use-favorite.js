import { computed } from 'vue'
import { useStore } from 'vuex'
import { save, remove } from '@/assets/js/array-store'
import { FAVORITE_KEY } from '@/assets/js/constant'
export default function useFavorite() {
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList)

  function getFavoriteIcon(song) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  function isFavorite(song) {
    return favoriteList.value.findIndex(item => item.id === song.id) > -1
  }

  function toggleFavorite(song) {
    let list
    const maxLen = 100
    if (isFavorite(song)) {
      //   remove();
      const list = remove(FAVORITE_KEY, compare)
      store.commit('setFavoriteList', list)
    } else {
      //   add();
      const list = save(song, FAVORITE_KEY, compare, maxLen)
      store.commit('setFavoriteList', list)
    }
    function compare(item) {
      return item.id === song.id
    }
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}
