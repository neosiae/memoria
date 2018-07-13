const body = document.querySelector('body');
const noteTextArea = document.querySelector('.note');
const sidebar = document.querySelector('.sidebar');
const notesList = document.querySelector('.notes');
const statusBar = document.querySelector('.status-bar');
const newNoteButton = document.querySelector('.button-new');
const sidebarButton = document.querySelector('.button-sidebar');

const ACTIVE = 'active';
const HIDDEN = 'hidden';

function toggleSidebar() {
  toggleClass(sidebar, ACTIVE);
  toggleClass(sidebarButton, ACTIVE);
  toggleClass(noteTextArea, HIDDEN);
  toggleClass(newNoteButton, HIDDEN);
  toggleClass(statusBar, HIDDEN);
}

function getNoteTitle(content) {
  const splittedContent = content.split('\n');
  const nonEmptyLines = splittedContent.filter(line => line.length > 0);
  const title = nonEmptyLines[0];
  return title;
}

function limitTitleLength(title, length) {
  if (title && title.length > length) {
    const truncatedTitle = title.slice(0, length + 1);
    return `${truncatedTitle}...`;
  } else {
    return title;
  }
}

function getCurrentNote(textArea) {
  const [id, title, content] = [
    textArea.dataset.id,
    limitTitleLength(getNoteTitle(textArea.value), 29),
    textArea.value,
  ];
  return { id, title, content };
}

function createNewNote() {
  noteTextArea.value = '';
  noteTextArea.focus();
  assignUniqueIDToElement(noteTextArea);
}

function autoSaveNote() {
  const currentNote = getCurrentNote(noteTextArea);
  if (currentNote.title) {
    addToLocalNotes(currentNote);
    saveToLocalStorage(localNotes);
    renderNotesList();
  }
}

function createNotesList() {
  const notesListArray = Object.keys(localNotes).map(
    key => `<li data-id=${key}>${localNotes[key].title}</li>`,
  );
  return notesListArray.join('');
}

function renderNotesList() {
  notesList.innerHTML = createNotesList();
}

function selectNote(noteID) {
  for (let key of Object.keys(localNotes)) {
    if (key === noteID) {
      noteTextArea.value = localNotes[key].content;
      noteTextArea.dataset.id = key;
    }
  }

  if (isActive(sidebar)) {
    toggleSidebar();
  }
}

function handleLoad() {
  removeClass(body, 'preload');
}

function handleDOMContentLoaded() {
  assignUniqueIDToElement(noteTextArea);
  combineLocalNotes();
  renderNotesList();
}

function handleClick(event) {
  if (event.target) {
    if (
      event.target.matches('button.button-sidebar') ||
      event.target.matches('button.button-sidebar span')
    ) {
      toggleSidebar();
    }

    if (
      event.target.matches('button.button-new') ||
      event.target.matches('button.button-new span')
    ) {
      createNewNote();
    }

    if (event.target.matches('ul.notes li')) {
      selectNote(event.target.dataset.id);
    }
  }
}

function handleKeyDown() {
  if (statusBar.textContent !== 'Saving') {
    statusBar.textContent = 'Saving';
  }
}

function handleKeyUp() {
  autoSaveNote();
  statusBar.textContent = 'Saved';
}

window.addEventListener('load', handleLoad, true);
document.addEventListener('DOMContentLoaded', handleDOMContentLoaded, false);
document.addEventListener('click', handleClick, false);
noteTextArea.addEventListener('keydown', handleKeyDown, false);
noteTextArea.addEventListener('keyup', debounce(handleKeyUp, 600), false);
