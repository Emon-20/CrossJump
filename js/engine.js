(function (CJ) {
  const DIRS = [[-1,-1],[-1,1],[1,-1],[1,1]];
  const inB = (n, r, c) => r >= 0 && c >= 0 && r < n && c < n;
  const E = CJ.Engine = {};
  // board: 0 empty, 1 player1 (bottom, moves first), 2 player2 (top), 3 block
  E.newGame = (lv) => {
    const n = lv.n, b = Array.from({ length: n }, () => Array(n).fill(0));
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if ((r + c) % 2) {
      if (r < lv.rows) b[r][c] = 2; else if (r >= n - lv.rows) b[r][c] = 1;
    }
    (lv.blocks || []).forEach(([r, c]) => b[r][c] = 3);
    return { n, b, turn: 1, chain: null };
  };
  E.movesFrom = (s, r, c, jumpsOnly) => {
    const p = s.b[r][c], o = 3 - p, out = [];
    for (const [dr, dc] of DIRS) {
      const r1 = r + dr, c1 = c + dc, r2 = r1 + dr, c2 = c1 + dc;
      if (!inB(s.n, r1, c1)) continue;
      const v = s.b[r1][c1];
      if (v === 0 && !jumpsOnly) out.push({ fr: r, fc: c, tr: r1, tc: c1 });
      else if (v === o && inB(s.n, r2, c2) && s.b[r2][c2] === 0)
        out.push({ fr: r, fc: c, tr: r2, tc: c2, cr: r1, cc: c1 });
    }
    return out;
  };
  E.allMoves = (s) => {
    if (s.chain) return E.movesFrom(s, s.chain[0], s.chain[1], true);
    const out = [];
    for (let r = 0; r < s.n; r++) for (let c = 0; c < s.n; c++)
      if (s.b[r][c] === s.turn) out.push(...E.movesFrom(s, r, c));
    return out;
  };
  E.apply = (s, m) => {
    const b = s.b.map(x => x.slice());
    b[m.tr][m.tc] = b[m.fr][m.fc]; b[m.fr][m.fc] = 0;
    const ns = { n: s.n, b, turn: s.turn, chain: null };
    if (m.cr != null) {
      b[m.cr][m.cc] = 0;
      if (E.movesFrom(ns, m.tr, m.tc, true).length) { ns.chain = [m.tr, m.tc]; return ns; }
    }
    ns.turn = 3 - s.turn;
    return ns;
  };
  E.count = (s, p) => s.b.reduce((a, row) => a + row.filter(v => v === p).length, 0);
  E.winner = (s) => {
    if (!E.count(s, 1)) return 2;
    if (!E.count(s, 2)) return 1;
    return E.allMoves(s).length ? 0 : 3 - s.turn;
  };
})(window.CJ);
