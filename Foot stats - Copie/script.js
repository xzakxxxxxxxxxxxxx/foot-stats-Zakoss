const players = [
    {
        id: 1,
        name: "Alex",
        role: "Attaquant",
        photo: "players/alex.png",
        matches: 9,
        wins: 5,
        goals: 7,
        assists: 2
    },
    {
        id: 2,
        name: "Emma",
        role: "Milieu",
        photo: "players/emma.png",
        matches: 10,
        wins: 6,
        goals: 6,
        assists: 5
    },
    {
        id: 3,
        name: "Lucas",
        role: "Défenseur",
        photo: "players/lucas.png",
        matches: 8,
        wins: 4,
        goals: 2,
        assists: 1
    }
];
if (!localStorage.getItem("players")) {
    localStorage.setItem("players", JSON.stringify(players));
}
// Afficher / cacher le formulaire
function toggleForm() {
    const form = document.getElementById("matchForm");
    form.style.display = form.style.display === "none" ? "flex" : "none";
}

// Créer un match
function createMatch(event) {
    event.preventDefault();

    const match = {
        teamA: teamA.value,
        teamB: teamB.value,
        scoreA: scoreA.value,
        scoreB: scoreB.value,
        players: players.value,
        date: new Date().toLocaleDateString("fr-FR")
    };

    const matches = JSON.parse(localStorage.getItem("matches")) || [];
    matches.unshift(match);
    localStorage.setItem("matches", JSON.stringify(matches));

    matchForm.reset();
    matchForm.style.display = "none";

if (document.getElementById("matchesList")) {
  displayMatches();
}

}

// Afficher les matchs
function displayMatches() {
    const matchesList = document.getElementById("matchesList");
    const matches = JSON.parse(localStorage.getItem("matches")) || [];

    matchesList.innerHTML = "";

    matches.forEach((match, index) => {
        matchesList.innerHTML += `
        <div class="match-card">
            <small class="date">${match.date}</small>

            <div class="teams">
                <div class="team">
                    <span>${match.teamA}</span>
                    <strong>${match.scoreA}</strong>
                </div>

                <span class="vs">vs</span>

                <div class="team">
                    <span>${match.teamB}</span>
                    <strong>${match.scoreB}</strong>
                </div>
            </div>

            <small class="players">👥 ${match.players} joueurs</small>

            <button class="delete-btn" onclick="deleteMatch(${index})">
                🗑 Supprimer
            </button>
        </div>
        `;
    });
}


function deleteMatch(index) {
    const matches = JSON.parse(localStorage.getItem("matches")) || [];

    matches.splice(index, 1); // supprime le match
    localStorage.setItem("matches", JSON.stringify(matches));

    displayMatches();
}


// Charger les matchs au démarrage
displayMatches();

function displayPlayers() {
    const container = document.getElementById("playersList");
    const players = JSON.parse(localStorage.getItem("players")) || [];

    container.innerHTML = "";

    players.forEach(player => {
        container.innerHTML += `
            <a href="player.html?id=${player.id}" class="player-line">
                <img src="${player.photo}">
                <div class="player-info">
                    <strong>${player.name}</strong>
                    <small>${player.role}</small>
                </div>
                <span class="arrow">›</span>
            </a>
        `;
    });
}
function loadPlayerProfile() {
    const params = new URLSearchParams(window.location.search);
    const playerId = parseInt(params.get("id"));

    const players = JSON.parse(localStorage.getItem("players")) || [];
    const player = players.find(p => p.id === playerId);

    if (!player) return;

    const isAdmin = sessionStorage.getItem("isAdmin") === "true";

    document.getElementById("playerProfile").innerHTML = `
        <div class="profile-card">
            <img src="${player.photo}">
            <h2>${player.name}</h2>
            <p>${player.role}</p>

            <div class="stats">
                <div>⚽ But(s)<br><strong>${player.goals}</strong></div>
                <div>🎯 Passes<br><strong>${player.assists}</strong></div>
                <div>🏟 Matchs<br><strong>${player.matches}</strong></div>
                <div>🏆 Victoires<br><strong>${player.wins}</strong></div>
            </div>

            ${isAdmin ? `
            <button class="edit-btn" onclick="toggleEdit(${player.id})">
                ✏️ Modifier les stats
            </button>

            <div id="editForm" class="hidden">
                <label>Buts</label>
                <input type="number" id="goals" value="${player.goals}">

                <label>Passes</label>
                <input type="number" id="assists" value="${player.assists}">

                <label>Matchs</label>
                <input type="number" id="matches" value="${player.matches}">

                <label>Victoires</label>
                <input type="number" id="wins" value="${player.wins}">

                <button class="save-btn" onclick="savePlayerStats(${player.id})">
                    💾 Sauvegarder
                </button>
            </div>
            ` : ""}
        </div>
    `;
}

