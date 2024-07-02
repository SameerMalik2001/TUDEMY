import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
    {
        video_url: {
            type:String,  //cloudinary url
        },
        description: {
            type:String,
            required:true,
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseDraft",
            required:true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required:true
        },
        video_length: {
            type: String,
            default: "00:00"
        },
        section: {
            type: Number,
            required:true,
            default: 1
        },
        section_title:{
            type: String,
            required:true,
            default: ""
        },
        lecture:{
            type: Number,
            required:true,
            default: 1
        },
        lecture_title:{
            type: String,
            default: ""
        }
    },
    {
        timestamps: true,
    }
);

export const Vidoe = mongoose.model('Vidoe', videoSchema);
