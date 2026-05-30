import { fetchChannels, createChannel, deleteChannel, updateChannel } from '../api';

export function setupChannelsView() {
  const list = document.getElementById('channels-list')!;

  async function renderChannels() {
    try {
      const channels = await fetchChannels();
      list.innerHTML = channels
        .map(
          (ch: any) => `
        <div class="chan-row" data-chan="${ch.id}">
          <div class="chan-av" style="background:linear-gradient(135deg,${ch.color ?? '#8257e6'},${ch.color ?? '#6420aa'})">${ch.letter ?? ch.name[0]?.toUpperCase()}</div>
          <div class="chan-meta">
            <b>${ch.name}</b>
            <div class="handle">${ch.handle ?? ''}</div>
          </div>
          <div class="chan-stat"><b>${((ch.subscribers ?? 0) / 1e6).toFixed(1)}M</b><span>inscritos</span></div>
          <div class="chan-last">último vídeo<br /><span class="${ch.active ? 'ok' : ''}">${ch.lastVideoLabel ?? '—'}</span></div>
          <div class="switch ${ch.active ? 'on' : ''}" data-switch="${ch.id}"></div>
          <button class="chan-del" data-delete="${ch.id}" title="Remover canal">×</button>
        </div>`
        )
        .join('');

      list.querySelectorAll('[data-switch]').forEach((sw) => {
        const id = sw.getAttribute('data-switch')!;
        sw.addEventListener('click', async () => {
          const isOn = sw.classList.toggle('on');
          await updateChannel(id, { active: isOn });
        });
      });

      list.querySelectorAll('[data-delete]').forEach((btn) => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-delete')!;
          await deleteChannel(id);
          renderChannels();
        });
      });

      document.getElementById('nav-chan-count')!.textContent = String(channels.length);
    } catch (err) {
      console.error('Failed to load channels', err);
      window.showToast?.('Erro', '// falha ao carregar canais');
    }
  }

  document.getElementById('open-add-channel')?.addEventListener('click', () => {
    window.openAddChannel();
  });

  document.getElementById('chan-add-btn')?.addEventListener('click', async () => {
    const input = document.getElementById('chan-input') as HTMLInputElement;
    const name = input.value.trim();
    if (!name) return;

    try {
      await createChannel({ name });
      input.value = '';
      window.closeAddChannel();
      window.showToast?.('Canal adicionado', '// ' + name + ' entrará na próxima execução');
      renderChannels();
    } catch (err: any) {
      window.showToast?.('Erro', '// ' + (err.message ?? 'falha ao adicionar'));
    }
  });

  renderChannels();
}
