import {Router} from 'express'; 
import {createclient, getclients} from '../controllers/clientes.controller';
const router = Router();
router.get('/clients',getclients);
export default router;