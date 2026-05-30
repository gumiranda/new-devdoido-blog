(function(){
  'use strict';

  var connected = false;

  // ---------- toast ----------
  function toast(msg, sub){
    document.getElementById('toast-msg').textContent = msg;
    document.getElementById('toast-sub').textContent = sub || '';
    var t = document.getElementById('toast');
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(function(){ t.classList.remove('show'); }, 2600);
  }

  // ---------- navigation ----------
  var viewTitles = {
    overview: 'visão geral', account: 'conta google', channels: 'canais monitorados',
    schedule: 'agendamento', runs: 'execuções', library: 'biblioteca',
    automation: 'geração automática', mysaas: 'meu saas', settings: 'configurações',
    artigos: 'artigos', credits: 'créditos & cobrança', planos: 'planos',
    placeholder: 'em breve'
  };
  function navTo(view){
    document.querySelectorAll('.sb-item').forEach(function(i){
      i.classList.toggle('active', i.getAttribute('data-nav')===view);
    });
    document.querySelectorAll('.view').forEach(function(v){
      v.classList.toggle('active', v.getAttribute('data-view')===view);
    });
    document.getElementById('crumb-view').textContent = viewTitles[view] || view;
    document.querySelector('.view-scroll').scrollTop = 0;
  }
  document.querySelectorAll('.sb-item').forEach(function(item){
    item.addEventListener('click', function(){ navTo(item.getAttribute('data-nav')); });
  });

  // ---------- connection state ----------
  function applyConnected(){
    document.getElementById('conn-dot').className = 'dot ' + (connected ? 'ok' : 'off');
    document.getElementById('conn-text').textContent = connected ? 'faturei.api.bot@gmail.com' : 'Conta Google não conectada';
    document.getElementById('run-now-btn').style.display = connected ? 'inline-flex' : 'none';
    document.getElementById('nav-acct-warn').style.display = connected ? 'none' : 'block';
    // overview
    document.getElementById('ov-disconnected').style.display = connected ? 'none' : 'block';
    document.getElementById('ov-connected').style.display = connected ? 'block' : 'none';
    // account
    document.getElementById('acct-disconnected').style.display = connected ? 'none' : 'block';
    document.getElementById('acct-connected').style.display = connected ? 'block' : 'none';
  }
  applyConnected();

  // ---------- OAUTH flow ----------
  var oauthOverlay = document.getElementById('oauth-overlay');
  function showStep(n){
    document.querySelectorAll('#oauth-modal .step').forEach(function(s){
      s.classList.toggle('active', s.getAttribute('data-step')===String(n));
    });
  }
  function openOauth(){
    showStep(1);
    // reset google sub-screens
    document.getElementById('gc-account-pick').style.display = 'block';
    document.getElementById('gc-consent').style.display = 'none';
    document.getElementById('gc-allow').style.display = 'none';
    oauthOverlay.classList.add('open');
  }
  function closeOauth(){ oauthOverlay.classList.remove('open'); }

  document.getElementById('open-oauth').addEventListener('click', openOauth);
  document.querySelectorAll('[data-close-oauth]').forEach(function(b){ b.addEventListener('click', closeOauth); });
  document.getElementById('to-step-2').addEventListener('click', function(){ showStep(2); });

  // google: pick account -> consent
  document.getElementById('pick-acct').addEventListener('click', function(){
    document.getElementById('gc-account-pick').style.display = 'none';
    document.getElementById('gc-consent').style.display = 'block';
    document.getElementById('gc-allow').style.display = 'inline-block';
  });
  // google: allow -> success
  document.getElementById('gc-allow').addEventListener('click', function(){ showStep(3); });

  // success -> connect + go channels
  document.getElementById('go-channels').addEventListener('click', function(){
    connected = true; applyConnected(); closeOauth();
    navTo('channels');
    toast('Conta Google conectada', '// faturei.api.bot@gmail.com');
  });
  // closing on success step also connects
  oauthOverlay.addEventListener('click', function(e){
    if(e.target===oauthOverlay){
      // if on success step, treat as connected
      var onSuccess = document.querySelector('#oauth-modal .step[data-step="3"]').classList.contains('active');
      if(onSuccess){ connected = true; applyConnected(); }
      closeOauth();
    }
  });

  // disconnect
  document.getElementById('disconnect-btn').addEventListener('click', function(){
    if(confirm('Desconectar a conta Google? O pipeline deixará de executar até reconectar.')){
      connected = false; applyConnected(); navTo('account');
      toast('Conta desconectada', '// pipeline pausado');
    }
  });

  // run now
  document.getElementById('run-now-btn').addEventListener('click', function(){
    toast('Execução iniciada', '// consultando uploads recentes...');
  });

  // ---------- ADD CHANNEL ----------
  var addOverlay = document.getElementById('addchan-overlay');
  document.getElementById('open-add-channel').addEventListener('click', function(){
    document.getElementById('chan-input').value = '';
    document.getElementById('chan-result').classList.remove('show');
    document.getElementById('chan-search-btn').style.display = 'inline-flex';
    document.getElementById('chan-add-btn').style.display = 'none';
    addOverlay.classList.add('open');
    setTimeout(function(){ document.getElementById('chan-input').focus(); }, 50);
  });
  document.querySelectorAll('[data-close-addchan]').forEach(function(b){ b.addEventListener('click', function(){ addOverlay.classList.remove('open'); }); });
  addOverlay.addEventListener('click', function(e){ if(e.target===addOverlay) addOverlay.classList.remove('open'); });

  function doSearch(){
    if(!document.getElementById('chan-input').value.trim()) return;
    document.getElementById('chan-result').classList.add('show');
    document.getElementById('chan-search-btn').style.display = 'none';
    document.getElementById('chan-add-btn').style.display = 'inline-flex';
  }
  document.getElementById('chan-search-btn').addEventListener('click', doSearch);
  document.getElementById('chan-input').addEventListener('keydown', function(e){ if(e.key==='Enter') doSearch(); });

  document.getElementById('chan-add-btn').addEventListener('click', function(){
    // add a Rocketseat-like row (demo) — avoid dup by checking count
    var list = document.getElementById('channels-list');
    var row = document.createElement('div');
    row.className = 'chan-row'; row.setAttribute('data-chan','');
    row.innerHTML = '<div class="chan-av" style="background:linear-gradient(135deg,#8257e6,#6420aa)">R</div>'
      + '<div class="chan-meta"><b>Rocketseat</b><div class="handle">@rocketseat · recém-adicionado</div></div>'
      + '<div class="chan-stat"><b>2.1M</b><span>inscritos</span></div>'
      + '<div class="chan-last">aguardando<br><span>próxima execução</span></div>'
      + '<div class="switch on" data-switch></div>';
    list.appendChild(row);
    wireSwitch(row.querySelector('[data-switch]'));
    addOverlay.classList.remove('open');
    var n = list.querySelectorAll('[data-chan]').length;
    document.getElementById('nav-chan-count').textContent = n;
    document.getElementById('ov-chan').textContent = n;
    toast('Canal adicionado', '// Rocketseat entrará na próxima execução');
  });

  // ---------- switches ----------
  function wireSwitch(sw){
    sw.addEventListener('click', function(){ sw.classList.toggle('on'); });
  }
  document.querySelectorAll('[data-switch]').forEach(wireSwitch);

  // ---------- schedule ----------
  document.querySelectorAll('#freq-seg button').forEach(function(b){
    b.addEventListener('click', function(){
      document.querySelectorAll('#freq-seg button').forEach(function(x){ x.classList.remove('active'); });
      b.classList.add('active');
      var f = b.getAttribute('data-freq');
      var cron = document.getElementById('cron-expr');
      if(f==='daily') cron.textContent = '0 8 * * *';
      else if(f==='hours') cron.textContent = '0 */6 * * *';
      else cron.textContent = '0 8 * * 1';
    });
  });
  var timeInput = document.getElementById('time-input');
  timeInput.addEventListener('input', function(){
    var v = timeInput.value || '08:00';
    document.getElementById('time-display').innerHTML = v + '<span class="ampm">BRT</span>';
    document.getElementById('sched-next-time').textContent = 'Amanhã, ' + v;
    var hh = v.split(':')[0];
    document.getElementById('cron-expr').textContent = '0 ' + parseInt(hh,10) + ' * * *';
  });
  document.querySelectorAll('#schedule [data-check]').forEach(function(c){
    c.addEventListener('click', function(){ c.classList.toggle('on'); });
  });
  document.getElementById('save-sched').addEventListener('click', function(){
    toast('Agendamento salvo', '// cron atualizado · próxima: amanhã ' + (timeInput.value||'08:00'));
  });

  // ---------- runs -> drawer-ish (just toast/expand) ----------
  document.querySelectorAll('[data-run]').forEach(function(r){
    r.addEventListener('click', function(){ navTo('library'); });
  });

  // ---------- LIBRARY ----------
  var videos = [
    { ch:'rocketseat', chName:'Rocketseat', col:'#8257e6,#3b0d6b', letter:'R', title:'Next.js 16: o que muda na prática', dur:'18:24', pub:'29 mai', words:'3.412', status:'done', thumbGrad:'linear-gradient(135deg,#8257e6,#3b0d6b)' },
    { ch:'rocketseat', chName:'Rocketseat', col:'#8257e6,#3b0d6b', letter:'R', title:'Como estruturar um monorepo com Turborepo', dur:'24:10', pub:'28 mai', words:'4.108', status:'done', thumbGrad:'linear-gradient(135deg,#7c3aed,#4c1d95)' },
    { ch:'filipe', chName:'Filipe Deschamps', col:'#06b6d4,#0e7490', letter:'F', title:'Construindo um sistema de filas do zero', dur:'41:52', pub:'29 mai', words:'7.220', status:'proc', thumbGrad:'linear-gradient(135deg,#06b6d4,#0c4a6e)' },
    { ch:'codigofonte', chName:'Código Fonte TV', col:'#f59e0b,#b45309', letter:'C', title:'O que é Clean Architecture de verdade', dur:'15:30', pub:'28 mai', words:'2.890', status:'done', thumbGrad:'linear-gradient(135deg,#f59e0b,#92400e)' },
    { ch:'rocketseat', chName:'Rocketseat', col:'#8257e6,#3b0d6b', letter:'R', title:'React Server Components explicado', dur:'21:08', pub:'27 mai', words:'3.940', status:'done', thumbGrad:'linear-gradient(135deg,#6d28d9,#4c1d95)' },
    { ch:'filipe', chName:'Filipe Deschamps', col:'#06b6d4,#0e7490', letter:'F', title:'Postgres: índices que você não usa mas deveria', dur:'33:14', pub:'27 mai', words:'6.012', status:'done', thumbGrad:'linear-gradient(135deg,#0891b2,#0c4a6e)' },
    { ch:'codigofonte', chName:'Código Fonte TV', col:'#f59e0b,#b45309', letter:'C', title:'TypeScript avançado: generics na prática', dur:'19:45', pub:'26 mai', words:'3.510', status:'queue', thumbGrad:'linear-gradient(135deg,#d97706,#92400e)' },
    { ch:'rocketseat', chName:'Rocketseat', col:'#8257e6,#3b0d6b', letter:'R', title:'Deploy na AWS sem quebrar o orçamento', dur:'27:30', pub:'26 mai', words:'4.880', status:'done', thumbGrad:'linear-gradient(135deg,#8257e6,#3b0d6b)' },
    { ch:'filipe', chName:'Filipe Deschamps', col:'#06b6d4,#0e7490', letter:'F', title:'Como funciona o event loop do Node.js', dur:'38:02', pub:'25 mai', words:'6.740', status:'done', thumbGrad:'linear-gradient(135deg,#06b6d4,#0c4a6e)' }
  ];
  var statusMeta = {
    done:  { cls:'done',  label:'transcrito' },
    proc:  { cls:'proc',  label:'transcrevendo' },
    queue: { cls:'queue', label:'na fila' }
  };
  function renderLibrary(filter){
    var grid = document.getElementById('vid-grid');
    var list = videos.filter(function(v){ return !filter || filter==='all' || v.ch===filter; });
    grid.innerHTML = list.map(function(v, i){
      var sm = statusMeta[v.status];
      return '<div class="vid-card" data-vid="'+videos.indexOf(v)+'">'
        + '<div class="vid-thumb" style="background:'+v.thumbGrad+'">'
        + '<span class="ts-badge '+sm.cls+'"><span class="dot"></span> '+sm.label+'</span>'
        + '<div class="play"><svg fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>'
        + '<span class="dur">'+v.dur+'</span></div>'
        + '<div class="vid-body">'
        + '<div class="vid-chan"><span class="ca" style="background:linear-gradient(135deg,'+v.col+')">'+v.letter+'</span><span>'+v.chName+'</span></div>'
        + '<h4>'+v.title+'</h4>'
        + '<div class="vid-foot"><span>'+v.pub+' 2026</span><span>'+(v.status==='done'?v.words+' palavras':sm.label)+'</span></div>'
        + '</div></div>';
    }).join('');
    grid.querySelectorAll('[data-vid]').forEach(function(card){
      card.addEventListener('click', function(){ openDrawer(videos[parseInt(card.getAttribute('data-vid'),10)]); });
    });
  }
  document.getElementById('lib-filters').addEventListener('click', function(e){
    var c = e.target.closest('.fchip'); if(!c) return;
    document.querySelectorAll('#lib-filters .fchip').forEach(function(x){ x.classList.remove('active'); });
    c.classList.add('active');
    renderLibrary(c.getAttribute('data-f'));
  });
  renderLibrary('all');

  // ---------- DRAWER ----------
  var drawer = document.getElementById('drawer');
  var drawerOverlay = document.getElementById('drawer-overlay');
  function openDrawer(v){
    if(v.status !== 'done'){
      toast('Transcrição ainda não disponível', '// status: ' + statusMeta[v.status].label);
      return;
    }
    document.getElementById('dv-title').textContent = v.title;
    document.getElementById('dv-chan').textContent = v.chName;
    document.getElementById('dv-words').textContent = v.words + ' palavras';
    document.getElementById('dv-thumb').style.background = v.thumbGrad;
    document.querySelector('#dv-thumb .dur').textContent = v.dur;
    drawer.classList.add('open'); drawerOverlay.classList.add('open');
  }
  function closeDrawer(){ drawer.classList.remove('open'); drawerOverlay.classList.remove('open'); }
  document.getElementById('drawer-close').addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);
  document.getElementById('copy-transcript').addEventListener('click', function(){ toast('Transcrição copiada', '// 3.412 palavras na área de transferência'); });
  document.addEventListener('keydown', function(e){
    if(e.key==='Escape'){ closeDrawer(); closeOauth(); document.getElementById('addchan-overlay').classList.remove('open'); }
  });

  // tenant switch (cosmetic)
  document.getElementById('tenant-switch').addEventListener('click', function(){ toast('Workspace', '// Faturei · fintech'); });

  // ========== AUTOMATION ==========
  var ruleSwitch = document.getElementById('rule-switch');
  var ruleHead = document.getElementById('rule-head');
  if(ruleSwitch){
    ruleSwitch.addEventListener('click', function(){
      ruleSwitch.classList.toggle('on');
      var on = ruleSwitch.classList.contains('on');
      ruleHead.classList.toggle('on', on);
      ruleHead.querySelector('.rh-t b').textContent = on ? 'Automação ativa' : 'Automação pausada';
    });
  }

  // prompt char count + focus ring
  var promptArea = document.getElementById('prompt-area');
  var promptEditor = document.getElementById('prompt-editor');
  function updatePromptChars(){
    if(!promptArea) return;
    document.getElementById('prompt-chars').textContent = promptArea.value.length.toLocaleString('pt-BR') + ' caracteres';
  }
  if(promptArea){
    promptArea.addEventListener('input', updatePromptChars);
    promptArea.addEventListener('focus', function(){ promptEditor.classList.add('focus'); });
    promptArea.addEventListener('blur', function(){ promptEditor.classList.remove('focus'); });
    updatePromptChars();
  }

  // variable insertion at cursor
  document.querySelectorAll('.var-chip').forEach(function(chip){
    chip.addEventListener('click', function(){
      if(!promptArea) return;
      var v = chip.getAttribute('data-var');
      var start = promptArea.selectionStart, end = promptArea.selectionEnd;
      var val = promptArea.value;
      promptArea.value = val.slice(0, start) + v + val.slice(end);
      var pos = start + v.length;
      promptArea.focus();
      promptArea.setSelectionRange(pos, pos);
      updatePromptChars();
    });
  });

  // model picker
  document.querySelectorAll('#model-row .model-opt').forEach(function(m){
    m.addEventListener('click', function(){
      document.querySelectorAll('#model-row .model-opt').forEach(function(x){ x.classList.remove('on'); });
      m.classList.add('on');
    });
  });

  // automation check options
  document.querySelectorAll('[data-view="automation"] [data-check]').forEach(function(c){
    c.addEventListener('click', function(){ c.classList.toggle('on'); });
  });

  document.getElementById('save-automation') && document.getElementById('save-automation').addEventListener('click', function(){
    toast('Automação salva', '// gerar artigo quando transcrição ficar pronta');
  });

  // test prompt -> simulate generation
  var testBtn = document.getElementById('test-prompt-btn');
  if(testBtn){
    testBtn.addEventListener('click', function(){
      var loading = document.getElementById('gen-loading');
      var output = document.getElementById('gen-output');
      var steps = document.getElementById('gl-steps');
      output.classList.remove('show');
      loading.classList.add('show');
      testBtn.disabled = true;
      var msgs = ['lendo transcrição...', 'aplicando prompt...', 'gerando com Claude Sonnet 4.5...', 'estruturando seções...', 'criando slug e tags...'];
      var i = 0;
      var iv = setInterval(function(){
        i++; if(i < msgs.length){ steps.textContent = msgs[i]; }
      }, 520);
      setTimeout(function(){
        clearInterval(iv);
        loading.classList.remove('show');
        output.classList.add('show');
        testBtn.disabled = false;
        toast('Artigo de teste gerado', '// rascunho pronto para revisão');
      }, 2900);
    });
  }

  // ========== SETTINGS tabs ==========
  document.querySelectorAll('#settings-tabs .st-tab').forEach(function(tab){
    tab.addEventListener('click', function(){
      var t = tab.getAttribute('data-tab');
      document.querySelectorAll('#settings-tabs .st-tab').forEach(function(x){ x.classList.toggle('active', x===tab); });
      document.querySelectorAll('[data-view="settings"] .set-panel').forEach(function(p){
        p.classList.toggle('active', p.getAttribute('data-panel')===t);
      });
    });
  });
  // reveal secrets
  document.querySelectorAll('[data-reveal]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var inp = btn.parentElement.querySelector('input');
      if(inp.type==='password'){ inp.type='text'; btn.textContent='ocultar'; }
      else { inp.type='password'; btn.textContent='mostrar'; }
    });
  });

  // ========== MEU SAAS ==========
  document.querySelectorAll('#ms-colors [data-color]').forEach(function(c){
    c.addEventListener('click', function(){
      document.querySelectorAll('#ms-colors [data-color]').forEach(function(x){ x.classList.remove('on'); });
      c.classList.add('on');
    });
  });
  function wireUpload(dropId, inputId){
    var drop = document.getElementById(dropId); if(!drop) return;
    var input = document.getElementById(inputId);
    function handle(file){
      if(!file || !file.type.startsWith('image/')) return;
      var r = new FileReader();
      r.onload = function(e){
        var img = drop.querySelector('img.preview');
        if(!img){ img = document.createElement('img'); img.className='preview'; drop.appendChild(img); }
        img.src = e.target.result;
      };
      r.readAsDataURL(file);
    }
    input.addEventListener('change', function(){ handle(input.files[0]); });
    drop.addEventListener('dragover', function(e){ e.preventDefault(); drop.style.borderColor='var(--lime-500)'; });
    drop.addEventListener('dragleave', function(){ drop.style.borderColor=''; });
    drop.addEventListener('drop', function(e){ e.preventDefault(); drop.style.borderColor=''; if(e.dataTransfer.files[0]) handle(e.dataTransfer.files[0]); });
  }
  wireUpload('ms-cover-drop','ms-cover');
  wireUpload('ms-logo-drop','ms-logo');
  document.getElementById('save-mysaas') && document.getElementById('save-mysaas').addEventListener('click', function(){
    toast('SaaS atualizado', '// alterações publicadas no blog');
  });

  // ========== ARTIGOS ==========
  var artigos = [
    { title:'Next.js 16 na prática: o novo cache que finalmente faz sentido', status:'draft', src:'ia', cat:'Next.js', from:'Rocketseat', updated:'hoje 08:02', views:0, grad:'linear-gradient(135deg,#8257e6,#3b0d6b)', letter:'N', slug:'nextjs-16-cache', idx:{state:'na'} },
    { title:'Como funciona o event loop do Node.js', status:'draft', src:'ia', cat:'Node.js', from:'Filipe Deschamps', updated:'hoje 08:01', views:0, grad:'linear-gradient(135deg,#06b6d4,#0c4a6e)', letter:'E', slug:'event-loop-nodejs', idx:{state:'na'} },
    { title:'Se o Cursor cair, você sabe codar?', status:'published', src:'manual', cat:'Carreira', from:'você', updated:'28 mai', views:2400, grad:'linear-gradient(135deg,#84cc16,#3f6212)', letter:'C', slug:'cursor-cair-saber-codar', idx:{state:'indexed', coverage:'URL enviada e indexada', crawl:'27 mai 2026', checked:'há 3h'} },
    { title:'Clean Architecture de verdade: o guia sem hype', status:'published', src:'ia', cat:'Arquitetura', from:'Código Fonte TV', updated:'28 mai', views:1820, grad:'linear-gradient(135deg,#f59e0b,#92400e)', letter:'A', slug:'clean-architecture-guia', idx:{state:'notindexed', coverage:'Descoberta — não indexada no momento', crawl:'—', checked:'há 3h'} },
    { title:'MEI, ME ou PJ: o que vale a pena pra dev em 2026', status:'published', src:'manual', cat:'Finanças', from:'você', updated:'27 mai', views:980, grad:'linear-gradient(135deg,#3b82f6,#1e3a8a)', letter:'M', slug:'mei-me-pj-dev-2026', idx:{state:'indexed', coverage:'URL enviada e indexada', crawl:'26 mai 2026', checked:'há 1d'} },
    { title:'React Server Components explicado de uma vez', status:'published', src:'ia', cat:'React', from:'Rocketseat', updated:'27 mai', views:1540, grad:'linear-gradient(135deg,#6d28d9,#4c1d95)', letter:'R', slug:'rsc-explicado', idx:{state:'indexed', coverage:'URL enviada e indexada', crawl:'26 mai 2026', checked:'há 1d'} },
    { title:'Postgres: índices que você não usa mas deveria', status:'published', src:'ia', cat:'Banco de dados', from:'Filipe Deschamps', updated:'27 mai', views:1210, grad:'linear-gradient(135deg,#0891b2,#0c4a6e)', letter:'P', slug:'postgres-indices', idx:{state:'notindexed', coverage:'Rastreada — não indexada no momento', crawl:'25 mai 2026', checked:'há 2d'} },
    { title:'Como cobrar mais como freelancer sem perder cliente', status:'published', src:'manual', cat:'Finanças', from:'você', updated:'25 mai', views:760, grad:'linear-gradient(135deg,#84cc16,#3f6212)', letter:'F', slug:'cobrar-mais-freelancer', idx:{state:'unknown'} },
    { title:'TypeScript avançado: generics na prática', status:'draft', src:'ia', cat:'TypeScript', from:'Código Fonte TV', updated:'24 mai', views:0, grad:'linear-gradient(135deg,#d97706,#92400e)', letter:'T', slug:'typescript-generics', idx:{state:'na'} },
    { title:'Deploy na AWS sem quebrar o orçamento', status:'archived', src:'ia', cat:'DevOps', from:'Rocketseat', updated:'20 mai', views:430, grad:'linear-gradient(135deg,#8257e6,#3b0d6b)', letter:'D', slug:'deploy-aws-barato', idx:{state:'excluded', coverage:"Excluída por tag 'noindex'", crawl:'19 mai 2026', checked:'há 9d'} }
  ];
  var artStatusMeta = {
    published: { cls:'published', label:'publicado' },
    draft:     { cls:'draft',     label:'rascunho' },
    archived:  { cls:'archived',  label:'arquivado' }
  };
  var idxMeta = {
    indexed:    { cls:'indexed',    label:'Indexada',     dot:'var(--lime-400)' },
    notindexed: { cls:'notindexed', label:'Não indexada', dot:'hsl(0 72% 66%)' },
    excluded:   { cls:'excluded',   label:'Excluída',     dot:'hsl(38 92% 68%)' },
    unknown:    { cls:'unknown',    label:'Verificar',    dot:'var(--fg-dim)' },
    checking:   { cls:'checking',   label:'Verificando',  dot:'hsl(217 85% 72%)' },
    queued:     { cls:'queued',     label:'Na fila',      dot:'var(--fg-muted)' }
  };
  var artState = { status:'all', src:'all', idx:'', q:'' };

  // ---- GSC quota / rate-limit model ----
  var QUOTA_MAX = 2000, RATE_PER_MIN = 600;
  var gsc = { used: 184, recentWindow: [] }; // recentWindow: timestamps of last-min checks
  function updateQuotaUI(){
    document.getElementById('gsc-used').textContent = gsc.used.toLocaleString('pt-BR');
    var pct = Math.min(100, (gsc.used/QUOTA_MAX)*100);
    var fill = document.getElementById('gsc-fill');
    fill.style.width = pct + '%';
    fill.classList.toggle('high', pct > 80);
  }
  function quotaExhausted(){ return gsc.used >= QUOTA_MAX; }
  function rateLimited(){
    var now = Date.now();
    gsc.recentWindow = gsc.recentWindow.filter(function(t){ return now - t < 60000; });
    return gsc.recentWindow.length >= RATE_PER_MIN;
  }
  function spendQuota(){ gsc.used++; gsc.recentWindow.push(Date.now()); updateQuotaUI(); }

  function fmtViews(v){ return v>=1000 ? (v/1000).toFixed(1)+'k' : (v===0 ? '—' : v); }

  function idxCellHTML(a, i){
    if(a.idx.state==='na') return '<div class="idx-cell"><span class="idx-badge na">não publicado</span></div>';
    var m = idxMeta[a.idx.state] || idxMeta.unknown;
    var icon = '';
    if(a.idx.state==='indexed') icon = '<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>';
    else if(a.idx.state==='notindexed') icon = '<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    else if(a.idx.state==='unknown') icon = '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="17" x2="12.01" y2="17"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/></svg>';
    else icon = '<span class="dot"></span>';
    return '<div class="idx-cell"><span class="idx-badge '+m.cls+'" data-idxbadge="'+i+'">'+icon+' '+m.label+'</span></div>';
  }

  function renderArtigos(){
    var list = artigos.filter(function(a){
      if(artState.status!=='all' && a.status!==artState.status) return false;
      if(artState.src!=='all' && a.src!==artState.src) return false;
      if(artState.idx==='notindexed' && a.idx.state!=='notindexed' && a.idx.state!=='excluded') return false;
      if(artState.q && (a.title+' '+a.cat+' '+a.from).toLowerCase().indexOf(artState.q.toLowerCase())<0) return false;
      return true;
    });
    var wrap = document.getElementById('art-list');
    wrap.innerHTML = list.map(function(a){
      var i = artigos.indexOf(a);
      var sm = artStatusMeta[a.status];
      var spark = a.src==='ia' ? '<span class="ai-spark"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></span>' : '';
      var sub = (a.src==='ia' ? '⚡ de '+a.from : '✎ à mão') + ' · ' + a.cat;
      return '<div class="art-row" data-i="'+i+'">'
        + '<div class="art-main"><div class="art-thumb" style="background:'+a.grad+'">'+a.letter+spark+'</div>'
        + '<div class="art-info"><b>'+a.title+'</b><div class="sub">'+sub+'</div></div></div>'
        + '<div><span class="spill '+sm.cls+'"><span class="dot"></span> '+sm.label+'</span></div>'
        + idxCellHTML(a, i)
        + '<div class="art-views-cell">'+fmtViews(a.views)+'</div>'
        + '<div style="position:relative; text-align:right;"><button class="art-kebab" data-kebab="'+i+'"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg></button>'
        + '<div class="art-menu" data-menu="'+i+'">'
        + '<a href="Editor de Artigo.html" class="am-item"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg> Editar</a>'
        + '<a href="Artigo.html" class="am-item"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> Ver no blog</a>'
        + (a.idx.state!=='na' ? '<div class="am-item" data-recheck="'+i+'"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> Verificar indexação</div>' : '')
        + '<div class="am-sep"></div>'
        + '<div class="am-item danger"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg> Excluir</div>'
        + '</div></div>'
        + '</div>';
    }).join('');
    document.getElementById('art-empty').style.display = list.length ? 'none' : 'block';
    wrap.style.display = list.length ? 'block' : 'none';

    wrap.querySelectorAll('[data-kebab]').forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.stopPropagation();
        var id = btn.getAttribute('data-kebab');
        var menu = wrap.querySelector('[data-menu="'+id+'"]');
        var isOpen = menu.classList.contains('open');
        closeAllMenus();
        if(!isOpen) menu.classList.add('open');
      });
    });
    wrap.querySelectorAll('.am-item.danger').forEach(function(it){
      it.addEventListener('click', function(){ toast('Artigo excluído', '// movido para a lixeira'); closeAllMenus(); });
    });
    wrap.querySelectorAll('[data-recheck]').forEach(function(it){
      it.addEventListener('click', function(){ closeAllMenus(); checkOne(parseInt(it.getAttribute('data-recheck'),10)); });
    });
    wrap.querySelectorAll('[data-idxbadge]').forEach(function(b){
      b.addEventListener('click', function(e){ e.stopPropagation(); openIdxPop(parseInt(b.getAttribute('data-idxbadge'),10), b); });
    });
  }

  function closeAllMenus(){ document.querySelectorAll('.art-menu').forEach(function(m){ m.classList.remove('open'); }); closeIdxPop(); }

  // ---- single check (rate-limit aware) ----
  function checkOne(i, silent){
    var a = artigos[i];
    if(a.idx.state==='na') return;
    if(quotaExhausted()){ toast('Quota diária esgotada', '// 2.000/2.000 · reset à meia-noite PT'); return; }
    if(rateLimited()){ showRateWarn(); }
    setBadge(i, 'checking');
    setTimeout(function(){
      spendQuota();
      // resolve to a state (demo: keep current if known, else infer)
      var prev = a.idx.state;
      var resolved = (prev==='checking' || prev==='queued' || prev==='unknown') ? (Math.random()>0.45?'indexed':'notindexed') : prev;
      if(resolved==='indexed'){ a.idx = {state:'indexed', coverage:'URL enviada e indexada', crawl:'29 mai 2026', checked:'agora'}; }
      else if(resolved==='notindexed'){ a.idx = {state:'notindexed', coverage:'Descoberta — não indexada no momento', crawl:'—', checked:'agora'}; }
      else { a.idx.checked = 'agora'; }
      renderArtigos();
      if(!silent) toast('Indexação verificada', '// '+ idxMeta[a.idx.state].label.toLowerCase() +' · 1 verificação usada');
    }, 1300);
  }
  function setBadge(i, state){ artigos[i].idx.state = state; renderArtigos(); }

  // ---- batch check (queue + rate limit) ----
  var batchRunning = false;
  function checkAll(){
    if(batchRunning) return;
    var targets = artigos.map(function(a,i){return i;}).filter(function(i){ return artigos[i].idx.state!=='na'; });
    if(!targets.length) return;
    if(quotaExhausted()){ toast('Quota diária esgotada', '// reset à meia-noite PT'); return; }
    batchRunning = true;
    document.getElementById('check-all-btn').disabled = true;
    // mark all queued
    targets.forEach(function(i){ artigos[i].idx.state = 'queued'; });
    renderArtigos();
    showRateWarn(); // demonstrate the rate-limit queue
    var k = 0;
    (function next(){
      if(k>=targets.length || quotaExhausted()){
        batchRunning = false;
        document.getElementById('check-all-btn').disabled = false;
        hideRateWarn();
        toast('Verificação em lote concluída', '// '+k+' URLs inspecionadas');
        return;
      }
      var i = targets[k++];
      artigos[i].idx.state = 'checking'; renderArtigos();
      setTimeout(function(){
        spendQuota();
        var r = Math.random();
        if(r>0.7) artigos[i].idx = {state:'notindexed', coverage:'Descoberta — não indexada no momento', crawl:'—', checked:'agora'};
        else artigos[i].idx = {state:'indexed', coverage:'URL enviada e indexada', crawl:'29 mai 2026', checked:'agora'};
        renderArtigos();
        next();
      }, 600); // throttled to respect rate limit
    })();
  }
  function showRateWarn(){ document.getElementById('rate-warn').style.display = 'flex'; }
  function hideRateWarn(){ document.getElementById('rate-warn').style.display = 'none'; }

  // ---- inspection popover ----
  function closeIdxPop(){ var p = document.getElementById('idx-pop'); if(p) p.remove(); }
  function openIdxPop(i, anchor){
    closeAllMenus();
    var a = artigos[i];
    if(a.idx.state==='na' || a.idx.state==='checking' || a.idx.state==='queued'){ return; }
    var m = idxMeta[a.idx.state] || idxMeta.unknown;
    var covOk = a.idx.state==='indexed';
    var pop = document.createElement('div');
    pop.className = 'idx-pop open'; pop.id = 'idx-pop';
    pop.innerHTML =
      '<div class="ip-head"><span class="ih-status" style="color:'+m.dot+'"><span class="dot" style="background:'+m.dot+'"></span> '+m.label+'</span>'
      + '<button class="modal-x" id="idx-pop-x" style="width:26px;height:26px;"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>'
      + '<div class="ip-body">'
      + '<div class="ip-url">crazystack.com.br/faturei/blog/'+a.slug+'</div>'
      + '<div class="ip-kv"><span class="k">cobertura</span><span class="v '+(covOk?'ok':(a.idx.state==='unknown'?'':'bad'))+'">'+(a.idx.coverage||'não verificada')+'</span></div>'
      + '<div class="ip-kv"><span class="k">último rastreio</span><span class="v">'+(a.idx.crawl||'—')+'</span></div>'
      + '<div class="ip-kv"><span class="k">no sitemap</span><span class="v ok">sim</span></div>'
      + '<div class="ip-kv"><span class="k">verificado</span><span class="v">'+(a.idx.checked||'nunca')+'</span></div>'
      + '</div>'
      + (a.idx.checked && a.idx.checked!=='agora' && a.idx.checked!=='nunca' ? '<div class="ip-cooldown">// dados em cache do Search Console · reverificar consome 1 da quota</div>' : '')
      + '<div class="ip-foot"><button class="btn btn-secondary btn-sm" id="idx-pop-recheck" style="flex:1; justify-content:center;"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> Reverificar</button>'
      + '<a href="#" class="btn btn-secondary btn-sm" style="justify-content:center;"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a></div>';
    anchor.closest('.art-row').querySelector('div[style*="position:relative"]') ? null : null;
    var cell = anchor.closest('.idx-cell'); cell.style.position='relative'; cell.appendChild(pop);
    document.getElementById('idx-pop-x').addEventListener('click', function(e){ e.stopPropagation(); closeIdxPop(); });
    document.getElementById('idx-pop-recheck').addEventListener('click', function(e){ e.stopPropagation(); closeIdxPop(); checkOne(i); });
    pop.addEventListener('click', function(e){ e.stopPropagation(); });
  }

  document.addEventListener('click', closeAllMenus);

  var artTabs = document.getElementById('art-tabs');
  if(artTabs){
    artTabs.addEventListener('click', function(e){
      var t = e.target.closest('.art-tab'); if(!t) return;
      artTabs.querySelectorAll('.art-tab').forEach(function(x){ x.classList.remove('active'); });
      t.classList.add('active'); artState.status = t.getAttribute('data-status'); renderArtigos();
    });
    document.querySelector('[data-view="artigos"] .art-toolbar .left').addEventListener('click', function(e){
      var c = e.target.closest('.fchip'); if(!c) return;
      if(c.hasAttribute('data-idx')){
        var on = c.classList.toggle('active');
        artState.idx = on ? 'notindexed' : '';
      } else {
        this.querySelectorAll('.fchip[data-src]').forEach(function(x){ x.classList.remove('active'); });
        c.classList.add('active'); artState.src = c.getAttribute('data-src');
      }
      renderArtigos();
    });
    document.getElementById('art-search').addEventListener('input', function(){ artState.q = this.value; renderArtigos(); });
    document.getElementById('check-all-btn').addEventListener('click', checkAll);
    updateQuotaUI();
    renderArtigos();
  }

  // ========== CRÉDITOS & PLANOS & CHECKOUT ==========
  var BALANCE_MAX = 3000;
  var credits = { balance: 1240 };
  function fmtN(n){ return n.toLocaleString('pt-BR'); }
  function refreshCredits(){
    var pct = Math.max(0, Math.min(100, (credits.balance/BALANCE_MAX)*100));
    var cp = document.getElementById('cp-balance'); if(cp) cp.textContent = fmtN(credits.balance);
    var cpf = document.getElementById('cp-fill'); if(cpf){ cpf.style.width = pct+'%'; cpf.style.background = pct<15 ? 'var(--warn)' : 'var(--lime-500)'; }
    var cb = document.getElementById('cb-balance'); if(cb) cb.textContent = fmtN(credits.balance);
    var cbf = document.getElementById('cb-fill'); if(cbf){ cbf.style.width = pct+'%'; cbf.classList.toggle('high', pct<15); }
    var warn = document.getElementById('low-credit-warn'); if(warn) warn.style.display = pct<15 ? 'flex' : 'none';
  }
  refreshCredits();

  // credit pill -> credits view
  document.getElementById('credit-pill').addEventListener('click', function(){ navTo('credits'); });
  var gotoPlanos = document.getElementById('goto-planos'); if(gotoPlanos) gotoPlanos.addEventListener('click', function(){ navTo('planos'); });

  // billing cycle toggle
  var billCycle = document.getElementById('bill-cycle');
  if(billCycle){
    billCycle.addEventListener('click', function(e){
      var b = e.target.closest('button'); if(!b) return;
      billCycle.querySelectorAll('button').forEach(function(x){ x.classList.remove('active'); });
      b.classList.add('active');
      var yearly = b.getAttribute('data-cycle')==='year';
      document.querySelectorAll('.plan-tier .amt[data-price-month]').forEach(function(el){
        var m = el.getAttribute('data-price-month'), y = el.getAttribute('data-price-year');
        el.textContent = yearly ? Math.round(y/12) : m;
      });
      document.querySelectorAll('.plan-tier .per').forEach(function(el){ el.textContent = yearly ? '/mês · anual' : '/mês'; });
    });
  }

  // ---- checkout state ----
  var checkoutOverlay = document.getElementById('checkout-overlay');
  var coState = { kind:'topup', credits:5000, price:79, label:'Pacote 5.000 créditos', sub:'recarga avulsa', method:'pix' };

  function coStep(s){ document.querySelectorAll('#checkout-overlay .step').forEach(function(st){ st.classList.toggle('active', st.getAttribute('data-co-step')===s); }); }
  function fmtBRL(n){ return 'R$ ' + n.toFixed(2).replace('.', ','); }
  function genQR(){
    var svg = document.getElementById('pix-qr-svg'); if(!svg) return;
    var cells = 25, html = '<rect width="100" height="100" fill="#fff"/>';
    for(var y=0;y<cells;y++){ for(var x=0;x<cells;x++){
      if((x*7 + y*13 + x*y) % 3 === 0) html += '<rect x="'+(x*4)+'" y="'+(y*4)+'" width="4" height="4" fill="#0a0a0a"/>';
    }}
    // finder squares
    [[0,0],[0,84],[84,0]].forEach(function(p){ html += '<rect x="'+p[0]+'" y="'+p[1]+'" width="16" height="16" fill="#fff"/><rect x="'+(p[0]+2)+'" y="'+(p[1]+2)+'" width="12" height="12" fill="#0a0a0a"/><rect x="'+(p[0]+5)+'" y="'+(p[1]+5)+'" width="6" height="6" fill="#fff"/>'; });
    svg.innerHTML = html;
  }
  function renderCheckout(){
    document.getElementById('co-credits').textContent = fmtN(coState.credits) + ' cr';
    document.getElementById('co-credits-sub').textContent = coState.sub;
    document.getElementById('co-item-label').textContent = coState.label;
    document.getElementById('co-item-price').textContent = fmtBRL(coState.price);
    var disc = coState.method==='pix' ? +(coState.price*0.05).toFixed(2) : 0;
    document.getElementById('co-discount').textContent = '−' + fmtBRL(disc);
    document.getElementById('co-total').textContent = fmtBRL(coState.price - disc);
    document.getElementById('co-pay-btn').textContent = coState.method==='pix' ? 'Pagar com Pix' : 'Pagar com cartão';
    document.getElementById('co-title').textContent = coState.kind==='sub' ? 'Assinar plano '+coState.planName : 'Comprar créditos';
    // panels
    document.querySelectorAll('#checkout-overlay .pay-panel').forEach(function(p){ p.classList.toggle('active', p.getAttribute('data-panel')===coState.method); });
    document.querySelectorAll('#pay-methods .pay-method').forEach(function(m){ m.classList.toggle('on', m.getAttribute('data-method')===coState.method); });
    if(coState.method==='pix') genQR();
  }
  function openCheckout(){ coStep('pay'); renderCheckout(); checkoutOverlay.classList.add('open'); }
  function closeCheckout(){ checkoutOverlay.classList.remove('open'); }

  // open from buy-credits (default pack)
  var buyBtn = document.getElementById('buy-credits-btn');
  if(buyBtn) buyBtn.addEventListener('click', function(){ coState = {kind:'topup', credits:5000, price:79, label:'Pacote 5.000 créditos', sub:'recarga avulsa', method:'pix'}; openCheckout(); });

  // packs
  document.querySelectorAll('.pack').forEach(function(pk){
    pk.addEventListener('click', function(){
      var cr = parseInt(pk.getAttribute('data-pack'),10), pr = parseInt(pk.getAttribute('data-price'),10);
      coState = {kind:'topup', credits:cr, price:pr, label:'Pacote '+fmtN(cr)+' créditos', sub:'recarga avulsa', method:'pix'};
      openCheckout();
    });
  });

  // plan buttons
  document.querySelectorAll('.plan-tier [data-plan]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var plan = btn.getAttribute('data-plan'), amt = parseInt(btn.getAttribute('data-amount'),10);
      if(btn.textContent.trim()==='Plano atual') { toast('Já é seu plano', '// plano '+plan+' ativo'); return; }
      var planCredits = plan==='Scale' ? 12000 : 3000;
      coState = {kind:'sub', planName:plan, credits:planCredits, price:amt, label:'Assinatura '+plan+' · mensal', sub:'franquia mensal', method:'pix'};
      openCheckout();
    });
  });

  // method switch
  document.getElementById('pay-methods').addEventListener('click', function(e){
    var m = e.target.closest('.pay-method'); if(!m) return;
    coState.method = m.getAttribute('data-method'); renderCheckout();
  });

  // pix copy
  document.getElementById('pix-copy-btn').addEventListener('click', function(){
    var inp = document.getElementById('pix-code'); inp.select();
    this.textContent = 'copiado!'; var self=this; setTimeout(function(){ self.textContent='copiar'; }, 1500);
    toast('Código Pix copiado', '// cole no app do seu banco');
  });

  // pay
  document.getElementById('co-pay-btn').addEventListener('click', function(){
    var btn = this;
    if(coState.method==='pix'){
      var st = document.getElementById('pix-status');
      st.className = 'pix-status'; st.innerHTML = '<span class="dot"></span> aguardando pagamento...';
      btn.disabled = true; btn.textContent = 'aguardando Pix...';
      setTimeout(function(){
        st.className = 'pix-status paid'; st.innerHTML = '<span class="dot"></span> pagamento recebido!';
        setTimeout(finishCheckout, 700);
      }, 2200);
    } else {
      btn.disabled = true; btn.textContent = 'processando...';
      setTimeout(finishCheckout, 1600);
    }
  });
  function finishCheckout(){
    var btn = document.getElementById('co-pay-btn'); btn.disabled=false; btn.textContent = coState.method==='pix'?'Pagar com Pix':'Pagar com cartão';
    credits.balance += coState.credits; refreshCredits();
    document.getElementById('co-success-credits').textContent = '+' + fmtN(coState.credits) + ' créditos';
    document.getElementById('co-success-msg').textContent = coState.kind==='sub'
      ? 'Plano '+coState.planName+' ativado! Sua franquia mensal de créditos já está no saldo.'
      : 'Seus créditos avulsos já estão disponíveis no saldo da plataforma.';
    coStep('success');
    toast(coState.kind==='sub'?'Plano ativado':'Créditos adicionados', '// +'+fmtN(coState.credits)+' cr via '+(coState.method==='pix'?'Abacate Pay':'Stripe'));
  }

  document.querySelectorAll('[data-close-checkout]').forEach(function(b){ b.addEventListener('click', function(){ closeCheckout(); if(coState.kind!=='sub') navTo('credits'); }); });
  checkoutOverlay.addEventListener('click', function(e){ if(e.target===checkoutOverlay) closeCheckout(); });

})();
