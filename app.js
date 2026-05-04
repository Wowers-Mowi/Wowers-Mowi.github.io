"use strict";

const STORAGE_KEY = "plan-vuelo-asistente-v2";
const OLD_STORAGE_KEY = "plan-vuelo-asistente-v1";
const SETTINGS_STORAGE_KEY = "plan-vuelo-opciones-v1";

const DEFAULT_OPTION_SETS = {
  departmentMode: [
    { value: "PRIVADO", label: "Privado" },
    { value: "LSFA", label: "LSFA" },
    { value: "OTROS", label: "Otros" },
  ],
  aircraftType: [
    { value: "EXPL", label: "EXPL - Conada" },
    { value: "EC130", label: "EC130 - Frogger" },
    { value: "H500", label: "H500 - Buzzard" },
    { value: "C310", label: "C310 - Cuban 800" },
    { value: "DHC2", label: "DHC2 - Dodo" },
    { value: "LI45", label: "LI45 - Luxor" },
    { value: "C182", label: "C182 - Mammatus" },
    { value: "C750", label: "C750 - Nimbus" },
    { value: "SEAW", label: "SEAW - Seabreeze" },
    { value: "L145", label: "L145 - Shamal" },
    { value: "PA-46", label: "PA-46 - Velum" },
    { value: "B206", label: "B206 - Maverick" },
    { value: "AW139", label: "AW139 - Swift" },
    { value: "B47", label: "B47 - Sparrow" },
    { value: "B47S", label: "B47S - Seasparrow" },
    { value: "CH-7", label: "CH-7 - Havok" },
    { value: "EC45", label: "EC45 - Super Volito" },
    { value: "H160", label: "H160 - Volatus" },
  ],
  flightRule: [
    { value: "V", label: "V - VFR, reglas visuales" },
    { value: "I", label: "I - IFR, reglas instrumentales" },
    { value: "Y", label: "Y - IFR y cambio a VFR" },
    { value: "Z", label: "Z - VFR y cambio a IFR" },
  ],
  flightType: [
    { value: "G", label: "G - Aviacion general" },
    { value: "S", label: "S - Servicio aereo regular" },
    { value: "N", label: "N - Transporte no regular" },
    { value: "M", label: "M - Militar" },
    { value: "X", label: "X - Otra categoria" },
  ],
  departure: [
    { value: "LSIA", label: "LSIA - Aeropuerto Internacional Los Santos" },
    { value: "BCSS", label: "BCSS - Sandy Shores" },
    { value: "BCGS", label: "BCGS - Grape Seed" },
    { value: "SAGOV", label: "SAGOV - Helipuerto SAGOV" },
    { value: "SACP", label: "SACP - Cayo Perico" },
    { value: "HOSP1", label: "HOSP1 - Helipuerto Hospital" },
    { value: "HOSP2", label: "HOSP2 - Helipuerto Hospital" },
    { value: "VPHP", label: "VPHP - Helipuerto Vespucci" },
  ],
  destination: [
    { value: "LSIA", label: "LSIA - Aeropuerto Internacional Los Santos" },
    { value: "BCSS", label: "BCSS - Sandy Shores" },
    { value: "BCGS", label: "BCGS - Grape Seed" },
    { value: "SAGOV", label: "SAGOV - Helipuerto SAGOV" },
    { value: "SACP", label: "SACP - Cayo Perico" },
    { value: "HOSP1", label: "HOSP1 - Helipuerto Hospital" },
    { value: "HOSP2", label: "HOSP2 - Helipuerto Hospital" },
    { value: "VPHP", label: "VPHP - Helipuerto Vespucci" },
  ],
  rmk: [
    { value: "PRIVADO", label: "RMK Privado" },
    { value: "VUELO DE ENTRENAMIENTO", label: "RMK Vuelo de entrenamiento" },
    { value: "OPERACION NOCTURNA", label: "RMK Operacion nocturna" },
    { value: "VUELO EN FORMACION", label: "RMK Vuelo en formacion" },
    { value: "SIN_RMK", label: "Sin RMK" },
  ],
  returnToDeparture: [
    { value: "NO", label: "No" },
    { value: "SI", label: "Si, vuelve a salida" },
  ],
};

