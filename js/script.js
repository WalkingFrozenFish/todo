// Поле ввода текста задачи, и кнопка добавления задачи
let inputToDo = document.querySelector("#inputToDo");
let addToDo = document.querySelector("#addToDo");

// Проверка наличия задач в локальном хранилище
function postsCheck() {
    if (localStorage.getItem("postsToDo") !== null &&
        localStorage.getItem("postsInProgress") !== null &&
        localStorage.getItem("postsDone") !== null) {

        // Проверка на наличие не сделанных задач
        let counter1 = JSON.parse(localStorage.getItem("postsToDo"))
        for (let i = 0; i < counter1.length; i++) {
            createItem(counter1[i], "newToDo");
        }

        // Проверка на наличие задач в процессе
        let counter2 = JSON.parse(localStorage.getItem("postsInProgress"))
        for (let i = 0; i < counter2.length; i++) {
            createItem(counter2[i], "progressToDo");
            deletePost(counter2[i].postId, "postsInProgress");
            moveToDone(counter2[i].postId)
        }

        // Проверка на наличие завершенных задач
        let counter3 = JSON.parse(localStorage.getItem("postsDone"))
        for (let i = 0; i < counter3.length; i++) {
            createItem(counter3[i], "doneToDo");
            deletePost(counter3[i].postId, "postsDone");
            finalDelete(counter3[i].postId)
        }
        // Иначе просто добавляем пустой массив для задач
    } else {
        localStorage.setItem("postsToDo", JSON.stringify([]));
        localStorage.setItem("postsInProgress", JSON.stringify([]));
        localStorage.setItem("postsDone", JSON.stringify([]));
    }
}
postsCheck();

// Навешиваем событие на кнопку добавления задачи
addToDo.addEventListener("click", (event) => {
    event.preventDefault();

    // Объект с данными
    let newItem = {
        postId: uuidv4(),
        status: 'newToDo',
        textItem: inputToDo.value,
    }

    // Добавляем в массив с задачами которые надо выполнить
    let array = JSON.parse(localStorage.getItem("postsToDo"))
    array.push(newItem);
    localStorage.setItem('postsToDo', JSON.stringify(array));

    // Создаем пост, передаем данные и целевую колонку
    createItem(newItem, "newToDo");

    inputToDo.value = "";
})

// Функция для создания разметки одной задачи
function createItem(data, targetColumn) {
    let itemHtml = `<div class="item">
                        <p class="item-text">${data?.textItem}</p>
                        <button class="move-item" id="p-${data?.postId}">Next</button>
                        <button class="remove-item" id="r-${data?.postId}">X</button>
                    </div>`;
    // Вызываем функцию по добавлению разметки, и целевую колонку
    addItem(itemHtml, targetColumn);
    // Навешиваем событие на удаление задачи, передаем id и массив с нужными задачами
    deletePost(data?.postId, "postsToDo");
    // Навешиваем событие на перемещение задачи
    moveToProgress(data?.postId);
}

// Функция для создания уникального id
function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
};

// Функция для монтирования верстки задачи, в целевой элемент
function addItem(item, targetElement) {
    document.querySelector(`#${targetElement}`).insertAdjacentHTML("afterbegin", item);
}

// Функция для перемещения задачи в следующую колонку
function moveToProgress(id) {
    let btnMoveToProgress = document.querySelector(`#p-${id}`);
    btnMoveToProgress.addEventListener("click", () => {
        // Парсим данные из двух массивов
        let arrayPosts = JSON.parse(localStorage.getItem('postsToDo'))
        let arrayProgress = JSON.parse(localStorage.getItem("postsInProgress"))
        // Создаем пустой массив для добавления данных в хранилище
        let newArr = [];
        for (let i = 0; i < arrayPosts.length; i++) {
            if (arrayPosts[i].postId === id) {
                // Получаем нужный элемент и добавляем его в массив с задачами в процессе
                let elementToProgress = arrayPosts.splice(i, 1);
                newArr = arrayProgress.concat(elementToProgress);

                localStorage.setItem('postsToDo', JSON.stringify(arrayPosts))
                localStorage.setItem('postsInProgress', JSON.stringify(newArr))
                break;
            }
        }
        window.location.reload();
        // перезагружаем страницу
    })
}

// Функция для добавления задач в колонку с завершенными задачами
function moveToDone(id) {
    let btnMoveToProgress = document.querySelector(`#p-${id}`);
    btnMoveToProgress.addEventListener("click", () => {
        // Парсим данные, создаем пустой массив
        let arrayProgress = JSON.parse(localStorage.getItem("postsInProgress"))
        let arrayDone = JSON.parse(localStorage.getItem('postsDone'))
        let newArr = [];
        for (let i = 0; i < arrayProgress.length; i++) {
            if (arrayProgress[i].postId === id) {
                // Получаем элемент и добавляем в массив с завершенными задачами
                let elementToDone = arrayProgress.splice(i, 1);
                newArr = arrayDone.concat(elementToDone);

                localStorage.setItem('postsInProgress', JSON.stringify(arrayProgress))
                localStorage.setItem('postsDone', JSON.stringify(newArr))
                break;
            }
        }
        window.location.reload();
        // перезагружаем страницу
    })
}

// Функция для удаления задачи
function deletePost(id, arr) {
    let btnDelete = document.querySelector(`#r-${id}`);
    btnDelete.addEventListener('click', () => {
        // Удаляем задачу из массива, который мы получаем в аргументе
        let arrayPosts = JSON.parse(localStorage.getItem(`${arr}`))
        for (let i = 0; i < arrayPosts.length; i++) {
            if (arrayPosts[i].postId === id) {
                // Находим элемент и удаляем, потом добавляем в хранилище
                arrayPosts.splice(i, 1);
                localStorage.setItem(`${arr}`, JSON.stringify(arrayPosts))
                break;
            }
        }
        window.location.reload();
    })
}

// Функция для удаления завершенных задач
function finalDelete(id) {
    let btnDelete = document.querySelector(`#p-${id}`);
    btnDelete.addEventListener('click', () => {
        // Парсим данные из массива завершенных задач
        let arrayPosts = JSON.parse(localStorage.getItem(`postsDone`))
        for (let i = 0; i < arrayPosts.length; i++) {
            if (arrayPosts[i].postId === id) {
                arrayPosts.splice(i, 1);
                localStorage.setItem(`postsDone`, JSON.stringify(arrayPosts))
                break;
            }
        }
        window.location.reload();
    })
}