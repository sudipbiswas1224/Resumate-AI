import 'dotenv/config'
import app from './src/app.js';
import connectoDB from './src/configs/db.js';

connectoDB();


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})