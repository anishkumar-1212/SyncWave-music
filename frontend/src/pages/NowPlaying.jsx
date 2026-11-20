import { Pause, Play, Repeat2, Shuffle, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import "./NowPlaying.css";

const formatTime = (value) => `${Math.floor(value / 60) || 0}:${String(Math.floor(value % 60) || 0).padStart(2, "0")}`;

export default function NowPlaying() {
  const player = usePlayer();
  if (!player.current) return <section className="now-page"><div className="empty-state">Choose a track to see it here.</div></section>;
  return <section className="now-page"><div className="now-player-card">
    <img className="now-artwork" src={player.current.albumArt} alt={`${player.current.album || player.current.title} artwork`} />
    <div className="now-copy"><p>NOW PLAYING</p><h1>{player.current.title}</h1><h2>{player.current.artist}</h2>{player.current.album && <span>{player.current.album}</span>}</div>
    <div className="now-timeline"><span>{formatTime(player.time)}</span><input aria-label="Seek" type="range" min="0" max={player.duration || 1} value={player.time} onChange={(event) => player.seek(Number(event.target.value))} /><span>{formatTime(player.duration)}</span></div>
    <div className="now-controls"><button className={player.shuffle ? "selected" : ""} aria-label="Shuffle" title="Shuffle" onClick={player.toggleShuffle}><Shuffle /></button><button aria-label="Previous track" title="Previous track" onClick={player.previous}><SkipBack /></button><button className="now-play" aria-label={player.playing ? "Pause" : "Play"} onClick={player.playing ? player.pause : player.play}>{player.playing ? <Pause /> : <Play />}</button><button aria-label="Next track" title="Next track" onClick={player.next}><SkipForward /></button><button className={player.repeat !== "off" ? "selected" : ""} aria-label="Repeat" title="Repeat" onClick={player.cycleRepeat}><Repeat2 /></button></div>
    <label className="now-volume"><Volume2 /><input aria-label="Volume" type="range" min="0" max="1" step="0.05" value={player.volume} onChange={(event) => player.setVolume(Number(event.target.value))} /></label>
  </div></section>;
}
