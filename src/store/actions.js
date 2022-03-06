import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/utils'
export function selectPlay({ commit, state }, { list, index }) {
  commit('setPlayMode', PLAY_MODE.sqeuence)
  commit('setSqeuenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlayList', list)
  commit('setCurrentIndex', index)
}

export function randomPlay({ commit, state }, { list, index }) {
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSqeuenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlayList', shuffle(list))
  commit('setCurrentIndex', 0)
}

export function changeMode({ state, getters, commit }, mode) {
  const currentId = getters.currentSong.id
  if (mode === PLAY_MODE.random) {
    commit('setPlayList', shuffle(state.sqeuenceList))
  } else {
    commit('setPlayList', state.sqeuenceList)
  }
  const index = state.playList.findIndex(el => el.id === currentId)
  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}

export function removeSong({ state, commit }, song) {
  const playList = state.playList.slice()
  const sqeuenceList = state.sqeuenceList.slice()
  const playIndex = findIndex(playList, song)
  const sqeuenceIndex = findIndex(sqeuenceList, song)
  if (sqeuenceIndex < 0 || playIndex < 0) {
    return
  }
  let currentIndex = state.currentIndex
  if (playIndex < currentIndex || currentIndex === playList.length - 1) {
    currentIndex--
  }
  playList.splice(playIndex, 1)
  sqeuenceList.splice(sqeuenceIndex, 1)
  console.log(sqeuenceList)
  console.log(playList)
  console.log(currentIndex)
  commit('setSqeuenceList', sqeuenceList)
  commit('setPlayList', playList)
  commit('setCurrentIndex', currentIndex)
  if (!playList.length) {
    commit('setPlayingState', false)
  }
}

export function addSong({ commit, state }, song) {
  const playlist = state.playList.slice()
  const sequenceList = state.sqeuenceList.slice()
  let currentIndex = state.currentIndex
  const playIndex = findIndex(playlist, song)

  if (playIndex > -1) {
    currentIndex = playIndex
  } else {
    playlist.push(song)
    currentIndex = playlist.length - 1
  }

  const sequenceIndex = findIndex(sequenceList, song)
  if (sequenceIndex === -1) {
    sequenceList.push(song)
  }

  commit('setSqeuenceList', sequenceList)
  commit('setPlayList', playlist)
  commit('setCurrentIndex', currentIndex)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
}

export function clearSongList({ commit }) {
  commit('setSqeuenceList', [])
  commit('setPlayList', [])
  commit('setCurrentIndex', 0)
  commit('setPlayingState', false)
}

function findIndex(list, song) {
  return list.findIndex(item => item.id === song.id)
}
