import jwt from 'jsonwebtoken';

export const verifyToken = (token) => {
    if (!token) {
        throw new Error('No token provided');
    }

    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                reject('Unauthorized!');
            } else {
                resolve(decoded);
            }
        });
    });
};