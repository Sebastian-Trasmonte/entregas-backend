export const auth = function (req, res, next) {
    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }
    return next();
}

export const admin = function (req, res, next) {
    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }
    if (req.session.user.role === "admin") {
        return res.status(401).send({ error: 'Unauthorized' });
    }
    return next();
}