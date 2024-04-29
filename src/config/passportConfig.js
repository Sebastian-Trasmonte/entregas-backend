import passport from "passport";
import local from "passport-local";

import userModel from  "../dao/models/userModel.js";
import {
    createHash,
    isValidPassword
} from "../helpers/utils.js";

const localStrategy = local.Strategy;
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
                    password: createHash(password),
                    role: "user"
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
             
                const user = await userModel.findOne({
                    email: username
                });
              
                if (!user) {
                    return done(null, false, {
                        message: "User not found"
                    });
                }
             
                if (!isValidPassword(user,password)) {
                    return done(null, false, {
                        message: "Invalid password"
                    });
                }
                return done(null, user);
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
}

export default inicializatePassport;