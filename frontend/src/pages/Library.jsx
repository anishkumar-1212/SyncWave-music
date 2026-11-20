import { useEffect, useState } from "react";
import { api } from "../services/api";
import SongRow from "../components/SongRow";
export default function Library() {
  const [songs, setSongs] = useState([]);
  useEffect(() => {
    api("/songs").then(setSongs);
  }, []);
  return (
    <section>
      <header>
        <h1>Your Library</h1>
        <p>All music available on SyncWave.</p>
      </header>
      {songs.map((s) => (
        <SongRow key={s._id} song={s} songs={songs} />
      ))}
    </section>
  );
}
