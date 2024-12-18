
// using express

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors =require('cors')


app.use(express.json())  // middle ware 
app.use(cors())


// app.get ('/', (req,res) =>{
//     res.send('hello world')
// })

//  sample in memory storage for item 
//let todos = [];

// connecting mongodb 
const connectToDatabase = async () => {
   try {
       await mongoose.connect('mongodb+srv://tamilnilavan192:1234@cluster0.veic7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/mern-app');
       console.log('Connected to database');
   } catch (err) {
       console.error('Error connecting to database:', err);
   }
};

// Call the function to connect to the database
connectToDatabase();

// creating schema 

const todoSchema = new mongoose.Schema({    
   title: {required: true,
   type: String},
   description: {required: true,
      type: String
   }
})

// creating model 

const todomodel = mongoose.model('Todo', todoSchema) 

// create a new todo item
   app.post('/todos', async (req,res)=>{
    const {title, description} = req.body;
   //  const newTodo = {
   //      id: todos.length +1,   //increment the id 
   //      title,
   //      description
   //  };
   //  todos.push(newTodo);
   //  console.log(todos);
   try{
      const newTodo = new todomodel({title, description});
       await newTodo.save();
      res.status(201).json(newTodo);
   } catch (error){
      console.log( error);
      res.status(500).json({message:error});

      
   }
   

   })

   // get all item 

   app.get('/todos', async (req, res) => {
      try {
          const todos = await todomodel.find();
          if (todos.length === 0) {
              return res.status(200).json({ message: "No tasks available" });
          }
          res.json(todos);
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: error.message });
      }
  });
  

   // update a todo item 

   app.put("/todos/:id", async (req, res) => {
      try {
      const {title, description} = req.body;
     const id = req.params.id;
     const updatedTodo = await todomodel.findByIdAndUpdate(
         id,
         {title, description},
         {new: true}
     )

     if (!updatedTodo) {
         return res.status(404).json({ message: "todo not found"})
     }
     res.json(updatedTodo)
     
   } catch (error) {
      console.log(error)
         res.status(500).json({message:error.message});
   }
   })

   //delete
    app.delete('/todos/:id', async (req,res) =>{
      try{
         const id = req.params.id;
          await todomodel.findByIdAndDelete(id);
         res.status(204).end();
      }catch (error) {
         console.log(error)
         res.status(500).json({message:error.message});
      }
    })
    
// start the server

  const port = 8000;
 app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
 })