(function (CJ) {
  const $ = (id) => document.getElementById(id);
  const UI = CJ.UI = {};
  let pieces = {}, cells = [], n = 0;
  const key = (r, c) => r + ',' + c;

  UI.buildMenu = (onPick) => {
    const box = $('levels'); box.innerHTML = '';
    CJ.LEVELS.forEach((lv, i) => {
      const b = document.createElement('button'); b.className = 'lv';
      b.innerHTML = `<span class="n">${i + 1}</span><span class="t">${lv.name}</span><span class="d">${lv.desc}</span>`;
      b.onclick = () => onPick(i); box.appendChild(b);
    });
  };
  UI.show = (id) => document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id));

  UI.buildBoard = (s, onCell) => {
    n = s.n; const board = $('board'), layer = $('pieces');
    board.style.setProperty('--n', n);
    board.querySelectorAll('.cell').forEach(c => c.remove());
    layer.innerHTML = ''; pieces = {}; cells = [];
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const d = document.createElement('div');
      d.className = 'cell' + ((r + c) % 2 ? ' d' : '') + (s.b[r][c] === 3 ? ' blk' : '');
      d.onclick = () => onCell(r, c);
      board.insertBefore(d, layer); cells.push(d);
      if (s.b[r][c] === 1 || s.b[r][c] === 2) {
        const p = document.createElement('div');
        p.className = 'pc p' + s.b[r][c]; p.innerHTML = '<i></i>';
        p.style.transform = `translate(${c * 100}%,${r * 100}%)`;
        layer.appendChild(p); pieces[key(r, c)] = p;
      }
    }
  };
  UI.clearHints = () => { cells.forEach(c => c.classList.remove('sel', 'hint', 'jmp')); Object.values(pieces).forEach(p => p.classList.remove('sel')); };
  UI.select = (r, c, moves) => {
    UI.clearHints();
    cells[r * n + c].classList.add('sel'); pieces[key(r, c)]?.classList.add('sel');
    moves.forEach(m => cells[m.tr * n + m.tc].classList.add('hint', ...(m.cr != null ? ['jmp'] : [])));
  };
  UI.move = (m) => {
    UI.clearHints();
    cells.forEach(c => c.classList.remove('last'));
    const p = pieces[key(m.fr, m.fc)]; delete pieces[key(m.fr, m.fc)];
    if (m.cr != null) {
      const v = pieces[key(m.cr, m.cc)]; delete pieces[key(m.cr, m.cc)];
      if (v) { v.style.setProperty('--t', v.style.transform); v.classList.add('cap'); setTimeout(() => v.remove(), 400); }
    }
    p.style.transform = `translate(${m.tc * 100}%,${m.tr * 100}%)`; pieces[key(m.tr, m.tc)] = p;
    cells[m.fr * n + m.fc].classList.add('last'); cells[m.tr * n + m.tc].classList.add('last');
  };
  UI.hud = (g, names) => {
    for (const p of [1, 2]) {
      $('nm' + p).textContent = names[p];
      $('left' + p).textContent = CJ.Engine.count(g.s, p);
      $('cap' + p).textContent = g.caps[p];
      $('pl' + p).classList.toggle('on', g.s.turn === p && !g.over);
    }
    $('lvlName').textContent = `Level ${g.level + 1} · ${CJ.LEVELS[g.level].name}`;
    $('turn').textContent = g.over ? '' : g.s.chain ? `${names[g.s.turn]}: jump again!` : `${names[g.s.turn]}'s turn`;
    $('turn').style.color = g.s.turn === 1 ? 'var(--p1)' : 'var(--p2)';
  };
  UI.win = (w, name, g, hasNext) => {
    const t = $('winTitle'); t.textContent = `${name} wins!`;
    t.style.setProperty('--c', w === 1 ? 'var(--p1)' : 'var(--p2)');
    $('winSub').textContent = `Final count: ${CJ.Engine.count(g.s, 1)} vs ${CJ.Engine.count(g.s, 2)} pieces left.`;
    $('btnNext').style.display = hasNext ? '' : 'none';
    const cf = $('confetti'); cf.innerHTML = '';
    const cols = ['#3de3cf', '#ff6f9c', '#ffd166', '#fff'];
    for (let i = 0; i < 70; i++) {
      const s = document.createElement('span');
      s.style.cssText = `left:${Math.random() * 100}%;background:${cols[i % 4]};animation-duration:${2 + Math.random() * 2.5}s;animation-delay:${Math.random() * .8}s`;
      cf.appendChild(s);
    }
    $('win').hidden = false;
  };
  UI.hideWin = () => { $('win').hidden = true; };
})(window.CJ);