const QUESTIONS = [
  {
    key: "departmentMode",
    title: "Departamento o empresa",
    help: "Elige alguna de las opciones u Otros. Si eliges Otros, se abre una caja para escribir exactamente el texto que debe aparecer en el plan.",
    type: "department",
    configurable: true,
  },
  {
    key: "pilotName",
    title: "Piloto al mando",
    help: "Nombre del piloto responsable del vuelo.",
    type: "text",
    placeholder: "Ej. Duncan Beckett",
    required: true,
    configurable: true,
  },
  {
    key: "license",
    title: "Licencia de vuelo",
    help: "Escribe la licencia tal como debe verse en el plan, incluyendo prefijo, guion o espacios.",
    type: "text",
    placeholder: "Ej. PCH-768415",
    required: true,
    configurable: true,
  },
  {
    key: "aircraftId",
    title: "Identificacion de aeronave",
    help: "Matricula, indicativo o identificador de la aeronave.",
    type: "text",
    placeholder: "Ej. 281 YEI",
    required: true,
    configurable: true,
  },
  {
    key: "aircraftType",
    title: "Tipo de aeronave",
    help: "Codigo ICAO o codigo interno del modelo.",
    type: "select",
    configurable: true,
  },
  {
    key: "visualDescription",
    title: "Color o descripcion visual",
    help: "Descripcion corta para reconocer la aeronave.",
    type: "text",
    placeholder: "Ej. Rojo y Amarillo",
    configurable: true,
  },
  {
    key: "flightRule",
    title: "Regla de vuelo",
    help: [
      "I: IFR. Todo el vuelo se realiza por reglas instrumentales.",
      "V: VFR. Todo el vuelo se realiza por reglas visuales.",
      "Y: empieza en IFR y luego cambia a VFR.",
      "Z: empieza en VFR y luego cambia a IFR.",
    ],
    type: "select",
    configurable: true,
  },
  {
    key: "flightType",
    title: "Tipo de vuelo",
    help: [
      "S: servicio aereo regular, con operacion programada.",
      "N: transporte aereo no regular, sin horario regular.",
      "G: aviacion general, uso privado, recreativo o escuela habitual.",
      "M: vuelo militar.",
      "X: otra categoria distinta de las anteriores.",
    ],
    type: "select",
    configurable: true,
  },
  {
    key: "departure",
    title: "Punto de salida",
    help: "Codigo del aerodromo/helipuerto desde el que sale el vuelo.",
    type: "select",
    configurable: true,
  },
  {
    key: "destination",
    title: "Punto de destino",
    help: "Codigo del aerodromo/helipuerto al que se dirige el vuelo.",
    type: "select",
    configurable: true,
  },
  {
    key: "returnToDeparture",
    title: "¿La ruta vuelve al punto de salida?",
    help: "Elige Si cuando la ruta sale de un aerodromo/helipuerto, pasa por el destino y termina otra vez en el aerodromo/helipuerto de salida. Ejemplo: LSIA-BCGS-LSIA.",
    type: "select",
    configurable: true,
  },
  {
    key: "persons",
    title: "Personas a bordo",
    help: "Numero total de personas dentro de la aeronave, incluyendo piloto y pasajeros.",
    type: "number",
    min: 1,
    max: 99,
    required: true,
    configurable: true,
  },
  {
    key: "emergency",
    title: "Equipo radio de emergencia",
    help: "Marca los equipos disponibles en la aeronave. UHF y VHF son radios; ELT es el transmisor localizador de emergencia.",
    type: "checks",
    options: [
      { key: "uhf", label: "UHF" },
      { key: "vhf", label: "VHF" },
      { key: "elt", label: "ELT" },
    ],
  },
  {
    key: "rmk",
    title: "Observaciones especiales (RMK)",
    help: [
      "Privado: marca el vuelo como privado.",
      "Vuelo de entrenamiento: para formacion o practica de pilotos.",
      "Operacion nocturna: cuando el vuelo se realiza en condiciones nocturnas.",
      "Vuelo en formacion: cuando opera coordinado con otras aeronaves.",
      "Sin RMK: no anade observaciones a la linea DATOS.",
    ],
    type: "select",
    configurable: true,
  },
];

const CONFIGURABLE_QUESTIONS = QUESTIONS.filter((question) => question.configurable);

const canvas = document.getElementById("flight-plan-canvas");
const ctx = canvas.getContext("2d");
const form = document.getElementById("wizard-form");
const progressBar = document.getElementById("progress-bar");
const stepCount = document.getElementById("step-count");
const questionTitle = document.getElementById("question-title");
const questionHelp = document.getElementById("question-help");
const questionControl = document.getElementById("question-control");
const backBtn = document.getElementById("back-btn");
const nextBtn = document.getElementById("next-btn");
const resetBtn = document.getElementById("reset-btn");
const copyBtn = document.getElementById("copy-btn");
const copyAtcBtn = document.getElementById("copy-atc-btn");
const copyMessage = document.getElementById("copy-message");
const downloadLink = document.getElementById("download-link");
const utcReadout = document.getElementById("utc-readout");
const previewStatus = document.getElementById("preview-status");
const settingsBtn = document.getElementById("settings-btn");
const settingsModal = document.getElementById("settings-modal");
const settingsCloseBtn = document.getElementById("settings-close-btn");
const settingsQuestionSelect = document.getElementById("settings-question-select");
const settingsHint = document.getElementById("settings-hint");
const settingsOptionsList = document.getElementById("settings-options-list");
const settingsAddBtn = document.getElementById("settings-add-btn");
const settingsSaveBtn = document.getElementById("settings-save-btn");
const settingsRestoreBtn = document.getElementById("settings-restore-btn");
const settingsStatus = document.getElementById("settings-status");

const planLogo = new Image();
planLogo.src = "./assets/plan-logo.png";
planLogo.addEventListener("load", renderCanvas);

let optionConfig = loadOptionConfig();
let currentStep = 0;
let completed = false;
let state = loadState();
let settingsDraftConfig = null;
let settingsDirty = false;

function getUtcParts() {
  const now = new Date();
  const hour = String(now.getUTCHours()).padStart(2, "0");
  const minute = String(now.getUTCMinutes()).padStart(2, "0");
  return {
    day: String(now.getUTCDate()),
    hour,
    minute,
    time: `${hour}:${minute}`,
    readout: `${String(now.getUTCDate()).padStart(2, "0")}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${now.getUTCFullYear()} ${hour}:${minute} UTC`,
  };
}