function showGoals() {
  setActiveTab(true);
  renderRanking("goals");
}

function showAssists() {
  setActiveTab(false);
  renderRanking("assists");
}

function setActiveTab(isGoals) {
  const b = document.getElementById("btn-buteurs");
  const p = document.getElementById("btn-passeurs");
  if (!b || !p) return;

  if (isGoals) {
    b.classList.add("active");
    p.classList.remove("active");
  } else {
    p.classList.add("active");
    b.classList.remove("active");
  }
}

function renderRanking(key) {
  const container = document.getElementById("ranking");
  if (!container) return;

  const players = JSON.parse(localStorage.getItem("players")) || [];
  const sorted = [...players].sort((a, b) => (b[key] || 0) - (a[key] || 0));

  container.innerHTML = "";

  sorted.forEach((p, index) => {
    container.innerHTML += `
      <a class="player-card" href="player.html?id=${p.id}">
        <span class="rank">#${index + 1}</span>
        <div class="info">
          <strong>${p.name}</strong>
          <small>${p.matches ?? 0} matchs</small>
        </div>
        <span class="stat">${p[key] ?? 0}</span>
      </a>
    `;
  });
}

const ADMIN_PASSWORD = "1234"; // 

function loginAdmin(event) {
  if (event) event.preventDefault();

  const input = document.getElementById("adminPassword");
  const error = document.getElementById("error");
  const code = input ? input.value : "";

  // 🔐 change ton code ici
  if (code === "1234") {
    sessionStorage.setItem("isAdmin", "true");
    if (error) error.textContent = "";

    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminPanel").classList.remove("hidden");

    renderAdminPlayersList();
  } else {
    if (error) error.textContent = "❌ Code incorrect";
  }
}

function logoutAdmin() {
  sessionStorage.removeItem("isAdmin");
  window.location.reload();
}

function addGoalRow() {
  const goalsList = document.getElementById("goalsList");
  if (!goalsList) {
    alert("Erreur: goalsList introuvable dans matchs.html");
    return;
  }

  const players = JSON.parse(localStorage.getItem("players")) || [];
  if (players.length === 0) {
    alert("Aucun joueur enregistré.");
    return;
  }

  const options = players.map(p => `<option value="${p.id}">${p.name}</option>`).join("");
  const optionsAssist = `<option value="">Aucun</option>` + options;

  const rowId = "goal_" + Date.now();

  goalsList.insertAdjacentHTML("beforeend", `
    <div class="goal-row" id="${rowId}">
      <div class="row">
        <select class="scorer" required>
          <option value="" disabled selected>Buteur</option>
          ${options}
        </select>

        <select class="assister">
          ${optionsAssist}
        </select>
      </div>

      <button type="button" class="remove-btn" onclick="removeGoalRow('${rowId}')">
        Supprimer ce but
      </button>
    </div>
  `);
}



