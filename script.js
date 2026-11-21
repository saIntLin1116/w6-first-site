import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js';

// Firebase 網頁設定是公開識別資訊；資料安全由登入狀態與 Firestore 規則負責。
const firebaseConfig = {
  apiKey: 'AIzaSyAtrgZaKNvsIdYpZ2m7xlCNTxp2oqozuaY',
  authDomain: 'daily-planner-project-a.firebaseapp.com',
  projectId: 'daily-planner-project-a',
  storageBucket: 'daily-planner-project-a.firebasestorage.app',
  messagingSenderId: '1094751083021',
  appId: '1:1094751083021:web:065bfad5da2a186549d344',
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const dateElement = document.querySelector('#today-date');
const calendarDate = document.querySelector('#calendar-date');
const authMessage = document.querySelector('#auth-message');
const userName = document.querySelector('#user-name');
const authButton = document.querySelector('#auth-button');
const signOutButton = document.querySelector('#sign-out-button');
const loginPrompt = document.querySelector('#login-prompt');
const dashboard = document.querySelector('#dashboard-grid');
const navButtons = [...document.querySelectorAll('[data-view]')];
const calendarMonthTitle = document.querySelector('#calendar-month-title');
const calendarGrid = document.querySelector('#calendar-grid');
const selectedDateTitle = document.querySelector('#selected-date-title');
const calendarPrevButton = document.querySelector('#calendar-prev');
const calendarNextButton = document.querySelector('#calendar-next');
const calendarTodayButton = document.querySelector('#calendar-today');
const views = {
  inbox: document.querySelector('#inbox-view'),
  today: document.querySelector('#today-view'),
  calendar: document.querySelector('#calendar-view'),
};

const taskForm = document.querySelector('#task-form');
const taskNameInput = document.querySelector('#task-name');
const taskFeedback = document.querySelector('#task-feedback');
const inboxList = document.querySelector('#inbox-task-list');
const inboxCount = document.querySelector('#inbox-count');
const inboxNavCount = document.querySelector('#inbox-nav-count');
const inboxEmpty = document.querySelector('#inbox-empty');
const todayList = document.querySelector('#today-task-list');
const todayCount = document.querySelector('#today-count');
const todayEmpty = document.querySelector('#today-empty');
const nextTaskCard = document.querySelector('#next-task-card');
const nextTaskName = document.querySelector('#next-task-name');
const nextTaskDetail = document.querySelector('#next-task-detail');
const completeNextTask = document.querySelector('#complete-next-task');
const editNextTask = document.querySelector('#edit-next-task');
const returnNextTask = document.querySelector('#return-next-task');
const laterTasksTitle = document.querySelector('#later-tasks-title');
const completedList = document.querySelector('#completed-task-list');
const completedCount = document.querySelector('#completed-count');
const completedEmpty = document.querySelector('#completed-empty');
const scheduleList = document.querySelector('#schedule-list');
const scheduleCount = document.querySelector('#schedule-count');
const scheduleEmpty = document.querySelector('#schedule-empty');
const scheduleForm = document.querySelector('#schedule-form');
const scheduleFeedback = document.querySelector('#form-feedback');
const eventDateInput = document.querySelector('#event-date');
const eventCategoryInput = document.querySelector('#event-category');
const eventCategoryOptions = document.querySelector('#event-category-options');
const eventCategoryColorInput = document.querySelector('#event-category-color');
const eventAllDayInput = document.querySelector('#event-all-day');
const eventStartInput = document.querySelector('#event-start-time');
const eventEndInput = document.querySelector('#event-end-time');
const eventTimeFields = document.querySelector('#event-time-fields');
const editDialog = document.querySelector('#task-edit-dialog');
const editForm = document.querySelector('#task-edit-form');
const editName = document.querySelector('#edit-task-name');
const editDueDate = document.querySelector('#edit-task-due');
const editEstimate = document.querySelector('#edit-task-estimate');
const editDifficulty = document.querySelector('#edit-task-difficulty');
const editNote = document.querySelector('#edit-task-note');
const editFeedback = document.querySelector('#edit-feedback');
const eventEditDialog = document.querySelector('#event-edit-dialog');
const eventEditForm = document.querySelector('#event-edit-form');
const eventEditName = document.querySelector('#edit-event-name');
const eventEditDate = document.querySelector('#edit-event-date');
const eventEditCategory = document.querySelector('#edit-event-category');
const eventEditCategoryOptions = document.querySelector('#edit-event-category-options');
const eventEditCategoryColor = document.querySelector('#edit-event-category-color');
const eventEditAllDay = document.querySelector('#edit-event-all-day');
const eventEditStart = document.querySelector('#edit-event-start');
const eventEditEnd = document.querySelector('#edit-event-end');
const eventEditTimeFields = document.querySelector('#edit-event-time-fields');
const eventEditNote = document.querySelector('#edit-event-note');
const eventEditFeedback = document.querySelector('#edit-event-feedback');

const statusLabels = { pending: '未開始', progress: '進行中', done: '已完成' };
const difficultyLabels = { low: '低', medium: '中', high: '高' };
const defaultEventCategories = ['課業', '工作', '生活', '社交', '其他'];
const eventCategoryPalette = ['#114665', '#720f32', '#7b445a', '#16202b', '#85858b'];
const defaultCategoryColors = {
  課業: '#114665', 工作: '#720f32', 生活: '#7b445a', 社交: '#16202b', 其他: '#85858b', 行程: '#7b445a',
};
let currentUser = null;
let tasks = [];
let schedules = [];
let categories = [];
let editingTaskId = null;
let editingEventId = null;
let selectedDateKey = taipeiDateKey();
let [calendarYear, calendarMonth] = selectedDateKey.split('-').map(Number);
calendarMonth -= 1;
let stopTasksListener = null;
let stopEventsListener = null;
let stopCategoriesListener = null;

function taipeiDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function showToday() {
  const dateKey = taipeiDateKey();
  dateElement.dateTime = dateKey;
  dateElement.textContent = new Intl.DateTimeFormat('zh-TW', {
    timeZone: 'Asia/Taipei', year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  }).format(new Date());
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12));
}

