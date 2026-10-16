// Pure helper for permission status. Android check() never returns "blocked", only request() does,
// so we keep the last known "blocked" status when check() says "denied".

export function resolveStatus(checked, lastKnown) {
  if (checked === 'denied' && lastKnown === 'blocked') {
    return 'blocked';
  }
  return checked;
}

// Location is granted when FINE or COARSE is granted (approximate location counts).
export function locationStatusFrom(fine, coarse) {
  if (fine === 'granted' || coarse === 'granted') {
    return 'granted';
  }
  if (fine === 'blocked' || coarse === 'blocked') {
    return 'blocked';
  }
  return 'denied';
}
