function updateTask(selectedId) {
  $.ajax({
    url: `http://localhost:5000/api/todos/${selectedId}`,
    type: 'POST',
    success: function (taskList) {
      console.log(taskList);
      renderTaskList(taskList);
    },
  });
}

function getTaskList() {
  $.get('http://localhost:5000/api/todos', function (taskList) {
    renderTaskList(taskList);
  });
}

function updateAlarmList(taskList) {
  const alarmList = [];
  taskList.forEach((task) => {
    if (
      !alarmList.find((alarm) => alarm.id.toString() === task.id.toString())
    ) {
      const startingTaskTime = new Date(task.startedAt).getTime();
      const endingTaskTime = new Date(task.endedAt).getTime();
      const nowTime = new Date().getTime();
      const delay = 60 * 5 * 1000;
      if (startingTaskTime - delay > nowTime)
        alarmList.push({
          id: task.id,
          note: task.title,
          timer: window.setTimeout(function () {
            alert(`5 minute until ${task.title} start`);
          }, startingTaskTime - nowTime - delay),
        });
      if (endingTaskTime - delay > nowTime)
        alarmList.push({
          id: task.id,
          note: task.title,
          timer: window.setTimeout(function () {
            alert(`5 minute until ${task.title} finished`);
          }, endingTaskTime - nowTime - delay),
        });
    }
  });
  console.log(alarmList);
}

function getDateTime(date) {
  const dateObject = new Date(date);
  return `${dateObject.getFullYear()}/${
    dateObject.getMonth() + 1
  }/${dateObject.getDate()} ${dateObject.getHours()}:${dateObject.getMinutes()}`;
}

function renderTaskList(taskList) {
  console.log('render');
  console.log({ taskList });
  $('.task-container').empty();
  $('.task-container.done-list').empty();
  taskList.forEach((task) => {
    console.log(
      `.task-container${
        task.isCompleted ? '.completed-task-list' : 'inCompleted-task-list'
      }`,
    );
    $(
      `.task-container${
        task.isCompleted ? '.completed-task-list' : '.inCompleted-task-list'
      }`,
    ).append(
      `<div class="task">
              <div class="checbox">
                <input id="${task.id}" ${
        task.isCompleted ? 'checked' : ''
      } type="checkbox" name="">
                <label>${task.title}</label>
              </div>
              ${
                task.startedAt
                  ? `
              <div class="date-time">
                <span>تاریخ شروع: </span>
                <span>${getDateTime(task.startedAt)}</span>
              </div>`
                  : ''
              }
               ${
                 task.startedAt
                   ? `
              <div class="date-time">
                <span>تاریخ پایان: </span>
                <span>${getDateTime(task.endedAt)}</span>
              </div>`
                   : ''
               }
            </div>`,
    );
  });
  $('input[type="checkbox"]').on('change', function (e) {
    console.log('here');
    const selectedId = e.target.id;
    updateTask(selectedId);
  });

  updateAlarmList(taskList);
}

getTaskList();

$('.add-task').click(function () {
  $('.sidebar').removeClass('hidden');
});

$('.close-btn').click(function () {
  $('.sidebar').addClass('hidden');
});

$('form').submit(function (e) {
  e.preventDefault();
  const form = $(this);
  const arrayOfData = form.serializeArray();
  console.log(arrayOfData);
  const data = {};
  arrayOfData.forEach((item) => {
    data[item.name] = item.value;
  });
  form[0].reset();

  $.post(
    'http://localhost:5000/api/todos',
    JSON.stringify(data),
    function (taskList) {
      renderTaskList(taskList);
    },
  );
});
