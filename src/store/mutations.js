const mutations = {
  setPlayingState(state, playing) {
    state.playing = playing
  },
  setSqeuenceList(state, list) {
    state.sqeuenceList = list
  },
  setPlayList(state, list) {
    state.playList = list
  },
  setPlayMode(state, mode) {
    state.playMode = mode
  },
  setCurrentIndex(state, index) {
    state.currentIndex = index
  },
  setFullScreen(state, fullScreen) {
    state.fullScreen = fullScreen
  },
  setFavoriteList(state, favoriteList) {
    state.favoriteList = favoriteList
  },
  addSongLyric(state, { song, lyric }) {
    state.sqeuenceList.map(item => {
      if (item.mid === song.mid) {
        item.lyric = lyric
        return item
      }
    })
  },

  setPlayHistory(state, songs) {
    state.playHistory = songs
  },

  setSearchHistory(state, searches) {
    state.searchHistory = searches
  }
}

export default mutations
