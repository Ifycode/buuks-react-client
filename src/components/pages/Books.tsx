import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Modal from "../Modal";

// Rough work... Arrange code, and reduce the code in this file later.

const Books = (): JSX.Element => {
  const navigate = useNavigate();
  // TODO: const [userName, setUserName] = useState(''); // add name property to the get response on the backend so that you can display this at the top of the page
  const [books, setBooks] = useState([]);
  const [booksCount, setBooksCount] = useState(0);

  //---------------------------------------------------------
  const getUserBooks = async (userId: string) => {
    console.log('Get books function! ', userId);

    const req = await fetch(`${process.env.REACT_APP_BASE_URL}/books/user/${userId}`, {
      // headers: new Headers({ //this also works
      //   'x-access-token': `${localStorage.getItem('accessToken')}`
      // })
      headers: {
        'x-access-token': localStorage.getItem('accessToken') as string,
      }
    });

    const data = await req.json();

    if (data) {
      setBooks(data.books);
      setBooksCount(data.count);
      console.log('data: ', data);
    } else {
      console.log('error: some error occured...');
    }
  }

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    // const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken) {
      const user = JSON.parse(window.atob(accessToken.split('.')[1]));
      if (user) {
        console.log('You\'re logged in!');
        console.log(user);
        getUserBooks(user._id);
      } else {
        navigate('/login');
        console.log('This is just for debugging, does this ever happen?: Access token, but no user');
      }
    } else {
      navigate('/login');
      console.log('Da pa da!');
    }
  }, []);

  //----------------------------------------------------------------

  return (
    <section>
      <h1>Books page!</h1>
      <p>Welcome (user name will go here)!</p>
      <b>(Please pardon my ugly UI for now.  Will work on that once I'm done with functionality)</b>
      {
        booksCount !== 0 ? books.map(((book: any) => {
          return (
            // Temporary styles use tailwind later on
            <div key={book._id} className="cards">
              <h3>{book.title}</h3>
              <h3>{book.description}</h3>
              <a href={book.pdf} style={{ color: 'blue' }}>Preview or download PDF</a>
              <div className="card-buttons">
                <button className="margin-right">Update</button>
                <button>Delete</button>
              </div>
            </div>
          )
        })) :
          <div>You have not added any book yet</div>
      }
      <button className="button block">Add a new book</button>

      <Modal>
        <form>
          <h1>Add new book (form)</h1>
          <input
            type="text"
            placeholder="New book title"
          />
          <textarea placeholder="New book description"></textarea>
          <input type="file" />
          <button className="button">Submit new book</button>
        </form>
      </Modal>

      {/* Temporary style: Use tailwind later on */}
      <Link to="/" style={{ textDecoration: 'underline', color: 'blue' }}>Back to home page</Link>
    </section>
  );
}

export default Books;
