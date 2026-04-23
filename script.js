const MODELS = {
  gemini: [
    { id: "gemini-2.5-flash",      name: "Gemini 2.5 Flash (Recomendado)" },
    { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite" },
    { id: "gemini-2.0-flash",      name: "Gemini 2.0 Flash" },
    { id: "gemini-exp-1206",       name: "Gemini Experimental" }
  ],
  groq: [
    { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B (Rapido!)" },
    { id: "llama3-8b-8192",          name: "Llama 3 8B" },
    { id: "mixtral-8x7b-32768",      name: "Mixtral 8x7B" }
  ],
  openai: [
    { id: "gpt-4o-mini", name: "GPT-4o Mini" },
    { id: "gpt-4o",      name: "GPT-4o" },
    { id: "o3-mini",     name: "o3 Mini" }
  ],
  xai: [
    { id: "grok-2-latest", name: "Grok 2 Latest" },
    { id: "grok-beta",     name: "Grok Beta" }
  ]
};

const STAT_RANKS  = ["E", "D", "C", "B", "A", "Infinito"];
const STAT_COLORS = {
  poderDestrutivo: "#ef4444",
  velocidade:      "#facc15",
  alcance:         "#38bdf8",
  persistencia:    "#4ade80",
  precisao:        "#a855f7",
  potencialDesenv: "#f97316"
};
const STAT_LABELS = {
  poderDestrutivo: "Poder Destrutivo",
  velocidade:      "Velocidade",
  alcance:         "Alcance",
  persistencia:    "Persistencia",
  precisao:        "Precisao",
  potencialDesenv: "Pot. Desenvolvimento"
};
const RANK_WIDTH = { E: 10, D: 27, C: 45, B: 65, A: 82, "Infinito": 100 };

let sessionStands = {};
let standAtual    = null;
let contador      = 0;
let savedHistory  = [];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function resolverFiltro(val, opts) { return val === "aleatorio" ? pick(opts) : val; }
async function gerarStand() {
  const btnGerar = document.getElementById("btnGerar");
  const loading  = document.getElementById("loading");
  const card     = document.getElementById("card");
  const errorBox = document.getElementById("errorBox");

  const tipoManifestacao = resolverFiltro(
    document.getElementById("tipoManifestacao").value,
    ["Humanoide", "Distante", "Automatico", "Colonia", "Vinculado", "Ato"]
  );
  const poderDestrutivo = resolverFiltro(
    document.getElementById("poderDestrutivo").value,
    ["A", "B", "C", "D", "E"]
  );

  btnGerar.disabled = true;
  card.classList.remove("visible");
  errorBox.classList.remove("visible");
  loading.classList.add("visible");

  const temasInspiracoes = [
    "musica classica (Beethoven, Mozart, Bach)",
    "rock e heavy metal (AC/DC, Metallica, Led Zeppelin)",
    "jazz e blues (Miles Davis, Robert Johnson)",
    "pop dos anos 80/90 (Michael Jackson, Madonna, Prince)",
    "hip-hop e rap (2Pac, Notorious B.I.G., Jay-Z)",
    "eletronica e techno (Daft Punk, Chemical Brothers)",
    "opera e musica dramatica",
    "soul e funk (James Brown, Aretha Franklin)",
    "reggae (Bob Marley)",
    "punk rock (Sex Pistols, The Clash)",
    "bossa nova e MPB (Tom Jobim, Caetano Veloso)",
    "K-pop e J-pop",
    "metal progressivo (Dream Theater, Tool)",
    "country e bluegrass",
    "musica eletronica brasileira (baile funk, axe, forro)"
  ];
  const categoriasTipo = [
    "Stand de manipulacao temporal (parar, reverter, acelerar o tempo)",
    "Stand de manipulacao espacial (portais, dobramento de espaco)",
    "Stand de transformacao/metamorfose (objetos, materiais, corpos)",
    "Stand de ilusao e percepcao (alucinacoes, falsas realidades)",
    "Stand de forca bruta pura (combate direto, destruicao)",
    "Stand de suporte e cura (recuperacao, escudos, buffs)",
    "Stand de infiltracao e furtividade (invisibilidade, espionagem)",
    "Stand de controle de elementos (fogo, agua, terra, ar, eletricidade)",
    "Stand de necromancia ou ressurreicao",
    "Stand de informacao e previsao (leitura de memorias, previsao do futuro)",
    "Stand de copia e absorcao (copiar habilidades, absorver poder)",
    "Stand de criacao (materializar objetos ou seres do nada)",
    "Stand de veneno, doenca e contaminacao",
    "Stand de gravidade e magnetismo",
    "Stand ligado a conceitos abstratos (amor, medo, memoria, destino)"
  ];

  const temaInsp = pick(temasInspiracoes);
  const catTipo  = pick(categoriasTipo);
  const numAtos  = tipoManifestacao === "Ato" ? (Math.floor(Math.random() * 3) + 2) : 0;

  const instrucaoExtra = `
--- FATORES ALEATORIOS OBRIGATORIOS ---
TEMA MUSICAL DE REFERENCIA: ${temaInsp}
CATEGORIA DO PODER: ${catTipo}
TIPO DE MANIFESTACAO DEFINIDO: ${tipoManifestacao}
PODER DESTRUTIVO DEFINIDO: ${poderDestrutivo}
${tipoManifestacao === "Ato" ? `QUANTIDADE DE ATOS: ${numAtos} (OBRIGATORIO gerar exatamente ${numAtos} atos no array "atos")` : ""}
--------------------------------------`;

  const blocoAto = tipoManifestacao === "Ato" ? `
COMO ESTE STAND E DO TIPO "ATO", o JSON deve conter o campo "atos" (array).
Cada ato e uma fase distinta do Stand (como Crazy Diamond Act 1, 2, 3...), com aparencia, habilidade, stats e tecnicas proprios.
Estrutura obrigatoria de CADA objeto dentro do array "atos":
{
  "ato": 1,
  "nome": "NOME DO STAND: ACT 1",
  "condicaoTransicao": null,
  "aparencia": "Descricao visual do Ato 1.",
  "habilidadePrincipal": "Habilidade especifica do Ato 1.",
  "descricao": "Comportamento e personalidade do Ato 1.",
  "fraquezas": "Limitacoes do Ato 1.",
  "stats": { "poderDestrutivo": "C", "velocidade": "B", "alcance": "C", "persistencia": "B", "precisao": "C", "potencialDesenv": "A" },
  "tecnicas": [ { "nome": "Tecnica", "descricao": "Descricao.", "tipo": "ofensiva" } ]
}
REGRA DO CAMPO "condicaoTransicao":
- O Ato 1 deve ter "condicaoTransicao": null.
- Do Ato 2 em diante, "condicaoTransicao" descreve COMO e POR QUE o Stand transiciona do ato ANTERIOR para este ato.
Os Atos devem evoluir progressivamente: o Ato 1 e mais simples/fraco, o ultimo e o mais poderoso.
Os campos "aparencia", "habilidadePrincipal", "descricao", "fraquezas", "stats" e "tecnicas" no nivel raiz do JSON devem usar os dados do Ato FINAL como referencia.
` : "";

  const prompt = `Voce e um criador de Stands de JoJo's Bizarre Adventure. Crie um Stand completamente original e criativo.
Retorne SOMENTE um JSON valido (sem markdown, sem blocos de codigo, sem texto extra) com esta estrutura exata:
{
  "nome": "NOME DO STAND EM CAIXA ALTA (referencia musical)",
  "tema": "Breve explicacao da referencia musical/cultural",
  "tipoManifestacao": "${tipoManifestacao}",
  "aparencia": "Descricao visual detalhada do Stand em 2-3 frases.",
  "habilidadePrincipal": "Nome e descricao completa da habilidade principal (2-3 frases).",
  "descricao": "Descricao geral do Stand, comportamento e personalidade (2-3 frases).",
  "fraquezas": "Limitacoes, fraquezas e condicoes de uso (2-3 frases).",
  "stats": { "poderDestrutivo": "B", "velocidade": "A", "alcance": "C", "persistencia": "B", "precisao": "A", "potencialDesenv": "C" },
  "tecnicas": [ { "nome": "Nome da Tecnica", "descricao": "Descricao detalhada.", "tipo": "ofensiva" } ],
  "atos": [],
  "usuario": { "nome": "Nome do Usuario", "descricao": "Breve descricao.", "fraseIconica": "Frase marcante ao ativar o Stand." },
  "detalhes": { "alcanceMetros": "5 metros", "velocidadeDetalhada": "Suprassonica em combate direto", "grito": "ORA ORA ORA", "fraseAtivacao": "Frase ao invocar o Stand" },
  "referenciasMusicais": [ { "nome": "Nome da musica/album", "artista": "Nome do artista", "relacao": "Como se relaciona com o Stand" } ]
}
${blocoAto}
REGRAS OBRIGATORIAS:
=== STATS === Escala: E (minimo), D, C, B, A, Infinito (supremo). Distribua de forma ASSIMETRICA.
=== TECNICAS === Crie 3 a 5 tecnicas. Tipo: ofensiva/defensiva/suporte/especial.
=== NOME === Deve ser referencia musical real. Ex: KILLER QUEEN, CRAZY DIAMOND, GOLD EXPERIENCE.
=== USUARIO === Personagem original (nao use personagens do manga).
=== REFERENCIAS MUSICAIS === Liste 2 a 4 musicas/albums que inspiraram o Stand.
=== OUTROS === Todo texto descritivo em PORTUGUES. Stand com conceito unico.
tipoManifestacao e poderDestrutivo devem seguir EXATAMENTE os fatores aleatorios abaixo.
${instrucaoExtra}`;

  try {
    const provider   = document.getElementById("apiProvider")?.value || "gemini";
    const model      = document.getElementById("apiModel")?.value    || "gemini-2.5-flash";
    const apiKey     = document.getElementById("apiKey")?.value?.trim();
    if (!apiKey) throw new Error("Por favor, insira sua API Key nas configuracoes.");

    let raw = "";
    if (provider === "gemini") {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error?.message || `HTTP ${res.status}`); }
      const data = await res.json();
      raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } else {
      const endpoints = {
        openai: "https://api.openai.com/v1/chat/completions",
        groq:   "https://api.groq.com/openai/v1/chat/completions",
        xai:    "https://api.x.ai/v1/chat/completions"
      };
      const res = await fetch(endpoints[provider], {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], response_format: { type: "json_object" } })
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error?.message || `HTTP ${res.status}`); }
      const data = await res.json();
      raw = data.choices?.[0]?.message?.content || "";
    }

    raw = raw.replace(/```json|```/g, "").trim();
    const stand = JSON.parse(raw);
    standAtual  = stand;

    const geradosNestaSessao = [];
    if (stand.tipoManifestacao === "Ato" && stand.atos && stand.atos.length > 0) {
      stand.atos.forEach(ato => {
        contador++;
        const atoObj = buildAtoObject(ato, stand);
        sessionStands[atoObj._chave] = { stand: atoObj, num: contador };
        geradosNestaSessao.push({ stand: atoObj, num: contador });
      });
    } else {
      contador++;
      sessionStands[stand.nome] = { stand, num: contador };
      geradosNestaSessao.push({ stand, num: contador });
    }

    geradosNestaSessao.forEach(item => savedHistory.push({ stand: item.stand, num: item.num }));
    localStorage.setItem("stand_history",  JSON.stringify(savedHistory));
    localStorage.setItem("stand_contador", contador.toString());
    [...geradosNestaSessao].reverse().forEach(item => adicionarHistorico(item.stand, item.num));
    renderCard(geradosNestaSessao[0].stand, geradosNestaSessao[0].num);

  } catch(e) {
    document.getElementById("errorBox").textContent = "Erro: " + e.message;
    document.getElementById("errorBox").classList.add("visible");
  } finally {
    loading.classList.remove("visible");
    btnGerar.disabled = false;
  }
}
// ────────────────────────────────────────────
function buildAtoObject(ato, parent) {
  return {
    nome:               ato.nome || `${parent.nome}: ACT ${ato.ato}`,
    _chave:             `${parent.nome}__ato${ato.ato}`,
    tema:               parent.tema,
    tipoManifestacao:   parent.tipoManifestacao,
    aparencia:          ato.aparencia          || parent.aparencia,
    habilidadePrincipal: ato.habilidadePrincipal || parent.habilidadePrincipal,
    descricao:          ato.descricao           || parent.descricao,
    fraquezas:          ato.fraquezas           || parent.fraquezas,
    stats:              ato.stats               || parent.stats,
    tecnicas:           ato.tecnicas            || parent.tecnicas,
    condicaoTransicao:  ato.condicaoTransicao   || null,
    usuario:            parent.usuario,
    detalhes:           parent.detalhes,
    referenciasMusicais: parent.referenciasMusicais,
    _isAto:             true,
    _numAto:            ato.ato,
    _parentNome:        parent.nome,
    _totalAtos:         parent.atos.length,
    _atos:              parent.atos
  };
}

