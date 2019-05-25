import mongoose from 'mongoose';

export interface LocalUser {
    _id: string;
    username: string;
    password: string;
}

export const LocalUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});
export const LocalUserModel = mongoose.model('LocalUser', LocalUserSchema);
