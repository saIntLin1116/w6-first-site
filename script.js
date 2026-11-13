const dateElement = document.querySelector('#today-date');
const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60_000);
dateElement.dateTime = localDate.toISOString().slice(0, 10);
dateElement.textContent = new Intl.DateTimeFormat('zh-TW', {
  year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
}).format(today);

const scheduleList = document.querySelector('#schedule-list');
const scheduleCount = document.querySelector('#schedule-count');
const scheduleForm = document.querySelector('#schedule-form');
const scheduleFeedback = document.querySelector('#form-feedback');
const taskList = document.querySelector('#task-list');
const taskCount = document.querySelector('#task-count');
const taskForm = document.querySelector('#task-form');

let nextId = 4;
const schedules = [
  { id: 1, time: '09:00', name: '晨間例會', note: '確認本週目標與工作進度', category: '工作', style: 'work' },
  { id: 2, time: '12:30', name: '和怡君吃午餐', note: '小巷日和・中山店', category: '生活', style: 'life' },
  { id: 3, time: '16:00', name: '完成 W6 前端練習', note: '整理頁面並檢查手機版', category: '學習', style: 'study' },
];
const tasks = [
  { id: 1, name: '回覆課程小組訊息', status: 'done', note: '上午 10:30' },
  { id: 2, name: '整理行程管理頁面', status: 'progress', note: '下午 2:00' },
  { id: 3, name: '準備明天的簡報資料', status: 'pending', note: '今天完成' },
];

function updateCount(element, count, unit) {
  element.textContent = `${count} ${unit}`;
}

function renderSchedules() {
  scheduleList.replaceChildren();
  [...schedules].sort((a, b) => a.time.localeCompare(b.time)).forEach((item, index, sorted) => {
    const row = document.createElement('li');
    row.className = 'schedule-item';
    row.dataset.id = item.id;

    const time = document.createElement('time');
    time.textContent = item.time;
    const dot = document.createElement('span');
    dot.className = 'timeline-dot';
    const copy = document.createElement('div');
    copy.className = 'schedule-copy';
    const title = document.createElement('h3');
    title.textContent = item.name;
    const note = document.createElement('p');
    note.textContent = item.note || '尚未新增備註';
    copy.append(title, note);
    const tag = document.createElement('span');
    tag.className = `event-tag tag-${item.style || 'other'}`;
    tag.textContent = item.category || '新增';
    const remove = document.createElement('button');
    remove.className = 'delete-button schedule-delete';
    remove.type = 'button';
    remove.dataset.action = 'delete-schedule';
    remove.setAttribute('aria-label', `刪除行程：${item.name}`);
    remove.textContent = '×';
    row.append(time, dot, copy, tag, remove);
    if (index < sorted.length - 1) row.classList.add('has-following');
    scheduleList.append(row);
  });
  updateCount(scheduleCount, schedules.length, '個安排');
}

const statusLabels = { pending: '待處理', progress: '進行中', done: '已完成' };

function renderTasks() {
  taskList.replaceChildren();
  tasks.forEach((item) => {
    const row = document.createElement('li');
    row.className = 'task-item';
    row.dataset.id = item.id;
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = `task-check is-${item.status}`;
    toggle.dataset.action = 'cycle-status';
    toggle.setAttribute('aria-label', `${item.name}：${statusLabels[item.status]}，點擊切換狀態`);
    toggle.textContent = item.status === 'done' ? '✓' : item.status === 'progress' ? '•' : '';
    const copy = document.createElement('div');
    copy.className = 'task-copy';
    const title = document.createElement('h3');
    title.textContent = item.name;
    if (item.status === 'done') title.classList.add('is-complete');
    const note = document.createElement('p');
    note.textContent = item.note || '今日新增';
    copy.append(title, note);
    const status = document.createElement('span');
    status.className = `status status-${item.status}`;
    status.textContent = statusLabels[item.status];
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'delete-button';
    remove.dataset.action = 'delete-task';
    remove.setAttribute('aria-label', `刪除待辦：${item.name}`);
    remove.textContent = '×';
    row.append(toggle, copy, status, remove);
    taskList.append(row);
  });
  updateCount(taskCount, tasks.length, '項任務');
}

scheduleForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(scheduleForm);
  const name = String(formData.get('event-name')).trim();
  const time = String(formData.get('event-time'));
  const note = String(formData.get('event-note')).trim();
  if (!name || !time) return;
  schedules.push({ id: nextId++, time, name, note, category: '新增', style: 'other' });
  renderSchedules();
  scheduleFeedback.textContent = `已加入「${name}」，可在上方行程列表查看。`;
  scheduleForm.reset();
});

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(taskForm);
  const name = String(formData.get('task-name')).trim();
  const status = String(formData.get('task-status'));
  if (!name) return;
  tasks.push({ id: nextId++, name, status, note: '今日新增' });
  renderTasks();
  taskForm.reset();
  taskForm.querySelector('input').focus();
});

scheduleList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action="delete-schedule"]');
  if (!button) return;
  const row = button.closest('.schedule-item');
  const index = schedules.findIndex((item) => item.id === Number(row.dataset.id));
  if (index !== -1) schedules.splice(index, 1);
  renderSchedules();
});

taskList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const row = button.closest('.task-item');
  const index = tasks.findIndex((item) => item.id === Number(row.dataset.id));
  if (index === -1) return;
  if (button.dataset.action === 'delete-task') tasks.splice(index, 1);
  if (button.dataset.action === 'cycle-status') {
    const order = ['pending', 'progress', 'done'];
    tasks[index].status = order[(order.indexOf(tasks[index].status) + 1) % order.length];
  }
  renderTasks();
});

renderSchedules();
renderTasks();
