import { get } from "./base";

export async function processSongs(songs) {
  if (!songs.length) return [];
  const mids = songs.map((song) => song.mid);
  const { map } = await get("/api/getSongsUrl", { mid: mids });
  return songs
    .map((song) => {
      song.url = map[song.mid];
      return song;
    })
    .filter((song) => song.url.indexOf("vkey") > -1);
}
const lyricMap = {};
export async function getLyric(song) {
  const { mid } = song;
  if (song.lyric) return song.lyric;
  if (lyricMap[mid]) return lyricMap[mid];
  const { lyric = "[00:00:00] 该歌词暂时无法获取" } = await get(
    "/api/getLyric",
    {
      mid,
    }
  );
  lyricMap[mid] = lyric;
  return lyric;
}
