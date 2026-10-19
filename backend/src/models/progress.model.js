import mongoose ,{Schema }from "mongoose";


const progressSchema =new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        video: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "video",
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        },
        completionDate: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

export const Progress = mongoose.model("Progress", progressSchema);
