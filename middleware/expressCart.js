const initializeExpressCart = (req, res, next) => {
    if (!req.session.expressCart) {
        req.session.expressCart = [];
    }
    next();
};

const destroyExpressCart = (req, res, next) => {
    req.session.expressCart = [];
    next();
};

app.use(initializeExpressCart);
