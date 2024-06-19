import winston from "winston";
import config from "../config/config.js";


//standars
// error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
const customLevels = {
    levels: {
        fatal :0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: "red",
        error: "red",
        warning: "yellow",
        info: "green",
        http: "blue",
        debug: "white",
    },
};

const devLogger = winston.createLogger({
    levels: customLevels.levels,
    format: winston.format.combine(
        winston.format.colorize({ colors: customLevels.colors}),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({
            level: "debug"
        }),
    ],
});

const prodLogger = winston.createLogger({
    levels: customLevels.levels,
    format: winston.format.combine(
        winston.format.colorize({ colors: customLevels.colors }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
            filename: "errors.log",
            level: "error"
        }),
        new winston.transports.Console({
            level: "http"
        }),
    ],
});

export const addLogger = (req, res, next) => {
    req.logger = getLogger(config.env_loggin);  
    req.logger.http(`${req.method} - ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
}

const getLogger = (env) => {
    return env === "devLogger" ? devLogger : prodLogger;
}

export const logger = getLogger(config.env_loggin);