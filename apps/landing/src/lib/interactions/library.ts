import { fetchVideos, fetchVideoTranscript, retryVideoTranscript } from '../api';

const STATUS_META: Record<string, { cls: string; label: string }> = {
  queued: { cls: 'ts-queued', label: 'na fila' },
  processing: { cls: 'ts-proc', label: 'processando' },
  done: { cls: 'ts-done', label: 'pronto' },
  error: { cls: 'ts-error', label: 'erro' },
};

function formatDuration(seconds?: number) {
  if (!seconds) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatDate(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export function setupLibraryView() {
  const grid = document.getElementById('vid-grid')!;
  const filters = document.getElementById('lib-filters')!;
  let videos: any[] = [];

  async function loadVideos(filter?: string) {
    try {
      videos = await fetchVideos(filter && filter !== 'all' ? filter : undefined);
    } catch {
      videos = [];
    }
  }

  function renderLibrary(filter?: string) {
    const list = filter && filter !== 'all'
      ? videos.filter((v) => v.channelId === filter)
      : videos;

    grid.innerHTML = list
      .map((v) => {
        const statusKey = v.status ?? 'queued';
        const sm = STATUS_META[statusKey] ?? STATUS_META.queued;
        const transcriptStr = v.transcriptStatus === 'error'
          ? 'erro transcrição'
          : v.transcriptStatus === 'processing'
            ? 'transcrevendo...'
            : v.status === 'done' && v.wordCount
              ? v.wordCount.toLocaleString('pt-BR') + ' palavras'
              : sm.label;

        return `
      <div class="vid-card" data-vid="${v.id}" data-chan="${v.channelId}">
        <div class="vid-thumb" style="background:${v.thumbGrad ?? 'linear-gradient(135deg, #8257e6, #3b0d6b)'}">
          <span class="ts-badge ${sm.cls}"><span class="dot"></span> ${sm.label}</span>
          <div class="play"><svg fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>
          <span class="dur">${formatDuration(v.durationSeconds)}</span>
        </div>
        <div class="vid-body">
          <h4>${v.title}</h4>
          <div class="vid-foot">
            <span>${formatDate(v.publishedAt)} 2026</span>
            <span>${transcriptStr}</span>
          </div>
          ${v.transcriptStatus === 'error' ? '<button class="btn btn-ghost btn-sm retry-ts-btn" style="margin-top:4px">Reprocessar</button>' : ''}
        </div>
      </div>`;
      })
      .join('');

    grid.querySelectorAll('.vid-card').forEach((card) => {
      card.addEventListener('click', async () => {
        const id = (card as HTMLElement).getAttribute('data-vid')!;
        const video = videos.find((v) => v.id === id);
        if (!video) return;
        try {
          const data = await fetchVideoTranscript(id);
          window.openDrawer?.({ ...video, transcript: data.transcript });
        } catch {
          window.openDrawer?.(video);
        }
      });
    });

    grid.querySelectorAll('.retry-ts-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = ((btn as HTMLElement).closest('.vid-card') as HTMLElement)?.getAttribute('data-vid');
        if (!id) return;
        await retryVideoTranscript(id);
        window.showToast?.('Reenviado', '// transcrição será reprocessada');
        await loadVideos();
        renderLibrary((filters.querySelector('.fchip.active') as HTMLElement)?.getAttribute('data-f') ?? undefined);
      });
    });
  }

  filters.addEventListener('click', async (e) => {
    const chip = (e.target as HTMLElement).closest('.fchip');
    if (!chip) return;
    filters.querySelectorAll('.fchip').forEach((x) => x.classList.remove('active'));
    chip.classList.add('active');
    const filter = chip.getAttribute('data-f') ?? undefined;
    await loadVideos(filter);
    renderLibrary(filter);
  });

  (async () => {
    await loadVideos();
    renderLibrary('all');
  })();
}
