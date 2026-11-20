import { useEffect, useState } from "react";
import { api } from "../services/api";
import SongRow from "../components/SongRow";
export default function Home() {
  const [songs, setSongs] = useState([]);
  useEffect(() => {
    api("/songs")
      .then(setSongs)
      .catch(() => {});
  }, []);
  return (
    <section>
      <header>
        <p>Good evening</p>
        <h1>Made for you</h1>
      </header>
      <div className="hero">
        <div>
          <span>SYNCWAVE ORIGINAL</span>
          <h2>
            Find your next
            <br />
            favorite sound.
          </h2>
          <p>Fresh picks built around your mood.</p>
        </div>
      </div>
      <h2>Popular tracks</h2>
      <div className="track-list">
        {songs.map((s) => (
          <SongRow key={s._id} song={s} songs={songs} />
        ))}
      </div>
    </section>
  );
}