function defaultState() {
  return {
    departmentMode: "PRIVADO",
    departmentOther: "",
    pilotName: "",
    license: "",
    aircraftId: "",
    aircraftType: "H160",
    visualDescription: "",
    flightRule: "V",
    flightType: "G",
    departure: "LSIA",
    destination: "BCGS",
    persons: "1",
    emergency: {
      uhf: true,
      vhf: true,
      elt: true,
    },
    rmk: "PRIVADO",
    returnToDeparture: "NO",
    optionMode: {},
  };
}

function loadState() {
  const fresh = defaultState();
  const stored = readStorage(STORAGE_KEY) || migrateOldState();
  const merged = {
    ...fresh,
    ...stored,
    emergency: {
      ...fresh.emergency,
      ...(stored ? stored.emergency : {}),
    },
    optionMode: {
      ...fresh.optionMode,
      ...(stored ? stored.optionMode : {}),
    },
  };

  if (!stored || !stored.departmentMode) {
    const oldDepartment = clean(stored && stored.department);
    if (oldDepartment && oldDepartment !== "PRIVADO" && oldDepartment !== "LSFA") {
      merged.departmentMode = "OTROS";
      merged.departmentOther = oldDepartment;
    }
  }

  ensureStateFitsAllOptions(merged);
  return merged;
}

function migrateOldState() {
  const old = readStorage(OLD_STORAGE_KEY);
  if (!old) return null;
  const oldDepartment = clean(old.department);
  const knownDepartment = ["PRIVADO", "LSFA"].includes(oldDepartment);
  return {
    ...old,
    departmentMode: knownDepartment ? oldDepartment : oldDepartment ? "OTROS" : "PRIVADO",
    departmentOther: knownDepartment ? "" : oldDepartment,
  };
}

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadOptionConfig() {
  const stored = readStorage(SETTINGS_STORAGE_KEY) || {};
  const config = {};
  for (const question of CONFIGURABLE_QUESTIONS) {
    if (Array.isArray(stored[question.key])) {
      config[question.key] = normalizeOptions(stored[question.key]);
    }
  }
  return config;
}

function saveOptionConfig() {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(optionConfig));
}

function clean(value) {
  return String(value || "").trim();
}

function upper(value) {
  return clean(value).toUpperCase();
}

function normalizeOption(option) {
  const label = clean(option && option.label);
  const value = clean(option && option.value) || label;
  return {
    value,
    label: label || value,
  };
}

function normalizeOptions(options) {
  const seen = new Set();
  const normalized = [];
  for (const option of options || []) {
    const item = normalizeOption(option);
    if (!item.value || seen.has(item.value)) continue;
    seen.add(item.value);
    normalized.push(item);
  }
  return normalized;
}

function getQuestion(key) {
  return QUESTIONS.find((question) => question.key === key);
}

function getOptionsFor(key) {
  const custom = optionConfig[key];
  if (custom && custom.length) return custom;
  return DEFAULT_OPTION_SETS[key] ? DEFAULT_OPTION_SETS[key] : [];
}

function getEditableOptions(key) {
  const custom = optionConfig[key];
  const source = custom && custom.length ? custom : getOptionsFor(key);
  return source.map((option) => ({ ...option }));
}

function hasDefaultOptions(key) {
  return Array.isArray(DEFAULT_OPTION_SETS[key]) && DEFAULT_OPTION_SETS[key].length > 0;
}

function hasManualOptions(key) {
  return Array.isArray(optionConfig[key]) && optionConfig[key].length > 0 && !hasDefaultOptions(key);
}

function ensureStateFitsAllOptions(targetState) {
  for (const question of QUESTIONS) {
    ensureStateFitsOptions(question.key, targetState);
  }
}

function ensureStateFitsOptions(key, targetState = state) {
  const question = getQuestion(key);
  if (!question) return;
  const options = getOptionsFor(key);

  if (question.type === "select" || question.type === "department") {
    if (!options.some((option) => option.value === targetState[key]) && options[0]) {
      targetState[key] = options[0].value;
    }
    return;
  }

  if ((question.type === "text" || question.type === "number") && targetState.optionMode[key] === "list") {
    if (options.length && !options.some((option) => option.value === targetState[key])) {
      targetState[key] = options[0].value;
    }
    if (!options.length) {
      targetState.optionMode[key] = "manual";
    }
  }
}

function getDepartmentValue() {
  if (state.departmentMode === "OTROS") {
    return clean(state.departmentOther);
  }
  return clean(state.departmentMode);
}

function getAircraftName(code) {
  const item = getOptionsFor("aircraftType").find((type) => type.value === code);
  if (!item) return "";
  if (item.label.includes(" - ")) return item.label.split(" - ").slice(1).join(" - ");
  return "";
}

function getAircraftVisualText() {
  const name = getAircraftName(state.aircraftType);
  return clean(`${name} ${clean(state.visualDescription)}`) || name;
}

function getDataLine() {
  const routeBack = state.returnToDeparture === "SI" ? `-${upper(state.departure)}` : "";
  const route = `${upper(state.departure)}-${upper(state.destination)}${routeBack}`;
  const rmk = state.rmk === "SIN_RMK" ? "" : ` | RMK ${upper(state.rmk)}`;
  return `${upper(state.aircraftType)} / DEP - ${route}${rmk}`;
}

