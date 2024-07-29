export const addMulterRoute = (route) => {
    return (req, res, next) => {
        req.multerRoute = route;
        next();
    };
};