const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();
const app = express();

app.use(express.json());

const doesExist = (username) => {
	let userswithsamename = users.filter((user) => {
		return user.username === username;
	});
	if (userswithsamename.length > 0) {
		return true;
	} else {
		return false;
	}
};

// para crear un usuario y contraseña, comando post, si no existe, hace un push del arreglo users y entrega el estatus 200 y el mensaje json
// si ya existe, arroja 404 y no lo hace
public_users.post('/register', (req, res) => {
	//console.log(req.query); // Cambiado a req.query para registrar los parámetros de la URL
	const { username, password } = req.query; // Obtén username y password de req.query en lugar de req.body

	if (username && password) {
		if (!doesExist(username)) {
			users.push({ username, password });
			return res
				.status(200)
				.json({ message: 'User successfully registered. Now you can login' });
		} else {
			return res.status(404).json({ message: 'User already exists!' });
		}
	} else {
		if (!username) {
			return res.status(400).json({ message: 'Username is required' });
		}
		if (!password) {
			return res.status(400).json({ message: 'Password is required' });
		}
	}
});

public_users.post('/register', (req, res) => {
	//Write your code here
	return res.status(300).json({ message: 'Yet to be implemented' });
});

//                1 ///////////////
// Get the book list available in the shop
public_users.get('/', function (req, res) {
	//Uso de styngify para convertir el objeto a string y lo consultamos en postman.
	res.send(JSON.stringify(books, null, 4)); // boojs esta declarado al inicio como json
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
	//creamos la constante para almacenar ISBN del get request
	const ISBN = req.params.isbn;
	// luego ese ISBN lo buscamos en el objeto books
	res.send(books[ISBN]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
	// respuesta en 0 como arreglo por que  pueden ser muchos.
	// luego recorremos el arreglo de todas las entradas de books
	// tecnica de filtro segun coincidencia de autor
	let ans = Object.values(books).filter(
		(book) => book.author === req.params.author
	);

	if (ans.length === 0) {
		return res.status(300).json({ message: 'Author not found' });
	}
	res.send(ans);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
	//Write your code here
	let ans = Object.values(books).filter(
		(book) => book.title === req.params.title
	);

	if (ans.length === 0) {
		return res.status(300).json({ message: 'Title not found' });
	}
	res.send(ans);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
	//Write your code here
	const ISBN = req.params.isbn;
	res.send(books[ISBN].reviews);
});

// Task 10  ------ Add the code for getting the list of books available
// using Promise callbacks or async-await with Axios

// promesa para obtener la lista
function getBookList() {
	return new Promise((resolve, reject) => {
		resolve(books);
	});
}

// ahora usamos la promesa dentro de un request
// envia todos los book del objeto books
public_users.get('/', function (req, res) {
	getBookList().then(
		(book) => res.send(JSON.stringify(book, null, 4)),
		(error) => res.send('denied')
	);
});

// Task 11  ------ Add the code for getting the book details based on ISBN
// using Promise callbacks or async-await with Axios.

function getFromISBN(isbn) {
	let book_ = books[isbn];
	return new Promise((resolve, reject) => {
		if (book_) {
			resolve(book_);
		} else {
			reject('Unable to find book!');
		}
	});
}

// Ahora el callback para obtener el book from ISBN
public_users.get('/isbn/:isbn', function (req, res) {
	const isbn = req.params.isbn;
	getFromISBN(isbn).then(
		(bk) => res.send(JSON.stringify(bk, null, 4)),
		(error) => res.send(error)
	);
});
// Task 12---- Add the code for getting the book details based on Author
//using Promise callbacks or async-await with Axios.

function getFromAuthor(author) {
	let output = [];
	return new Promise((resolve, reject) => {
		let output = Object.values(books).filter((book) => book.author === author);

		resolve(output);
	});
}

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
	const author = req.params.author;
	getFromAuthor(author).then((result) =>
		res.send(JSON.stringify(result, null, 4))
	);
});

// Task 13
// Add the code for getting the book details based on Title using Promise callbacks or async-await with Axios.

// prommesa que recoge el titulo,
// output se transforma en toods los libros que filtrados por coincidencia de titulo y resuelve el output
function getFromTitle(title) {
	return new Promise((resolve, reject) => {
		let output = Object.values(books).filter((book) => book.title === title);
		resolve(output);
	});
}

// ahora el callback, el resultado de la promesa lo env[ias como string parseado JSON
public_users.get('/title/:title', function (req, res) {
	const title = req.params.title;
	getFromTitle(title).then((result) =>
		res.send(JSON.stringify(result, null, 4))
	);
});

module.exports.general = public_users;
