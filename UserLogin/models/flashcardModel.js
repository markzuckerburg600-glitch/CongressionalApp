import mongoose from "mongoose"

const Schema = mongoose.Schema

const flashcardSchema = new Schema({
    word: {
        type: String,
        required: true
    },
    definition: {
        type: String,
        required: true
    }
})

const outModel = mongoose.model("FlashcardModel", flashcardSchema)

export default outModel