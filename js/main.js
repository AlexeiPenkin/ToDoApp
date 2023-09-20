// Находим элементы на странице //
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');


// создаем массив, который будет содержать все задачи //
// в начале массив пустой //
let tasks = [];


// проверям, есть ли что-то в localStorage; если есть, то выгружаем, форматируя данные, которые представляют собой строку, в формат JSON с помощью метода "parse", и перезаписываем данные в массив "tasks" //
if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    
    // или упрощаем запись функции по перебору массива forEaach //
    tasks.forEach((task) => renderTask(task));
}


// отображаем массив //
// tasks.forEach(function (task) {
//         // // Формируем css класс
//         // const cssClass = task.done ? "task-title task-title--done" : "task-title";

//         // // Формируем разметку для массива
//         // const taskHTML = `
//         // <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
//         //     <span class="${cssClass}">${task.text}</span>
//         //     <div class="task-item__buttons">
//         //         <button type="button" data-action="done" class="btn-action">
//         //             <img src="./img/tick.svg" alt="Done" width="18" height="18">
//         //         </button>
//         //         <button type="button" data-action="delete" class="btn-action">
//         //             <img src="./img/cross.svg" alt="Done" width="18" height="18">
//         //         </button>
//         //     </div>
//         // </li>`;
    
//         // // Добавляем массив на страницу
//         // tasksList.insertAdjacentHTML('beforeend', taskHTML);

//         // код после рефакторинга - весь вышеуказанный код (cssClass, taskHTML, insertAdjacentHTML) был перенесен в функцию renderTask(task)
//         renderTask(task);
// })


checkEmptyList()


// Добавление задачи
form.addEventListener('submit', addTask); // если вызвать функцию со скобками addTask(), то она выполнится сразу, поэтому скобки не указываем, чтобы функция выполнилась только после действия "submit"


// Удаление задачи
tasksList.addEventListener('click', deleteTask);


// Отмечаем задачу завершенной (кликл по галочке)
tasksList.addEventListener('click', doneTask);


// Сохранение разметки в localStorage и отображение разметки при обновлении страницы - НО это НЕ правильный способ!!!
// if (localStorage.getItem('tasksHTML')) {
//     tasksList.innerHTML = localStorage.getItem('tasksHTML');
// }


// Функции
function addTask(event) {
    event.preventDefault();
    
    // Достаем текст из поля ввода/input
    const taskText = taskInput.value

    // Описываем задачу в виде объекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };

    // Добавляем задачу в массив с задачами
    tasks.push(newTask);

    // Вызовом функции сохраняем список задач в хранилище браузера LocalStorage
    saveToLocalStorage();

    // // Формируем css класс
    // const cssClass = newTask.done ? "task-title task-title--done" : "task-title";

    // // Формируем разметку для новой задачи
    // const taskHTML = `
    // <li id="${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
    //     <span class="${cssClass}">${newTask.text}</span>
    //     <div class="task-item__buttons">
    //         <button type="button" data-action="done" class="btn-action">
    //             <img src="./img/tick.svg" alt="Done" width="18" height="18">
    //         </button>
    //         <button type="button" data-action="delete" class="btn-action">
    //             <img src="./img/cross.svg" alt="Done" width="18" height="18">
    //         </button>
    //     </div>
    // </li>`;

    // // Добавляем новую задачу на страницу
    // tasksList.insertAdjacentHTML('beforeend', taskHTML);

    // код после рефакторинга - весь вышеуказанный код (cssClass, taskHTML, insertAdjacentHTML) был перенесен в функцию renderTask(task)
    renderTask(newTask);

    // Очищаем поел ввода и возвращаем на него фокус
    taskInput.value = "";
    taskInput.focus();

    // Скрываем надпись "Список дел пуст", если в списке задач более 1-го элемента - вариант с сохранением разметки в localStorage
    // if (tasksList.children.length > 1) {
    //     emptyList.classList.add('none');
    // }

    // saveHTMLtoLS(); // способ не правильный

    // Вызываем функцию отображения надписи "Списоко дел пуст"    
    checkEmptyList()
}


// function deleteTask(event) {
//     // Проверяем, что клик был по кнопке "удалить задачу"
//     if (event.target.dataset.action === 'delete') {
//         const parentNode = event.target.closest('.list-group-item');
//         parentNode.remove();
//     }

