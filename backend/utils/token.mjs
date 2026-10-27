import jwt from 'jsonwebtoken';

const MASA_BERLAKU = '7d';

export const buatToken = (user) =>
    jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: MASA_BERLAKU,
    });

export const bacaToken = (token) =>
    jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });