"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleLogin = exports.updateLoginInfos = exports.login = exports.signup = void 0;
const user_model_1 = __importStar(require("../models/user.model"));
const utils_1 = require("../controllers/utils");
const utils_2 = require("./utils");
const async_middleware_1 = __importDefault(require("../middlewares/async.middleware"));
exports.signup = (0, async_middleware_1.default)(async (req, res) => {
    const errors = (0, user_model_1.validateCreateUser)(req.body);
    if (errors.length)
        return res.status(400).send({ errors: errors });
    const existUser = await user_model_1.default.exists({ username: req.body.username });
    if (existUser)
        return res.status(400).send({ message: "username exists" });
    req.body.password = (0, utils_1.hashPassword)(req.body.password);
    const user = await user_model_1.default.create(req.body);
    res.send({ token: (0, utils_1.makeToken)({ _id: user._id }) });
});
exports.login = (0, async_middleware_1.default)(async (req, res) => {
    const errors = (0, user_model_1.validateAuthUser)(req.body);
    if (errors.length)
        return res.status(400).send({ errors: errors });
    const user = await user_model_1.default.findOne({ username: req.body.username });
    if (!user)
        return res.status(400).send({ message: "User not found." });
    if (!(0, utils_1.validatePassword)(req.body.password, user.password))
        return res.status(400).send({ message: "Invalid password" });
    res.status(201).send({ token: (0, utils_1.makeToken)({ _id: user._id }) });
});
exports.updateLoginInfos = (0, async_middleware_1.default)(async (req, res) => {
    const errors = (0, user_model_1.validateUpdateLoginInfosData)(req.body.data);
    if (errors.length)
        return res.status(400).send({ errors: errors });
    const newPassword = req.body.data.newPassword;
    const newUsername = req.body.data.newUsername;
    const oldPassword = req.body.data.oldPassword;
    if (newPassword && (newPassword.length < 5 || newPassword.length > 30))
        return res
            .status(400)
            .send({ message: "Password Length should be between 5 and 30" });
    if (newUsername && (newUsername.length < 5 || newUsername.length > 30))
        return res
            .status(400)
            .send({ message: "User name Length should be between 5 and 30" });
    if (!newPassword && !newUsername)
        return (0, utils_2.sendBadRequestResponse)("You Should update at least one field", res);
    const me = await user_model_1.default.findById(req.body.user._id);
    if (!me)
        return res.status(505).send({ message: "Something Went Wrong" });
    if (me.authType !== "normal")
        return res.status(400).send({ message: "Invalid Operation" });
    if (!(0, utils_1.validatePassword)(oldPassword, me.password))
        return (0, utils_2.sendBadRequestResponse)("Old password is incorrect", res);
    if (newPassword)
        me.password = (0, utils_1.hashPassword)(newPassword);
    if (newUsername)
        me.username = newUsername;
    await me.save();
    res.send();
});
exports.googleLogin = (0, async_middleware_1.default)(async (req, res) => {
    const accessToken = req.body.accessToken;
    if (!accessToken)
        return res.status(400).send({ message: "Invalid Token" });
    const data = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token${accessToken}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    }).then((res) => res.json());
    const user = await user_model_1.default.findOne({ sub: data.sub });
    if (user)
        return res.send({ token: (0, utils_1.makeToken)({ _id: user._id }) });
    const newUser = await user_model_1.default.create({
        authType: "google",
        sub: data.sub,
        firstName: data.given_name,
        lastName: data.family_name,
    });
    res.send({ token: (0, utils_1.makeToken)({ _id: newUser._id }) });
});
