import './App.css';
import React, {useEffect, useState} from 'react';

function App() {
  const [authors, setData] = useState([]);
  const [error, setError] = useState(null);
  const [newName, setNewName] = useState("");
  const [newSurname, setNewSurname] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/authors');
      if (!response.ok) {
        throw new Error('Wystąpił błąd. Spróbuj ponownie później.');
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteAuthor = id => {
    fetch(`http://localhost:8000/authors/${id}`, {
      method: "DELETE",
    })
      .then(response => response.json())
      .then(() => {
        setData(values => {
          return values.filter(item => item.id !== id)
        })
      })
  }

  const addAuthor = () => {
    const name = newName.trim()
    const surname = newSurname.trim()
    if (name && surname) {
      fetch("http://localhost:8000/authors", {
        method: "POST",
        body: JSON.stringify({
          name,
          surname
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then(response => response.json())
        .then(data => {
          setData([...authors, data])
          setNewName("")
          setNewSurname("")
        })
    }
  }

  return (
    <div>
    
    <table border = "1">
      <tr>
        <th>Name</th>
        <th>Surname</th>
      </tr>
      {authors.map((author) => (
      <tr key={author.id}>
        <td>{author.name}</td>
        <td>{author.surname}</td>
        <td>
          <button onClick={() => deleteAuthor(author.id)}>{"Delete"}</button>
        </td>
      </tr>
      ))}
    </table>
       <br></br>
    <form onSubmit = {addAuthor}>
      <label>
        Name:
        <input type="text" name="name" value={newName} onChange={(n) => setNewName(n.target.value)}/>
      </label>
      <br></br>
      <label>
        Surname:
        <input type="text" name="surname" value={newSurname} onChange={(e) => setNewSurname(e.target.value)}/>
      </label>
      <br></br>
      <input type="submit" value="Add author"/>
    </form>
  </div>
  );
}


export default App;
