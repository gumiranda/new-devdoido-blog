// scenes.jsx — CrazyStack institutional video
// Loaded after animations.jsx. Uses window globals: Sprite, useSprite, useTime, Easing, interpolate, animate, clamp, TextSprite.

const FG='#fafafa', MUT='#a3a3a3', DIM='#707070';
const LIME='#84cc16', LIME4='#a3e635', LIME3='#bef264';
const BORDER='#262626', BG='#0a0a0a', BG1='#0f0f0f', BG2='#171717', BG3='#1f1f1f';
const RED='#ef4444', YT='#ff0033', BLUE='#3b82f6', PURPLE='#a855f7';
const SANS="'Geist', system-ui, sans-serif";
const MONO="'Geist Mono', ui-monospace, monospace";

// ── ambient grid + glow background ───────────────────────────────────────────
function GridBG({ glow = LIME, glowX = 50, glowY = 8, opacity = 0.06, drift = 0 }) {
  return (
    <div style={{ position:'absolute', inset:0, background:BG, overflow:'hidden' }}>
      <div style={{
        position:'absolute', inset:-40,
        backgroundImage:`linear-gradient(${glow}${Math.round(opacity*255).toString(16).padStart(2,'0')} 1px,transparent 1px),linear-gradient(90deg,${glow}${Math.round(opacity*255).toString(16).padStart(2,'0')} 1px,transparent 1px)`,
        backgroundSize:'64px 64px',
        transform:`translateY(${drift}px)`,
        maskImage:`radial-gradient(ellipse 80% 60% at ${glowX}% ${glowY}%, #000 35%, transparent 85%)`,
        WebkitMaskImage:`radial-gradient(ellipse 80% 60% at ${glowX}% ${glowY}%, #000 35%, transparent 85%)`,
      }}/>
      <div style={{
        position:'absolute', left:`${glowX}%`, top:`${glowY}%`, transform:'translate(-50%,-50%)',
        width:1100, height:620, borderRadius:'50%',
        background:`radial-gradient(ellipse at center, ${glow}22, transparent 70%)`,
        filter:'blur(50px)',
      }}/>
    </div>
  );
}

// small helpers to stagger using absolute Stage times
function FadeText(props){ const {t0,t1,...rest}=props; return <Sprite start={t0} end={t1}><TextSprite {...rest}/></Sprite>; }

// kicker label (mono uppercase)
function Kicker({ t0, t1, x, y, text, color=LIME4, align='left' }){
  return (
    <Sprite start={t0} end={t1}>
      {({localTime,duration})=>{
        const inT=Easing.easeOutCubic(clamp(localTime/0.4,0,1));
        const outT=clamp((localTime-(duration-0.3))/0.3,0,1);
        const op=inT*(1-outT);
        return (
          <div style={{ position:'absolute', left:x, top:y, transform:`translateX(${align==='center'?'-50%':'0'})`, opacity:op, display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ width:8,height:8,borderRadius:'50%',background:color,boxShadow:`0 0 12px ${color}` }}/>
            <span style={{ fontFamily:MONO, fontSize:22, letterSpacing:'0.18em', textTransform:'uppercase', color, whiteSpace:'nowrap' }}>{text}</span>
          </div>
        );
      }}
    </Sprite>
  );
}

