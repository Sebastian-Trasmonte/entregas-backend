import {
    Router
} from "express";
import UserController from "../controllers/userController.js";
import { errorsEnum } from "../helpers/errorsEnum.js";
import { uploader } from "../helpers/utils.js";
import { addMulterRoute } from "../middlewares/multer.js";
import {auth} from "../middlewares/auth.js";


const router = Router();
const userController = new UserController();

router.get("/premium/:uid", async (req, res) => {
    try {
       
        const uid = req.params.uid;
        let roleUpdated = await userController.changeUserRol(uid);
        if (roleUpdated == errorsEnum.USER_NOT_HAS_DOCUMENTS) {
            res.status(400).send({
                message: "El usuario no tiene documentos",
                status: "error"
            });
            return;
        }
        
        if (uid == req.session.user.id) {
            req.session.user.role = roleUpdated;
        } 
      
        res.status(200).send({
            message: "Rol actualizado de usuario",
            status: "success",
            data: roleUpdated
        });
    } catch (e) {
        res.status(400).send({
            message: e.message,
            status: "error"
        });
    }
});

router.post('/:uid/documents',auth,addMulterRoute('users'), uploader.array('files', 3), async (req, res) => {
    const files = req.files;
    const uid = req.params.uid;
    try {
        if (!files) {
            throw new Error("Documents not found");
        }
        await userController.addDocumentToUser(uid,files);
        res.status(200).send({
            message: "Documento subido",
            status: "success"
        });
    } catch (e) {
        res.status(400).send({
            message: e.message,
            status: "error"
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await userController.getAllUsers();
        res.status(200).send(users);
    } catch (e) {
        res.status(400).send({
            message: e.message,
            status: "error"
        });
    }
});

router.delete('/', async (req, res) => {
    try {
        await userController.deleteInactiveUsers();
        res.status(200).send({
            message: "Usuarios eliminados con inactividad",
            status: "success"
        });
    } catch (e) {
        res.status(400).send({
            message: e.message,
            status: "error"
        });
    }
});

router.delete('/:uid', async (req, res) => {
    try {
        const uid = req.params.uid;
        await userController.deleteUserById(uid);
        res.status(200).send({
            message: "Usuario eliminado",
            status: "success"
        });
    } catch (e) {
        res.status(400).send({
            message: e.message,
            status: "error"
        });
    }
});

export default router;