function loadAdminPlayers() {
    const container = document.getElementById("adminPlayers");
    const players = JSON.parse(localStorage.getItem("players")) || [];

    container.innerHTML = "";

    players.forEach((p, index) => {
        container.innerHTML += `
            <div class="admin-card">
                <h3>${p.name}</h3>

                <label>Buts</label>
                <input type="number" value="${p.goals}" onchange="updateStat(${index}, 'goals', this.value)">

                <label>Passes</label>
                <input type="number" value="${p.assists}" onchange="updateStat(${index}, 'assists', this.value)">

                <label>Matchs</label>
                <input type="number" value="${p.matches}" onchange="updateStat(${index}, 'matches', this.value)">

                <label>Victoires</label>
                <input type="number" value="${p.wins}" onchange="updateStat(${index}, 'wins', this.value)">
            </div>
        `;
    });
}

function updateStat(index, key, value) {
    const players = JSON.parse(localStorage.getItem("players")) || [];
    players[index][key] = parseInt(value);
    localStorage.setItem("players", JSON.stringify(players));
}

function toggleEdit() {
    document.getElementById("editForm").classList.toggle("hidden");
}

function savePlayerStats(playerId) {
    const players = JSON.parse(localStorage.getItem("players")) || [];

    const player = players.find(p => p.id === playerId);
    if (!player) return;

    player.goals = parseInt(document.getElementById("goals").value);
    player.assists = parseInt(document.getElementById("assists").value);
    player.matches = parseInt(document.getElementById("matches").value);
    player.wins = parseInt(document.getElementById("wins").value);

    localStorage.setItem("players", JSON.stringify(players));

    loadPlayerProfile(); // refresh auto
}

function addPlayer(name, role, photo) {
  const players = JSON.parse(localStorage.getItem("players")) || [];

  const newId = players.length ? Math.max(...players.map(p => p.id)) + 1 : 1;

  players.push({
    id: newId,
    name,
    role,
    photo,
    matches: 0,
    wins: 0,
    goals: 0,
    assists: 0
  });

  localStorage.setItem("players", JSON.stringify(players));
}
addPlayer("Nicolas", "Milieu", "players/default.png");

function handleAddPlayer(event) {
  event.preventDefault();

  const isAdmin = sessionStorage.getItem("isAdmin") === "true";
  if (!isAdmin) {
    alert("Accès refusé.");
    return;
  }

  const name = document.getElementById("newName").value.trim();
  const role = document.getElementById("newRole").value.trim();
  const fileInput = document.getElementById("newPhotoFile");
  const msg = document.getElementById("addPlayerMsg");

  if (!name || !role) return;

  const file = fileInput.files && fileInput.files[0];

  // Si pas de photo → on ajoute direct avec photo par défaut
  if (!file) {
    addPlayerToStorage({ name, role, photo: "players/default.png" });
    document.getElementById("addPlayerForm").reset();
    if (msg) msg.textContent = "✅ Joueur ajouté !";
    renderAdminPlayersList();
    return;
  }

  // Si photo → on la convertit en base64 pour la garder dans localStorage
  const reader = new FileReader();
  reader.onload = function () {
    const photoDataUrl = reader.result; // ex: data:image/png;base64,...
    addPlayerToStorage({ name, role, photo: photoDataUrl });

    document.getElementById("addPlayerForm").reset();
    if (msg) msg.textContent = "✅ Joueur + photo ajoutés !";
    renderAdminPlayersList();
  };
  reader.readAsDataURL(file);
}

function addPlayerToStorage({ name, role, photo }) {
  const players = JSON.parse(localStorage.getItem("players")) || [];

  const newId = players.length ? Math.max(...players.map(p => p.id)) + 1 : 1;

  players.push({
    id: newId,
    name,
    role,
    photo,
    matches: 0,
    wins: 0,
    goals: 0,
    assists: 0
  });

  localStorage.setItem("players", JSON.stringify(players));
}

