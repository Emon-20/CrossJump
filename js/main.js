(function (CJ) {
  const E = CJ.Engine, UI = CJ.UI, $ = (id) => document.getElementById(id);
  let mode = 'ai', g = null, selMoves = [], timer = null;
  const names = () => mode === 'ai' ? { 1: 'You', 2: 'Computer' } : { 1: 'Player 1', 2: 'Player 2' };
  const isAI = () => mode === 'ai' && g.s.turn === 2 && !g.over;

  function start(level) {
    clearTimeout(timer); UI.hideWin();
    g = { level, s: E.newGame(CJ.LEVELS[level]), caps: { 1: 0, 2: 0 }, over: false, busy: false };
    selMoves = [];
    UI.buildBoard(g.s, onCell); UI.show('game'); UI.hud(g, names());
  }
  function play(m) {
    const who = g.s.turn;
    UI.move(m);
    if (m.cr != null) g.caps[who]++;
    g.s = E.apply(g.s, m); selMoves = [];
    const w = E.winner(g.s);
    if (w) {
      g.over = true; UI.hud(g, names());
      timer = setTimeout(() => UI.win(w, names()[w], g, g.level < CJ.LEVELS.length - 1), 700);
      return;
    }
    UI.hud(g, names());
    if (isAI()) { g.busy = true; timer = setTimeout(aiTurn, 550); }
    else if (g.s.chain) pick(g.s.chain[0], g.s.chain[1]);
  }
  function aiTurn() { const m = CJ.AI.pick(g.s, CJ.LEVELS[g.level].depth); g.busy = false; play(m); }
  function pick(r, c) {
    selMoves = E.allMoves(g.s).filter(m => m.fr === r && m.fc === c);
    UI.select(r, c, selMoves);
  }
  function onCell(r, c) {
    if (!g || g.over || g.busy || isAI()) return;
    const m = selMoves.find(x => x.tr === r && x.tc === c);
    if (m) return play(m);
    if (g.s.chain) return;
    if (g.s.b[r][c] === g.s.turn && E.movesFrom(g.s, r, c).length) pick(r, c);
    else { UI.clearHints(); selMoves = []; }
  }

  document.querySelectorAll('#modeSeg button').forEach(b => b.onclick = () => {
    mode = b.dataset.mode;
    document.querySelectorAll('#modeSeg button').forEach(x => x.classList.toggle('on', x === b));
  });
  UI.buildMenu(start);
  $('btnMenu').onclick = $('btnToMenu').onclick = () => { clearTimeout(timer); UI.hideWin(); UI.show('menu'); };
  $('btnRestart').onclick = $('btnAgain').onclick = () => start(g.level);
  $('btnNext').onclick = () => start(g.level + 1);
})(window.CJ);
