import { fetchSubjects, fetchStudentData } from "./FirebaseFirestore.js";

/* -----------------------------
   🔹 CLASS AVERAGE CALCULATIONS
----------------------------- */

// Calculate overall class average
export function calculateClassAverage(students) {
  if (!students || students.length === 0) return 0;
  const totalMarks = students.reduce((sum, s) => {
  const mark = Number(s.marks ?? s.average ?? 0);
  return sum + (isNaN(mark) ? 0 : mark);
}, 0);
}

// Compare average change from previous week
export function calculateAverageChange(currentAvg, previousAvg) {
  if (!previousAvg) return { change: 0, direction: 'stable' };
  const change = ((currentAvg - previousAvg) / previousAvg * 100).toFixed(1);
  return {
    change: Math.abs(change),
    direction: change >= 0 ? 'increased' : 'decreased'
  };
}

// Update average display on dashboard
export function updateClassAverage(students, previousAverage = null) {
  const average = calculateClassAverage(students);

  const averageEl = document.getElementById('class-average');
  const countEl = document.getElementById('students-count');
  const changeEl = document.getElementById('average-change');

  if (averageEl) averageEl.textContent = `${average}%`;
  if (countEl) countEl.textContent = `Calculated from ${students.length} students`;

  const changeData = calculateAverageChange(parseFloat(average), previousAverage);
  if (changeEl) {
    if (changeData.direction === 'increased') {
      changeEl.innerHTML = `<i class="fas fa-arrow-up"></i> increased by ${changeData.change}% from last week`;
      changeEl.style.color = '#28a745';
    } else if (changeData.direction === 'decreased') {
      changeEl.innerHTML = `<i class="fas fa-arrow-down"></i> decreased by ${changeData.change}% from last week`;
      changeEl.style.color = '#dc3545';
    } else {
      changeEl.textContent = 'No change from last week';
      changeEl.style.color = '#6c757d';
    }
  }

  // Smooth animation effect
  if (averageEl) {
    averageEl.style.transition = 'all 0.5s ease';
    averageEl.style.transform = 'scale(1.1)';
    setTimeout(() => { averageEl.style.transform = 'scale(1)'; }, 500);
  }

  return parseFloat(average);
}

/* -----------------------------
   🔹 SUBJECT DISPLAY HANDLING
----------------------------- */

// Render subjects on main dashboard list
export async function loadSubjects() {
  const container = document.getElementById("subjects-container");
  if (!container) return;

  container.innerHTML = `<p>Loading subjects...</p>`;
  const subjects = await fetchSubjects();

  if (subjects.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-book-open"></i>
        <p>No subjects found</p>
      </div>
    `;
    return;
  }

  container.innerHTML = subjects.map(s => `
    <div class="subject-card" data-id="${s.id}">
      <h3>${s.name}</h3>
      <p>${s.year || ''}</p>
      <p>Lecturer: ${s.lecturer || 'N/A'}</p>
    </div>
  `).join("");
}

/* -----------------------------
   🔹 STUDENT COUNT DISPLAY
----------------------------- */

export async function loadStudents() {
  const students = await fetchStudentData();
  const countEl = document.getElementById("students-count");
  if (countEl) countEl.textContent = `${students.length} registered students`;
}

/* -----------------------------
   🔹 REFRESH DASHBOARD DATA
----------------------------- */

export async function refreshData() {
  const refreshBtn = document.getElementById('refresh-btn');
  if (!refreshBtn) return;

  const originalText = refreshBtn.innerHTML;
  refreshBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Loading...';
  refreshBtn.disabled = true;

  try {
    const currentAvg = parseFloat(document.getElementById('class-average')?.textContent);
    const [students, subjects] = await Promise.all([fetchStudentData(), fetchSubjects()]);

    const newAvg = updateClassAverage(students, isNaN(currentAvg) ? null : currentAvg);
    await loadSubjects();
    await loadStudents();

    console.log(`✅ Data refreshed: ${students.length} students, ${subjects.length} subjects`);
    return newAvg;
  } catch (error) {
    console.error('❌ Error refreshing dashboard data:', error);
  } finally {
    refreshBtn.innerHTML = originalText;
    refreshBtn.disabled = false;
  }
}