function renderAdminPlayersList() {
  const box = document.getElementById("adminPlayersList");
  if (!box) return;

  const players = JSON.parse(localStorage.getItem("players")) || [];
  box.innerHTML = "";

  players.forEach(p => {
    box.innerHTML += `
      <div style="display:flex;align-items:center;gap:10px;margin:10px 0;">
        <img src="${p.photo}" style="width:38px;height:38px;border-radius:50%;object-fit:cover;border:2px solid #22c55e;">
        <div style="flex:1;min-width:0;">
          <div style="font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.name}</div>
          <div style="color:#94a3b8;font-size:12px;">${p.role}</div>
        </div>
      </div>
    `;
  });
}
function renderAdminPlayersList() {
  const box = document.getElementById("adminPlayersList");
  if (!box) return;

  const players = JSON.parse(localStorage.getItem("players")) || [];
  box.innerHTML = "";

  players.forEach(p => {
    box.innerHTML += `
      <div class="admin-player-line">
        <div class="admin-player-info">
          <strong>${p.name}</strong>
          <small>${p.role}</small>
        </div>

        <button onclick="openEditPlayer(${p.id})">✏️</button>
      </div>
    `;
  });
}

function openEditPlayer(playerId) {
  const players = JSON.parse(localStorage.getItem("players")) || [];
  const p = players.find(pl => pl.id === playerId);
  if (!p) return;

  const newName = prompt("Nom du joueur :", p.name);
  if (newName === null) return;

  const newRole = prompt("Poste :", p.role);
  if (newRole === null) return;

  const newGoals = prompt("Buts :", p.goals);
  if (newGoals === null) return;

  const newAssists = prompt("Passes :", p.assists);
  if (newAssists === null) return;

  const newMatches = prompt("Matchs joués :", p.matches);
  if (newMatches === null) return;

  const newWins = prompt("Victoires :", p.wins);
  if (newWins === null) return;

  p.name = newName.trim();
  p.role = newRole.trim();
  p.goals = parseInt(newGoals) || 0;
  p.assists = parseInt(newAssists) || 0;
  p.matches = parseInt(newMatches) || 0;
  p.wins = parseInt(newWins) || 0;

  localStorage.setItem("players", JSON.stringify(players));
  renderAdminPlayersList();

  alert("✅ Joueur modifié");
}
function getPlayers() {
  return JSON.parse(localStorage.getItem("players")) || [];
}
function savePlayers(players) {
  localStorage.setItem("players", JSON.stringify(players));
}
function getMatches() {
  return JSON.parse(localStorage.getItem("matches")) || [];
}
function saveMatches(matches) {
  localStorage.setItem("matches", JSON.stringify(matches));
}
function initMatchForm() {
  const aBox = document.getElementById("teamAPlayers");
  const bBox = document.getElementById("teamBPlayers");
  if (!aBox || !bBox) return;

  const players = getPlayers();
  aBox.innerHTML = "";
  bBox.innerHTML = "";

  players.forEach(p => {
    aBox.innerHTML += `
      <label class="pick-line">
        <input type="checkbox" class="pickA" value="${p.id}">
        <span>${p.name}</span>
      </label>
    `;
    bBox.innerHTML += `
      <label class="pick-line">
        <input type="checkbox" class="pickB" value="${p.id}">
        <span>${p.name}</span>
      </label>
    `;
  });

  // vide la liste des buts à l'ouverture
  const goalsList = document.getElementById("goalsList");
  if (goalsList) goalsList.innerHTML = "";
}
function createMatch(event) {
  event.preventDefault();

  const teamAName = document.getElementById("teamA").value.trim();
  const teamBName = document.getElementById("teamB").value.trim();
  const scoreA = parseInt(document.getElementById("scoreA").value || "0");
  const scoreB = parseInt(document.getElementById("scoreB").value || "0");

  const teamAIds = Array.from(document.querySelectorAll(".pickA:checked")).map(x => parseInt(x.value));
  const teamBIds = Array.from(document.querySelectorAll(".pickB:checked")).map(x => parseInt(x.value));

  // sécurité: pas de joueur dans les deux équipes
  const overlap = teamAIds.filter(id => teamBIds.includes(id));
  if (overlap.length > 0) {
    alert("Un joueur est coché dans les deux équipes. Corrige avant de valider.");
    return;
  }
  if (teamAIds.length === 0 || teamBIds.length === 0) {
    alert("Choisis au moins 1 joueur par équipe.");
    return;
  }

  // lire les buts
  const goalRows = Array.from(document.querySelectorAll("#goalsList .goal-row"));
  const goals = goalRows.map(row => {
    const scorer = row.querySelector(".scorer").value;
    const assister = row.querySelector(".assister").value;
    return {
      scorerId: parseInt(scorer),
      assisterId: assister ? parseInt(assister) : null
    };
  });

  const match = {
    id: Date.now(), // id unique
    date: new Date().toLocaleDateString("fr-FR"),
    teamAName,
    teamBName,
    scoreA,
    scoreB,
    teamAIds,
    teamBIds,
    goals
  };

  const matches = getMatches();
  matches.unshift(match);
  saveMatches(matches);

  // Recalcul complet des stats à partir de tous les matchs
  recomputeStatsFromMatches();

  // reset UI
  document.getElementById("matchForm").reset();
  document.getElementById("goalsList").innerHTML = "";
  document.getElementById("matchForm").style.display = "none";

  displayMatches();
}
function recomputeStatsFromMatches() {
  const players = getPlayers();
  const matches = getMatches();

  players.forEach(p => {
    p.matches = 0;
    p.wins = 0;
    p.goals = 0;
    p.assists = 0;
  });

  matches.forEach(m => {
    if (!Array.isArray(m.teamAIds) || !Array.isArray(m.teamBIds)) return;

    const allIds = [...m.teamAIds, ...m.teamBIds];
    allIds.forEach(id => {
      const pl = players.find(x => x.id === id);
      if (pl) pl.matches += 1;
    });

    let winners = [];
    if (m.scoreA > m.scoreB) winners = m.teamAIds;
    else if (m.scoreB > m.scoreA) winners = m.teamBIds;

    winners.forEach(id => {
      const pl = players.find(x => x.id === id);
      if (pl) pl.wins += 1;
    });

    (m.goals || []).forEach(g => {
      const scorer = players.find(x => x.id === g.scorerId);
      if (scorer) scorer.goals += 1;

      if (g.assisterId) {
        const assister = players.find(x => x.id === g.assisterId);
        if (assister) assister.assists += 1;
      }
    });
  });

  savePlayers(players);
}
match.teamAIds.length

  // reset stats
  players.forEach(p => {
    p.matches = 0;
    p.wins = 0;
    p.goals = 0;
    p.assists = 0;
  });

 matches.forEach(m => {
  // ✅ si ancien format (pas de teamAIds/teamBIds) -> on ignore
  if (!Array.isArray(m.teamAIds) || !Array.isArray(m.teamBIds)) return;




    // victoires
    let winners = [];
    if (m.scoreA > m.scoreB) winners = m.teamAIds;
    else if (m.scoreB > m.scoreA) winners = m.teamBIds;
    // égalité => rien

    winners.forEach(id => {
      const pl = players.find(x => x.id === id);
      if (pl) pl.wins += 1;
    });

    // buts + passes
    (m.goals || []).forEach(g => {
      const scorer = players.find(x => x.id === g.scorerId);
      if (scorer) scorer.goals += 1;

      if (g.assisterId) {
        const assister = players.find(x => x.id === g.assisterId);
        if (assister) assister.assists += 1;
      }
    });
  });

  savePlayers(players);

