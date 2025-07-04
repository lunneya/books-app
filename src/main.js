// Form
const form = document.querySelector(".form");
const formInput = document.querySelector("#formInput");
const formStatus = document.querySelector("#statusSelect");
// Filter
const filter = document.querySelector(".filter");
// Render
const booksList = document.querySelector(".list");
// List
const list = document.querySelector(".list");

const books = [];

form.addEventListener("submit", addBook);
list.addEventListener("click", deleteBook);
filter.addEventListener("click", filterBooks);

function addBook(e) {
    e.preventDefault();

    const booksTitle = formInput.value;
    const bookStatus = formStatus.value;

    const newBook = {
        id: Date.now(),
        title: booksTitle,
        status: bookStatus,
    }

    books.push(newBook);
    renderBooks(newBook);

    formInput.value = "";
    formInput.focus();
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
    if (e.target.tagName !== 'BUTTON') return false;

    const filterClass = e.target.dataset['filter'];

    const bookList = document.querySelectorAll(".list-books");

    bookList.forEach(book => {
        book.classList.remove('list-hide');

        if (filterClass !== 'all' && book.dataset.status !== filterClass) {
            book.classList.add('list-hide');
        }
    });
}

function renderBooks(book) {
    const booksHTML = `<li id=${book.id} class="list-books book" data-status="${book.status}">
              <span class="list-title">${book.title}</span>
              <div class="list-actions">
                <span class="list-status">${book.status}</span>
                <button class="delete-btn" data-action="delete">✕</button>
              </div>
            </li>`

    booksList.insertAdjacentHTML('beforeend', booksHTML);
}