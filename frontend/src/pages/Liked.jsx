import { useEffect, useState } from "react";
import { api } from "../services/api";
import SongRow from "../components/SongRow";
export default function Liked() {
  const [songs, setSongs] = useState([]);
  useEffect(() => {
    api("/auth/liked")
      .then(setSongs)
      .catch(() => {});
  }, []);
  return (
    <section>
      <header>
        <p>PLAYLIST</p>
        <h1>Liked Songs</h1>
      </header>
      {songs.length ? (
        songs.map((s) => <SongRow key={s._id} song={s} songs={songs} />)
      ) : (
        <div className="empty-state">Like songs to build your collection.</div>
      )}
    </section>
  );
}
