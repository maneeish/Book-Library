// Select the books container
const booksContainer = document.querySelector(".books-container");
const searchBox = document.getElementById("search-box");
const sortBookSelect = document.getElementById("sort");
const listViewBtn = document.getElementById("list-view");
const gridView = document.getElementById("grid-view");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const paginationBtns = document.querySelector(".pagination-btns-container");

let currentPage = 1;
const totalItems = 210;
const totalPages = 21;
const itemsPerPage = totalItems / totalPages;

// Toggle List and Grid Views
listViewBtn.addEventListener("click", () => {
  booksContainer.classList.add("list-view");
  listViewBtn.style.color = "rgb(252, 103, 4)";
  gridView.style.color = "white";
});

gridView.addEventListener("click", () => {
  booksContainer.classList.remove("list-view");
  gridView.style.color = "rgb(252, 103, 4)";
  listViewBtn.style.color = "white";
});

// Function to sort and update books
function sortBooks() {
  const option = sortBookSelect.value;
  const books = Array.from(document.querySelectorAll(".book"));

  books.sort((a, b) => {
    const titleA = a.querySelector("#book-title")?.innerText?.toLowerCase() || "";
    const titleB = b.querySelector("#book-title")?.innerText?.toLowerCase() || "";

    const yearA = parseInt(a.querySelector("#published-date")?.innerText) || 0;
    const yearB = parseInt(b.querySelector("#published-date")?.innerText) || 0;

    return option === "title" ? titleA.localeCompare(titleB) : yearA - yearB;
  });

  booksContainer.innerHTML = "";
  books.forEach((book) => booksContainer.appendChild(book));
}

// Add event listener to sort books
sortBookSelect.addEventListener("change", sortBooks);

// Function to search for a book
function searchBook() {
  const searchTerm = searchBox.value.toLowerCase();
  document.querySelectorAll(".book").forEach((book) => {
    const title = book.querySelector("#book-title")?.innerText?.toLowerCase() || "";
    const author = book.querySelector("#author")?.innerText?.toLowerCase() || "";
    book.style.display = title.includes(searchTerm) || author.includes(searchTerm) ? "flex" : "none";
  });
}

// Event listener for search input
searchBox.addEventListener("input", searchBook);

// Function to create book elements
function createBookElement(books) {
  books.forEach((book) => {
    const bookElm = document.createElement("div");
    bookElm.classList.add("book");
    bookElm.innerHTML = `
        <img src="${book?.volumeInfo?.imageLinks?.thumbnail || 'placeholder.jpg'}" 
             alt="thumbnail" id="thumbnail" loading="lazy"/>
        <div class="book-info">
          <h2 id="book-title">${book?.volumeInfo?.title || "Unknown Title"}</h2>
          <p id="author">${book?.volumeInfo?.authors?.[0] || "Unknown Author"}</p>
          <small>${book?.volumeInfo?.publisher || "Unknown Publisher"}</small>
          <div class="more_info">
              <p id="published-date">${book?.volumeInfo?.publishedDate || "N/A"}</p>
              <a href="${book?.volumeInfo?.infoLink}" target="_blank">More info</a>
          </div>
        </div>
    `;
    booksContainer.appendChild(bookElm);
  });
}

// Pagination logic
function updateActiveButton() {
  paginationBtns.querySelectorAll("button").forEach((btn, index) => {
    btn.style.backgroundColor = index + 1 === currentPage ? "rgb(252, 103, 4)" : "rgba(148, 40, 248, 0.4)";
  });
}

// Function to fetch books
async function fetchBooks(page = 1) {
  gridView.style.color = "rgb(252, 103, 4)";
  const url = `https://api.freeapi.app/api/v1/public/books/?limit=${itemsPerPage}&page=${page}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Could not fetch data: ${response.status}`);

    const data = await response.json();
    booksContainer.innerHTML = "";
    createBookElement(data?.data?.data || []);
  } catch (error) {
    console.error(error.message);
  }
}

// Add Pagination Buttons
for (let i = 1; i <= totalPages; i++) {
  const btn = document.createElement("button");
  btn.innerText = i;
  paginationBtns.appendChild(btn);
  btn.addEventListener("click", () => {
    currentPage = i;
    fetchBooks(currentPage);
    updateActiveButton();
  });
}

// Pagination controls
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchBooks(currentPage);
    updateActiveButton();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchBooks(currentPage);
    updateActiveButton();
  }
});

// Initialize the script
document.addEventListener("DOMContentLoaded", () => {
  fetchBooks(currentPage);
  updateActiveButton();
});