function getPlanValues() {
  const utc = getUtcParts();
  const direction2 = [clean(state.pilotName), upper(state.license)].filter(Boolean).join(" | ");
  return {
    utc,
    priority: "FF",
    addressCode: upper(state.departure),
    direction2,
    direction3: getAircraftVisualText(),
    department: upper(getDepartmentValue()),
    aircraftId: upper(state.aircraftId),
    flightRule: upper(state.flightRule),
    flightType: upper(state.flightType),
    aircraftType: upper(state.aircraftType),
    departure: upper(state.departure),
    departureTime: utc.time,
    destination: upper(state.destination),
    persons: String(Math.max(0, Math.min(99, Number(state.persons) || 0))).padStart(2, "0"),
    emergency: state.emergency,
    dataLine1: getDataLine(),
    dataLine2: getAircraftVisualText(),
    pilotName: clean(state.pilotName),
    license: upper(state.license),
  };
}

function renderWizard() {
  const progress = completed ? 100 : (currentStep / QUESTIONS.length) * 100;
  progressBar.style.width = `${progress}%`;
  backBtn.disabled = currentStep === 0 && !completed;

  if (completed) {
    stepCount.textContent = "Previsualizacion final";
    questionTitle.textContent = "Plan listo";
    questionControl.innerHTML = "";
    renderHelp("La hora y el dia del plan se actualizan automaticamente en UTC. Revisa la imagen y usa el boton de copia situado debajo de la previsualizacion.");
    nextBtn.textContent = "Editar respuestas";
    copyBtn.disabled = false;
    copyAtcBtn.disabled = false;
    previewStatus.textContent = "";
    return;
  }

  const question = QUESTIONS[currentStep];
  stepCount.textContent = `Pregunta ${currentStep + 1} de ${QUESTIONS.length}`;
  questionTitle.textContent = question.title;
  nextBtn.innerHTML = currentStep === QUESTIONS.length - 1 ? "Ver plan <span aria-hidden=\"true\">&gt;</span>" : "Siguiente <span aria-hidden=\"true\">&gt;</span>";
  copyBtn.disabled = true;
  copyAtcBtn.disabled = true;
  previewStatus.textContent = "";

  questionControl.innerHTML = "";
  questionControl.appendChild(buildControl(question));
  renderHelp(question.help);
}

function renderHelp(help) {
  questionHelp.innerHTML = "";
  if (Array.isArray(help)) {
    const list = document.createElement("ul");
    for (const item of help) {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    }
    questionHelp.appendChild(list);
    return;
  }
  questionHelp.textContent = help || "";
}

function buildControl(question) {
  if (question.type === "department") return buildDepartment(question);
  if (question.type === "select") return buildSelect(question);
  if (question.type === "number") return buildManualField(question, "number");
  if (question.type === "checks") return buildChecks(question);
  return buildManualField(question, "text");
}

function buildLabel(text, child) {
  const label = document.createElement("label");
  label.className = "field-label";
  label.append(text, child);
  return label;
}

function buildDepartment(question) {
  const wrap = document.createElement("div");
  wrap.className = "question-control";

  const select = createSelect(getOptionsFor(question.key), state[question.key]);
  select.addEventListener("change", () => {
    state[question.key] = select.value;
    saveState();
    renderWizard();
    renderCanvas();
  });
  wrap.appendChild(buildLabel("Respuesta por defecto", select));

  if (state[question.key] === "OTROS") {
    const textarea = document.createElement("textarea");
    textarea.className = "textarea-input";
    textarea.value = state.departmentOther || "";
    textarea.placeholder = "Escribe el departamento o empresa";
    textarea.required = true;
    textarea.addEventListener("input", () => {
      state.departmentOther = textarea.value;
      saveState();
      renderCanvas();
    });
    wrap.appendChild(buildLabel("Texto personalizado", textarea));
    setTimeout(() => textarea.focus(), 0);
  } else {
    setTimeout(() => select.focus(), 0);
  }

  return wrap;
}

function buildSelect(question) {
  const select = createSelect(getOptionsFor(question.key), state[question.key]);
  select.addEventListener("change", () => {
    state[question.key] = select.value;
    saveState();
    renderCanvas();
  });
  setTimeout(() => select.focus(), 0);
  return buildLabel("Respuesta por defecto", select);
}

function createSelect(options, value) {
  const select = document.createElement("select");
  select.className = "select-input";
  const normalized = options.length ? options : [{ value: "", label: "Sin opciones" }];
  for (const option of normalized) {
    const item = document.createElement("option");
    item.value = option.value;
    item.textContent = option.label;
    select.appendChild(item);
  }
  select.value = normalized.some((option) => option.value === value) ? value : normalized[0].value;
  return select;
}

function buildManualField(question, inputType) {
  const wrap = document.createElement("div");
  wrap.className = "question-control";
  const options = getOptionsFor(question.key);
  const hasOptions = options.length > 0;

  if (hasOptions) {
    const mode = state.optionMode[question.key] || "list";
    state.optionMode[question.key] = mode;
    wrap.appendChild(buildModeToggle(question.key, mode));
    if (mode === "list") {
      if (!options.some((option) => option.value === state[question.key])) {
        state[question.key] = options[0].value;
        saveState();
      }
      const select = createSelect(options, state[question.key]);
      select.addEventListener("change", () => {
        state[question.key] = select.value;
        saveState();
        renderCanvas();
      });
      wrap.appendChild(buildLabel("Elegir opcion guardada", select));
      setTimeout(() => select.focus(), 0);
      return wrap;
    }
  }

  const input = document.createElement("input");
  input.className = inputType === "number" ? "number-input" : "text-input";
  input.type = inputType;
  input.value = state[question.key] || "";
  input.placeholder = question.placeholder || "";
  input.required = Boolean(question.required);
  if (question.min !== undefined) input.min = String(question.min);
  if (question.max !== undefined) input.max = String(question.max);
  input.addEventListener("input", () => {
    state[question.key] = input.value;
    saveState();
    renderCanvas();
  });
  wrap.appendChild(buildLabel("Respuesta", input));
  setTimeout(() => input.focus(), 0);
  return wrap;
}

function buildModeToggle(key, mode) {
  const toggle = document.createElement("div");
  toggle.className = "mode-toggle";
  const listBtn = document.createElement("button");
  const manualBtn = document.createElement("button");
  listBtn.type = "button";
  manualBtn.type = "button";
  listBtn.textContent = "Elegir";
  manualBtn.textContent = "Escribir";
  listBtn.className = mode === "list" ? "active" : "";
  manualBtn.className = mode === "manual" ? "active" : "";

  listBtn.addEventListener("click", () => {
    state.optionMode[key] = "list";
    const options = getOptionsFor(key);
    if (options.length && !options.some((option) => option.value === state[key])) {
      state[key] = options[0].value;
    }
    saveState();
    renderWizard();
    renderCanvas();
  });

  manualBtn.addEventListener("click", () => {
    state.optionMode[key] = "manual";
    saveState();
    renderWizard();
    renderCanvas();
  });

  toggle.append(listBtn, manualBtn);
  return toggle;
}

function buildChecks(question) {
  const grid = document.createElement("div");
  grid.className = "check-grid";
  for (const option of question.options) {
    const label = document.createElement("label");
    label.className = "check-card";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = Boolean(state.emergency[option.key]);
    input.addEventListener("change", () => {
      state.emergency[option.key] = input.checked;
      saveState();
      renderCanvas();
    });
    label.append(input, option.label);
    grid.appendChild(label);
  }
  return grid;
}

function validateCurrentQuestion() {
  const question = QUESTIONS[currentStep];
  if (question.type === "department" && state.departmentMode === "OTROS" && !clean(state.departmentOther)) {
    const input = questionControl.querySelector("textarea");
    if (input) {
      input.reportValidity();
      input.focus();
    }
    return false;
  }

  if (!question.required) return true;
  const value = clean(state[question.key]);
  if (value) return true;
  const input = questionControl.querySelector("input, select, textarea");
  if (input) {
    input.reportValidity();
    input.focus();
  }
  return false;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (completed) {
    completed = false;
    currentStep = Math.max(0, QUESTIONS.length - 1);
    renderWizard();
    renderCanvas();
    return;
  }

  if (!validateCurrentQuestion()) return;

  if (currentStep < QUESTIONS.length - 1) {
    currentStep += 1;
  } else {
    completed = true;
  }
  renderWizard();
  renderCanvas();
});

backBtn.addEventListener("click", () => {
  if (completed) {
    completed = false;
    currentStep = QUESTIONS.length - 1;
  } else {
    currentStep = Math.max(0, currentStep - 1);
  }
  renderWizard();
  renderCanvas();
});

resetBtn.addEventListener("click", () => {
  if (!window.confirm("Reiniciar el formulario?")) return;
  state = defaultState();
  ensureStateFitsAllOptions(state);
  currentStep = 0;
  completed = false;
  localStorage.removeItem(STORAGE_KEY);
  copyMessage.textContent = "";
  copyMessage.className = "copy-message";
  renderWizard();
  renderCanvas();
});

copyBtn.addEventListener("click", async () => {
  if (!completed) return;
  copyMessage.textContent = "";
  copyMessage.className = "copy-message";
  try {
    const blob = await canvasToBlob(canvas);
    if (!navigator.clipboard || !window.ClipboardItem) {
      throw new Error("El navegador no permite copiar imagenes desde este contexto.");
    }
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    copyMessage.textContent = "Imagen copiada al portapapeles.";
    copyMessage.classList.add("ok");
  } catch (error) {
    updateDownloadLink();
    copyMessage.textContent = "No se pudo copiar automaticamente. Usa la descarga PNG o abre la app desde http://localhost.";
    copyMessage.classList.add("error");
  }
});

copyAtcBtn.addEventListener("click", async () => {
  if (!completed) return;
  copyMessage.textContent = "";
  copyMessage.className = "copy-message";

  try {
    await copyTextToClipboard(getAtcMessage());
    copyMessage.textContent = "Comunicacion ATC copiada al portapapeles.";
    copyMessage.classList.add("ok");
  } catch (error) {
    copyMessage.textContent = "No se pudo copiar la comunicacion ATC automaticamente.";
    copyMessage.classList.add("error");
  }
});

function canvasToBlob(sourceCanvas) {
  return new Promise((resolve, reject) => {
    sourceCanvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("No se pudo generar la imagen."));
    }, "image/png");
  });
}

function getAtcMessage() {
  const aircraftId = upper(state.aircraftId) || "MATRICULA";
  const departure = upper(state.departure) || "AERODROMO";
  return `${aircraftId} para ATC ${departure} Solicitamos autorizaci\u00f3n para despegue desde ${departure} seg\u00fan previsto en plan de vuelo. Cambio.`;
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!copied) throw new Error("No se pudo copiar texto.");
}

