import { MOCK } from '../mock';

export function setupChannelsView() {
  const list = document.getElementById('channels-list')!;

  function renderChannels() {
    list.innerHTML = MOCK.channels
      .map(
        (ch) => `
      <div class="chan-row" data-chan="${ch.id}">
        <div class="chan-av" style="background:${ch.color}">${ch.letter}</div>
        <div class="chan-meta">
          <b>${ch.name}</b>
          <div class="handle">${ch.handle}</div>
        </div>
        <div class="chan-stat"><b>${(ch.subscribers / 1e6).toFixed(1)}M</b><span>inscritos</span></div>
        <div class="chan-last">último vídeo<br /><span class="${ch.active ? 'ok' : ''}">${ch.lastVideo}</span></div>
        <div class="switch ${ch.active ? 'on' : ''}" data-switch="${ch.id}"></div>
      </div>`
      )
      .join('');

    list.querySelectorAll('[data-switch]').forEach((sw) => {
      sw.addEventListener('click', () => sw.classList.toggle('on'));
    });

    document.getElementById('nav-chan-count')!.textContent = String(MOCK.channels.length);
  }

  document.getElementById('open-add-channel')?.addEventListener('click', () => {
    window.openAddChannel();
  });

  document.getElementById('chan-add-btn')?.addEventListener('click', () => {
    const input = document.getElementById('chan-input') as HTMLInputElement;
    const name = input.value.trim();
    if (!name) return;

    MOCK.channels.push({
      id: 'ch_' + (MOCK.channels.length + 1),
      name,
      handle: '@' + name.toLowerCase().replace(/\s+/g, ''),
      channelId: 'UC' + Math.random().toString(36).slice(2, 12),
      color: 'linear-gradient(135deg,#8257e6,#6420aa)',
      letter: name[0].toUpperCase(),
      subscribers: 0,
      lastVideo: 'próxima execução',
      active: true,
    });

    renderChannels();
    window.closeAddChannel();
    window.showToast('Canal adicionado', '// ' + name + ' entrará na próxima execução');
  });

  renderChannels();
}
