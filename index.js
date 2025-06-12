import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db=new pg.Client({
user: "postgres",
host: "localhost",
database:"permalist", 
password:"domadb11223344_", 
port:5432,
});

db.connect();


let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/",async (req, res) => {

  //query to select by order ascending
  const result=await db.query("SELECT * FROM items ORDER BY id ASC")
  items=result.rows;

  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async(req, res) => {
    // items.push({ title: item });
  const item = req.body.newItem;

  //insert  into the items table
  try{
      await db.query("INSERT INTO items(title) VALUES ($1)",
    [item]);
  
  res.redirect("/");
  }
  catch(err){
    console.log("There was an error executing your query:- " , err.stack);
  }
});

app.post("/edit", async(req, res) => {
const id=req.body.updatedItemId;
const title=req.body.updatedItemTitle;


//sql query to update
try{
await db.query("UPDATE items SET title=($1) WHERE id=$2",
   [title,id] )
res.redirect("/")

}
catch(err){
  console.log("Error updating the data: " , err.stack);
}
});



app.post("/delete",async (req, res) => {
  const itemId=req.body.deleteItemId;


  //sql query to delete from the table
  try{
    await db.query("DELETE FROM items WHERE id=$1", [itemId]);
    res.redirect("/");
  }
  catch(err){
    console.log("There was an error deleting your task:- ", err.stack)
  }





});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
