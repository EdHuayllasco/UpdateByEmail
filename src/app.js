import express from 'express';
import { verifyToken } from '../src/verifytoken';
import config from './config';
import { getUserFromDatabase, updateUserInDatabase } from '../src/database/connection';
import jwt from 'jsonwebtoken';
import clientsRoutes from './routes/clients.routes';
const bodyParser = require('body-parser');


const app = express();
app.set('view engine', 'ejs');
app.set('port', config.port);
app.use(bodyParser.json());
app.use(clientsRoutes);

app.get('/user/:token', async (req, res) => {
    const token = req.params.token; 

    try {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Token inválido' });
                console.error(err);
            } else {
                const userID = decoded.id;
                const result = await getUserFromDatabase(userID);
                res.render('index', { user: result });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});
app.put('/user/:token', async (req, res) => {
    const token = req.params.token;
    const updatedUser = req.body;
    
    try {
        const decoded = await verifyToken(token);
        const userId = decoded.id;
        const user = await updateUserInDatabase(userId, updatedUser);
        if(user){
            res.status(200).send({ message: 'User updated successfully' });
        }else{
            res.status(400).send({ message: 'User not updated' });
        }
    } catch (err) {
        res.status(401).send({ message: 'Unauthorized! Invalid token' });
    }
});
export default app;