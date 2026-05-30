import { MOCK, STATUS_META } from '../mock';

export function setupLibraryView() {
  const grid = document.getElementById('vid-grid')!;
  const filters = document.getElementById('lib-filters')!;

  function renderLibrary(filter?: string) {
    const list = MOCK.videos.filter((v) => !filter || filter === 'all' || v.ch === filter);

    grid.innerHTML = list
      .map((v) => {
        const sm = STATUS_META[v.status];
        return `
      <div class="vid-card" data-vid="${v.ch}-${v.title}">
        <div class="vid-thumb" style="background:${v.thumbGrad}">
          <span class="ts-badge ${sm.cls}"><span class="dot"></span> ${sm.label}</span>
          <div class="play"><svg fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>
          <span class="dur">${v.dur}</span>
        </div>
        <div class="vid-body">
          <div class="vid-chan">
            <span class="ca" style="background:linear-gradient(135deg,${v.col})">${v.letter}</span>
            <span>${v.chName}</span>
          </div>
          <h4>${v.title}</h4>
          <div class="vid-foot">
            <span>${v.pub} 2026</span>
            <span>${v.status === 'done' ? v.words + ' palavras' : sm.label}</span>
          </div>
        </div>
      </div>`;
      })
      .join('');

    grid.querySelectorAll('.vid-card').forEach((card) => {
      card.addEventListener('click', () => {
        const ch = card.getAttribute('data-vid')!;
        const [chId] = ch.split('-');
        const video = MOCK.videos.find((v) => v.ch + '-' + v.title === ch);
        if (video) window.openDrawer(video);
      });
    });
  }

  filters.addEventListener('click', (e) => {
    const chip = (e.target as HTMLElement).closest('.fchip');
    if (!chip) return;
    filters.querySelectorAll('.fchip').forEach((x) => x.classList.remove('active'));
    chip.classList.add('active');
    renderLibrary(chip.getAttribute('data-f') ?? undefined);
  });

  renderLibrary('all');
}