// ────────────────────────────────────────────
// REQUIEM
// ────────────────────────────────────────────
async function gerarRequiem() {
  if (!standAtual) return;
  const btnReq   = document.getElementById("btnRequiem");
  const loading  = document.getElementById("loading");
  const errorBox = document.getElementById("errorBox");

  btnReq.disabled = true;
  errorBox.classList.remove("visible");
  loading.classList.add("visible");

  const base = standAtual;
  const nomeBase  = base.nome;
  const temaBase  = base.tema || "";
  const habilBase = base.habilidadePrincipal || "";
  const statsBase = JSON.stringify(base.stats || {});

  const prompt = `Voce e um criador de Stands de JoJo's Bizarre Adventure.
Crie a versao REQUIEM do Stand abaixo. Requiem e uma evolucao alem dos limites normais, como ocorreu com Gold Experience Requiem e Silver Chariot Requiem.

STAND ORIGINAL:
- Nome: ${nomeBase}
- Tema: ${temaBase}
- Habilidade principal: ${habilBase}
- Stats: ${statsBase}

REGRAS DO REQUIEM:
1. O nome DEVE ser "${nomeBase}: REQUIEM" (em caixa alta)
2. O tema musical deve ser o mesmo, porem com enfase no aspecto tragico, final ou transcendente
3. A habilidade principal deve ser uma TRANSCENDENCIA da habilidade original (nao apenas uma versao mais forte - deve ter um conceito novo e grandioso)
4. As stats devem ter pelo menos 3 valores "Infinito"
5. O tipoManifestacao deve ser "Requiem" (string literal)
6. A aparencia muda drasticamente - geralmente mais sombria, com simbolos de morte ou transcendencia
7. O usuario pode ser o mesmo, mas sua frase iconica deve mudar para algo mais sombrio/grandioso
8. Crie 4 a 6 tecnicas devastadoras
9. As fraquezas devem existir mas ser muito limitadas (afinal e um Requiem)
10. Todo texto em PORTUGUES

Retorne SOMENTE um JSON valido (sem markdown, sem blocos de codigo) com esta estrutura:
{
  "nome": "${nomeBase}: REQUIEM",
  "tema": "Versao transcendente de: ${temaBase}",
  "tipoManifestacao": "Requiem",
  "aparencia": "Descricao visual totalmente nova e sombria.",
  "habilidadePrincipal": "Habilidade transcendente, conceito totalmente novo.",
  "descricao": "Descricao do Requiem.",
  "fraquezas": "Limitacoes (poucas e severas).",
  "stats": { "poderDestrutivo": "Infinito", "velocidade": "Infinito", "alcance": "A", "persistencia": "Infinito", "precisao": "A", "potencialDesenv": "Infinito" },
  "tecnicas": [ { "nome": "Nome", "descricao": "Descricao.", "tipo": "especial" } ],
  "atos": [],
  "_isRequiem": true,
  "_standOrigem": "${nomeBase}",
  "usuario": { "nome": "mesmo nome do original", "descricao": "Descricao atualizada.", "fraseIconica": "Frase sombria e grandiosa." },
  "detalhes": { "alcanceMetros": "Ilimitado", "velocidadeDetalhada": "Alem da percepcao humana", "grito": "grito do Requiem", "fraseAtivacao": "frase de ativacao" },
  "referenciasMusicais": [ { "nome": "musica", "artista": "artista", "relacao": "relacao" } ]
}`;

  try {
    const provider = document.getElementById("apiProvider")?.value || "gemini";
    const model    = document.getElementById("apiModel")?.value    || "gemini-2.5-flash";
    const apiKey   = document.getElementById("apiKey")?.value?.trim();
    if (!apiKey) throw new Error("Por favor, insira sua API Key nas configuracoes.");

    let raw = "";
    if (provider === "gemini") {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error?.message || `HTTP ${res.status}`); }
      const data = await res.json();
      raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } else {
      const endpoints = {
        openai: "https://api.openai.com/v1/chat/completions",
        groq:   "https://api.groq.com/openai/v1/chat/completions",
        xai:    "https://api.x.ai/v1/chat/completions"
      };
      const res = await fetch(endpoints[provider], {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], response_format: { type: "json_object" } })
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error?.message || `HTTP ${res.status}`); }
      const data = await res.json();
      raw = data.choices?.[0]?.message?.content || "";
    }

    raw = raw.replace(/```json|```/g, "").trim();
    const req = JSON.parse(raw);
    req._isRequiem    = true;
    req._standOrigem  = nomeBase;

    contador++;
    const chave = req.nome;
    sessionStands[chave] = { stand: req, num: contador };
    savedHistory.push({ stand: req, num: contador });
    localStorage.setItem("stand_history",  JSON.stringify(savedHistory));
    localStorage.setItem("stand_contador", contador.toString());
    adicionarHistorico(req, contador);
    renderCard(req, contador);

  } catch(e) {
    document.getElementById("errorBox").textContent = "Erro Requiem: " + e.message;
    document.getElementById("errorBox").classList.add("visible");
  } finally {
    loading.classList.remove("visible");
    btnReq.disabled = false;
  }
}
// ────────────────────────────────────────────
function renderCard(stand, num) {
  standAtual = stand;
  document.getElementById("cardNome").textContent   = stand.nome;
  document.getElementById("cardTema").textContent   = stand.tema || "";
  document.getElementById("cardNumero").textContent = `#${String(num).padStart(3, "0")}`;
  document.getElementById("cardHabilidade").textContent = stand.habilidadePrincipal || "";
  document.getElementById("cardDescricao").textContent  = stand.descricao || "";
  document.getElementById("cardFraquezas").textContent  = stand.fraquezas || "";

  // —— Botao Requiem: mostrar somente se for o ultimo ato (e nao for ja um Requiem)
  const btnReq = document.getElementById("btnRequiem");
  const isUltimoAto = stand._isAto && stand._numAto === stand._totalAtos;
  const jaERequiem  = stand._isRequiem === true || (stand.tipoManifestacao === "Requiem");
  btnReq.style.display = (isUltimoAto && !jaERequiem) ? "inline-flex" : "none";

  // Badges
  const tiposEl = document.getElementById("cardTipos");
  tiposEl.innerHTML = "";
  const TIPO_COLORS = {
    "Humanoide": "#7c3aed", "Distante": "#38bdf8", "Automatico": "#f97316",
    "Colonia": "#4ade80", "Vinculado": "#f472b6", "Ato": "#facc15",
    "Requiem": "#8b0000"
  };
  const tipoLabel = stand._isAto
    ? `Ato ${stand._numAto} de ${stand._totalAtos}`
    : stand.tipoManifestacao;
  [
    stand.tipoManifestacao,
    tipoLabel !== stand.tipoManifestacao ? tipoLabel : null,
    stand.stats?.poderDestrutivo ? `Poder ${stand.stats.poderDestrutivo}` : null
  ].filter(Boolean).forEach(t => {
    const b = document.createElement("span");
    b.className = "type-badge";
    b.textContent = t;
    b.style.background = TIPO_COLORS[t] || "#2a2a3e";
    b.style.color = "#fff";
    tiposEl.appendChild(b);
  });
  if (stand._isRequiem) {
    const rb = document.createElement("span");
    rb.className = "type-badge";
    rb.textContent = "REQUIEM";
    rb.style.background = "#8b0000";
    rb.style.color = "#fff";
    rb.style.fontWeight = "900";
    tiposEl.appendChild(rb);
  }

  // Prompt de imagem
  const pc = document.getElementById("promptContainer");
  const apparence = (stand.aparencia || "").replace(/"/g, "'");
  const atoSuffix = stand._isAto ? ` Act ${stand._numAto}` : "";
  const reqSuffix = stand._isRequiem ? " REQUIEM" : "";
  const imgPrompt = `JoJo's Bizarre Adventure Stand, manga style, Araki art style, dramatic lighting, isolated on white background. Stand named ${stand.nome}${atoSuffix}${reqSuffix}. Type: ${stand.tipoManifestacao}. Appearance: ${apparence}. Detailed, stylized, bold outlines, high contrast.`;
  pc.innerHTML = `
    <div class="section-title">Prompt para Gerar Imagem</div>
    <div style="display:flex;gap:8px;align-items:center;">
      <input type="text" readonly value="${imgPrompt}" style="flex:1;background:#1a1a2e;border:1px solid #3f3f5a;color:#fff;padding:6px 10px;border-radius:4px;font-size:0.8rem;">
      <button class="btn btn-secondary" style="white-space:nowrap;font-size:0.75rem;padding:6px 10px;" onclick="navigator.clipboard.writeText(this.previousElementSibling.value)">Copiar Prompt</button>
    </div>
    <div style="font-size:0.75rem;color:var(--muted);margin-top:6px;"><b>Obs:</b> Recomenda-se o <a href="https://leonardo.ai" target="_blank" style="color:var(--accent-light);">Leonardo.ai</a> para gerar a imagem.</div>
  `;

  // Linha de Atos
  const atoLineSection = document.getElementById("atoLineSection");
  const atoLine        = document.getElementById("atoLine");
  if (stand._isAto && stand._atos && stand._atos.length > 1) {
    atoLineSection.style.display = "block";
    atoLine.innerHTML = "";
    stand._atos.forEach((a, idx) => {
      const chave    = `${stand._parentNome}__ato${a.ato}`;
      const isCurrent = a.ato === stand._numAto;
      if (idx > 0) {
        const cond = a.condicaoTransicao || "";
        const arr  = document.createElement("div");
        arr.style.cssText = "display:flex;flex-direction:column;align-items:center;padding-top:4px;gap:3px;max-width:90px;text-align:center;";
        arr.innerHTML = `<span style="font-size:1.2rem;">&#8594;</span>${cond ? `<span style="font-size:0.6rem;color:var(--muted);">${cond}</span>` : ""}`;
        atoLine.appendChild(arr);
      }
      const el = document.createElement("div");
      el.className = "evo-stage";
      const nameDiv  = document.createElement("div");
      nameDiv.className = "evo-name" + (isCurrent ? " current" : " clickable");
      nameDiv.textContent = `Ato ${a.ato}`;
      nameDiv.title = a.nome || "";
      if (!isCurrent && sessionStands[chave]) {
        nameDiv.onclick = () => {
          const entry = sessionStands[chave];
          renderCard(entry.stand, entry.num);
          window.scrollTo({ top: 0, behavior: "smooth" });
        };
      }
      const labelDiv = document.createElement("div");
      labelDiv.className = "evo-label";
      labelDiv.textContent = idx === stand._atos.length - 1 ? `Ato ${a.ato} (Final)` : `Ato ${a.ato}`;
      el.appendChild(nameDiv);
      el.appendChild(labelDiv);
      atoLine.appendChild(el);
    });
  } else {
    atoLineSection.style.display = "none";
  }

  // Stats
  const statsGrid = document.getElementById("statsGrid");
  statsGrid.innerHTML = `<div style="display:contents;"><span style="color:var(--muted);font-size:0.75rem;">Stat</span><span style="color:var(--muted);font-size:0.75rem;">Rank</span></div>`;
  const stats = stand.stats || {};
  Object.entries(stats).forEach(([key, rank]) => {
    const color = STAT_COLORS[key] || "#888";
    const pct   = RANK_WIDTH[rank] || 50;
    statsGrid.innerHTML += `
      <span style="font-size:0.8rem;">${STAT_LABELS[key] || key}</span>
      <span style="display:flex;align-items:center;gap:8px;">
        <span style="flex:1;height:8px;background:#1a1a2e;border-radius:4px;overflow:hidden;">
          <span style="display:block;height:100%;width:${pct}%;background:${color};border-radius:4px;"></span>
        </span>
        <span style="font-weight:700;color:${color};min-width:52px;">${rank}</span>
      </span>`;
  });

  // Tecnicas
  const tecList = document.getElementById("tecnicasList");
  tecList.innerHTML = "";
  (stand.tecnicas || []).forEach(t => {
    const tipoTag = { ofensiva: "#ef4444", defensiva: "#38bdf8", suporte: "#4ade80", especial: "#facc15" }[t.tipo] || "#888";
    tecList.innerHTML += `
      <div style="margin-bottom:12px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
          <span style="font-weight:700;font-size:0.9rem;">${t.nome}</span>
          <span style="font-size:0.7rem;background:${tipoTag}22;color:${tipoTag};border:1px solid ${tipoTag}55;padding:2px 8px;border-radius:12px;">${t.tipo}</span>
        </div>
        <p style="font-size:0.82rem;color:var(--muted);margin:0;">${t.descricao}</p>
      </div>`;
  });

  // Detalhes
  const det    = stand.detalhes || {};
  const detRow = document.getElementById("detalhesRow");
  detRow.innerHTML = `
    <div><span style="color:var(--muted);font-size:0.75rem;">Alcance:</span><br><b>${det.alcanceMetros || "&#8212;"}</b></div>
    <div><span style="color:var(--muted);font-size:0.75rem;">Velocidade:</span><br><b>${det.velocidadeDetalhada || "&#8212;"}</b></div>
    <div><span style="color:var(--muted);font-size:0.75rem;">Grito:</span><br><b>${det.grito || "&#8212;"}</b></div>
    <div><span style="color:var(--muted);font-size:0.75rem;">Ativacao:</span><br><i>${det.fraseAtivacao || "&#8212;"}</i></div>`;

  // Usuario
  const usr    = stand.usuario || {};
  const usrBox = document.getElementById("usuarioBox");
  usrBox.innerHTML = `
    <div style="font-weight:700;font-size:1rem;margin-bottom:6px;">${usr.nome || "Desconhecido"}</div>
    <p style="font-size:0.85rem;color:var(--muted);margin:0 0 8px;">${usr.descricao || ""}</p>
    ${usr.fraseIconica ? `<blockquote style="border-left:3px solid var(--accent);padding-left:12px;font-style:italic;color:var(--accent-light);margin:0;">"${usr.fraseIconica}"</blockquote>` : ""}`;

  // Referencias musicais
  const refList = document.getElementById("refMusicais");
  refList.innerHTML = "";
  (stand.referenciasMusicais || []).forEach(r => {
    refList.innerHTML += `
      <div style="margin-bottom:8px;">
        <div style="font-weight:600;font-size:0.85rem;">&#127925; ${r.nome}</div>
        <div style="font-size:0.78rem;color:var(--muted);">${r.artista} &middot; ${r.relacao}</div>
      </div>`;
  });

  document.getElementById("card").classList.add("visible");
}
// ────────────────────────────────────────────
function adicionarHistorico(stand, num) {
  const chips = document.getElementById("historyChips");
  const chip  = document.createElement("div");
  chip.className = "chip";
  chip.style.cssText = "display:flex;align-items:center;gap:6px;padding-right:4px;";

  const reqTag = stand._isRequiem ? " [REQUIEM]" : "";
  const label  = stand._isAto
    ? `#${String(num).padStart(3, "0")} ${stand._parentNome} Ato ${stand._numAto}${reqTag}`
    : `#${String(num).padStart(3, "0")} ${stand.nome}${reqTag}`;

  const textSpan = document.createElement("span");
  textSpan.textContent = label;
  if (stand._isRequiem) textSpan.style.color = "#ff6b6b";
  textSpan.onclick = e => {
    e.stopPropagation();
    renderCard(stand, num);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const delBtn = document.createElement("span");
  delBtn.innerHTML = "&times;";
  delBtn.style.cssText = "color:#ef4444;font-weight:bold;cursor:pointer;padding:0 4px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background 0.2s;";
  delBtn.title = "Excluir";
  delBtn.onmouseover = () => delBtn.style.background = "rgba(239,68,68,0.2)";
  delBtn.onmouseout  = () => delBtn.style.background = "transparent";
  delBtn.onclick = e => {
    e.stopPropagation();
    if (confirm(`Excluir ${label}?`)) {
      savedHistory = savedHistory.filter(i => i.num !== num);
      localStorage.setItem("stand_history", JSON.stringify(savedHistory));
      chip.remove();
      if (standAtual?.nome === stand.nome || standAtual?._chave === stand._chave) {
        if (savedHistory.length > 0) {
          const last = savedHistory[savedHistory.length - 1];
          renderCard(last.stand, last.num);
        } else {
          document.getElementById("card").classList.remove("visible");
          standAtual = null;
        }
      }
    }
  };

  chip.appendChild(textSpan);
  chip.appendChild(delBtn);
  chips.insertBefore(chip, chips.firstChild);
}

// ────────────────────────────────────────────
function copiarStand() {
  if (!standAtual) return;
  const s     = standAtual;
  const stats = Object.entries(s.stats || {}).map(([k, v]) => `${STAT_LABELS[k]}: ${v}`).join(" | ");
  const tecns = (s.tecnicas || []).map(t => `${t.nome} (${t.tipo}): ${t.descricao}`).join("\n");
  const refs  = (s.referenciasMusicais || []).map(r => `${r.nome} - ${r.artista}`).join(", ");
  const atoInfo   = s._isAto     ? `\nAto: ${s._numAto} de ${s._totalAtos}` : "";
  const transInfo = s._isAto && s.condicaoTransicao ? `\nTransicao para este Ato: ${s.condicaoTransicao}` : "";
  const reqInfo   = s._isRequiem ? `\n[REQUIEM - Evoluido de: ${s._standOrigem}]` : "";
  const texto = `=== ${s.nome} ===${atoInfo}${transInfo}${reqInfo}\n${s.tema}\nTipo: ${s.tipoManifestacao}\n\nHabilidade: ${s.habilidadePrincipal}\n\nDescricao: ${s.descricao}\n\nAparencia: ${s.aparencia}\n\nFraquezas: ${s.fraquezas}\n\nStats: ${stats}\n\nTecnicas:\n${tecns}\n\nUsuario: ${s.usuario?.nome} - ${s.usuario?.descricao}\nFrase: "${s.usuario?.fraseIconica}"\n\nReferencias: ${refs}`;
  navigator.clipboard.writeText(texto).then(() => {
    const btn = document.querySelector(".copy-btn");
    btn.textContent = "Copiado!";
    setTimeout(() => btn.textContent = "Copiar texto", 2000);
  });
}

// ────────────────────────────────────────────
function loadHistory() {
  try {
    const stored = localStorage.getItem("stand_history");
    if (!stored) return;
    const history = JSON.parse(stored);
    if (!Array.isArray(history)) return;
    savedHistory = history;
    history.forEach(item => {
      if (item.stand && item.num) {
        const chave = item.stand._chave || item.stand.nome;
        sessionStands[chave] = { stand: item.stand, num: item.num };
        adicionarHistorico(item.stand, item.num);
        if (item.num > contador) contador = item.num;
      }
    });
  } catch(e) { console.warn("Erro ao carregar historico:", e); }
}

function clearHistory() {
  if (!confirm("Limpar todo o historico?")) return;
  savedHistory  = [];
  sessionStands = {};
  localStorage.removeItem("stand_history");
  document.getElementById("historyChips").innerHTML = "";
  document.getElementById("card").classList.remove("visible");
  standAtual = null;
}

// ────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const btnClear      = document.getElementById("btnClearHistory");
  if (btnClear) btnClear.onclick = clearHistory;

  const providerSelect = document.getElementById("apiProvider");
  const modelSelect    = document.getElementById("apiModel");
  const apiKeyInput    = document.getElementById("apiKey");

  function updateModels() {
    if (!providerSelect || !modelSelect) return;
    const provider = providerSelect.value || "gemini";
    const list     = MODELS[provider] || MODELS.gemini;
    modelSelect.innerHTML = "";
    list.forEach(m => {
      const opt = document.createElement("option");
      opt.value   = m.id;
      opt.textContent = m.name;
      modelSelect.appendChild(opt);
    });
    const savedModel = localStorage.getItem("stand_apiModel");
    if (savedModel && list.some(m => m.id === savedModel)) modelSelect.value = savedModel;
  }

  if (providerSelect) {
    const savedProvider = localStorage.getItem("stand_apiProvider");
    if (savedProvider) providerSelect.value = savedProvider;
    providerSelect.addEventListener("change", () => {
      localStorage.setItem("stand_apiProvider", providerSelect.value);
      updateModels();
    });
  }
  updateModels();

  if (apiKeyInput) {
    const savedKey = localStorage.getItem("stand_apiKey");
    if (savedKey) apiKeyInput.value = savedKey;
    apiKeyInput.addEventListener("input", () => localStorage.setItem("stand_apiKey", apiKeyInput.value.trim()));
  }
  if (modelSelect) {
    modelSelect.addEventListener("change", () => localStorage.setItem("stand_apiModel", modelSelect.value));
  }

  loadHistory();
});
