// Form
const form = document.querySelector(".form");
const formInputTitle = document.querySelector("#formInputTitle");
const formInputAuthor = document.querySelector("#formInputAuthor");
const formInputDate = document.querySelector("#formInputDate");
const formStatus = document.querySelector("#statusSelect");
// Filter
const filter = document.querySelector(".filterByStatus");
// Render
const booksList = document.querySelector(".list");
// Modal
const modalWindow = document.querySelector(".modal");
const modalBtn = document.querySelector("#btn-modal")
const closeModalBtn = document.querySelector(".close-btn");

// filter by title, author, date
const filterByTitle = document.querySelector("#filterByTitle");
const filterByAuthor = document.querySelector("#filterByAuthor");
const filterByDate = document.querySelector("#filterByDate");

const filterByBtn = document.querySelector("#searchValue"); // Button
const clearFilter = document.querySelector("#clearSearch"); // Clear filter

// table
const btnArrow = document.querySelectorAll(".table-content-button");

let books = [];

if (localStorage.getItem('books')) {
    const savedBooks = JSON.parse(localStorage.getItem('books'));
    if (Array.isArray(savedBooks)) {
        books = savedBooks;
    }
}
renderBooks();

form.addEventListener("submit", addBook);
booksList.addEventListener("click", deleteBook);
filter.addEventListener("click", filterBooks);
modalBtn.addEventListener("click", showModal);
closeModalBtn.addEventListener("click", closeModal);

// filter by values
filterByTitle.addEventListener("input", filterBtn);
filterByAuthor.addEventListener("input", filterBtn);
filterByDate.addEventListener("input", filterBtn);

filterByBtn.addEventListener("click", filterBtn); // Listens for input, when a button pressed
clearFilter.addEventListener("click", clearFilterBooks)

// listens table btn
btnArrow.forEach(btn => {
    btn.addEventListener("click", () => {
        // Убираем классы у всех кнопок
        btnArrow.forEach(button => {
            if (button !== btn) button.classList.remove('asc', 'desc');
        })

        // Добавляем к активной кнопке
        if (btn.classList.contains('asc')) {
            btn.classList.remove('asc');
            btn.classList.add('desc');
        } else if (btn.classList.contains('desc')) {
            btn.classList.remove('desc');
            btn.classList.add('asc');
        } else {
            btn.classList.add('asc');
        }
    });
});

// functions
function addBook(e) {
    e.preventDefault();

    const booksTitle = formInputTitle.value;
    const booksAuthor = formInputAuthor.value;
    const booksDate = formInputDate.value;
    const bookStatus = formStatus.value;

    const newBook = {
        id: Date.now(),
        title: booksTitle,
        author: booksAuthor,
        date: booksDate,
        status: bookStatus,
    }

    books.push(newBook);
    saveToLocalStorage();
    renderBooks();

    formInputTitle.value= "";
    formInputAuthor.value= "";
    formInputDate.value= "";
    formInputTitle.focus();
}

function deleteBook(e) {
    if (e.target.dataset.action !== "delete") return;

    const parentNode = e.target.closest("li");

    // Book id
    const bookId = Number(parentNode.id);

    // Find book index in const books = [];
    const bookIndex = books.findIndex(book => book.id === bookId);

    // Delete book in books
    books.splice(bookIndex, 1);

    saveToLocalStorage();

    // Delete e.target.closest("li")
    parentNode.remove();
}

function filterBooks(e) {
    if (e.target.tagName !== 'SELECT') return false;

    const filterClass = e.target.value;

    const bookList = document.querySelectorAll(".list-books");

    bookList.forEach(book => {
        book.classList.remove('list-hide');

        if (filterClass !== 'all' && book.dataset.status !== filterClass) {
            book.classList.add('list-hide');
        }
    });
}

// Если параметра нет, то происходит рендер всех книг
// Если есть параметр, то происходит рендер книги из параметра
function renderBooks(b) {
const booksForRender = Array.isArray(b) ? b : (b ? [b] : books);
    booksList.innerHTML = "";
    booksForRender.forEach(book => {
        const booksHTML = `<li class="list-books book" data-status="${book.status}">
              <h1 class="list-title">${book.title}</h1>
              <span>${book.author}</span>
              <p>${book.date}</p>
              <div class="list-actions">
                <span class="list-status">${book.status}</span>
                <button id=${book.id} class="delete-btn" data-action="delete">✕</button>
              </div>
            </li>`

        booksList.insertAdjacentHTML('beforeend', booksHTML);
        console.log('Render books', booksForRender);
    });
}

function showModal() {
    modalWindow.classList.add("show");
}

function closeModal() {
    modalWindow.classList.remove("show");
}

function filterBtn(e) {

    // Собираем все значения из inputs в объект
    const filters = {
        title: filterByTitle.value.trim().toLowerCase(),
        author: filterByAuthor.value.trim().toLowerCase(),
        date: filterByDate.value.trim().toLowerCase(),
    };


    if (e.target === filterByBtn) {
        // Фильтруем книги
        const filteredBooks = books.filter(book => {
            // Object.keys(filters) создаем массив: ['title', 'author', 'date']
            // .every() проверяет, что каждое из условий true
            return Object.keys(filters).every(key => {

                // Если input пустой — не фильтруем || проверяем, что книга включает в себя введенное значение
                // String.prototype.includes отвечает за проверку, если введенное значение присутствует
                return filters[key] === "" || book[key].toLowerCase().includes(filters[key]);
            });
        });

        renderBooks(filteredBooks);
    }
}

function clearFilterBooks() {
    filterByTitle.value = "";
    filterByAuthor.value = "";
    filterByDate.value = "";
    renderBooks();
}

function saveToLocalStorage() {
    localStorage.setItem('books', JSON.stringify(books));
}