// typewriter for terminal
function Type({ text, cps=24, startAt=0, color=FG, caret=true }){
  const { localTime } = useSprite();
  const n = Math.max(0, Math.floor((localTime-startAt)*cps));
  const shown = text.slice(0, n);
  const done = n>=text.length;
  const blink = Math.floor(localTime*1.6)%2===0;
  return (
    <span style={{ color }}>
      {shown}
      {caret && (!done || blink) && <span style={{ display:'inline-block', width:13, height:26, background:LIME4, transform:'translateY(4px)', marginLeft:2 }}/>}
    </span>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 1 — TERMINAL HOOK (0 – 5.5)
// ════════════════════════════════════════════════════════════════════════════
function SceneTerminal(){
  const time = useTime();
  const active = time>=0 && time<=5.7;
  if(!active) return null;
  // scene-wide ken burns zoom-in
  const z = interpolate([0,5.5],[1.0,1.06],Easing.easeInOutSine)(time);
  return (
    <Sprite start={0} end={5.7} keepMounted>
      {({progress,localTime})=>{
        const out = clamp((localTime-5.2)/0.5,0,1);
        return (
          <div style={{ position:'absolute', inset:0, opacity:1-out }}>
            <GridBG glow={LIME} glowX={50} glowY={45} opacity={0.07}/>
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', transform:`scale(${z})` }}>
              <div style={{ width:1180 }}>
                {/* terminal window */}
                <Sprite start={0.2} end={5.7}>
                  {({localTime:lt})=>{
                    const inT=Easing.easeOutCubic(clamp(lt/0.5,0,1));
                    return (
                      <div style={{ background:'#050505', border:`1px solid ${BORDER}`, borderRadius:14, overflow:'hidden', boxShadow:'0 40px 100px rgba(0,0,0,.6)', opacity:inT, transform:`translateY(${(1-inT)*24}px)` }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'16px 20px', background:BG2, borderBottom:`1px solid ${BORDER}` }}>
                          <span style={{ width:13,height:13,borderRadius:'50%',background:BG3 }}/>
                          <span style={{ width:13,height:13,borderRadius:'50%',background:BG3 }}/>
                          <span style={{ width:13,height:13,borderRadius:'50%',background:BG3 }}/>
                          <span style={{ fontFamily:MONO, fontSize:18, color:DIM, marginLeft:10, whiteSpace:'nowrap' }}>~/seu-projeto — zsh</span>
                        </div>
                        <div style={{ padding:'34px 36px', fontFamily:MONO, fontSize:30, lineHeight:1.7 }}>
                          <div><span style={{color:LIME4}}>$</span> <Type text="cursor generate --app" cps={26} startAt={0} caret={false} color={MUT}/></div>
                          <Sprite start={2.0} end={5.7}><div style={{color:DIM}}>// 100 linhas geradas em 4.2s ✓</div></Sprite>
                          <Sprite start={2.7} end={5.7}>
                            <div style={{marginTop:8}}><span style={{color:RED}}>$</span> <Type text="cursor --offline" cps={20} startAt={0} color={MUT}/></div>
                          </Sprite>
                          <Sprite start={4.0} end={5.7}>
                            {({localTime:e})=>{
                              const op=Easing.easeOutCubic(clamp(e/0.4,0,1));
                              return <div style={{marginTop:10,color:RED,opacity:op}}>✗ connection lost — você sabe o que esse código faz?</div>;
                            }}
                          </Sprite>
                        </div>
                      </div>
                    );
                  }}
                </Sprite>
              </div>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 2 — THE PROBLEM (5.5 – 10.7)
// ════════════════════════════════════════════════════════════════════════════
function SceneProblem(){
  const time=useTime();
  if(time<5.4 || time>10.9) return null;
  const z=interpolate([5.5,10.7],[1.04,1.0],Easing.easeOutSine)(time);
  return (
    <Sprite start={5.4} end={10.9} keepMounted>
      {({localTime})=>{
        const inOp=Easing.easeOutCubic(clamp(localTime/0.4,0,1));
        const out=clamp((localTime-5.1)/0.4,0,1);
        return (
          <div style={{ position:'absolute', inset:0, opacity:inOp*(1-out) }}>
            <GridBG glow={RED} glowX={50} glowY={50} opacity={0.05}/>
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', transform:`scale(${z})`, textAlign:'center' }}>
              <FadeText t0={5.7} t1={10.7} x={960} y={400} align="center" text="A IA escreve 100 linhas em 10 segundos." size={58} weight={600} color={MUT} font={SANS}/>
              <Sprite start={6.9} end={10.7}>
                {({localTime:lt,duration})=>{
                  const inT=Easing.easeOutBack(clamp(lt/0.5,0,1));
                  const o=clamp((lt-(duration-0.3))/0.3,0,1);
                  return (
                    <div style={{ position:'absolute', left:960, top:500, transform:`translate(-50%,${(1-inT)*30}px) scale(${0.9+0.1*inT})`, opacity:(clamp(lt/0.4,0,1))*(1-o), whiteSpace:'nowrap' }}>
                      <span style={{ fontFamily:SANS, fontSize:96, fontWeight:800, letterSpacing:'-0.03em', color:FG }}>Mas você entende </span>
                      <span style={{ fontFamily:SANS, fontSize:96, fontWeight:800, letterSpacing:'-0.03em', color:LIME4 }}>cada uma?</span>
                    </div>
                  );
                }}
              </Sprite>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 3 — O CURSO (10.7 – 18.2)
// ════════════════════════════════════════════════════════════════════════════
function ModuleChip({ t0, label, x, y, color=LIME }){
  return (
    <Sprite start={t0} end={18.2}>
      {({localTime,duration})=>{
        const inT=Easing.easeOutBack(clamp(localTime/0.5,0,1));
        const o=clamp((localTime-(duration-0.3))/0.3,0,1);
        return (
          <div style={{ position:'absolute', left:x, top:y, opacity:clamp(localTime/0.3,0,1)*(1-o), transform:`scale(${0.6+0.4*inT})`, transformOrigin:'left center',
            display:'flex', alignItems:'center', gap:12, background:BG1, border:`1px solid ${BORDER}`, borderRadius:10, padding:'16px 22px' }}>
            <span style={{ width:10,height:10,borderRadius:'50%',background:color }}/>
            <span style={{ fontFamily:MONO, fontSize:26, color:FG }}>{label}</span>
          </div>
        );
      }}
    </Sprite>
  );
}
function SceneCourse(){
  const time=useTime();
  if(time<10.6 || time>18.4) return null;
  const z=interpolate([10.7,18.2],[1.0,1.05],Easing.easeInOutSine)(time);
  return (
    <Sprite start={10.6} end={18.4} keepMounted>
      {({localTime})=>{
        const inOp=Easing.easeOutCubic(clamp(localTime/0.4,0,1));
        const out=clamp((localTime-7.4)/0.4,0,1);
        return (
          <div style={{ position:'absolute', inset:0, opacity:inOp*(1-out) }}>
            <GridBG glow={LIME} glowX={28} glowY={30} opacity={0.06}/>
            <div style={{ position:'absolute', inset:0, transform:`scale(${z})`, transformOrigin:'30% 50%' }}>
              <Kicker t0={10.9} t1={18.2} x={150} y={250} text="01 · o curso"/>
              <FadeText t0={11.1} t1={18.2} x={146} y={300} text="Aprenda na unha." size={104} weight={800} color={FG} font={SANS} entryEase={Easing.easeOutCubic}/>
              <FadeText t0={11.5} t1={18.2} x={150} y={430} text={"Node · React · Next.js · React Native — escritos\nlinha por linha. Do zero ao deploy."} size={32} weight={400} color={MUT} font={SANS}/>

              {/* module chips on the right */}
              <ModuleChip t0={12.4} label="Node.js + Fastify" x={1180} y={300}/>
              <ModuleChip t0={12.65} label="React + Hooks" x={1320} y={400} color={LIME3}/>
              <ModuleChip t0={12.9} label="Next.js 15 + tRPC" x={1180} y={500}/>
              <ModuleChip t0={13.15} label="React Native" x={1360} y={600} color={LIME4}/>
              <ModuleChip t0={13.4} label="Clean Architecture" x={1180} y={700}/>

              {/* stats strip */}
              <Sprite start={14.6} end={18.2}>
                {({localTime:lt,duration})=>{
                  const inT=Easing.easeOutCubic(clamp(lt/0.5,0,1));
                  const o=clamp((lt-(duration-0.35))/0.35,0,1);
                  const stats=[['70h+','de conteúdo'],['12','projetos reais'],['∞','acesso vitalício']];
                  return (
                    <div style={{ position:'absolute', left:150, top:640, display:'flex', gap:64, opacity:inT*(1-o), transform:`translateY(${(1-inT)*20}px)` }}>
                      {stats.map(([n,l],i)=>(
                        <div key={i}>
                          <div style={{ fontFamily:SANS, fontSize:64, fontWeight:800, letterSpacing:'-0.02em', color:LIME4 }}>{n}</div>
                          <div style={{ fontFamily:MONO, fontSize:20, color:DIM, textTransform:'uppercase', letterSpacing:'0.08em', marginTop:4 }}>{l}</div>
                        </div>
                      ))}
                    </div>
                  );
                }}
              </Sprite>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 4 — A PLATAFORMA (pipeline) (18.2 – 27.2)
// ════════════════════════════════════════════════════════════════════════════
function PipeNode({ t0, x, y, w=300, icon, title, sub, accent=LIME, lit }){
  return (
    <Sprite start={t0} end={27.2}>
      {({localTime,duration})=>{
        const inT=Easing.easeOutBack(clamp(localTime/0.5,0,1));
        const o=clamp((localTime-(duration-0.4))/0.4,0,1);
        const glow = lit ? `0 0 36px ${accent}55` : 'none';
        const bord = lit ? accent : BORDER;
        return (
          <div style={{ position:'absolute', left:x, top:y, width:w, opacity:clamp(localTime/0.3,0,1)*(1-o), transform:`translate(-50%,-50%) scale(${0.7+0.3*inT})`,
            background:BG1, border:`1.5px solid ${bord}`, borderRadius:16, padding:'22px 24px', boxShadow:glow, transition:'box-shadow .2s' }}>
            <div style={{ width:54,height:54,borderRadius:12, background:`${accent}1f`, border:`1px solid ${accent}55`, display:'flex',alignItems:'center',justifyContent:'center', color:accent, marginBottom:14 }}>{icon}</div>
            <div style={{ fontFamily:SANS, fontSize:26, fontWeight:600, color:FG }}>{title}</div>
            <div style={{ fontFamily:MONO, fontSize:17, color:DIM, marginTop:5 }}>{sub}</div>
          </div>
        );
      }}
    </Sprite>
  );
}
// connector with traveling packet
function Connector({ t0, x1, x2, y, accent=LIME }){
  return (
    <Sprite start={t0} end={27.2}>
      {({localTime})=>{
        const draw=Easing.easeInOutCubic(clamp(localTime/0.5,0,1));
        const w=(x2-x1)*draw;
        // packet travels repeatedly
        const pp=((localTime-0.4)%1.4)/1.4;
        const packetX = x1 + (x2-x1)*clamp(pp,0,1);
        const showPacket = localTime>0.5;
        return (
          <React.Fragment>
            <div style={{ position:'absolute', left:x1, top:y-1.5, width:w, height:3, background:`linear-gradient(90deg,${accent}40,${accent})`, borderRadius:2 }}/>
            {showPacket && <div style={{ position:'absolute', left:packetX, top:y, width:14,height:14, marginLeft:-7,marginTop:-7, borderRadius:'50%', background:accent, boxShadow:`0 0 16px ${accent}` }}/>}
          </React.Fragment>
        );
      }}
    </Sprite>
  );
}
function ScenenPlatform(){
  const time=useTime();
  if(time<18.1 || time>27.4) return null;
  const z=interpolate([18.2,27.2],[1.06,1.0],Easing.easeOutSine)(time);
  const NY=600;
  // 4 evenly-spaced nodes, width 280 (half=140)
  const X=[255,725,1195,1665];
  return (
    <Sprite start={18.1} end={27.4} keepMounted>
      {({localTime})=>{
        const inOp=Easing.easeOutCubic(clamp(localTime/0.4,0,1));
        const out=clamp((localTime-9.0)/0.4,0,1);
        const L=localTime;
        return (
          <div style={{ position:'absolute', inset:0, opacity:inOp*(1-out) }}>
            <GridBG glow={YT} glowX={50} glowY={42} opacity={0.045}/>
            <Kicker t0={18.4} t1={27.2} x={960} y={210} align="center" text="02 · a plataforma" color={'#ff6b81'}/>
            <FadeText t0={18.6} t1={27.2} x={960} y={255} align="center" text="Do vídeo ao artigo indexado." size={72} weight={800} color={FG} font={SANS}/>
            <FadeText t0={19.0} t1={27.2} x={960} y={375} align="center" text="No automático, todo dia." size={34} weight={400} color={MUT} font={SANS}/>

            <div style={{ position:'absolute', inset:0, transform:`scale(${z})`, transformOrigin:'50% 60%' }}>
              <Connector t0={20.0} x1={X[0]+140} x2={X[1]-140} y={NY} accent={YT}/>
              <Connector t0={20.8} x1={X[1]+140} x2={X[2]-140} y={NY} accent={'#22d3ee'}/>
              <Connector t0={21.6} x1={X[2]+140} x2={X[3]-140} y={NY} accent={LIME}/>
              <PipeNode t0={19.6} x={X[0]} y={NY} w={280} accent={YT} lit={L>2.0}
                icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7l-7 5 7 5V7zM1 5h15v14H1z"/></svg>} title="Canais" sub="YouTube conectado"/>
              <PipeNode t0={20.4} x={X[1]} y={NY} w={280} accent={'#22d3ee'} lit={L>3.0}
                icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>} title="Transcrição" sub="vídeo → texto"/>
              <PipeNode t0={21.2} x={X[2]} y={NY} w={280} accent={LIME} lit={L>4.0}
                icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9z"/></svg>} title="Artigo IA" sub="escrito pelo seu prompt"/>
              <PipeNode t0={22.0} x={X[3]} y={NY} w={280} accent={'#60a5fa'} lit={L>5.0}
                icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.6" y2="16.6"/><polyline points="8 11 10 13 14 9"/></svg>} title="Blog indexado" sub="ranqueado no Google"/>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 5 — SYNTHESIS (27.2 – 31.6)
// ════════════════════════════════════════════════════════════════════════════
function SynthCard({ t0, side, title, sub, icon, accent }){
  const fromX = side==='left' ? -200 : 200;
  return (
    <Sprite start={t0} end={31.6}>
      {({localTime,duration})=>{
        const inT=Easing.easeOutCubic(clamp(localTime/0.6,0,1));
        const o=clamp((localTime-(duration-0.35))/0.35,0,1);
        const x=(side==='left'?620:1300);
        return (
          <div style={{ position:'absolute', left:x, top:480, transform:`translate(-50%,-50%) translateX(${fromX*(1-inT)}px)`, opacity:inT*(1-o), width:480,
            background:BG1, border:`1.5px solid ${accent}55`, borderRadius:18, padding:'34px 32px', boxShadow:`0 0 40px ${accent}22` }}>
            <div style={{ width:62,height:62,borderRadius:14, background:`${accent}1f`, border:`1px solid ${accent}55`, display:'flex',alignItems:'center',justifyContent:'center', color:accent, marginBottom:18 }}>{icon}</div>
            <div style={{ fontFamily:SANS, fontSize:38, fontWeight:800, letterSpacing:'-0.02em', color:FG }}>{title}</div>
            <div style={{ fontFamily:SANS, fontSize:24, color:MUT, marginTop:8 }}>{sub}</div>
          </div>
        );
      }}
    </Sprite>
  );
}
function SceneSynthesis(){
  const time=useTime();
  if(time<27.1 || time>31.8) return null;
  return (
    <Sprite start={27.1} end={31.8} keepMounted>
      {({localTime})=>{
        const inOp=Easing.easeOutCubic(clamp(localTime/0.4,0,1));
        const out=clamp((localTime-4.4)/0.4,0,1);
        return (
          <div style={{ position:'absolute', inset:0, opacity:inOp*(1-out) }}>
            <GridBG glow={LIME} glowX={50} glowY={50} opacity={0.06}/>
            <FadeText t0={27.3} t1={31.6} x={960} y={210} align="center" text="Uma stack só." size={40} weight={500} color={MUT} font={MONO}/>
            <SynthCard t0={27.5} side="left" title="Construa de verdade." sub="o bootcamp que forma o dev insubstituível" accent={LIME}
              icon={<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>}/>
            <SynthCard t0={27.7} side="right" title="Escale no automático." sub="a plataforma que publica conteúdo por você" accent={'#60a5fa'}
              icon={<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7l-7 5 7 5V7zM1 5h15v14H1z"/></svg>}/>
            {/* plus sign joining */}
            <Sprite start={28.4} end={31.6}>
              {({localTime:lt})=>{
                const inT=Easing.easeOutBack(clamp(lt/0.5,0,1));
                return <div style={{ position:'absolute', left:960, top:480, transform:`translate(-50%,-50%) scale(${inT})`, fontFamily:SANS, fontSize:72, fontWeight:300, color:DIM }}>+</div>;
              }}
            </Sprite>
          </div>
        );
      }}
    </Sprite>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 6 — CTA / LOGO (31.6 – 36)
// ════════════════════════════════════════════════════════════════════════════
function SceneCTA(){
  const time=useTime();
  if(time<31.5) return null;
  const z=interpolate([31.6,36],[0.96,1.02],Easing.easeOutSine)(time);
  return (
    <Sprite start={31.5} end={36} keepMounted>
      {({localTime})=>{
        const inOp=Easing.easeOutCubic(clamp(localTime/0.5,0,1));
        const blink=Math.floor(time*1.5)%2===0;
        return (
          <div style={{ position:'absolute', inset:0, opacity:inOp }}>
            <GridBG glow={LIME} glowX={50} glowY={50} opacity={0.07}/>
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', transform:`scale(${z})` }}>
              <Sprite start={31.7} end={36}>
                {({localTime:lt})=>{
                  const inT=Easing.easeOutBack(clamp(lt/0.6,0,1));
                  return (
                    <div style={{ display:'flex', alignItems:'center', gap:6, transform:`scale(${0.8+0.2*inT})`, opacity:clamp(lt/0.4,0,1) }}>
                      <span style={{ fontFamily:MONO, fontSize:80, color:LIME, fontWeight:500 }}>&gt;_</span>
                      <span style={{ fontFamily:SANS, fontSize:110, fontWeight:800, letterSpacing:'-0.04em', color:FG }}>crazystack</span>
                      <span style={{ display:'inline-block', width:18, height:88, background:LIME, marginLeft:8, opacity:blink?1:0.15 }}/>
                    </div>
                  );
                }}
              </Sprite>
              <FadeText t0={32.5} t1={36} x={960} y={640} align="center" text="Comece de graça. Sem cartão." size={40} weight={500} color={MUT} font={SANS}/>
              <Sprite start={33.0} end={36}>
                {({localTime:lt})=>{
                  const inT=Easing.easeOutCubic(clamp(lt/0.5,0,1));
                  return (
                    <div style={{ position:'absolute', left:960, top:760, transform:`translate(-50%,${(1-inT)*16}px)`, opacity:inT,
                      fontFamily:MONO, fontSize:30, color:LIME4, border:`1px solid ${LIME}55`, background:`${LIME}14`, padding:'14px 30px', borderRadius:999 }}>
                      crazystack.com.br
                    </div>
                  );
                }}
              </Sprite>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

function Video(){
  const time=useTime();
  // update screen label each second for commenting
  React.useEffect(()=>{
    const root=document.getElementById('vid-root');
    if(root) root.setAttribute('data-screen-label', 't='+Math.floor(time)+'s');
  },[Math.floor(time)]);
  return (
    <div id="vid-root" style={{ position:'absolute', inset:0, background:BG }}>
      <SceneTerminal/>
      <SceneProblem/>
      <SceneCourse/>
      <ScenenPlatform/>
      <SceneSynthesis/>
      <SceneCTA/>
    </div>
  );
}

window.Video = Video;
