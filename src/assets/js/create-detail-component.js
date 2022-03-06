import MusicList from '@/components/music-list/music-list.vue'
import { processSongs } from '@/service/song.js'
import storage from 'good-storage'
import { ALBUM_KEY, SINGER_KEY } from '@/assets/js/constant'
export default function createdDetailComponent({ name, key, featch }) {
  return {
    name,
    props: {
      data: Object
    },
    data() {
      return {
        loading: false,
        songs: []
      }
    },
    components: {
      MusicList
    },
    computed: {
      computedData() {
        const data = this.data
        let ret = null
        if (data) {
          ret = data
        } else {
          const cachedData = storage.session.get(key)
          const keyMap = {
            [ALBUM_KEY]: 'id',
            [SINGER_KEY]: 'mid'
          }
          const curmid = this.$route.params.id
          if (cachedData && cachedData[keyMap[key]].toString() === curmid) {
            ret = cachedData
          }
        }
        return ret
      },
      pic() {
        const data = this.computedData
        return data && data.pic
      },
      title() {
        const data = this.computedData
        return data && (data.name || data.title)
      }
    },
    async created() {
      const computedData = this.computedData
      if (!computedData) {
        const path = this.$route.matched[0].path
        this.$router.push(path)
        return
      }
      const respone = await featch(computedData)
      const songs = await processSongs(respone.songs)
      this.loading = false
      this.songs = songs
    }
  }
}
