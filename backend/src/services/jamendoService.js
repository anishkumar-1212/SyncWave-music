import Song from "../models/Song.js";

const API_URL = "https://api.jamendo.com/v3.0/tracks/";

function normalizeTrack(track) {
  const tags = track.musicinfo?.tags?.genres || [];
  return {
    title: track.name,
    artist: track.artist_name,
    album: track.album_name || "Single",
    albumArt: track.album_image || track.image,
    audioUrl: track.audio,
    duration: Number(track.duration) || undefined,
    genre: tags[0] || "Independent",
    year: track.releasedate ? Number(track.releasedate.slice(0, 4)) : undefined,
    source: "jamendo",
    sourceId: String(track.id),
    licenseUrl: track.license_ccurl,
    providerUrl: track.shareurl,
    tags,
  };
}

export async function fetchJamendoTracks({ query, tags, offset = 0, limit = 100 }) {
  if (!process.env.JAMENDO_CLIENT_ID) {
    throw new Error("Set JAMENDO_CLIENT_ID in backend/.env before importing music.");
  }

  const params = new URLSearchParams({
    client_id: process.env.JAMENDO_CLIENT_ID,
    format: "json",
    limit: String(Math.min(Math.max(Number(limit) || 100, 1), 200)),
    offset: String(Math.max(Number(offset) || 0, 0)),
    include: "licenses musicinfo",
    audioformat: "mp32",
    order: "popularity_month",
    type: "single albumtrack",
  });
  if (query?.trim()) params.set("search", query.trim());
  if (tags?.trim()) params.set("fuzzytags", tags.trim());

  const response = await fetch(`${API_URL}?${params}`);
  if (!response.ok) throw new Error("The music provider could not be reached.");
  const data = await response.json();
  if (data.headers?.status !== "success") {
    throw new Error(data.headers?.error_message || "Music provider rejected the request.");
  }
  return data.results.filter((track) => track.audio && track.name && track.artist_name).map(normalizeTrack);
}

export async function importJamendoTracks({
  query = "",
  tags = "indian bollywood hindi",
  offset = 0,
  limit = 100,
} = {}) {
  const tracks = await fetchJamendoTracks({ query, tags, offset, limit });
  const operations = tracks.map((track) => ({
    updateOne: {
      filter: { source: "jamendo", sourceId: track.sourceId },
      update: { $set: track },
      upsert: true,
    },
  }));
  if (operations.length) await Song.bulkWrite(operations);
  return { imported: tracks.length, query, tags, nextOffset: Number(offset) + Number(limit) };
}

export function startJamendoAutoImport() {
  if (process.env.JAMENDO_AUTO_IMPORT !== "true") return;
  if (!process.env.JAMENDO_CLIENT_ID) {
    console.warn("Jamendo auto-import is enabled but JAMENDO_CLIENT_ID is missing.");
    return;
  }

  const hours = Math.max(Number(process.env.JAMENDO_AUTO_IMPORT_INTERVAL_HOURS) || 12, 1);
  const importCatalog = async () => {
    try {
      const result = await importJamendoTracks({
        tags: process.env.JAMENDO_IMPORT_TAGS || "indian bollywood hindi",
        limit: Number(process.env.JAMENDO_IMPORT_LIMIT) || 200,
      });
      console.log(`Jamendo catalog refresh completed: ${result.imported} tracks.`);
    } catch (error) {
      console.error(`Jamendo catalog refresh failed: ${error.message}`);
    }
  };

  importCatalog();
  setInterval(importCatalog, hours * 60 * 60 * 1000).unref();
}
