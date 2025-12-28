import mongoose, { MongooseError } from "mongoose";

const connectoDB = async ()=>{
    try {

        let mongoUri = process.env.MONGO_URI;
        const projectName = 'AI_RESUME_BUILDER';
        if(!mongoUri) throw new Error("MONGO_URI environment is not set");

        //check if mongo uri endswith / or not
        if(mongoUri.endsWith('/')){
            mongoUri = mongoUri.slice(0, -1);
        }

        //connect to mongouri
        await mongoose.connect(`${mongoUri}/${projectName}`);
        console.log('Mongodb connected✅')

    } catch (error) {
        console.log('Error in conncting MongoDB:',error);
    }
}

export default connectoDB;