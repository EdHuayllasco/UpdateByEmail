import { getConnection } from "../database/connection.js";
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    logger: true,
    debug: true,
    secureConnection: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: true
    }
});
export const getclients = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM Clientes');

    const clientsWithTokens = result.recordset.map(client => {
        const token = jwt.sign({ id: client.ClienteID }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: client.Correo,
            subject: 'Actualizar datos',
            text: `Haz click en este enlace para actualizar tus datos http://localhost:3000/user/${token}`
        };
        transporter.sendMail(mailOptions);
        return { ...client, token };
    });

    res.json(clientsWithTokens);
};