settingsBtn.addEventListener("click", openSettings);
settingsCloseBtn.addEventListener("click", requestCloseSettings);
settingsModal.addEventListener("click", (event) => {
  if (event.target === settingsModal) requestCloseSettings();
});
settingsQuestionSelect.addEventListener("change", renderSettingsOptions);
settingsAddBtn.addEventListener("click", addSettingsOption);
settingsSaveBtn.addEventListener("click", saveSettingsDraft);
settingsRestoreBtn.addEventListener("click", restoreSettingsQuestion);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !settingsModal.hidden) requestCloseSettings();
});

function openSettings() {
  settingsDraftConfig = cloneOptionConfig(optionConfig);
  settingsDirty = false;
  settingsStatus.textContent = "";
  settingsStatus.className = "settings-status";
  renderSettingsQuestionSelect();
  renderSettingsOptions();
  settingsModal.hidden = false;
  setTimeout(() => settingsQuestionSelect.focus(), 0);
}

function closeSettings() {
  settingsModal.hidden = true;
  settingsDraftConfig = null;
  settingsDirty = false;
}

function requestCloseSettings() {
  if (!settingsDirty) {
    closeSettings();
    return;
  }

  const shouldSave = window.confirm("Hay cambios sin guardar. Pulsa Aceptar para guardar y salir, o Cancelar para salir sin guardar.");
  if (shouldSave) {
    saveSettingsDraft();
  }
  closeSettings();
}

function cloneOptionConfig(config) {
  const clone = {};
  for (const [key, options] of Object.entries(config || {})) {
    clone[key] = options.map((option) => ({ ...option }));
  }
  return clone;
}

function markSettingsDirty() {
  settingsDirty = true;
  settingsStatus.textContent = "Cambios sin guardar.";
  settingsStatus.className = "settings-status";
}

function renderSettingsQuestionSelect() {
  if (settingsQuestionSelect.options.length) return;
  for (const question of CONFIGURABLE_QUESTIONS) {
    const option = document.createElement("option");
    option.value = question.key;
    option.textContent = question.title;
    settingsQuestionSelect.appendChild(option);
  }
}

function getDraftOptions(key) {
  if (settingsDraftConfig && Object.prototype.hasOwnProperty.call(settingsDraftConfig, key)) {
    return settingsDraftConfig[key].map((option) => ({ ...option }));
  }
  if (hasDefaultOptions(key)) {
    return DEFAULT_OPTION_SETS[key].map((option) => ({ ...option }));
  }
  return [];
}

function setDraftOptions(key, options) {
  settingsDraftConfig[key] = options.map((option) => ({
    value: String(option.value || ""),
    label: String(option.label || ""),
  }));
}

function renderSettingsOptions() {
  const key = settingsQuestionSelect.value || CONFIGURABLE_QUESTIONS[0].key;
  const question = getQuestion(key);
  const options = getDraftOptions(key);
  const isBuiltInSelect = hasDefaultOptions(key);

  settingsHint.textContent = isBuiltInSelect
    ? "Edita, reordena o elimina opciones. Nada se guarda hasta pulsar Guardar."
    : "Agrega opciones para que esta pregunta permita elegir desde un desplegable o seguir escribiendo manualmente.";

  settingsOptionsList.innerHTML = "";
  if (!options.length) {
    const empty = document.createElement("p");
    empty.className = "option-empty";
    empty.textContent = "Esta pregunta aun no tiene opciones guardadas.";
    settingsOptionsList.appendChild(empty);
  }

  options.forEach((option, index) => {
    settingsOptionsList.appendChild(buildOptionRow(question, options, option, index));
  });
}

function buildOptionRow(question, options, option, index) {
  const row = document.createElement("div");
  row.className = "option-row";

  const labelInput = document.createElement("input");
  labelInput.className = "text-input";
  labelInput.type = "text";
  labelInput.value = option.label;
  labelInput.placeholder = "Texto visible";
  labelInput.addEventListener("input", () => {
    const nextOptions = getDraftOptions(question.key);
    nextOptions[index].label = labelInput.value;
    setDraftOptions(question.key, nextOptions);
    markSettingsDirty();
  });

  const valueInput = document.createElement("input");
  valueInput.className = "text-input";
  valueInput.type = "text";
  valueInput.value = option.value;
  valueInput.placeholder = "Valor en el plan";
  valueInput.addEventListener("input", () => {
    const nextOptions = getDraftOptions(question.key);
    nextOptions[index].value = valueInput.value;
    setDraftOptions(question.key, nextOptions);
    markSettingsDirty();
  });

  const orderWrap = document.createElement("div");
  orderWrap.className = "order-buttons";
  const upBtn = document.createElement("button");
  const downBtn = document.createElement("button");
  upBtn.className = "order-btn";
  downBtn.className = "order-btn";
  upBtn.type = "button";
  downBtn.type = "button";
  upBtn.textContent = "Subir";
  downBtn.textContent = "Bajar";
  upBtn.disabled = index === 0;
  downBtn.disabled = index === options.length - 1;
  upBtn.addEventListener("click", () => moveSettingsOption(question.key, index, -1));
  downBtn.addEventListener("click", () => moveSettingsOption(question.key, index, 1));
  orderWrap.append(upBtn, downBtn);

  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-option-btn";
  removeBtn.type = "button";
  removeBtn.textContent = "X";
  removeBtn.title = "Quitar opcion";
  removeBtn.disabled = hasDefaultOptions(question.key) && options.length <= 1;
  removeBtn.addEventListener("click", () => {
    const nextOptions = getDraftOptions(question.key).filter((_, optionIndex) => optionIndex !== index);
    setDraftOptions(question.key, nextOptions);
    markSettingsDirty();
    renderSettingsOptions();
  });

  row.append(buildLabel("Texto visible", labelInput), buildLabel("Valor", valueInput), orderWrap, removeBtn);
  return row;
}

