const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });

  return userswithsamename.length > 0;
}

public_users.post("/register", (req, res) => {
  //Write your code here
  let username = req.query.username;
  let password = req.query.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({
        "username": username,
        "password": password
      });

      return res.status(200).json({ message: "User successfully registered. You may now log in." });
    } else {
      return res.status(404).json({ message: "This user already exists!" });
    }
  }
  console.log(`user: ${username}\n\npass: ${password}`);
  return res.status(404).json({ message: "Unable to register user." });
});

/*
// Get the book list available in the shop - no axios or promise
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({ books }, null, 4));
});
*/

// Get available books list with promise
public_users.get('/', async (req, res) => {
  new Promise((resolve, reject) => {
    try {
      resolve(JSON.stringify(books, null, 4));
    } catch (err) {
      reject(err);
    }
  }).then(
    (data) => res.send(data),
    (err) => console.log(`Error: ${err}`)
  );
});

/* 
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];

  if (book) {
    res.send(JSON.stringify({book}, null, 4));
  } else {
    res.send("Unable to locate the book you were looking for.");
  }
});
 */

// Get book by ISBN with promise
public_users.get('/isbn/:isbn', async (req, res) => {
  new Promise((resolve, reject) => {
    try {
      const isbn = req.params.isbn;
      const book = books[isbn];

      book ? resolve(JSON.stringify(book, null, 4)) : resolve("Unable to locate the book you were looking for.");
    }
    catch (err) {
      reject(err);
    }
  }).then(
    (data) => res.send(data),
    (err) => console.log(`Error: ${err}`)
  );
});

/* 
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;

  let book = [];

  for (let isbn in books) {
    if (books[isbn]["author"] === author) {
      book.push(books[isbn]);
    }
  }

  if (book.length > 0) {
    res.send(JSON.stringify({book}, null, 4));
  } else {
    res.send(`We couldn\'t find a book by ${author}.`)
  }
});
 */

// Get book by author with promise
public_users.get('/author/:author', async (req, res) => {
  new Promise((resolve, reject) => {
    try {
      const author = req.params.author;
      let fromAuthor = {};
      
      for (let isbn in books) {
        if (books[isbn]['author'] === author) fromAuthor[isbn] = books[isbn];
      };

      if (Object.keys(fromAuthor).length === 0) resolve(`We didn\'t find any books by ${author}`);

      resolve(JSON.stringify(fromAuthor, null, 4));
    }
    catch (err) {
      reject(err);
    }
  }).then(
    (data) => res.send(data),
    (err) => console.log(`Error: ${err}`)
  )
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;

  let book = [];

  for (let isbn in books) {
    if (books[isbn]["title"] === title) {
      book.push(books[isbn]);
    }
  }

  if (book.length > 0) {
    res.send(JSON.stringify({book}, null, 4));
  } else {
    res.send(`We couldn\'t find a book by the name of ${title}.`);
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let review = books[isbn]["reviews"];
  let title = books[isbn]["title"];
  let author = books[isbn]["author"];

  if (!isbn) {
    res.send(`You must enter an ISBN to look up a review.`);
  } else {
    res.send(`Here\'s what people have to say about ${title} by ${author}\n\n${JSON.stringify({review}, null, 4)}`);
  }
});

module.exports.general = public_users;
