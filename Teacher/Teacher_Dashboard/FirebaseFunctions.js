import { fetchSubjects, fetchStudentData } from "./FirebaseFirestore.js";

// Render subjects
export async function renderSubjects(containerId = "subjects-container") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const subjects = await fetchSubjects();
  if (subjects.length === 0) {
    container.innerHTML = `<p>No subjects found</p>`;
    return;
  }

  container.innerHTML = subjects.map(s => `
    <div class="subject-card" data-id="${s.id}">
      <h3>${s.name}</h3>
      <p>Year: ${s.year || ""}</p>
      <p>Lecturer: ${s.lecturer || "N/A"}</p>
    </div>
  `).join("");
}

// Update class average
export function updateClassAverage(students, previousAverage = null) {
  if (!students || students.length === 0) return 0;

  const total = students.reduce((sum, s) => sum + (Number(s.average ?? 0)), 0);
  const avg = (total / students.length).toFixed(2);

  const avgEl = document.getElementById("class-average");
  if (avgEl) avgEl.textContent = `${avg}%`;

  return parseFloat(avg);
}

// Load student count
export async function loadStudents(containerId = "students-count") {
  const students = await fetchStudentData();
  const el = document.getElementById(containerId);
  if (el) el.textContent = `${students.length} registered students`;
}
