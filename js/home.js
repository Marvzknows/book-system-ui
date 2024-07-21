import { checkSession, baseURL, token } from "../js/main.js";

$(document).ready(function () {

    const tbody = $('#tbody');
    const bookName = $('#book_name');
    const bookAuthor = $('#book_author');
    const bookCover = $('#book_cover');
    const submitBookBtn = $('#submit_book');
    const updateBookBtn = $('#update_book');
    const searchedBook = $('#search_book');
    let searching;

    let editIdRef = null;
    let data = [];

  //Check token
  checkSession();
  fetchBooks();


  function renderBooksTbody(bookData, tableBody) {
    bookData.forEach((book, index) => {
        const {id, book_name, author_name, book_cover} = book;
      const row = `
        <tr> 
            <th scope="row">${index + 1}</th>
            <td>${book_cover}</td>
            <td>${book_name}</td>
            <td>${author_name}</td>
            <td class="d-flex gap-2 align-items-center">
                <button type="button" class="edit_btn btn btn-primary btn-sm" data-id="${id}">Edit</button>
                <button type="button" class="delete_btn btn btn-danger btn-sm" data-id="${id}">Delete</button>
            </td>
        </tr>
        `;
      tableBody.append(row);
    });
  }

  function fetchBooks() {
    // Clear tbody
    tbody.html('');

    $.ajax({
      type: "GET",
      url: `${baseURL}/api/fetchBooks.php`,
      headers: { Authorization: "Bearer " + token },
      success: function (response) {
        // console.log("Response:", response);
        data = response.data;
        renderBooksTbody(data, tbody);
      },
      error: function (err) {
        console.error("Error:", err);
      },
    });
  }


  // Handle Submit Book
  submitBookBtn.on('click', function(e) {
    e.preventDefault();
    editIdRef = null;

    const payLoad = {
        book_name: bookName.val(),
        book_author: bookAuthor.val()
    }
    
    $.ajax({
        type: "POST",
        url: `${baseURL}/api/insertBook.php`,
        headers: {Authorization: `Bearer ${token}`},
        data: payLoad,
        success: function (response) {
            console.log(response);
            // console.log(response.status);
            if(response.status === 200) {
                bookName.val('');
                bookAuthor.val('');
                fetchBooks();
                return;
            }
            alert(response.message);
        },error: function(err) {
            throw console.error(err);
        }
    });
  })
  
  
  //Handle Delete
  $(document).on('click', '.delete_btn', function () {
    const id = $(this).attr('data-id');
    if(!id) return alert('Invalid Action');

    const payLoad = {
        delete_id: id
    }

    $.ajax({
      type: "POST",
      url: `${baseURL}/api/deleteBook.php`,
      headers: { Authorization: `Bearer ${token}` },
      data: payLoad,
      success: function (response) {
        const res = JSON.parse(response);
        if(res.status === 200) {
            fetchBooks();
            return;
        }
        alert(res.message);
      },
      error: function (err) {
        throw console.error(err);
      },
    });
  })

  // Handle Populate Edit Data
  $(document).on('click', '.edit_btn', function() {

    const edit_id = $(this).attr('data-id');

    if(!edit_id) return alert('Invalid Action');
    editIdRef = null;

    $.ajax({
      type: "POST",
      url: `${baseURL}/api/getEditBook.php`,
      data: {edit_id: edit_id},
      headers: {Authorization: `Bearer ${token}`},
      success: function (response) {
        console.log(response.data);
        const {id, author_name, book_cover, book_name} = response.data;
        bookName.val(book_name);
        bookAuthor.val(author_name);
        editIdRef = id;
      },error: function(err) {
        throw console.error(err);
      }
    });
  })
  
  // Handle Edit API
  updateBookBtn.click(function(e) {
    e.preventDefault();
    if(!editIdRef || editIdRef === 0 || editIdRef === null) {
      alert('Invalid Action');
      return;
    }
    const payLoad = {
      edit_id: editIdRef,
      book_name: bookName.val(),
      author_name: bookAuthor.val()
  }

    $.ajax({
      type: "POST",
      url: `${baseURL}/api/editBook.php`,
      headers: {Authorization: `Bearer ${token}`},
      data: payLoad,
      success: function (response) {
        if(response.status === 200) {
          bookName.val('');
          bookAuthor.val('');
          editIdRef = null;
          fetchBooks();
          return;
        }
        alert('Updating Failed');
      },error: function(err) {
        throw console.log(err);
      }
    });
  })

  // Handle Search
  searchedBook.on("input", function () {
    let searchValue = $(this).val();
    if (searchValue.trim() === "") {
      fetchBooks();
      return;
    }
    clearTimeout(searching);
    searching = setTimeout(() => {
      $.ajax({
        type: "POST",
        url: `${baseURL}/api/searchBook.php`,
        headers: { Authorization: `Bearer ${token}` },
        data: { search: searchValue },
        success: function (response) {
          if(response.status === 200) {
            tbody.html('');
            renderBooksTbody(response.data, tbody);
            return
          }
          
        },
        error: function (err) {
          throw console.error(err);
        },
      });
    }, 700);
  });




});
