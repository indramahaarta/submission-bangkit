/* eslint-disable eqeqeq */
const { v4: uuidv4 } = require('uuid');
const books = require('./books');

const postBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = uuidv4();
  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();
  const insertedAt = updatedAt;

  let res = {};
  let status = 500;

  if (name === undefined) {
    res = {
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    };
    status = 400;
  } else if (readPage > pageCount) {
    res = {
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    };
    status = 400;
  } else {
    res = {
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    };
    status = 201;
    books.push({
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
      insertedAt,
    });
  }

  const response = h.response(res);
  response.code(status);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let booksReponse = books;

  if (name !== undefined) {
    booksReponse = booksReponse.filter(
      (book) => book.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  if (reading !== undefined) {
    booksReponse = booksReponse.filter((book) => book.reading == reading);
  }

  if (finished !== undefined) {
    booksReponse = booksReponse.filter((book) => book.finished == finished);
  }

  booksReponse = booksReponse.map(
    (book) => ({ id: book.id, name: book.name, publisher: book.publisher }),
  );
  const response = h.response({
    status: 'success',
    data: {
      books: booksReponse,
    },
  });
  response.code(200);

  return response;
};

const getBookHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);
  if (index === -1) {
    return h
      .response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      })
      .code(404);
  }

  return h
    .response({ status: 'success', data: { book: books[index] } })
    .code(200);
};

const updateBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const { id } = request.params;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);
  let res = {};
  let status = 500;
  const finished = readPage === pageCount;

  if (index >= 0) {
    if (name === undefined) {
      res = {
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      };
      status = 400;
    } else if (readPage > pageCount) {
      res = {
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      };
      status = 400;
    } else {
      const newBook = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        updatedAt,
      };

      books[index] = newBook;
      res = {
        status: 'success',
        message: 'Buku berhasil diperbarui',
      };
      status = 200;
    }
  } else {
    res = {
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    };
    status = 404;
  }

  return h.response(res).code(status);
};

const deleteBookHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index === -1) {
    return h
      .response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      })
      .code(404);
  }
  books.splice(index, 1);
  return h
    .response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    })
    .code(200);
};

module.exports = {
  postBookHandler,
  getAllBooksHandler,
  getBookHandler,
  updateBookHandler,
  deleteBookHandler,
};
