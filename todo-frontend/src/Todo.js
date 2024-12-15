import React  from 'react'
import  { useState} from 'react'
import { useEffect } from 'react';



export default function Todo() {
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("")
    const [todos,setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("")
    const [editId, setEditId] = useState("-1")
    
    const [editTitle,setEditTitle] = useState("");
    const [editdescription,setEditDescription] = useState("")

   const apiUrl = "http://localhost:8000"

    const handleSubmit = () => {
        setError("")
        if (title.trim() !== '' && description.trim() !== '') {
            fetch(apiUrl+"/todos", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({title, description})
            }).then((res) => {
                if (res.ok) {
                    setTodos([...todos, {title, description}]) 
                    setTitle("");
                    setDescription("");
                    setMessage("Item added successfully")
                    setTimeout(() => {
                        setMessage("");
                    },3000)
                }  else {
                           setError("Unable to create Todo item")
                }
            }).catch (() =>{
                setError("Unable to create Todo item")
            })
            
            
        }

    }
      useEffect(()=>{
        getItems()
      },[])
      const getItems = () => {
        fetch(apiUrl + "/todos")
            .then((res) => {
                if (!res.ok) {
                    return
                }
                return res.json();
            })
            .then((res) => {
                setTodos(res);
            })
            .catch((error) => {
                console.error("Error fetching todos:", error.message);
                // Optionally, set an error state or show an error message to the user
            });
    };
    
      const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
        
      }
      const handleUpdate = () => {
        setError("")
        if (editTitle.trim() !== '' && editdescription.trim() !== '') {
          fetch(apiUrl+"/todos/"+editId, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({title: editTitle, description: editdescription})
          }).then((res) => {
            if (res.ok) {
              const updatedTodos= todos.map((item)=>{
                if(item._id == editId){
                  item.title = editTitle;
                  item.description = editdescription;
                }
                return item;
              })
              setTodos(updatedTodos)
              setEditTitle("");
              setEditDescription("");
              setMessage("Item upddate successfully")
              setTimeout(()=> {
                setMessage("");
              },3000)

              setEditId(-1)
          }else {
            setError("unable to create Todo item")
            }
          }).catch(()=>{
            setError("Unable to create Todo item")
          })
        }
      }

      const handleEditCancel = () => {
        setEditId(-1);
      }
      const handleDelete = (id) => {
        if (window.confirm('Are you sure want to delete?')) {
            fetch(apiUrl+'/todos/'+id, {
                method: "DELETE"
            })
            .then(() => {
               const updatedTodos = todos.filter((item) => item._id !== id)
               setTodos(updatedTodos)
            })
        }
    }

  return <>
    
    <div className="row p-3 bg-info">
      <h1>ToDo Project with Mern </h1>
    </div>
    <div className="row">
        <h3>Add Item</h3>
       {message && <p className="text-success">{message}</p>}
   
 
        <div className=" form-group d-flex gap-2">
        <input placeholder="Title" onChange={(e)=> setTitle(e.target.value)} value={title}className="form-control" type="text" />
        <input placeholder="Description" onChange={(e)=>setDescription(e.target.value)} value={description} className="form-control" type="text" />
        <button className="btn btn-dark" onClick={handleSubmit}>submit</button>
    </div>
    {error && <p className='text-Danger'>{error}</p>}
    </div>
    <div className="row mt-3">
        <h3>Task</h3>
        <div className="col-md-6">

        <ul className="list-group">
           { 
           todos.map((item) => <li className="list-group-item bg-warning d-flex justify-content-between align-items-center my-2">
           <div className='d-flex flex-column me-2'>
            {
                 editId == -1 || editId !==  item._id ? <>
                  <span className='fw-bold'> {item.title }</span>
                  <span > {item.description }</span>
                </> : <>
                <div className='form-group d-flex gap-2'>
                <input placeholder="Title" onChange={(e)=> setEditTitle(e.target.value)} value={editTitle}className="form-control" type="text" />
                <input placeholder="Description" onChange={(e)=>setEditDescription(e.target.value)} value={editdescription} className="form-control" type="text" />
                </div>
                </>
            }
         
           </div>
           <div className="d-flex gap-2">
                        { editId == -1 ?<button className="btn btn-warning" onClick={() => handleEdit(item)} >Edit</button>:<button className="btn btn-warning" onClick={handleUpdate} >Update</button>}
                        { editId == -1 ? <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button> :
                        <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button> }
                    </div>
                </li>
          ) }
           
        </ul>
    </div>
    </div>
    </>
  }