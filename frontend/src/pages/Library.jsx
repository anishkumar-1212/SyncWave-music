import { useEffect, useState } from "react";
import { api } from "../services/api";
import SongRow from "../components/SongRow";
export default function Library() {
  const [songs, setSongs] = useState([]);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState("");
  const loadSongs = () => api("/songs").then(setSongs);
  useEffect(() => {
    loadSongs();
  }, []);
  const importFreeMusic = async () => {
    setImporting(true);
    setMessage("");
    try {
      const result = await api("/songs/import/jamendo", {
        method: "POST",
        body: JSON.stringify({ tags: "indian bollywood hindi", limit: 200 }),
      });
      setMessage(`${result.imported} licensed tracks added to your library.`);
      await loadSongs();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setImporting(false);
    }
  };
  return (
    <section>
      <header>
        <h1>Your Library</h1>
        <p>All music available on SyncWave.</p>
        <button
          className="primary import-button"
          disabled={importing}
          onClick={importFreeMusic}
        >
          {importing
            ? "Importing music…"
            : "Import licensed Indian-tagged music"}
        </button>
        {message && <p className="import-message">{message}</p>}
      </header>
      {songs.map((s) => (
        <SongRow key={s._id} song={s} songs={songs} />
      ))}
    </section>
  );
}
