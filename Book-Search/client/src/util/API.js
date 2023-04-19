import axios from "axios";

const API = {
  getBooks: (query) => {
    return axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
  },
  saveBook: (bookData) => {
    return axios.post("/api/books", bookData);
  },
  deleteBook: (id) => {
    return axios.delete(`/api/books/${id}`);
  },
  getSavedBooks: () => {
    return axios.get("/api/books");
  },
};

export default API;
