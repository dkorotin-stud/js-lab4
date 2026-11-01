const tables = [
    {
        title: "Водії",
        dataKey: "drivers",
        columns: [
            { key: "id", name: "№" },
            { key: "name", name: "ПІБ", type: "text" },
            { key: "phone", name: "Телефон", type: "tel" },
            { key: "birthYear", name: "Рік народження", type: "number", min: 1940, max: 2008 },
            { key: "experience", name: "Стаж (років)", type: "number", min: 0, max: 60 },
            { key: "rating", name: "Рейтинг", type: "number", min: 1, max: 5, step: 0.1 },
            { key: "license", name: "Посвідчення", type: "text" },
            { key: "status", name: "Статус", type: "select", options: ["На лінії", "На замовленні", "Вихідний"] }
        ]
    },
    {
        title: "Автомобілі",
        dataKey: "cars",
        columns: [
            { key: "id", name: "№" },
            { key: "brand", name: "Марка", type: "text" },
            { key: "model", name: "Модель", type: "text" },
            { key: "year", name: "Рік випуску", type: "number", min: 1990, max: 2026 },
            { key: "number", name: "Номер", type: "text" },
            { key: "color", name: "Колір", type: "text" },
            { key: "carClass", name: "Клас", type: "select", options: ["Економ", "Стандарт", "Комфорт", "Бізнес"] },
            { key: "driverId", name: "Водій", type: "driver" }
        ]
    },
    {
        title: "Поїздки",
        dataKey: "rides",
        columns: [
            { key: "id", name: "№" },
            { key: "from", name: "Звідки", type: "text" },
            { key: "to", name: "Куди", type: "text" },
            { key: "date", name: "Дата", type: "datetime-local" },
            { key: "distance", name: "Відстань (км)", type: "number", min: 1 },
            { key: "price", name: "Ціна (грн)", type: "number", min: 1 },
            { key: "payment", name: "Оплата", type: "select", options: ["Готівка", "Картка"] },
            { key: "driverId", name: "Водій", type: "driver" }
        ]
    }
];

const STORAGE_KEY = "taxi-data";

if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
}

let state = loadData();

function loadData() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
        console.error("Не вдалося прочитати дані з localStorage", e);
        return { drivers: [], cars: [], rides: [] };
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getRows(tableInfo) {
    return state[tableInfo.dataKey];
}

function getDriverName(id) {
    const driver = state.drivers.find(d => d.id === id);
    return driver ? driver.name.split(" ")[0] : "-";
}

function formatDate(value) {
    const [date, time] = value.split("T");
    const [year, month, day] = date.split("-");
    return `${day}.${month}.${year} ${time}`;
}

function toInputDate(value) {
    const [date, time] = value.split(" ");
    const [day, month, year] = date.split(".");
    return `${year}-${month}-${day}T${time}`;
}

const relations = {
    "Водії": [
        { table: "Автомобілі", dataKey: "cars", key: "driverId" },
        { table: "Поїздки", dataKey: "rides", key: "driverId" }
    ]
};

function showModal(message) {
    const modal = document.createElement("div");
    modal.className = "modal";

    const box = document.createElement("div");
    box.className = "modal-box";

    const text = document.createElement("p");
    text.textContent = message;

    const okBtn = document.createElement("button");
    okBtn.textContent = "OK";
    okBtn.addEventListener("click", () => modal.remove());

    modal.addEventListener("click", e => {
        if (e.target === modal) modal.remove();
    });

    box.append(text, okBtn);
    modal.appendChild(box);
    document.body.appendChild(modal);
    okBtn.focus();
}

function deleteRow(tableInfo, item) {
    const links = relations[tableInfo.title] || [];
    const usedIn = links
        .filter(link => state[link.dataKey].some(row => row[link.key] === item.id))
        .map(link => link.table);

    if (usedIn.length) {
        showModal(`Неможливо видалити запис №${item.id}, бо він використовується в таблиці: ${usedIn.join(", ")}.`);
        return;
    }

    const rows = getRows(tableInfo);
    rows.splice(rows.indexOf(item), 1);
    saveData();
    renderAll();
}

function parseValue(col, value) {
    if (col.type === "number" || col.type === "driver") return Number(value);
    if (col.type === "datetime-local") return formatDate(value);
    return value;
}

function editCell(td, col, item) {
    if (td.querySelector("input, select")) return;

    const field = createField(col);
    field.value = col.type === "datetime-local" ? toInputDate(item[col.key]) : item[col.key];
    field.required = true;

    let finished = false;

    function finish(save) {
        if (finished) return;
        finished = true;

        const value = field.value.trim();
        if (save && value !== "" && field.checkValidity()) {
            item[col.key] = parseValue(col, value);
            saveData();
        }
        renderAll();
    }

    field.addEventListener("keydown", e => {
        if (e.key === "Enter") finish(true);
        if (e.key === "Escape") finish(false);
    });
    field.addEventListener("blur", () => finish(true));

    td.replaceChildren(field);
    field.focus();
    if (field.tagName === "INPUT") field.select();
}