function makeDateKey(year, monthIndex, day) {
  const yearText = String(year).padStart(4, '0');
  const monthText = String(monthIndex + 1).padStart(2, '0');
  const dayText = String(day).padStart(2, '0');
  return `${yearText}-${monthText}-${dayText}`;
}

function formatDateKey(dateKey, options) {
  return new Intl.DateTimeFormat('zh-TW', { timeZone: 'UTC', ...options }).format(parseDateKey(dateKey));
}

function setSelectedDate(dateKey, syncDisplayedMonth = true) {
  selectedDateKey = dateKey;
  if (syncDisplayedMonth) {
    const [year, month] = dateKey.split('-').map(Number);
    calendarYear = year;
    calendarMonth = month - 1;
  }
  eventDateInput.value = selectedDateKey;
  renderSchedules();
}

function changeCalendarMonth(offset) {
  const nextMonth = new Date(Date.UTC(calendarYear, calendarMonth + offset, 1, 12));
  calendarYear = nextMonth.getUTCFullYear();
  calendarMonth = nextMonth.getUTCMonth();
  const selectedDay = Number(selectedDateKey.slice(-2));
  const lastDay = new Date(Date.UTC(calendarYear, calendarMonth + 1, 0, 12)).getUTCDate();
  setSelectedDate(makeDateKey(calendarYear, calendarMonth, Math.min(selectedDay, lastDay)), false);
}

function updateCount(element, count, unit) {
  element.textContent = `${count} ${unit}`;
}

function userCollection(name) {
  if (!currentUser) throw new Error('請先登入再操作個人資料。');
  return collection(db, 'users', currentUser.uid, name);
}

