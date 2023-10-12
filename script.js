const addBookButton = document.querySelector("#addbook");
const bookContainer = document.querySelector(".book-container");

const dialog = document.querySelector("dialog");
const bookTitle = document.querySelector("#bookTitle");
const bookAuthor = document.querySelector("#bookAuthor");
const confirmBtn = dialog.querySelector("#confirmBtn");

addBookButton.addEventListener("click", () => {
  bookTitle.value = "";
  bookAuthor.value = "";
  dialog.showModal();
});

dialog.addEventListener("close", (e) => {
  let formVal =
    dialog.returnValue === "default"
      ? "No return value."
      : `ReturnValue: ${dialog.returnValue}.`; // Have to check for "default" rather than empty string
  console.log(formVal);
});

confirmBtn.addEventListener("click", (event) => {
  event.preventDefault(); // We don't want to submit this fake form

  let book = new Book(bookTitle.value, bookAuthor.value);
  addBookToLibrary(book);

  dialog.close("submit"); // Have to send the select box value here.
});

let bookCounter = 0;
let myLibrary = [];

function Book(name, author) {
  this.name = name;
  this.author = author;
  this.isRead = false;
  this.id = -1;
}

function addBookToLibrary(book) {
  if (Object.getPrototypeOf(book) != Book.prototype) {
    console.log("Cannot add a non-book object to library");
    return;
  }

  book.id = bookCounter;
  bookCounter += 1;

  myLibrary.push(book);

  refreshLibrary();
}

function toggleBookReadStatus(bookID) {
  const book = myLibrary.find((x) => x.id === bookID);
  if (book === undefined) {
    return;
  }

  book.isRead = !book.isRead;
}

function refreshLibrary() {
  while (bookContainer.firstChild) {
    bookContainer.removeChild(bookContainer.lastChild);
  }

  for (let book of myLibrary) {
    createBookElement(book);
  }
}

function removeBookFromLibrary(bookID) {
  myLibrary = myLibrary.filter((x) => x.id != bookID);
}

function isBookRead(bookID) {
  const book = myLibrary.find((x) => x.id === bookID);
  if (book === undefined) {
    return;
  }

  return book.isRead;
}

function createBookElement(book) {
  const newDiv = document.createElement("div");
  newDiv.classList.add("book");
  newDiv.dataset.bookId = book.id;

  const bookInfo = document.createElement("p");
  bookInfo.innerText = `${book.name}, ${book.author}`;

  const newBookControlDiv = document.createElement("div");
  newBookControlDiv.classList.add("book-controls");

  const readToggleBtn = document.createElement("button");
  readToggleBtn.innerText = "Read";
  if (isBookRead(book.id)) {
    readToggleBtn.classList.add("read");
  }
  const removeBookBtn = document.createElement("button");
  removeBookBtn.innerText = "Remove";

  readToggleBtn.addEventListener("click", (e) => {
    readToggleBtn.classList.toggle("read");
    toggleBookReadStatus(book.id);
    console.log(myLibrary);
  });

  removeBookBtn.addEventListener("click", (e) => {
    console.log(book.id);
    removeBookFromLibrary(book.id);
    refreshLibrary();
  });

  newBookControlDiv.appendChild(readToggleBtn);
  newBookControlDiv.appendChild(removeBookBtn);

  newDiv.appendChild(bookInfo);
  newDiv.appendChild(newBookControlDiv);

  bookContainer.appendChild(newDiv);
}

const defaultBook = new Book("Game of Thrones", "George R. R. Martin");
addBookToLibrary(defaultBook);