function createTable(columns) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    const headRow = document.createElement("tr");
    columns.forEach(col => {
        const th = document.createElement("th");
        th.textContent = col.name;
        headRow.appendChild(th);
    });
    headRow.appendChild(document.createElement("th"));
    thead.appendChild(headRow);

    table.append(thead, tbody);
    return table;
}

function renderRows(table, tableInfo) {
    const rows = getRows(tableInfo).map(item => {
        const row = document.createElement("tr");

        tableInfo.columns.forEach(col => {
            const td = document.createElement("td");
            td.textContent = col.key === "driverId" ? getDriverName(item[col.key]) : item[col.key];

            if (col.key !== "id") {
                td.className = "editable";
                td.title = "Натисніть, щоб змінити";
                td.addEventListener("click", () => editCell(td, col, item));
            }

            row.appendChild(td);
        });

        const deleteTd = document.createElement("td");
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "✕";
        deleteBtn.title = "Видалити";
        deleteBtn.addEventListener("click", () => deleteRow(tableInfo, item));
        deleteTd.appendChild(deleteBtn);
        row.appendChild(deleteTd);

        return row;
    });

    table.querySelector("tbody").replaceChildren(...rows);
}

function renderAll() {
    tables.forEach(tableInfo => renderRows(tableInfo.element, tableInfo));
}

function createSelect(options) {
    const select = document.createElement("select");
    options.forEach(({ value, text }) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = text;
        select.appendChild(option);
    });
    return select;
}

function createField(col) {
    if (col.type === "select") {
        return createSelect(col.options.map(o => ({ value: o, text: o })));
    }

    if (col.type === "driver") {
        return createSelect(state.drivers.map(d => ({ value: d.id, text: d.name })));
    }

    const input = document.createElement("input");
    input.type = col.type;
    if (col.min !== undefined) input.min = col.min;
    if (col.max !== undefined) input.max = col.max;
    if (col.step !== undefined) input.step = col.step;
    return input;
}

function createForm(tableInfo, onAdd) {
    const form = document.createElement("form");

    tableInfo.columns
        .filter(col => col.key !== "id")
        .forEach(col => {
            const label = document.createElement("label");
            label.textContent = col.name;

            const field = createField(col);
            field.name = col.key;
            field.required = true;

            label.appendChild(field);
            form.appendChild(label);
        });

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Зберегти";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.textContent = "Скасувати";
    cancelBtn.addEventListener("click", () => form.remove());

    form.append(submitBtn, " ", cancelBtn);

    form.addEventListener("submit", e => {
        e.preventDefault();

        const ids = getRows(tableInfo).map(d => d.id);
        const item = { id: ids.length ? Math.max(...ids) + 1 : 1 };

        tableInfo.columns.forEach(col => {
            if (col.key === "id") return;

            const value = form.elements[col.key].value.trim();

            if (col.type === "number" || col.type === "driver") {
                item[col.key] = Number(value);
            } else if (col.type === "datetime-local") {
                item[col.key] = formatDate(value);
            } else {
                item[col.key] = value;
            }
        });

        onAdd(item);
        form.remove();
    });

    return form;
}

const tabsDiv = document.getElementById("tabs");
const contentDiv = document.getElementById("content");
const buttons = [];
const sections = [];

tables.forEach((tableInfo, i) => {
    const btn = document.createElement("button");
    btn.textContent = tableInfo.title;
    btn.addEventListener("click", () => showTab(i));
    tabsDiv.appendChild(btn);
    buttons.push(btn);

    const section = document.createElement("div");
    const table = createTable(tableInfo.columns);
    tableInfo.element = table;

    const addBtn = document.createElement("button");
    addBtn.className = "add-btn";
    addBtn.textContent = "Додати";
    addBtn.addEventListener("click", () => {
        const oldForm = section.querySelector("form");
        if (oldForm) oldForm.remove();

        const form = createForm(tableInfo, item => {
            getRows(tableInfo).push(item);
            saveData();
            renderAll();
        });
        addBtn.after(form);
    });

    section.append(table, addBtn);
    contentDiv.appendChild(section);
    sections.push(section);
});

function showTab(index) {
    sections.forEach((section, i) => {
        section.hidden = i !== index;
        buttons[i].classList.toggle("active", i === index);
    });
}

window.addEventListener("storage", e => {
    if (e.key !== STORAGE_KEY) return;
    state = loadData();
    renderAll();
});

renderAll();
showTab(0);
