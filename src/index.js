import { notesData } from './data';

const datePattern = /\d{1,2}\/\d{1,2}\/\d{4}/g;

const categoryInput = document.getElementById('category');
const contentInput = document.getElementById('content');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesTableBody = document.querySelector('#notesTable tbody');
const taskActiveCount = document.getElementById('taskActiveCount');
const taskArchivedCount = document.getElementById('taskArchivedCount');
const randomThoughtActiveCount = document.getElementById(
  'randomThoughtActiveCount'
);
const randomThoughtArchivedCount = document.getElementById(
  'randomThoughtArchivedCount'
);
const ideaActiveCount = document.getElementById('ideaActiveCount');
const ideaArchivedCount = document.getElementById('ideaArchivedCount');

function findDatesMentioned(content) {
  return content.match(datePattern) || [];
}

// Рендер таблиці
function renderNotesTable() {
  notesTableBody.innerHTML = '';

  for (const note of notesData) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${note.time.toLocaleString()}</td>
      <td>${note.content}</td>
      <td>${note.category}</td>
      <td>${note.datesMentioned.join(', ')}</td>
      <td>
        ${
          note.archived
            ? `<button data-index="${notesData.indexOf(
                note
              )}" class="unarchiveBtn">Unarchive</button>`
            : `<button data-index="${notesData.indexOf(
                note
              )}" class="archiveBtn">Archive</button>`
        }
        <button data-index="${notesData.indexOf(
          note
        )}" class="editBtn">Edit</button>
        <button data-index="${notesData.indexOf(
          note
        )}" class="deleteBtn">Delete</button>
      </td>
    `;
    notesTableBody.appendChild(tr);
  }
}

// Додавання нотатків
function handleAddNote() {
  const category = categoryInput.value;
  const content = contentInput.value;
  if (content.trim() === '') {
    alert('Please enter note content.');
    return;
  }

  const newNote = {
    time: new Date(),
    content: content,
    category: category,
    datesMentioned: findDatesMentioned(content),
  };

  notesData.push(newNote);
  renderNotesTable();
  updateSummaryTable();
  contentInput.value = '';
}

// Редагування нотатків
function editNote(index, newContent) {
  if (index < 0 || index >= notesData.length) {
    return; // Invalid index
  }

  notesData[index].content = newContent;
  notesData[index].datesMentioned = findDatesMentioned(newContent);
  renderNotesTable();
}

// Видалення нотатків
function deleteNote(index) {
  if (index < 0 || index >= notesData.length) {
    return; // Invalid index
  }

  notesData.splice(index, 1);
  renderNotesTable();
  updateSummaryTable();
}

// Аврхівування нотатків
function archiveNote(index) {
  const archivedNote = notesData.splice(index, 1)[0];
  archivedNote.archived = true;
  notesData.push(archivedNote);
  renderNotesTable();
  updateSummaryTable();
}

function unarchiveNote(index) {
  const unarchivedNote = notesData.splice(index, 1)[0];
  unarchivedNote.archived = false;
  notesData.push(unarchivedNote);
  renderNotesTable();
  updateSummaryTable();
}

// Оновлення таблиці summary
function updateSummaryTable() {
  const summary = {
    Task: { active: 0, archived: 0 },
    'Random Thought': { active: 0, archived: 0 },
    Idea: { active: 0, archived: 0 },
  };

  for (const note of notesData) {
    const category = note.category;
    if (note.archived) {
      summary[category].archived++;
    } else {
      summary[category].active++;
    }
  }

  taskActiveCount.textContent = summary.Task.active;
  taskArchivedCount.textContent = summary.Task.archived;
  randomThoughtActiveCount.textContent = summary['Random Thought'].active;
  randomThoughtArchivedCount.textContent = summary['Random Thought'].archived;
  ideaActiveCount.textContent = summary.Idea.active;
  ideaArchivedCount.textContent = summary.Idea.archived;
}

// Слухачі
addNoteBtn.addEventListener('click', handleAddNote);
document.addEventListener('click', event => {
  if (event.target.classList.contains('archiveBtn')) {
    const index = event.target.dataset.index;
    archiveNote(index);
  }
});
document.addEventListener('click', event => {
  if (event.target.classList.contains('editBtn')) {
    const index = event.target.dataset.index;
    const newContent = prompt('Edit note:', notesData[index].content);
    if (newContent !== null) {
      editNote(index, newContent);
    }
  } else if (event.target.classList.contains('deleteBtn')) {
    const index = event.target.dataset.index;
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNote(index);
    }
  }
});
document.addEventListener('click', event => {
  if (event.target.classList.contains('unarchiveBtn')) {
    const index = event.target.dataset.index;
    unarchiveNote(index);
  }
});

renderNotesTable();
updateSummaryTable();
