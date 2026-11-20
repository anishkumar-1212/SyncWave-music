import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSession } from "./SessionContext";
import { api } from "../services/api";
const C = createContext();
export const usePlayer = () => useContext(C);
const position = (s) =>
  s.isPlaying
    ? s.position + (Date.now() - new Date(s.playbackUpdatedAt)) / 1000
    : s.position;
export function PlayerProvider({ children }) {
  const audio = useRef(new Audio());
  const [current, setCurrent] = useState(null),
    [queue, setQueue] = useState([]),
    [index, setIndex] = useState(0),
    [playing, setPlaying] = useState(false),
    [time, setTime] = useState(0),
    [duration, setDuration] = useState(0),
    [volume, setVolumeState] = useState(0.75),
    [shuffle, setShuffle] = useState(false),
    [repeat, setRepeat] = useState("off");
  const { state, command } = useSession();
  useEffect(() => {
    const a = audio.current;
    a.volume = volume;
    const tick = () => setTime(a.currentTime),
      metadata = () => setDuration(a.duration);
    a.addEventListener("timeupdate", tick);
    a.addEventListener("loadedmetadata", metadata);
    return () => {
      a.removeEventListener("timeupdate", tick);
      a.removeEventListener("loadedmetadata", metadata);
      a.pause();
    };
  }, []);
  const send = (x) => state && command(x);
  const playSong = (
    song,
    items = queue,
    i = items.findIndex((x) => x._id === song._id),
  ) => {
    setCurrent(song);
    setQueue(items);
    setIndex(i < 0 ? 0 : i);
    audio.current.src = song.audioUrl;
    audio.current
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
    send({
      type: "select",
      songId: song._id,
      queue: items.map((x) => x._id),
      queueIndex: i,
      isPlaying: true,
    });
  };
  const play = () =>
    audio.current
      .play()
      .then(() => {
        setPlaying(true);
        send({ type: "play", position: audio.current.currentTime });
      })
      .catch(() => {});
  const pause = () => {
    audio.current.pause();
    setPlaying(false);
    send({ type: "pause", position: audio.current.currentTime });
  };
  const seek = (v) => {
    audio.current.currentTime = v;
    setTime(v);
    send({ type: "seek", position: v });
  };
  const next = () =>
    queue.length &&
    playSong(
      queue[(index + 1) % queue.length],
      queue,
      (index + 1) % queue.length,
    );
  const previous = () =>
    time > 3
      ? seek(0)
      : queue.length &&
        playSong(
          queue[(index - 1 + queue.length) % queue.length],
          queue,
          (index - 1 + queue.length) % queue.length,
        );
  const setVolume = (v) => {
    audio.current.volume = v;
    setVolumeState(v);
  };
  const toggleShuffle = () => {
    const value = !shuffle;
    setShuffle(value);
    send({ type: "settings", shuffle: value, repeatMode: repeat });
  };
  const cycleRepeat = () => {
    const value = repeat === "off" ? "all" : repeat === "all" ? "one" : "off";
    setRepeat(value);
    send({ type: "settings", shuffle, repeatMode: value });
  };
  useEffect(() => {
    if (!state?.currentSongId) return;
    const id =
        typeof state.currentSongId === "string"
          ? state.currentSongId
          : state.currentSongId._id,
      target = position(state);
    if (current?._id !== id) {
      api("/songs/" + id)
        .then((song) => {
          setCurrent(song);
          audio.current.src = song.audioUrl;
          audio.current.onloadedmetadata = () => {
            audio.current.currentTime = target;
            if (state.isPlaying) audio.current.play().catch(() => {});
          };
        })
        .catch(() => {});
      return;
    }
    if (Math.abs(audio.current.currentTime - target) > 0.75)
      audio.current.currentTime = target;
    if (state.isPlaying) audio.current.play().catch(() => {});
    else audio.current.pause();
    setPlaying(state.isPlaying);
    setShuffle(state.shuffle);
    setRepeat(state.repeatMode);
  }, [state, current]);
  return (
    <C.Provider
      value={{
        current,
        queue,
        playing,
        time,
        duration,
        volume,
        shuffle,
        repeat,
        playSong,
        play,
        pause,
        next,
        previous,
        seek,
        setVolume,
        setQueue,
        setShuffle,
        setRepeat,
        toggleShuffle,
        cycleRepeat,
      }}
    >
      {children}
    </C.Provider>
  );
}