function moveSettingsOption(key, index, direction) {
  const options = getDraftOptions(key);
  const target = index + direction;
  if (target < 0 || target >= options.length) return;
  const [item] = options.splice(index, 1);
  options.splice(target, 0, item);
  setDraftOptions(key, options);
  markSettingsDirty();
  renderSettingsOptions();
}

function addSettingsOption() {
  const key = settingsQuestionSelect.value || CONFIGURABLE_QUESTIONS[0].key;
  const options = getDraftOptions(key);
  const nextNumber = options.length + 1;
  options.push({
    value: `OPCION_${nextNumber}`,
    label: `Opcion ${nextNumber}`,
  });
  setDraftOptions(key, options);
  markSettingsDirty();
  renderSettingsOptions();
}

function restoreSettingsQuestion() {
  const key = settingsQuestionSelect.value || CONFIGURABLE_QUESTIONS[0].key;
  delete settingsDraftConfig[key];
  markSettingsDirty();
  renderSettingsOptions();
}

function saveSettingsDraft() {
  const nextConfig = {};
  for (const [key, options] of Object.entries(settingsDraftConfig || {})) {
    const normalized = normalizeOptions(options);
    if (normalized.length) {
      nextConfig[key] = normalized;
    }
  }

  optionConfig = nextConfig;
  saveOptionConfig();
  ensureStateFitsAllOptions(state);
  saveState();
  renderWizard();
  renderCanvas();

  settingsDirty = false;
  settingsStatus.textContent = "Cambios guardados.";
  settingsStatus.className = "settings-status ok";
  setTimeout(() => {
    if (!settingsModal.hidden) settingsSaveBtn.focus();
  }, 0);
}

function updateDownloadLink() {
  downloadLink.href = canvas.toDataURL("image/png");
}

function drawRect(x, y, w, h, options = {}) {
  ctx.save();
  if (options.fill) {
    ctx.fillStyle = options.fill;
    ctx.fillRect(x, y, w, h);
  }
  ctx.strokeStyle = options.stroke || "#111";
  ctx.lineWidth = options.lineWidth || 1;
  ctx.strokeRect(x, y, w, h);
  ctx.restore();
}

function drawLine(x1, y1, x2, y2, width = 1) {
  ctx.save();
  ctx.strokeStyle = "#111";
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function font(size, weight = "400") {
  return `${weight} ${size}px Arial, sans-serif`;
}

function drawFitText(text, x, y, w, h, options = {}) {
  const value = clean(text);
  if (!value) return;
  const align = options.align || "center";
  const weight = options.bold ? "700" : "400";
  let size = options.size || 21;
  const minSize = options.minSize || 11;
  ctx.save();
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  while (size > minSize) {
    ctx.font = font(size, weight);
    if (ctx.measureText(value).width <= w - 10) break;
    size -= 1;
  }
  const textX = align === "left" ? x + 6 : align === "right" ? x + w - 6 : x + w / 2;
  ctx.fillStyle = options.color || "#111";
  ctx.fillText(value, textX, y + h / 2);
  ctx.restore();
}

function drawLabel(text, x, y, w = 190, options = {}) {
  ctx.save();
  if (options.tag !== false) {
    ctx.fillStyle = options.fill || "#c6c6c6";
    ctx.fillRect(x, y, w, 26);
  }
  ctx.font = font(options.size || 17, options.bold ? "700" : "400");
  ctx.fillStyle = "#111";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + 7, y + 13);
  ctx.restore();
}

function drawValueBox(x, y, w, h, value, options = {}) {
  drawRect(x, y, w, h, { fill: "#fff", lineWidth: options.lineWidth || 1 });
  drawFitText(value, x, y, w, h, {
    align: options.align || "center",
    size: options.size || 20,
    bold: options.bold || false,
    minSize: options.minSize || 10,
  });
}

function drawSmallAction(x, y) {
  ctx.save();
  ctx.fillStyle = "#f3f3f3";
  ctx.fillRect(x, y, 58, 32);
  ctx.strokeStyle = "#111";
  ctx.strokeRect(x, y, 58, 32);
  ctx.font = font(18, "700");
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillStyle = "#767676";
  ctx.fillText("<<=", x + 29, y + 16);
  ctx.restore();
}

function drawPriorityButton(x, y) {
  drawRect(x, y, 120, 34, { fill: "#fff" });
  ctx.save();
  ctx.font = font(18, "700");
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#777";
  ctx.fillText("<<= FF", x + 55, y + 17);
  ctx.fillStyle = "#111";
  ctx.fillText("->", x + 97, y + 17);
  ctx.restore();
}

function drawPlanLogo(x, y, w, h) {
  if (!planLogo.complete || !planLogo.naturalWidth) {
    drawRect(x, y, w, h, { fill: "#fff" });
    drawFitText("LSAA", x, y, w, h, { size: 18, bold: true });
    return;
  }

  const ratio = Math.min(w / planLogo.naturalWidth, h / planLogo.naturalHeight);
  const drawW = planLogo.naturalWidth * ratio;
  const drawH = planLogo.naturalHeight * ratio;
  const drawX = x + (w - drawW) / 2;
  const drawY = y + (h - drawH) / 2;
  ctx.drawImage(planLogo, drawX, drawY, drawW, drawH);
}

