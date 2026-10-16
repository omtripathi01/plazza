// searchMedicines() filters the catalog by name or salt. addRecentSearch() keeps the recent list small.

export const MAX_RECENT = 5;

export function normalize(text) {
  return (text || '').trim().toLowerCase();
}

export function searchMedicines(medicines, query) {
  const q = normalize(query);
  if (!q) {
    return [];
  }
  return medicines.filter(
    m => normalize(m.name).includes(q) || normalize(m.salt).includes(q),
  );
}

// Returns a Promise so the UI has a real loading state (300 ms delay).
export function searchMedicinesAsync(medicines, query, delayMs = 300) {
  return new Promise(resolve => {
    setTimeout(() => resolve(searchMedicines(medicines, query)), delayMs);
  });
}

// Newest first, max 5, no duplicates (ignoring case).
export function addRecentSearch(recent, query) {
  const trimmed = (query || '').trim();
  if (!trimmed) {
    return recent;
  }
  const withoutDuplicate = recent.filter(
    item => normalize(item) !== normalize(trimmed),
  );
  return [trimmed, ...withoutDuplicate].slice(0, MAX_RECENT);
}
