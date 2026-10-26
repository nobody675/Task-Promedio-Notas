
(() => {
  const gradesEl = document.getElementById("grades");
  const form = document.getElementById("average-form");
  const message = document.getElementById("form-message");
  const nameInput = document.getElementById("student-name");
  const resultLabel = document.getElementById("result-label");
  const resultValue = document.getElementById("result-value");
  const resultMeta = document.getElementById("result-meta");

  let gradeCounter = 4;

  // Agregar una nueva nota
  function addGrade(value = "") {
    gradeCounter++;

    const row = document.createElement("div");
    row.className = "grade-row";

    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.max = "5";
    input.step = "0.1";
    input.value = value;
    input.required = true;
    input.setAttribute("aria-label", `Nota ${gradeCounter}`);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-grade";
    remove.textContent = "×";
    remove.setAttribute("aria-label", "Eliminar nota");

    row.append(input, remove);
    gradesEl.append(row);
    input.focus();
  }

  document.getElementById("add-grade").addEventListener("click", () => {
    addGrade();
    message.hidden = true;
  });

  // Eliminar notas
  gradesEl.addEventListener("click", (event) => {
    const remove = event.target.closest(".remove-grade");

    if (!remove) return;

    if (gradesEl.querySelectorAll(".grade-row").length <= 1) {
      message.textContent = "Debes conservar al menos una nota.";
      message.hidden = false;
      return;
    }

    remove.closest(".grade-row").remove();
    message.hidden = true;
  });

  // Calcular el promedio
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const inputs = [
      ...gradesEl.querySelectorAll("input")
    ];

    const grades = inputs.map((input) => {
      return input.value.trim() === ""
        ? NaN
        : Number(input.value);
    });

    const invalid = grades.some((grade) => {
      return !Number.isFinite(grade) ||
        grade < 0 ||
        grade > 5;
    });

    if (!nameInput.value.trim()) {
      message.textContent =
        "Escribe el nombre del estudiante.";
      message.hidden = false;
      nameInput.focus();
      return;
    }

    if (invalid) {
      message.textContent =
        "Todas las notas deben estar entre 0 y 5.";
      message.hidden = false;
      return;
    }

    const average =
      grades.reduce((sum, grade) => sum + grade, 0) /
      grades.length;

    const decimals = Number(
      document.getElementById("decimal-setting").value
    );

    const passGrade = Number(
      document.getElementById("pass-setting").value
    );

    if (
      !Number.isFinite(passGrade) ||
      passGrade < 0 ||
      passGrade > 5
    ) {
      message.textContent =
        "La nota mínima para aprobar debe estar entre 0 y 5.";
      message.hidden = false;
      return;
    }

    resultLabel.textContent =
      `Promedio de ${nameInput.value.trim()}`;

    resultValue.textContent = average.toFixed(decimals);

    resultMeta.textContent =
      `${grades.length} ${
        grades.length === 1
          ? "nota registrada"
          : "notas registradas"
      } · ${
        average >= passGrade
          ? "Aprobado"
          : "Por mejorar"
      }`;

    message.hidden = true;
  });

  // Navegación entre secciones
  const navItems = [
    ...document.querySelectorAll(".nav-item")
  ];

  const pages = [
    ...document.querySelectorAll(".page")
  ];

  const pageTitles = {
    inicio: "Task",
    tareas: "Mis tareas",
    promedio: "Promedio de notas",
    configuracion: "Configuración"
  };

  function showPage(page) {
    pages.forEach((section) => {
      section.classList.toggle(
        "active",
        section.id === `page-${page}`
      );
    });

    navItems.forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.page === page
      );
    });

    document.getElementById("page-title").textContent =
      pageTitles[page] || "Task";
  }

  navItems.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.dataset.page;

      if (page === "promedio") {
        showPage("inicio");
      } else {
        showPage(page);
      }
    });
  });

  document.querySelectorAll("[data-go-home]").forEach(
    (button) => {
      button.addEventListener("click", () => {
        showPage("inicio");
      });
    }
  );

  // Agregar y administrar tareas
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");

  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (!title) return;

    const item = document.createElement("div");
    item.className = "task-item";

    const label = document.createElement("label");
    label.style.cssText =
      "display:flex;align-items:center;gap:10px;" +
      "margin:0;font-weight:500";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.width = "18px";
    checkbox.style.height = "18px";

    const text = document.createElement("span");
    text.textContent = title;

    // Marcar una tarea como completada
    checkbox.addEventListener("change", () => {
      text.style.textDecoration = checkbox.checked
        ? "line-through"
        : "none";

      text.style.opacity = checkbox.checked
        ? ".55"
        : "1";
    });

    // Eliminar una tarea
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Eliminar";
    remove.style.cssText =
      "border:0;background:transparent;color:#ff9baa";

    remove.addEventListener("click", () => {
      item.remove();
    });

    label.append(checkbox, text);
    item.append(label, remove);
    taskList.append(item);

    taskInput.value = "";
    taskInput.focus();
  });
})();
