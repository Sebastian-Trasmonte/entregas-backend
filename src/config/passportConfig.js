import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import config from "./config.js";
import userModel from  "../dao/models/userModel.js";
import {
    isSamePassword
} from "../helpers/utils.js";
import UserController from "../controllers/userController.js";


const localStrategy = local.Strategy;
const clientId = config.client_id;
const clientSecret = config.client_secret;
const userController = new UserController();

const inicializatePassport = () => {
    passport.use('register', new localStrategy({
            passReqToCallback: true,
            usernameField: 'email'
        },

        async (req, username, password, done) => {
            const {
                first_name,
                last_name,
                email,
                age
            } = req.body;

            try {
                let user = await userModel.findOne({
                    email: username
                });
                if (user) {
                    return done(null, false, {
                        message: "User already exists"
                    });
                }

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: password
                };

                const result = await userModel.create(newUser);
                return done(null, result);
            } catch (error) {
                return done(error.message);
            }
        }
    ));

    passport.use('login', new localStrategy({
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req,username, password, done) => {
            try {
               const user = userController.login(username, password, done);
               delete user.password;
               return user;
            } catch (error) {
                return done(error.message);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            done(error.message);
        }
    });

    passport.use(new GitHubStrategy({
            clientID: clientId,
            clientSecret: clientSecret,
            callbackURL: "http://localhost:8080/api/session/githubcallback"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await userModel.findOne({
                    email: profile._json.login
                });
                if (user) {
                    return done(null, user);
                }
                const newUser = {
                    first_name: profile._json.name,
                    email: profile._json.login
                };
                const result = await userModel.create(newUser);
                return done(null, result);
            } catch (error) {
                return done(error.message);
            }
        }
    ));
}

export default inicializatePassport;