function renderCanvas() {
  const values = getPlanValues();
  utcReadout.textContent = `UTC ${values.utc.readout}`;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const outer = { x: 16, y: 16, w: 1168, h: 868 };
  drawRect(outer.x, outer.y, outer.w, outer.h, { fill: "#fff", lineWidth: 3 });

  const headerBottom = 136;
  drawLine(outer.x, headerBottom, outer.x + outer.w, headerBottom, 3);
  drawPlanLogo(50, 32, 72, 82);
  drawFitText("PLAN DE VUELO", outer.x, 46, outer.w, 72, { size: 38, bold: true });

  drawTopBlock(values);
  drawGreyBlock(values);
  updateDownloadLink();
}

function drawTopBlock(values) {
  drawLabel("PRIORIDAD", 52, 148, 150, { tag: false, size: 17 });
  drawLabel("DIRECCIONES", 205, 148, 190, { tag: false, size: 17 });

  drawPriorityButton(52, 205);

  const dirX = 205;
  const dirW = 885;
  drawValueBox(dirX, 174, dirW, 32, values.addressCode, { size: 18 });
  drawValueBox(dirX, 206, dirW, 32, values.direction2, { size: 18 });
  drawValueBox(dirX, 238, dirW - 100, 32, values.direction3, { size: 18 });
  drawSmallAction(dirX + dirW - 82, 238);

  drawLabel("DIA-", 22, 285, 70, { tag: false, size: 18 });
  drawLabel("HORA", 92, 285, 80, { tag: false, size: 18 });
  drawValueBox(22, 307, 48, 32, values.utc.day, { size: 18 });
  drawValueBox(70, 307, 48, 32, values.utc.hour, { size: 18 });
  drawValueBox(118, 307, 48, 32, values.utc.minute, { size: 18 });

  drawLabel("DEPARTAMENTO/ EMPRESA", 205, 285, 320, { tag: false, size: 17 });
  drawValueBox(205, 307, 335, 32, values.department, { size: 18 });
  drawSmallAction(555, 307);
}

function drawGreyBlock(values) {
  ctx.save();
  ctx.fillStyle = "#d6d6d6";
  ctx.fillRect(16, 360, 1168, 524);
  ctx.restore();

  drawLabel("IDENTIFICACION AERONAVE", 60, 382, 350);
  drawValueBox(60, 410, 350, 34, values.aircraftId, { size: 20 });

  drawLabel("REGLA VUELO", 468, 382, 170);
  drawValueBox(468, 410, 70, 34, values.flightRule, { size: 20 });

  drawLabel("TIPO DE VUELO", 670, 382, 170);
  drawValueBox(670, 410, 70, 34, values.flightType, { size: 20 });

  drawLabel("TIPO DE AERONAVE", 60, 492, 250);
  drawValueBox(60, 520, 210, 34, values.aircraftType, { size: 20 });

  drawLabel("EQUIPO RADIO DE EMERGENCIA", 350, 492, 375);
  drawEmergencyBox("UHF", values.emergency.uhf, 350, 525);
  drawEmergencyBox("VHF", values.emergency.vhf, 495, 525);
  drawEmergencyBox("ELT", values.emergency.elt, 635, 525);
  drawSmallAction(1095, 512);

  drawLabel("AERODROMO DE SALIDA", 80, 607, 230, { tag: false, size: 16 });
  drawValueBox(105, 632, 100, 34, values.departure, { size: 18 });

  drawLabel("HORA DESPEGUE", 350, 607, 180, { tag: false, size: 16 });
  drawValueBox(350, 632, 115, 34, values.departureTime, { size: 18 });

  drawLabel("AERODROMO DESTINO", 585, 607, 220, { tag: false, size: 16 });
  drawValueBox(640, 632, 100, 34, values.destination, { size: 18 });

  drawLabel("PERSONAS ABORDO", 885, 607, 220, { tag: false, size: 16 });
  drawValueBox(922, 632, 52, 34, values.persons[0], { size: 18 });
  drawValueBox(974, 632, 52, 34, values.persons[1], { size: 18 });

  drawLabel("DATOS", 60, 690, 110);
  drawValueBox(170, 688, 960, 34, values.dataLine1, { size: 18 });
  drawValueBox(60, 722, 1070, 34, values.dataLine2, { size: 18 });

  drawLabel("PILOTO AL MANDO", 60, 770, 250);
  drawValueBox(60, 798, 610, 34, values.pilotName, { size: 19 });
  drawSmallAction(1095, 785);

  drawLabel("LICENCIA DE VUELO", 60, 846, 200);
  drawValueBox(260, 844, 365, 34, values.license, { size: 18 });
  drawSmallAction(1095, 834);
}

function drawEmergencyBox(label, checked, x, y) {
  ctx.save();
  ctx.font = font(15, "400");
  ctx.fillStyle = "#111";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(label, x, y + 17);
  drawValueBox(x + 48, y, 54, 34, checked ? "X" : "", { size: 20, bold: true });
  ctx.restore();
}

setInterval(() => {
  renderCanvas();
}, 15000);

renderWizard();
renderCanvas();
