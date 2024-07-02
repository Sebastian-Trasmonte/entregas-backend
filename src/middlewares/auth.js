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
    if (req.session.user.role !== "admin") {
        return res.status(401).send({
            error: 'Unauthorized'
        });
    }
    return next();
}

export const user = function (req, res, next) {

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }
    if (req.session.user.role !== "user") {
        return res.status(401).send({
            error: 'Unauthorized'
        });
    }
    return next();
}

export const premium = function (req, res, next) {

    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }
    if (req.session.user.role !== "premium") {
        return res.status(401).send({
            error: 'Unauthorized'
        });
    }
    return next();
}

export const premiumOrAdmin = function (req, res, next) {
    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }
    if (req.session.user.role !== "premium" && req.session.user.role !== "admin") {
        return res.status(401).send({
            error: 'Unauthorized'
        });
    }
    return next();
}