//     // Возвращаем надпись "Список дел пуст", если в списке нет задач
//     if (tasksList.children.length === 1) {
//         emptyList.classList.remove('none');
//     }
// }
/*/////////////////////////////////////////////////////////////////////////*/
// Рефакторинг функции "deleteTask"
function deleteTask(event) {
    // Проверяем, что клик был НЕ по кнопке "удалить задачу"
    if (event.target.dataset.action !== 'delete') return; 
    // если клик был НЕ по кнопке "удалить задачу", функция завершает свою работу. 
    // если клик был ПО кнопке "удалить задачу", то функция не сработает, а сработает код ниже.

    // Проверяем, что клик был по кнопке "удалить задачу"
    const parentNode = event.target.closest('.list-group-item');

    // Определяем ID задачи
    const id = Number(parentNode.id);

    //Находим индекс задачи в массиве
    const index = tasks.findIndex((task) => task.id === id);

    // Удаляем задачу из массива задач по индексу
    tasks.splice(index, 1);

    // или 

    // Удаляем задачу из массива задач через фильтрацию массива
    tasks = tasks.filter((task) => task.id !== id);
    // полная версия
    // tasks = tasks.filter(function (task) {
    //     if (task.id === id) {
    //         return false
    //     } else {
    //         return true
    //     }
    // })

    // Вызовом функции сохраняем список задач в хранилище браузера LocalStorage
    saveToLocalStorage();

    // Удаляем задачу из разметки
    parentNode.remove();

    // Возвращаем надпись "Список дел пуст", если в списке нет задач -  - вариант с сохранением разметки в localStorage
    // if (tasksList.children.length === 1) {
    //     emptyList.classList.remove('none');
    // }

    // saveHTMLtoLS(); // способ не правильный

    // Вызываем функцию отображения надписи "Списоко дел пуст"    
    checkEmptyList()
}


// function doneTask(event) {
//     // Проверяем, что клик был по кнопке "задача выполнена"
//     if (event.target.dataset.action === 'done') {
//         const parentNode = event.target.closest('.list-group-item');
//         const taskTitle = parentNode.querySelector('.task-title');
//         taskTitle.classList.toggle('task-title--done');
//     }
// }
/*/////////////////////////////////////////////////////////////////////////*/
// Рефакторинг функции "doneTask"
function doneTask(event) {
    // Аналогично функции "deleteTask"
    // Проверяем, что клик был НЕ по кнопке "задача выполнена"
    if (event.target.dataset.action !== 'done') return;

    // Проверяем, что клик был ПО кнопке "задача выполнена"
    const parentNode = event.target.closest('.list-group-item');

    // Определяем ID задачи
    const id = Number(parentNode.id);

    const task = tasks.find((task) => task.id === id);
    // полная версия
    // const task = tasks.find(function (task) {
    //     if (task.id === id) {
    //         return true
    //     }
    // })

    // Меняем статус задачи: если false, то меняем на true, а если true, то меняем на false
    task.done = !task.done

    // Вызовом функции сохраняем список задач в хранилище браузера LocalStorage
    saveToLocalStorage();

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');

// saveHTMLtoLS(); // способ не правильный
}


// Сохраняем разметку в localStorage (LS = localStorage) - способ НЕ правильный
// function saveHTMLtoLS() {
//     localStorage.setItem('tasksHTML', tasksList.innerHTML);
// }


// Отображение/Скрытие надписи "Список дел пуст"
function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = 
            `<li id="emptyList" class="list-group-item empty-list">
                <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                <div class="empty-list__title">Список дел пуст</div>
            </li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}


// Сохраняем данные в localStorage - правильный способ!
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}


// рефакторинг повторяющийся код по формированию разметки
function renderTask(task) {
    // Формируем css класс
    const cssClass = task.done ? "task-title task-title--done" : "task-title";

    // Формируем разметку для массива
    const taskHTML = `
    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
        <span class="${cssClass}">${task.text}</span>
        <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
                <img src="./img/tick.svg" alt="Done" width="18" height="18">
            </button>
            <button type="button" data-action="delete" class="btn-action">
                <img src="./img/cross.svg" alt="Done" width="18" height="18">
            </button>
        </div>
    </li>`;

    // Добавляем массив на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}