function displayMatches() {
  const matchesList = document.getElementById("matchesList");
  if (!matchesList) return;

  const matches = getMatches();
  matchesList.innerHTML = "";

  matches.forEach((match, index) => {
    matchesList.innerHTML += `
      <div class="match-card">
        <small class="date">${match.date}</small>

        <div class="teams">
          <div class="team">
            <span>${match.teamAName}</span>
            <strong>${match.scoreA}</strong>
          </div>

          <span class="vs">vs</span>

          <div class="team">
            <span>${match.teamBName}</span>
            <strong>${match.scoreB}</strong>
          </div>
        </div>

        <small class="players">👥 ${(match.teamAIds?.length || 0) + (match.teamBIds?.length || 0)} joueurs
</small>

        <button class="delete-btn" type="button" onclick="deleteMatch(${index})">🗑 Supprimer</button>
      </div>
    `;
  });
}

function removeGoalRow(rowId) {
  const el = document.getElementById(rowId);
  if (el) el.remove();
}

matches,forEach

// ✅ rendre les fonctions accessibles aux onclick=""
window.toggleForm = toggleForm;
window.createMatch = createMatch;
window.displayMatches = displayMatches;
window.deleteMatch = deleteMatch;

window.initMatchForm = initMatchForm;
window.addGoalRow = addGoalRow;
window.removeGoalRow = removeGoalRow;

