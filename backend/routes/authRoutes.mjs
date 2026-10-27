import {Router} from "express";
import {daftar, masuk, profil} from '../controllers/authController.mjs';
import {wajibLogin} from '../middleware/authMiddleware.mjs';

const router = Router();

router.post('/register', daftar);
router.post('/login', masuk);
router.get('/me',wajibLogin, profil);

export default router;