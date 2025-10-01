import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
    let token = req.headers.authorization
    
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'token has invalid format'
        });
    }
    token = token.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_for_development_only', (err, payload) => {
        if (err) {
            return res.status(401).json({
                message: 'Token is invalid'
            });
        }
        req.user = payload;
        next();
    });

}