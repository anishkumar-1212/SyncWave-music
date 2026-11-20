import { useEffect, useState } from "react";
import { Search as Icon } from "lucide-react";
import { api } from "../services/api";
import SongRow from "../components/SongRow";
export default function Search() {
  const [q, setQ] = useState(""),
    [songs, setSongs] = useState([]);
  useEffect(() => {
    const id = setTimeout(
      () =>
        api("/songs?q=" + encodeURIComponent(q))
          .then(setSongs)
          .catch(() => {}),
      250,
    );
    return () => clearTimeout(id);
  }, [q]);
  return (
    <section>
      <header>
        <h1>Search</h1>
        <label className="search">
          <Icon />
          <input
            autoFocus
            placeholder="What do you want to listen to?"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
      </header>
      <h2>{q ? "Results" : "Browse all music"}</h2>
      {songs.map((s) => (
        <SongRow key={s._id} song={s} songs={songs} />
      ))}
    </section>
  );
}
