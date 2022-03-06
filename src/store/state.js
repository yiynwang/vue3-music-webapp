import { load } from '@/assets/js/array-store'
import { PLAY_MODE, FAVORITE_KEY, SEARCH_KEY } from '@/assets/js/constant'
const state = {
  sqeuenceList: [],
  playList: [],
  playing: false,
  playMode: PLAY_MODE.sqeuence,
  currentIndex: 0,
  fullScreen: false,
  favoriteList: load(FAVORITE_KEY),
  searchHistory: load(SEARCH_KEY),
  playHistory: []
}

export default state