window.recomputeStatsFromMatches = recomputeStatsFromMatches;

function refreshHome() {
  // 1) Recalcul stats si la fonction existe
  try {
    if (typeof recomputeStatsFromMatches === "function") {
      recomputeStatsFromMatches();
    }
  } catch (e) {
    console.log("recomputeStatsFromMatches erreur:", e);
  }

  // 2) Top buteur / passeur
  const topBox = document.getElementById("homeTop");
  if (topBox) {
    const players = JSON.parse(localStorage.getItem("players")) || [];

    const topScorer = [...players].sort((a, b) => (b.goals || 0) - (a.goals || 0))[0];
    const topAssister = [...players].sort((a, b) => (b.assists || 0) - (a.assists || 0))[0];

topBox.innerHTML = `
  <div class="card" style="margin-bottom:12px;">
    <div class="top-label">🥇 Meilleur buteur</div>
    <div class="top-row">
      <div class="top-name">${topScorer ? topScorer.name : "—"}</div>
      <div class="top-value">${topScorer ? (topScorer.goals || 0) : 0}</div>
    </div>
  </div>

  <div class="card">
    <div class="top-label">🎯 Meilleur passeur</div>
    <div class="top-row">
      <div class="top-name">${topAssister ? topAssister.name : "—"}</div>
      <div class="top-value">${topAssister ? (topAssister.assists || 0) : 0}</div>
    </div>
  </div>
`;

  }

  // 3) Derniers matchs
  const matchBox = document.getElementById("homeMatches");
  if (matchBox) {
    const matches = JSON.parse(localStorage.getItem("matches")) || [];
    const last = matches.slice(0, 3);

    if (last.length === 0) {
      matchBox.innerHTML = `<div class="card" style="margin-top:12px;color:#94a3b8;">Aucun match pour le moment</div>`;
      return;
    }

    matchBox.innerHTML = `<h2 style="margin:14px 0 10px;">📅 Derniers matchs</h2>` + last.map(m => {
      const aName = m.teamAName || m.teamA || "Équipe A";
      const bName = m.teamBName || m.teamB || "Équipe B";
      const aScore = m.scoreA ?? 0;
      const bScore = m.scoreB ?? 0;
      const date = m.date || "";

      return `
        <div class="match-card">
          <small class="date">${date}</small>
          <div class="teams">
            <div class="team"><span>${aName}</span><strong>${aScore}</strong></div>
            <span class="vs">vs</span>
            <div class="team"><span>${bName}</span><strong>${bScore}</strong></div>
          </div>
        </div>
      `;
    }).join("");
  }
}
