import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import SongRow from "../components/SongRow";
export default function Playlist() {
  const { id } = useParams(),
    [playlist, setPlaylist] = useState();
  useEffect(() => {
    api("/playlists/" + id)
      .then(setPlaylist)
      .catch(() => {});
  }, [id]);
  if (!playlist) return <section>Loading playlist…</section>;
  return (
    <section>
      <header>
        <p>PLAYLIST</p>
        <h1>{playlist.name}</h1>
        <p>{playlist.description}</p>
      </header>
      {playlist.songs.map((s) => (
        <SongRow key={s._id} song={s} songs={playlist.songs} />
      ))}
    </section>
  );
}
