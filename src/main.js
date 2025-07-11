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
const filterBy = document.querySelector("#filterBy"); // Select
const filterByValue = document.querySelector("#filterByValue"); // Input
const filterByBtn = document.querySelector("#searchValue"); // Button
const clearFilter = document.querySelector("#clearSearch"); // Clear filter

let searchField = 'title';
let books = [];

form.addEventListener("submit", addBook);
booksList.addEventListener("click", deleteBook);
filter.addEventListener("click", filterBooks);
modalBtn.addEventListener("click", showModal);
closeModalBtn.addEventListener("click", closeModal);

filterBy.addEventListener("change", filterSelect); // Listens select
filterByBtn.addEventListener("click", filterBtn); // Listens for input, when a button pressed
clearFilter.addEventListener("click", clearFilterBooks)

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

// Если параметра нет, то проиходит рендер всех книг
// Если есть параметр, то проиходит рендрер книги из параметра
function renderBooks(b) {
const booksForRender = b || books;
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
    });
}

function showModal() {
    modalWindow.classList.add("show");
}

function closeModal() {
    modalWindow.classList.remove("show");
}

function filterSelect(e) {
    searchField = e.target.value;
}

function filterBtn() {
    const inputValue = filterByValue.value.toLowerCase();

    const filteredBooks = books.filter(book =>{
        return book[searchField].toLowerCase().includes(inputValue);
    });

    renderBooks(filteredBooks);
}

function clearFilterBooks() {
    renderBooks();
}