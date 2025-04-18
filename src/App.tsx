import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, DocumentData } from "firebase/firestore";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import "./App.css";

const App = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [books, setBooks] = useState<DocumentData[]>([]);

  const booksCollection = collection(db, "books");

  const fetchBooks = async () => {
    const snapshot = await getDocs(booksCollection);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setBooks(data);
  };

  const deleteBook = async (id: string) => {
    try {
      await deleteDoc(doc(db, "books", id));
      fetchBooks(); // リロードして更新
    } catch (error) {
      console.error("削除に失敗しました", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const addBook = async () => {
    if (title.trim() === "" || author.trim() === "" || imageUrl.trim() === "") return;

    await addDoc(booksCollection, {
      title,
      author,
      imageUrl,
      createdAt: new Date(),
    });

    setTitle("");
    setAuthor("");
    setImageUrl("");
    fetchBooks();
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newBooks = Array.from(books);
    const [movedItem] = newBooks.splice(result.source.index, 1);
    newBooks.splice(result.destination.index, 0, movedItem);
    setBooks(newBooks);
  };

  return (
    <div className="app">
      <h1>📚 マイ本棚</h1>

      <div className="form">
        <input placeholder="タイトル" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="著者" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <input placeholder="画像URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        <button onClick={addBook}>追加</button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="bookshelf" direction="horizontal">
          {(provided) => (
            <div className="bookshelf" ref={provided.innerRef} {...provided.droppableProps}>
              {books.map((book, index) => (
                <Draggable key={book.id} draggableId={book.id} index={index}>
                  {(provided) => (
                    <div
                      className="book"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <img src={book.imageUrl} alt={book.title} />
                      <div className="info">
                        <strong>{book.title}</strong>
                        <small>{book.author}</small>
                      </div>
                      <button className="delete-button" onClick={() => deleteBook(book.id)}>
                        ❌
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default App;
