(function (CJ) {
  const E = CJ.Engine;
  function evalState(s, me) {
    let v = 0;
    for (let r = 0; r < s.n; r++) for (let c = 0; c < s.n; c++) {
      const p = s.b[r][c]; if (p !== 1 && p !== 2) continue;
      const adv = p === 1 ? s.n - 1 - r : r;
      const edge = (c === 0 || c === s.n - 1) ? 0.3 : 0;
      v += (p === me ? 1 : -1) * (10 + adv * 0.15 + edge);
    }
    return v;
  }
  function search(s, d, a, b, me) {
    const ms = E.allMoves(s);
    if (!ms.length) return s.turn === me ? -1e5 - d : 1e5 + d;
    if (d === 0) return evalState(s, me);
    const max = s.turn === me;
    let best = max ? -Infinity : Infinity;
    ms.sort((x, y) => (y.cr != null) - (x.cr != null));
    for (const m of ms) {
      const v = search(E.apply(s, m), d - 1, a, b, me);
      if (max) { if (v > best) best = v; if (v > a) a = v; }
      else { if (v < best) best = v; if (v < b) b = v; }
      if (b <= a) break;
    }
    return best;
  }
  CJ.AI = {
    pick(s, depth) {
      const me = s.turn, ms = E.allMoves(s);
      let best = -Infinity, pool = [];
      for (const m of ms) {
        const v = search(E.apply(s, m), depth - 1, -Infinity, Infinity, me);
        if (v > best + 1e-6) { best = v; pool = [m]; } else if (Math.abs(v - best) < 1e-6) pool.push(m);
      }
      return pool[Math.floor(Math.random() * pool.length)];
    }
  };
})(window.CJ);
