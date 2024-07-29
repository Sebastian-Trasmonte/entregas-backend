import {
    Router
} from "express";
import UserController from "../controllers/userController.js";
import { errorsEnum } from "../helpers/errorsEnum.js";
import { uploader } from "../helpers/utils.js";
import { addMulterRoute } from "../middlewares/multer.js";


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
        req.session.user.role = roleUpdated;
        res.status(200).send({
            message: "Rol actualizado de usuario",
            status: "success"
        });
    } catch (e) {
        res.status(400).send({
            message: e.message,
            status: "error"
        });
    }
});

router.post('/:uid/documents',addMulterRoute('users'), uploader.array('files', 3), async (req, res) => {
    const files = req.files;
    const uid = req.params.uid;
    try {
        const email = req.session.user.email;
        if (!files) {
            throw new Error("Documents not found");
        }
        if (uid != req.session.user.id) {
            throw new Error("UserId not match with the current session");
        }       
        await userController.addDocumentToUser(email,files);
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

export default router;