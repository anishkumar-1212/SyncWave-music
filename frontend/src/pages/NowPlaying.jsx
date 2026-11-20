import { usePlayer } from "../context/PlayerContext";
export default function NowPlaying() {
  const { current } = usePlayer();
  return (
    <section className="now-page">
      {current ? (
        <>
          <img src={current.albumArt} />
          <p>NOW PLAYING</p>
          <h1>{current.title}</h1>
          <h2>{current.artist}</h2>
        </>
      ) : (
        <div className="empty-state">Choose a track to see it here.</div>
      )}
    </section>
  );
}