function setActiveView(viewName) {
  Object.entries(views).forEach(([name, element]) => {
    element.hidden = name !== viewName;
  });
  navButtons.forEach((button) => {
    const active = button.dataset.view === viewName;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function setSignedOutView(message = '請使用 Google 登入以查看個人資料。') {
  stopTasksListener?.();
  stopEventsListener?.();
  stopCategoriesListener?.();
  stopTasksListener = null;
  stopEventsListener = null;
  stopCategoriesListener = null;
  currentUser = null;
  tasks = [];
  schedules = [];
  categories = [];
  dashboard.hidden = true;
  loginPrompt.hidden = false;
  userName.textContent = '';
  authButton.hidden = false;
  authButton.disabled = false;
  signOutButton.hidden = true;
  authMessage.textContent = message;
  editDialog.close();
  eventEditDialog.close();
  setActiveView('today');
  renderTasks();
  renderSchedules();
}

function getTodayTasks() {
  return tasks
    .filter((task) => task.plannedDate === taipeiDateKey() && task.status !== 'done')
    .sort((a, b) => {
      const aHasOrder = Number.isFinite(a.todayOrder);
      const bHasOrder = Number.isFinite(b.todayOrder);
      if (aHasOrder && bHasOrder && a.todayOrder !== b.todayOrder) return a.todayOrder - b.todayOrder;
      if (aHasOrder !== bHasOrder) return aHasOrder ? -1 : 1;
      return getCreatedTime(a) - getCreatedTime(b) || a.id.localeCompare(b.id);
    });
}

function getInboxTasks() {
  return tasks
    .filter((task) => task.status !== 'done' && task.plannedDate !== taipeiDateKey())
    .sort((a, b) => getCreatedTime(b) - getCreatedTime(a) || a.id.localeCompare(b.id));
}

function getCompletedTasks() {
  return tasks
    .filter((task) => task.status === 'done')
    .sort((a, b) => getTimestamp(b.completedAt) - getTimestamp(a.completedAt));
}

function getTimestamp(value) {
  if (!value) return 0;
  if (typeof value.toMillis === 'function') return value.toMillis();
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function getCreatedTime(task) {
  return getTimestamp(task.createdAt);
}

function taskDetail(task) {
  const details = [];
  if (task.dueDate) details.push(`截止 ${task.dueDate}`);
  if (Number.isFinite(task.estimatedMinutes)) details.push(`約 ${task.estimatedMinutes} 分鐘`);
  if (task.difficulty && difficultyLabels[task.difficulty]) details.push(`難度 ${difficultyLabels[task.difficulty]}`);
  if (task.note) details.push(task.note);
  return details.join('・') || '尚未設定其他資訊';
}

function createActionButton(label, action, className = 'row-action') {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.dataset.action = action;
  button.textContent = label;
  return button;
}

function renderTaskRow(task, location, position = 0, total = 0) {
  const row = document.createElement('li');
  row.className = 'task-item task-item-rich';
  row.dataset.id = task.id;

  const toggle = document.createElement(task.status === 'done' ? 'span' : 'button');
  toggle.className = `task-check is-${task.status}`;
  if (task.status === 'done') {
    toggle.setAttribute('aria-label', '已完成');
    toggle.textContent = '✓';
  } else {
    toggle.type = 'button';
    toggle.dataset.action = 'cycle-status';
    toggle.setAttribute('aria-label', `${task.name}：${statusLabels[task.status] || statusLabels.pending}，點擊切換狀態`);
    toggle.textContent = '';
  }

  const copy = document.createElement('div');
  copy.className = 'task-copy';
  const title = document.createElement('h3');
  title.textContent = task.name;
  if (task.status === 'done') title.classList.add('is-complete');
  const note = document.createElement('p');
  note.textContent = taskDetail(task);
  copy.append(title, note);

  const status = document.createElement('span');
  status.className = `status status-${task.status}`;
  status.textContent = statusLabels[task.status] || statusLabels.pending;

  const actions = document.createElement('div');
  actions.className = 'task-actions';
  actions.append(createActionButton('編輯', 'edit-task'));
  if (location === 'inbox') {
    if (task.status === 'progress') actions.append(createActionButton('退回未開始', 'mark-pending'));
    actions.append(createActionButton('加入今日', 'add-to-today', 'row-action is-primary'));
  } else if (location === 'today') {
    const up = createActionButton('上移', 'move-up');
    const down = createActionButton('下移', 'move-down');
    up.disabled = position === 0;
    down.disabled = position === total - 1;
    actions.append(up, down, createActionButton('移回清單', 'return-to-inbox'));
  } else {
    actions.append(createActionButton('恢復待辦', 'undo-completion'));
  }
  actions.append(createActionButton('刪除', 'delete-task', 'row-action is-danger'));
  row.append(toggle, copy, status, actions);
  return row;
}

function renderTasks() {
  const inboxTasks = getInboxTasks();
  const todayTasks = getTodayTasks();
  const completedTasks = getCompletedTasks();

  inboxList.replaceChildren();
  inboxTasks.forEach((task) => inboxList.append(renderTaskRow(task, 'inbox')));
  updateCount(inboxCount, inboxTasks.length, '項未安排');
  inboxNavCount.textContent = String(inboxTasks.length);
  inboxEmpty.hidden = inboxTasks.length > 0 || !currentUser;

  todayList.replaceChildren();
  todayTasks.slice(1).forEach((task, index) => {
    todayList.append(renderTaskRow(task, 'today', index + 1, todayTasks.length));
  });
  updateCount(todayCount, todayTasks.length, '項任務');
  todayEmpty.hidden = todayTasks.length > 0 || !currentUser;
  laterTasksTitle.hidden = todayTasks.length <= 1;
  if (todayTasks.length > 0) {
    const firstTask = todayTasks[0];
    nextTaskName.textContent = firstTask.name;
    nextTaskDetail.textContent = taskDetail(firstTask);
    completeNextTask.dataset.id = firstTask.id;
    editNextTask.dataset.id = firstTask.id;
    returnNextTask.dataset.id = firstTask.id;
    nextTaskCard.hidden = false;
  } else {
    nextTaskCard.hidden = true;
  }

  completedList.replaceChildren();
  completedTasks.forEach((task) => completedList.append(renderTaskRow(task, 'completed')));
  completedCount.textContent = String(completedTasks.length);
  completedEmpty.hidden = completedTasks.length > 0 || !currentUser;
}

function eventTimeLabel(event) {
  if (event.allDay) return '全天';
  const start = event.startTime || event.time || '';
  const end = event.endTime || '';
  if (start && end) return `${start}–${end}`;
  if (start) return `${start}（未設定結束時間）`;
  return '時間未設定';
}

function normalizeTimeInput(input) {
  const raw = input.value.trim();
  if (/^\d{3,4}$/.test(raw)) {
    const digits = raw.padStart(4, '0');
    input.value = `${digits.slice(0, 2)}:${digits.slice(2)}`;
    return;
  }
  const match = raw.match(/^(\d{1,2}):(\d{0,2})$/);
  if (match) input.value = `${match[1].padStart(2, '0')}:${match[2]}`;
}

function eventsForDate(dateKey) {
  return schedules
    .filter((event) => event.date === dateKey)
    .sort((a, b) => eventTimeLabel(a).localeCompare(eventTimeLabel(b)));
}

function eventCategoryColor(category = '其他') {
  const name = String(category || '其他').trim() || '其他';
  const savedCategory = categories.find((item) => item.name === name);
  if (savedCategory && /^#[0-9a-f]{6}$/i.test(savedCategory.color || '')) return savedCategory.color;
  if (defaultCategoryColors[name]) return defaultCategoryColors[name];
  let hash = 0;
  for (const character of name) hash = (hash * 31 + character.codePointAt(0)) >>> 0;
  return eventCategoryPalette[hash % eventCategoryPalette.length];
}

function categoryTextColor(hexColor) {
  const hex = /^#[0-9a-f]{6}$/i.test(hexColor || '') ? hexColor.slice(1) : '16202b';
  const channels = [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const luminance = channels
    .map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
    .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
  return luminance > 0.22 ? '#16202b' : '#ffffff';
}

function refreshEventCategoryOptions() {
  const categoryNames = [...new Set([
    ...defaultEventCategories,
    ...categories.map((item) => item.name),
    ...schedules.map((event) => String(event.category || '').trim()).filter(Boolean),
  ])];
  [eventCategoryOptions, eventEditCategoryOptions].forEach((list) => {
    list.replaceChildren(...categoryNames.map((category) => {
      const option = document.createElement('option');
      option.value = category;
      return option;
    }));
  });
}

async function saveEventCategory(name, color) {
  if (!currentUser) throw new Error('請先登入再儲存行程類別。');
  const categoryId = encodeURIComponent(name);
  const categoryRef = doc(db, 'users', currentUser.uid, 'categories', categoryId);
  const snapshot = await getDoc(categoryRef);
  const categoryData = {
    name,
    color,
    updatedAt: serverTimestamp(),
  };
  if (snapshot.exists()) {
    const savedCategory = snapshot.data();
    if (/^#[0-9a-f]{6}$/i.test(savedCategory.color || '')) return savedCategory.color;
    await updateDoc(categoryRef, categoryData);
  } else {
    await setDoc(categoryRef, { ...categoryData, createdAt: serverTimestamp() });
  }
}

function syncCategoryColor(categoryInput, colorInput) {
  const name = categoryInput.value.trim();
  const savedCategory = categories.find((item) => item.name === name);
  if (savedCategory && /^#[0-9a-f]{6}$/i.test(savedCategory.color || '')) {
    colorInput.value = savedCategory.color;
    colorInput.disabled = true;
    colorInput.title = '此類別已設定固定顏色';
  } else {
    colorInput.value = eventCategoryColor(name);
    colorInput.disabled = !name;
    colorInput.title = name ? '新類別可選擇顏色' : '';
  }
}

function renderCalendar() {
  const monthDate = new Date(Date.UTC(calendarYear, calendarMonth, 1, 12));
  calendarMonthTitle.textContent = new Intl.DateTimeFormat('zh-TW', {
    timeZone: 'UTC', year: 'numeric', month: 'long',
  }).format(monthDate);
  calendarDate.dateTime = selectedDateKey;
  calendarDate.textContent = formatDateKey(selectedDateKey, { month: 'long', day: 'numeric', weekday: 'long' });
  selectedDateTitle.textContent = formatDateKey(selectedDateKey, { month: 'long', day: 'numeric', weekday: 'long' });

  const firstDayOfWeek = monthDate.getUTCDay();
  const startDate = new Date(Date.UTC(calendarYear, calendarMonth, 1 - firstDayOfWeek, 12));
  const todayKey = taipeiDateKey();
  calendarGrid.replaceChildren();

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(startDate.getTime() + index * 86_400_000);
    const dateKey = makeDateKey(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    const isCurrentMonth = date.getUTCMonth() === calendarMonth;
    const dayEvents = eventsForDate(dateKey);
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'calendar-day';
    cell.setAttribute('role', 'gridcell');
    cell.dataset.date = dateKey;
    cell.setAttribute('aria-pressed', String(dateKey === selectedDateKey));
    cell.setAttribute('aria-label', `${formatDateKey(dateKey, { year: 'numeric', month: 'long', day: 'numeric' })}，${dayEvents.length ? `${dayEvents.length} 個行程` : '沒有行程'}`);
    if (!isCurrentMonth) cell.classList.add('is-outside-month');
    if (dateKey === selectedDateKey) cell.classList.add('is-selected');
    if (dateKey === todayKey) cell.classList.add('is-today');
    if (dayEvents.length) cell.classList.add('has-events');

    const dayNumber = document.createElement('span');
    dayNumber.className = 'calendar-day-number';
    dayNumber.textContent = String(date.getUTCDate());
    cell.append(dayNumber);
    if (dayEvents.length) {
      const markers = document.createElement('span');
      markers.className = 'calendar-day-markers';
      markers.setAttribute('aria-hidden', 'true');
      dayEvents.slice(0, 3).forEach((item) => {
        const dot = document.createElement('span');
        dot.className = 'calendar-event-dot';
        dot.style.backgroundColor = eventCategoryColor(item.category);
        markers.append(dot);
      });
      if (dayEvents.length > 3) {
        const overflow = document.createElement('span');
        overflow.className = 'calendar-event-overflow';
        overflow.textContent = `+${dayEvents.length - 3}`;
        markers.append(overflow);
      }
      cell.append(markers);
    }
    calendarGrid.append(cell);
  }
}

function renderSchedules() {
  refreshEventCategoryOptions();
  const selectedEvents = eventsForDate(selectedDateKey);
  scheduleList.replaceChildren();
  selectedEvents.forEach((item, index) => {
    const row = document.createElement('li');
    row.className = 'schedule-item';
    row.dataset.id = item.id;
    const time = document.createElement('time');
    time.textContent = eventTimeLabel(item);
    const dot = document.createElement('span');
    dot.className = 'timeline-dot';
    const categoryColor = eventCategoryColor(item.category);
    row.style.setProperty('--category-color', categoryColor);
    const copy = document.createElement('div');
    copy.className = 'schedule-copy';
    const title = document.createElement('h3');
    title.textContent = item.name;
    const note = document.createElement('p');
    note.textContent = item.note || '尚未新增備註';
    copy.append(title, note);
    const tag = document.createElement('span');
    tag.className = `event-tag tag-${item.style || 'other'}`;
    tag.style.backgroundColor = categoryColor;
    tag.style.color = categoryTextColor(categoryColor);
    tag.textContent = item.category || '行程';
    const actions = document.createElement('div');
    actions.className = 'event-actions';
    const edit = document.createElement('button');
    edit.type = 'button';
    edit.className = 'row-action';
    edit.dataset.action = 'edit-event';
    edit.textContent = '編輯';
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'row-action is-danger';
    remove.dataset.action = 'delete-schedule';
    remove.textContent = '刪除';
    remove.setAttribute('aria-label', `刪除行程：${item.name}`);
    actions.append(edit, remove);
    row.append(time, dot, copy, tag, actions);
    if (index < selectedEvents.length - 1) row.classList.add('has-following');
    scheduleList.append(row);
  });
  updateCount(scheduleCount, selectedEvents.length, '個安排');
  scheduleEmpty.hidden = selectedEvents.length > 0 || !currentUser;
  renderCalendar();
}

calendarGrid.addEventListener('click', (event) => {
  const day = event.target.closest('[data-date]');
  if (day) setSelectedDate(day.dataset.date, true);
});
calendarPrevButton.addEventListener('click', () => changeCalendarMonth(-1));
calendarNextButton.addEventListener('click', () => changeCalendarMonth(1));
calendarTodayButton.addEventListener('click', () => setSelectedDate(taipeiDateKey(), true));
eventAllDayInput.addEventListener('change', () => updateEventTimeFields(eventAllDayInput, eventTimeFields, eventStartInput, eventEndInput));
eventCategoryInput.addEventListener('change', () => syncCategoryColor(eventCategoryInput, eventCategoryColorInput));
eventEditCategory.addEventListener('change', () => syncCategoryColor(eventEditCategory, eventEditCategoryColor));
for (const timeInput of [eventStartInput, eventEndInput, eventEditStart, eventEditEnd]) {
  timeInput.addEventListener('input', () => normalizeTimeInput(timeInput));
}
eventEditAllDay.addEventListener('change', () => updateEventTimeFields(eventEditAllDay, eventEditTimeFields, eventEditStart, eventEditEnd));

function showDataError(error) {
  console.error('Firebase 資料讀取失敗：', error.code || error.message);
  authMessage.textContent = '資料讀取失敗；請確認 Firestore 規則與網路連線。';
}

function startUserData(user) {
  stopTasksListener?.();
  stopEventsListener?.();
  stopCategoriesListener?.();
  currentUser = user;
  dashboard.hidden = false;
  loginPrompt.hidden = true;
  authButton.hidden = true;
  signOutButton.hidden = false;
  userName.textContent = user.displayName || user.email || '已登入';
  authMessage.textContent = '已登入，資料只存取此帳號的專屬空間。';
  tasks = [];
  schedules = [];
  categories = [];
  selectedDateKey = taipeiDateKey();
  [calendarYear, calendarMonth] = selectedDateKey.split('-').map(Number);
  calendarMonth -= 1;
  eventDateInput.value = selectedDateKey;
  eventCategoryInput.value = '其他';
  syncCategoryColor(eventCategoryInput, eventCategoryColorInput);
  eventAllDayInput.checked = false;
  updateEventTimeFields(eventAllDayInput, eventTimeFields, eventStartInput, eventEndInput);
  setActiveView('today');
  renderTasks();
  renderSchedules();

  stopTasksListener = onSnapshot(userCollection('tasks'), (snapshot) => {
    tasks = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    renderTasks();
  }, showDataError);

  stopEventsListener = onSnapshot(userCollection('events'), (snapshot) => {
    schedules = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    renderSchedules();
  }, showDataError);

  stopCategoriesListener = onSnapshot(userCollection('categories'), (snapshot) => {
    categories = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    refreshEventCategoryOptions();
    syncCategoryColor(eventCategoryInput, eventCategoryColorInput);
    if (eventEditDialog.open) syncCategoryColor(eventEditCategory, eventEditCategoryColor);
    renderSchedules();
  }, showDataError);
}

async function saveTaskStatus(task, status) {
  const taskRef = doc(db, 'users', currentUser.uid, 'tasks', task.id);
  await updateDoc(taskRef, {
    status,
    completedAt: status === 'done' ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  });
}

async function moveTaskToToday(task) {
  const taskRef = doc(db, 'users', currentUser.uid, 'tasks', task.id);
  await updateDoc(taskRef, {
    plannedDate: taipeiDateKey(),
    todayOrder: getTodayTasks().length,
    updatedAt: serverTimestamp(),
  });
}

async function moveTaskToInbox(task) {
  const taskRef = doc(db, 'users', currentUser.uid, 'tasks', task.id);
  await updateDoc(taskRef, {
    plannedDate: null,
    todayOrder: null,
    updatedAt: serverTimestamp(),
  });
}

async function reorderToday(taskId, direction) {
  const ordered = getTodayTasks();
  const index = ordered.findIndex((task) => task.id === taskId);
  const otherIndex = index + direction;
  if (index < 0 || otherIndex < 0 || otherIndex >= ordered.length) return;
  [ordered[index], ordered[otherIndex]] = [ordered[otherIndex], ordered[index]];
  const batch = writeBatch(db);
  ordered.forEach((task, position) => {
    batch.update(doc(db, 'users', currentUser.uid, 'tasks', task.id), {
      todayOrder: position,
      updatedAt: serverTimestamp(),
    });
  });
  await batch.commit();
}

function openTaskEditor(task) {
  editingTaskId = task.id;
  editName.value = task.name || '';
  editDueDate.value = task.dueDate || '';
  editEstimate.value = Number.isFinite(task.estimatedMinutes) ? String(task.estimatedMinutes) : '';
  editDifficulty.value = task.difficulty || '';
  editNote.value = task.note || '';
  editFeedback.textContent = '';
  editDialog.showModal();
  editName.focus();
}

function closeTaskEditor() {
  editDialog.close();
  editingTaskId = null;
}

function updateEventTimeFields(checkbox, container, startInput, endInput) {
  const allDay = checkbox.checked;
  container.hidden = allDay;
  startInput.disabled = allDay;
  endInput.disabled = allDay;
  startInput.required = !allDay;
  endInput.required = false;
}

function openEventEditor(event) {
  editingEventId = event.id;
  eventEditName.value = event.name || '';
  eventEditDate.value = event.date || selectedDateKey;
  eventEditCategory.value = event.category || '其他';
  syncCategoryColor(eventEditCategory, eventEditCategoryColor);
  eventEditAllDay.checked = Boolean(event.allDay);
  eventEditStart.value = event.startTime || event.time || '';
  eventEditEnd.value = event.endTime || '';
  eventEditNote.value = event.note || '';
  eventEditFeedback.textContent = '';
  updateEventTimeFields(eventEditAllDay, eventEditTimeFields, eventEditStart, eventEditEnd);
  eventEditDialog.showModal();
  eventEditName.focus();
}

function closeEventEditor() {
  eventEditDialog.close();
  editingEventId = null;
}

function validTimeRange(allDay, start, end) {
  const validTime = (value) => /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
  return allDay || (validTime(start) && (!end || (validTime(end) && end > start)));
}

async function handleTaskAction(event) {
  const button = event.target.closest('[data-action]');
  if (!button || !currentUser) return;
  const row = button.closest('.task-item');
  const task = tasks.find((item) => item.id === row?.dataset.id);
  if (!task) return;

  try {
    switch (button.dataset.action) {
      case 'cycle-status': {
        const order = ['pending', 'progress', 'done'];
        const status = order[(order.indexOf(task.status) + 1) % order.length];
        await saveTaskStatus(task, status);
        break;
      }
      case 'undo-completion':
        await saveTaskStatus(task, 'pending');
        break;
      case 'mark-pending':
        await saveTaskStatus(task, 'pending');
        break;
      case 'add-to-today':
        await moveTaskToToday(task);
        break;
      case 'return-to-inbox':
        await moveTaskToInbox(task);
        break;
      case 'move-up':
        await reorderToday(task.id, -1);
        break;
      case 'move-down':
        await reorderToday(task.id, 1);
        break;
      case 'edit-task':
        openTaskEditor(task);
        break;
      case 'delete-task':
        if (window.confirm(`確定刪除任務「${task.name}」？`)) {
          await deleteDoc(doc(db, 'users', currentUser.uid, 'tasks', task.id));
        }
        break;
      default:
        break;
    }
  } catch (error) {
    console.error('任務更新失敗：', error.code || error.message);
    authMessage.textContent = '任務更新失敗，請確認連線與 Firestore 規則後重試。';
  }
}

navButtons.forEach((button) => {
  button.addEventListener('click', () => setActiveView(button.dataset.view));
});

authButton.addEventListener('click', async () => {
  authButton.disabled = true;
  authMessage.textContent = '正在開啟 Google 登入…';
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error('Google 登入未完成：', error.code || error.message);
    authMessage.textContent = error.code === 'auth/popup-closed-by-user'
      ? '登入視窗已關閉，尚未登入。'
      : '登入失敗，請稍後重試或查看瀏覽器提示。';
    authButton.disabled = false;
  }
});

signOutButton.addEventListener('click', async () => {
  signOutButton.disabled = true;
  try {
    await signOut(auth);
  } catch (error) {
    console.error('登出失敗：', error.code || error.message);
    authMessage.textContent = '登出未完成，請重試。';
  } finally {
    signOutButton.disabled = false;
  }
});

taskForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!currentUser) return;
  const name = taskNameInput.value.trim();
  if (!name) {
    taskFeedback.textContent = '請輸入任務名稱。';
    taskNameInput.focus();
    return;
  }
  try {
    await addDoc(userCollection('tasks'), {
      name,
      status: 'pending',
      note: '',
      dueDate: null,
      estimatedMinutes: null,
      difficulty: null,
      plannedDate: null,
      todayOrder: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    taskForm.reset();
    taskFeedback.textContent = `已將「${name}」加入清單。`;
    taskNameInput.focus();
  } catch (error) {
    console.error('任務儲存失敗：', error.code || error.message);
    taskFeedback.textContent = '儲存失敗，請確認連線與 Firestore 規則後重試。';
  }
});

inboxList.addEventListener('click', handleTaskAction);
todayList.addEventListener('click', handleTaskAction);
completedList.addEventListener('click', handleTaskAction);

completeNextTask.addEventListener('click', async () => {
  const task = tasks.find((item) => item.id === completeNextTask.dataset.id);
  if (!task || !currentUser) return;
  try {
    await saveTaskStatus(task, 'done');
  } catch (error) {
    console.error('完成任務失敗：', error.code || error.message);
    authMessage.textContent = '更新失敗，請確認連線與 Firestore 規則後重試。';
  }
});

returnNextTask.addEventListener('click', async () => {
  const task = tasks.find((item) => item.id === returnNextTask.dataset.id);
  if (!task || !currentUser) return;
  try {
    await moveTaskToInbox(task);
  } catch (error) {
    console.error('移回清單失敗：', error.code || error.message);
    authMessage.textContent = '更新失敗，請確認連線與 Firestore 規則後重試。';
  }
});

editNextTask.addEventListener('click', () => {
  const task = tasks.find((item) => item.id === editNextTask.dataset.id);
  if (task && currentUser) openTaskEditor(task);
});

editForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!currentUser || !editingTaskId) return;
  const name = editName.value.trim();
  const estimate = editEstimate.value ? Number(editEstimate.value) : null;
  if (!name) {
    editFeedback.textContent = '任務名稱不能空白。';
    editName.focus();
    return;
  }
  if (estimate !== null && (!Number.isInteger(estimate) || estimate < 1 || estimate > 1440)) {
    editFeedback.textContent = '預估分鐘請輸入 1 到 1440 的整數。';
    editEstimate.focus();
    return;
  }
  try {
    await updateDoc(doc(db, 'users', currentUser.uid, 'tasks', editingTaskId), {
      name,
      dueDate: editDueDate.value || null,
      estimatedMinutes: estimate,
      difficulty: editDifficulty.value || null,
      note: editNote.value.trim(),
      updatedAt: serverTimestamp(),
    });
    closeTaskEditor();
  } catch (error) {
    console.error('任務編輯失敗：', error.code || error.message);
    editFeedback.textContent = '儲存失敗，請確認連線與 Firestore 規則後重試。';
  }
});

document.querySelector('#close-edit-dialog').addEventListener('click', closeTaskEditor);
document.querySelector('#cancel-edit-task').addEventListener('click', closeTaskEditor);
editDialog.addEventListener('click', (event) => {
  if (event.target === editDialog) closeTaskEditor();
});

scheduleForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!currentUser) return;
  const name = document.querySelector('#event-name').value.trim();
  const date = eventDateInput.value;
  const category = eventCategoryInput.value.trim();
  const allDay = eventAllDayInput.checked;
  const startTime = allDay ? '' : eventStartInput.value;
  const endTime = allDay ? '' : eventEndInput.value;
  const note = document.querySelector('#event-note').value.trim();
  if (!name || !date || !category) { scheduleFeedback.textContent = '請填寫行程名稱、日期與類別。'; return; }
  if (!validTimeRange(allDay, startTime, endTime)) { scheduleFeedback.textContent = '開始時間請用 24 小時制；結束時間可留空，如有填寫須晚於開始時間。'; return; }
  try {
    await saveEventCategory(category, eventCategoryColorInput.value);
    await addDoc(userCollection('events'), {
      name, date, allDay, startTime, endTime, time: startTime, note, category,
      createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    });
    scheduleFeedback.textContent = `已加入「${name}」並儲存至你的帳號。`;
    scheduleForm.reset();
    eventAllDayInput.checked = false;
    syncCategoryColor(eventCategoryInput, eventCategoryColorInput);
    updateEventTimeFields(eventAllDayInput, eventTimeFields, eventStartInput, eventEndInput);
    setSelectedDate(date, true);
  } catch (error) {
    console.error('行程儲存失敗：', error.code || error.message);
    scheduleFeedback.textContent = '儲存失敗，請確認連線與 Firestore 規則後重試。';
  }
});

