const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const User = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});

const Todo = new Schema ({
    title : String,
    done : Boolean,
    userId : ObjectId
})

const UserModel = mongoose.model("users", User)
const TodoModel = mongoose.model("todos", Todo)

module.exports = {
    UserModel : UserModel,
    TodoModel : TodoModel
}