const MODELS = {
  gemini: [
    { id: "gemini-2.5-flash",      name: "Gemini 2.5 Flash (Recomendado)" },
    { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite" },
    { id: "gemini-2.0-flash",      name: "Gemini 2.0 Flash" },
    { id: "gemini-exp-1206",       name: "Gemini Experimental" }
  ],
  groq: [
    { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B (Rápido!)" },
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

const STAT_RANKS = ["E", "D", "C", "B", "A", "Infinito"];
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
  persistencia:    "Persistência",
  precisao:        "Precisão",
  potencialDesenv: "Pot. Desenvolvimento"
};
const RANK_WIDTH = { E: 10, D: 27, C: 45, B: 65, A: 82, "Infinito": 100 };

let sessionStands = {};
let standAtual = null;
let contador = 0;
let savedHistory = [];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function resolverFiltro(val, opts) {
  return val === "aleatorio" ? pick(opts) : val;
}

async function gerarStand() {
  const btnGerar = document.getElementById("btnGerar");
  const loading = document.getElementById("loading");
  const card = document.getElementById("card");
  const errorBox = document.getElementById("errorBox");

  const tipoManifestacao = resolverFiltro(
    document.getElementById("tipoManifestacao").value,
    ["Humanóide", "Distante", "Automático", "Colônia", "Vinculado", "Ato"]
  );
  const poderDestrutivo = resolverFiltro(
    document.getElementById("poderDestrutivo").value,
    ["A", "B", "C", "D", "E"]
  );

  btnGerar.disabled = true;
  card.classList.remove("visible");
  errorBox.classList.remove("visible");
  loading.classList.add("visible");

  // Randomizações temáticas (equivalente aos métodos de evolução do Fakemon)
  const temasInspiracoes = [
    "música clássica (Beethoven, Mozart, Bach)",
    "rock e heavy metal (AC/DC, Metallica, Led Zeppelin)",
    "jazz e blues (Miles Davis, Robert Johnson)",
    "pop dos anos 80/90 (Michael Jackson, Madonna, Prince)",
    "hip-hop e rap (2Pac, Notorious B.I.G., Jay-Z)",
    "eletrônica e techno (Daft Punk, Chemical Brothers)",
    "opera e música dramática",
    "soul e funk (James Brown, Aretha Franklin)",
    "reggae (Bob Marley)",
    "punk rock (Sex Pistols, The Clash)",
    "bossa nova e MPB (Tom Jobim, Caetano Veloso)",
    "K-pop e J-pop",
    "metal progressivo (Dream Theater, Tool)",
    "country e bluegrass",
    "música eletrônica brasileira (baile funk, axé, forró)"
  ];

  const categoriasTipo = [
    "Stand de manipulação temporal (parar, reverter, acelerar o tempo)",
    "Stand de manipulação espacial (portais, dobramento de espaço)",
    "Stand de transformação/metamorfose (objetos, materiais, corpos)",
    "Stand de ilusão e percepção (alucinações, falsas realidades)",
    "Stand de força bruta pura (combate direto, destruição)",
    "Stand de suporte e cura (recuperação, escudos, buffs)",
    "Stand de infiltração e furtividade (invisibilidade, espionagem)",
    "Stand de controle de elementos (fogo, água, terra, ar, eletricidade)",
    "Stand de necromancia ou ressurreição",
    "Stand de informação e previsão (leitura de memórias, previsão do futuro)",
    "Stand de cópia e absorção (copiar habilidades, absorver poder)",
    "Stand de criação (materializar objetos ou seres do nada)",
    "Stand de veneno, doença e contaminação",
    "Stand de gravidade e magnetismo",
    "Stand ligado a conceitos abstratos (amor, medo, memória, destino)"
  ];

  const temaInsp = pick(temasInspiracoes);
  const catTipo  = pick(categoriasTipo);

  const instrucaoExtra = `
--- FATORES ALEATÓRIOS OBRIGATÓRIOS ---
TEMA MUSICAL DE REFERÊNCIA: ${temaInsp}
CATEGORIA DO PODER: ${catTipo}
TIPO DE MANIFESTAÇÃO DEFINIDO: ${tipoManifestacao}
PODER DESTRUTIVO DEFINIDO: ${poderDestrutivo}
--------------------------------------`;

  const prompt = `Você é um criador de Stands de JoJo's Bizarre Adventure. Crie um Stand completamente original e criativo.

Retorne SOMENTE um JSON válido (sem markdown, sem blocos de código, sem texto extra) com esta estrutura exata:
{
  "nome": "NOME DO STAND EM CAIXA ALTA (referência musical)",
  "tema": "Breve explicação da referência musical/cultural (ex: baseado no álbum X da banda Y)",
  "tipoManifestacao": "Humanóide",
  "aparencia": "Descrição visual detalhada do Stand em 2-3 frases (cores, forma, tamanho, características marcantes).",
  "habilidadePrincipal": "Nome e descrição completa da habilidade principal do Stand (2-3 frases).",
  "descricao": "Descrição geral do Stand, seu comportamento e personalidade se houver (2-3 frases).",
  "fraquezas": "Limitações, fraquezas e condições de uso do Stand (2-3 frases).",
  "stats": {
    "poderDestrutivo": "B",
    "velocidade": "A",
    "alcance": "C",
    "persistencia": "B",
    "precisao": "A",
    "potencialDesenv": "C"
  },
  "tecnicas": [
    {
      "nome": "Nome da Técnica",
      "descricao": "Descrição detalhada da técnica em português.",
      "tipo": "ofensiva"
    }
  ],
  "usuario": {
    "nome": "Nome do Usuário",
    "descricao": "Breve descrição do usuário em português (personalidade, origem, motivação).",
    "fraseIconica": "Uma frase marcante que o usuário diria ao ativar o Stand."
  },
  "detalhes": {
    "alcanceMetros": "5 metros",
    "velocidadeDetalhada": "Suprassônica em combate direto",
    "grito": "ORA ORA ORA / MUDA MUDA / etc. (ou criativo)",
    "fraseAtivacao": "Frase que o usuário diz ao invocar o Stand"
  },
  "referenciasMusicais": [
    {
      "nome": "Nome da música/álbum",
      "artista": "Nome do artista",
      "relacao": "Como se relaciona com o Stand"
    }
  ]
}

REGRAS OBRIGATÓRIAS:

=== STATS ===
Os stats usam escala: E (mínimo), D, C, B, A, Infinito (supremo).
Distribua de forma ASSIMÉTRICA e temática — o Stand deve ter pontos fortes e fracos claros.
Exemplos de distribuição boa:
- Stand velocista: Poder:C, Velocidade:A, Alcance:D, Persistência:B, Precisão:A, Pot:B
- Stand tanque: Poder:A, Velocidade:D, Alcance:C, Persistência:A, Precisão:C, Pot:B
- Stand de longa distância: Poder:B, Velocidade:C, Alcance:A, Persistência:A, Precisão:A, Pot:C

=== TÉCNICAS ===
Crie entre 3 e 5 técnicas. Cada uma com nome criativo, descrição e tipo (ofensiva/defensiva/suporte/especial).
Técnicas devem ser coerentes com a habilidade principal.

=== NOME ===
O nome DEVE ser uma referência musical real (banda, álbum, música, artista). Ex: KILLER QUEEN, CRAZY DIAMOND, GOLD EXPERIENCE, STICKY FINGERS, BOHEMIAN RHAPSODY.

=== USUÁRIO ===
Crie um usuário original (não use personagens do mangá). Dê nome, personalidade e motivação.

=== REFERÊNCIAS MUSICAIS ===
Liste 2-4 músicas/álbuns que inspiraram o Stand.

=== OUTROS ===
- Todo texto descritivo em PORTUGUÊS.
- O Stand deve ter personalidade e conceito únicos — evite clones de Stands existentes.
- tipoManifestacao e poderDestrutivo devem seguir EXATAMENTE os fatores aleatórios abaixo.
${instrucaoExtra}`;

  try {
    const provider = document.getElementById("apiProvider")?.value || "gemini";
    const model    = document.getElementById("apiModel")?.value   || "gemini-2.5-flash";
    const apiKey   = document.getElementById("apiKey")?.value?.trim();

    if (!apiKey) throw new Error("Por favor, insira sua API Key nas configurações.");

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
    standAtual = stand;

    contador++;
    sessionStands[stand.nome] = { stand, num: contador };
    savedHistory.push({ stand, num: contador });
    localStorage.setItem("stand_history", JSON.stringify(savedHistory));
    localStorage.setItem("stand_contador", contador.toString());

    adicionarHistorico(stand, contador);
    renderCard(stand, contador);

  } catch(e) {
    document.getElementById("errorBox").textContent = "⚠️ Erro: " + e.message;
    document.getElementById("errorBox").classList.add("visible");
  } finally {
    loading.classList.remove("visible");
    btnGerar.disabled = false;
  }
}

function renderCard(stand, num) {
  document.getElementById("cardNome").textContent    = stand.nome;
  document.getElementById("cardTema").textContent    = stand.tema || "";
  document.getElementById("cardNumero").textContent  = `#${String(num).padStart(3, "0")}`;
  document.getElementById("cardHabilidade").textContent = stand.habilidadePrincipal || "";
  document.getElementById("cardDescricao").textContent  = stand.descricao || "";
  document.getElementById("cardFraquezas").textContent  = stand.fraquezas || "";

  // Tipos (tipo de manifestação)
  const tiposEl = document.getElementById("cardTipos");
  tiposEl.innerHTML = "";
  const TIPO_COLORS = {
    "Humanóide": "#7c3aed", "Distante": "#38bdf8", "Automático": "#f97316",
    "Colônia": "#4ade80",   "Vinculado": "#f472b6", "Ato": "#facc15"
  };
  [stand.tipoManifestacao, stand.stats?.poderDestrutivo ? `Poder ${stand.stats.poderDestrutivo}` : null].filter(Boolean).forEach(t => {
    const b = document.createElement("span");
    b.className = "type-badge";
    b.textContent = t;
    b.style.background = TIPO_COLORS[t] || "#2a2a3e";
    b.style.color = "#fff";
    tiposEl.appendChild(b);
  });

  // Prompt de imagem
  const pc = document.getElementById("promptContainer");
  const apparence = (stand.aparencia || "").replace(/"/g, "'");
  const imgPrompt = `JoJo's Bizarre Adventure Stand, manga style, Araki art style, dramatic lighting, isolated on white background. Stand named ${stand.nome}. Type: ${stand.tipoManifestacao}. Appearance: ${apparence}. Detailed, stylized, bold outlines, high contrast.`;
  pc.innerHTML = `
    <div style="font-size:0.75rem;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;">Prompt para Gerar Imagem</div>
    <div style="display:flex;gap:10px;align-items:center;">
      <input type="text" readonly value="${imgPrompt}" style="flex:1;background:#1a1a2e;border:1px solid #3f3f5a;color:#fff;padding:6px 10px;border-radius:4px;font-size:0.8rem;">
      <button onclick="navigator.clipboard.writeText(this.previousElementSibling.value);this.textContent='Copiado!';setTimeout(()=>this.textContent='Copiar Prompt',2000)" style="background:var(--primary);color:#fff;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;font-size:0.8rem;white-space:nowrap;">Copiar Prompt</button>
    </div>
    <div style="margin-top:8px;font-size:0.7rem;color:#a0a0b0;">
      <strong>Obs:</strong> Recomenda-se o <a href="https://leonardo.ai" target="_blank" style="color:#38bdf8;text-decoration:underline;">Leonardo.ai</a> para gerar a imagem.
    </div>`;

  // Stats (ranks)
  const statsGrid = document.getElementById("statsGrid");
  statsGrid.innerHTML = `
    <div style="grid-column:1/-1;display:grid;grid-template-columns:140px 60px 1fr;gap:6px;align-items:center;margin-bottom:4px;">
      <span style="font-size:0.65rem;color:var(--muted);text-transform:uppercase;letter-spacing:1px;">Stat</span>
      <span style="font-size:0.65rem;color:var(--muted);text-transform:uppercase;letter-spacing:1px;text-align:center;">Rank</span>
      <span></span>
    </div>`;

  const stats = stand.stats || {};
  Object.entries(stats).forEach(([key, rank]) => {
    const color = STAT_COLORS[key] || "#888";
    const pct   = RANK_WIDTH[rank] || 50;
    statsGrid.innerHTML += `
      <div style="grid-column:1/-1;display:grid;grid-template-columns:140px 60px 1fr;gap:6px;align-items:center;margin-bottom:8px;">
        <span style="font-size:0.72rem;color:var(--muted);">${STAT_LABELS[key] || key}</span>
        <span class="rank-badge rank-${rank}" style="text-align:center;">${rank}</span>
        <div style="background:#2a2a3e;border-radius:6px;height:8px;overflow:hidden;">
          <div style="width:${pct}%;height:8px;border-radius:6px;background:${color};transition:width 0.6s ease;"></div>
        </div>
      </div>`;
  });

  // Técnicas
  const tecList = document.getElementById("tecnicasList");
  tecList.innerHTML = "";
  (stand.tecnicas || []).forEach(t => {
    const tipoTag = { ofensiva: "#ef4444", defensiva: "#38bdf8", suporte: "#4ade80", especial: "#facc15" }[t.tipo] || "#888";
    tecList.innerHTML += `<div class="ability-box">
      <div class="ability-header">
        <span class="ability-name">${t.nome}</span>
        <span class="ability-tag" style="background:${tipoTag}22;color:${tipoTag};">${t.tipo}</span>
      </div>
      <div class="ability-effect">${t.descricao}</div>
    </div>`;
  });

  // Detalhes
  const det = stand.detalhes || {};
  const detRow = document.getElementById("detalhesRow");
  detRow.innerHTML = `
    <div class="ability-box">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:0.8rem;">
        <div><span style="color:var(--muted);">Alcance:</span><br><strong>${det.alcanceMetros || "—"}</strong></div>
        <div><span style="color:var(--muted);">Velocidade:</span><br><strong style="font-size:0.72rem;">${det.velocidadeDetalhada || "—"}</strong></div>
        <div><span style="color:var(--muted);">Grito:</span><br><strong>${det.grito || "—"}</strong></div>
        <div><span style="color:var(--muted);">Ativação:</span><br><em style="font-size:0.75rem;color:#facc15;">${det.fraseAtivacao || "—"}</em></div>
      </div>
    </div>`;

  // Usuário
  const usr = stand.usuario || {};
  const usrBox = document.getElementById("usuarioBox");
  usrBox.innerHTML = `
    <div class="ability-box">
      <div class="ability-header"><span class="ability-name">${usr.nome || "Desconhecido"}</span></div>
      <div class="ability-effect">${usr.descricao || ""}</div>
      ${usr.fraseIconica ? `<div style="margin-top:6px;font-size:0.78rem;color:#facc15;font-style:italic;">"${usr.fraseIconica}"</div>` : ""}
    </div>`;

  // Referências musicais
  const refList = document.getElementById("refMusicais");
  refList.innerHTML = "";
  (stand.referenciasMusicais || []).forEach(r => {
    refList.innerHTML += `<div class="location-item">
      <div>
        <div class="location-name">🎵 ${r.nome}</div>
        <div class="location-meta">${r.artista} · ${r.relacao}</div>
      </div>
    </div>`;
  });

  document.getElementById("card").classList.add("visible");
}

function adicionarHistorico(stand, num) {
  const chips = document.getElementById("historyChips");
  const chip  = document.createElement("div");
  chip.className = "chip";
  chip.style.cssText = "display:flex;align-items:center;gap:6px;padding-right:4px;";

  const textSpan = document.createElement("span");
  textSpan.textContent = `#${String(num).padStart(3, "0")} ${stand.nome}`;
  textSpan.onclick = e => { e.stopPropagation(); renderCard(stand, num); window.scrollTo({top:0,behavior:"smooth"}); };

  const delBtn = document.createElement("span");
  delBtn.innerHTML = "×";
  delBtn.style.cssText = "color:#ef4444;font-weight:bold;cursor:pointer;padding:0 4px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background 0.2s;";
  delBtn.title = "Excluir Stand";
  delBtn.onmouseover = () => delBtn.style.background = "rgba(239,68,68,0.2)";
  delBtn.onmouseout  = () => delBtn.style.background = "transparent";
  delBtn.onclick = e => {
    e.stopPropagation();
    if (confirm(`Excluir ${stand.nome}?`)) {
      savedHistory = savedHistory.filter(i => i.num !== num);
      localStorage.setItem("stand_history", JSON.stringify(savedHistory));
      chip.remove();
      if (standAtual?.nome === stand.nome) {
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

function copiarStand() {
  if (!standAtual) return;
  const s = standAtual;
  const stats  = Object.entries(s.stats || {}).map(([k, v]) => `${STAT_LABELS[k]}: ${v}`).join(" | ");
  const tecns  = (s.tecnicas || []).map(t => `${t.nome} (${t.tipo}): ${t.descricao}`).join("\n");
  const refs   = (s.referenciasMusicais || []).map(r => `${r.nome} - ${r.artista}`).join(", ");
  const texto  = `=== ${s.nome} ===\n${s.tema}\nTipo: ${s.tipoManifestacao}\n\nHabilidade: ${s.habilidadePrincipal}\n\nDescrição: ${s.descricao}\n\nAparência: ${s.aparencia}\n\nFraquezas: ${s.fraquezas}\n\nStats: ${stats}\n\nTécnicas:\n${tecns}\n\nUsuário: ${s.usuario?.nome} — ${s.usuario?.descricao}\nFrase: "${s.usuario?.fraseIconica}"\n\nReferências: ${refs}`;
  navigator.clipboard.writeText(texto).then(() => {
    const btn = document.querySelector(".copy-btn");
    btn.textContent = "✅ Copiado!";
    setTimeout(() => btn.textContent = "📋 Copiar texto", 2000);
  });
}

function loadHistory() {
  try {
    const stored = localStorage.getItem("stand_history");
    if (!stored) return;
    const history = JSON.parse(stored);
    if (!Array.isArray(history)) return;
    savedHistory = history;
    history.forEach(item => {
      if (item.stand && item.num) {
        sessionStands[item.stand.nome] = { stand: item.stand, num: item.num };
        adicionarHistorico(item.stand, item.num);
        if (item.num > contador) contador = item.num;
      }
    });
  } catch(e) {
    console.warn("Erro ao carregar histórico:", e);
  }
}

function clearHistory() {
  if (!confirm("Limpar todo o histórico?")) return;
  savedHistory = [];
  sessionStands = {};
  localStorage.removeItem("stand_history");
  document.getElementById("historyChips").innerHTML = "";
  document.getElementById("card").classList.remove("visible");
  standAtual = null;
}

document.addEventListener("DOMContentLoaded", () => {
  const btnClear = document.getElementById("btnClearHistory");
  if (btnClear) btnClear.onclick = clearHistory;

  const providerSelect = document.getElementById("apiProvider");
  const modelSelect    = document.getElementById("apiModel");
  const apiKeyInput    = document.getElementById("apiKey");

  function updateModels() {
    if (!providerSelect || !modelSelect) return;
    const provider = providerSelect.value || "gemini";
    const list = MODELS[provider] || MODELS.gemini;
    modelSelect.innerHTML = "";
    list.forEach(m => {
      const opt = document.createElement("option");
      opt.value = m.id;
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