scheduleList.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-action]');
  if (!button || !currentUser) return;
  const row = button.closest('.schedule-item');
  const item = schedules.find((entry) => entry.id === row.dataset.id);
  if (!item) return;
  if (button.dataset.action === 'edit-event') { openEventEditor(item); return; }
  if (button.dataset.action !== 'delete-schedule' || !window.confirm(`確定刪除行程「${item.name}」？`)) return;
  try {
    await deleteDoc(doc(db, 'users', currentUser.uid, 'events', item.id));
  } catch (error) {
    console.error('行程刪除失敗：', error.code || error.message);
    authMessage.textContent = '刪除失敗，請確認連線與 Firestore 規則後重試。';
  }
});

eventEditForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!currentUser || !editingEventId) return;
  const name = eventEditName.value.trim();
  const date = eventEditDate.value;
  const category = eventEditCategory.value.trim();
  const allDay = eventEditAllDay.checked;
  const startTime = allDay ? '' : eventEditStart.value;
  const endTime = allDay ? '' : eventEditEnd.value;
  if (!name || !date || !category) { eventEditFeedback.textContent = '請填寫行程名稱、日期與類別。'; return; }
  if (!validTimeRange(allDay, startTime, endTime)) { eventEditFeedback.textContent = '開始時間請用 24 小時制；結束時間可留空，如有填寫須晚於開始時間。'; return; }
  try {
    await saveEventCategory(category, eventEditCategoryColor.value);
    await updateDoc(doc(db, 'users', currentUser.uid, 'events', editingEventId), {
      name, date, category, allDay, startTime, endTime, time: startTime,
      note: eventEditNote.value.trim(), updatedAt: serverTimestamp(),
    });
    closeEventEditor();
    setSelectedDate(date, true);
  } catch (error) {
    console.error('行程編輯失敗：', error.code || error.message);
    eventEditFeedback.textContent = '儲存失敗，請確認連線與 Firestore 規則後重試。';
  }
});
document.querySelector('#close-event-dialog').addEventListener('click', closeEventEditor);
document.querySelector('#cancel-event-edit').addEventListener('click', closeEventEditor);
eventEditDialog.addEventListener('click', (event) => { if (event.target === eventEditDialog) closeEventEditor(); });

showToday();
setActiveView('today');
onAuthStateChanged(auth, (user) => {
  if (user) startUserData(user);
  else setSignedOutView();
}, (error) => {
  console.error('登入狀態讀取失敗：', error.code || error.message);
  setSignedOutView('無法確認登入狀態，請重新整理或再試一次。');
});
