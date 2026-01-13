import jwt from 'jsonwebtoken'

const protect = async (req, res, next) => {
    // get token
    const token = req.headers.authorization;
    // check if token is present or not 
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        req.userId = userId;
        next();
    } catch (error) {
        return res.status(401).json({
            message : "Unauthorized"
        })
    }
}

export default protect;