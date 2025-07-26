// form
const form = document.querySelector(".form");
const formInputTitle = document.querySelector("#formInputTitle");
const formInputAuthor = document.querySelector("#formInputAuthor");
const formInputDate = document.querySelector("#formInputDate");
const formStatus = document.querySelector("#statusSelect");
// filter
const filter = document.querySelector(".filterByStatus");
// render
const booksList = document.querySelector(".list");
// modal
const modalWindow = document.querySelector(".modal");
const modalBtn = document.querySelector("#btn-modal")
const closeModalBtn = document.querySelector(".close-btn");

// filter by title, author, date
const filterByTitle = document.querySelector("#filterByTitle");
const filterByAuthor = document.querySelector("#filterByAuthor");
const filterByDate = document.querySelector("#filterByDate");

const filterByBtn = document.querySelector("#searchValue"); // button
const clearFilter = document.querySelector("#clearSearch"); // clear filter

// table
const btnArrow = document.querySelectorAll(".table-content-button");

// pagination
const paginationContainer = document.querySelector(".pagination-content-numbers");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");

let books = [];
let originalBooks = [];
let filteredBooks = [];
let currentPage = 1;
const bookCount = 5;

// localStorage
if (localStorage.getItem('books')) {
    books = JSON.parse(localStorage.getItem('books'));
    originalBooks = [...books];
    filteredBooks = [...books]; // <== ключевая строка
    renderPaginatedBooks();
}

form.addEventListener("submit", addBook);
booksList.addEventListener("click", deleteBook);
filter.addEventListener("click", filterBooks);
modalBtn.addEventListener("click", showModal);
closeModalBtn.addEventListener("click", closeModal);

// filter by values
filterByBtn.addEventListener("click", filterBtn);

filterByBtn.addEventListener("click", filterBtn); // listens for input, when a button pressed
clearFilter.addEventListener("click", clearFilterBooks)

// listens table btn
btnArrow.forEach(btn => btn.addEventListener("click", stateArrow));

// listener arrow
prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderPaginatedBooks();
    }
});

nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(books.length / bookCount);
    if (currentPage < totalPages) {
        currentPage++;
        renderPaginatedBooks();
    }
})

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
    renderPaginatedBooks();

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

    filteredBooks = books.filter(book => {
        return filterClass === 'all' || book.status === filterClass;
    });

    currentPage = 1;
    renderPaginatedBooks();
}

// Если параметра нет, то происходит рендер всех книг
// Если есть параметр, то происходит рендер книги из параметра
function renderBooks(b) {
const booksForRender = Array.isArray(b) ? b : (b ? [b] : books);
    booksList.innerHTML = "";
    booksForRender.forEach(book => {
        const booksHTML = `<li class="list-books book" data-status="${book.status}">
              <h1 class="list-title">${book.title}</h1>
              <span class="list-author">${book.author}</span>
              <div class="list-actions">
                <p>${book.date}</p>
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

function filterBtn() {

    // Собираем все значения из inputs в объект
    const filters = {
        title: filterByTitle.value.trim().toLowerCase(),
        author: filterByAuthor.value.trim().toLowerCase(),
        date: filterByDate.value.trim().toLowerCase(),
    };

    // Фильтруем книги
    filteredBooks = books.filter(book => {
        // Object.keys(filters) создаем массив: ['title', 'author', 'date']
        // .some() ищет, по любому совпадению true
        return Object.keys(filters).some(key => {
            const filterValue = filters[key];

            if (filterValue === "") return false;

            // Проверка для title and author
            return book[key].toLowerCase().includes(filterValue);

            // Проверка для date
            if (key === "date") {
                const filterNumber = parseInt(filterValue, 10);
                const bookDate = parseInt(book.date, 10);
                return !isNaN(filterNumber) && bookDate === filterNumber;
            }
        });
    });

    currentPage = 1;
    renderPaginatedBooks();
}

function clearFilterBooks() {
    filterByTitle.value = "";
    filterByAuthor.value = "";
    filterByDate.value = "";
    filteredBooks = [...books];
    currentPage = 1;
    renderPaginatedBooks();
}

function stateArrow(e) {
    const btn = e.currentTarget;
    const sortKey = btn.dataset.key;

    // Если btn = e.currentTarget не равняется новой кнопкой, по которой произошло нажатие, то
    btnArrow.forEach(button => {
        if (button !== btn) button.classList.remove('asc', 'desc');
    })

    const asc = btn.classList.contains('asc'); // arrow up
    const desc = btn.classList.contains('desc'); // arrow down

    // Переключаем классы у активной кнопки
    if (asc) {
        btn.classList.remove('asc');
        btn.classList.add('desc');
        sorting(sortKey, 'desc');

    } else if (desc) {
        btn.classList.remove('desc');
        filteredBooks = [...originalBooks];
        currentPage = 1;
        renderPaginatedBooks();
    } else {
        btn.classList.add('asc');
        sorting(sortKey, 'asc');
    }

}

function sorting(key, direction = 'asc') {
    filteredBooks.sort((a, b) => {
        if (key === 'date') {
            const valueA = parseInt(a[key], 10);
            const valueB = parseInt(b[key], 10);

            if (isNaN(valueA) || isNaN(valueB)) return 0;
            return direction === 'asc'
                ? valueA - valueB
                : valueB - valueA;

        } else {
            const valueA = a[key]?.toString().toLowerCase() || '';
            const valueB = b[key]?.toString().toLowerCase() || '';
            return direction === 'asc'
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        }
    });
    currentPage = 1;
    renderPaginatedBooks();
}

function saveToLocalStorage() {
    localStorage.setItem('books', JSON.stringify(books));
}

function renderPaginatedBooks() {
    const startIndex = (currentPage - 1) * bookCount;
    const endIndex = startIndex + bookCount;
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

    renderBooks(paginatedBooks);
    renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(filteredBooks.length / bookCount); // фикс
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;

        if (i === currentPage) btn.classList.add('active');

        btn.addEventListener("click", () => {
            currentPage = i;
            renderPaginatedBooks();
        });
        paginationContainer.appendChild(btn);
    }

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}