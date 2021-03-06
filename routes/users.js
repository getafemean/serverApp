const express = require('express');
const { tokenVerification } = require('../middleware/tokenverification');
const app = express();
const { ErrorHandler } = require('../helpers/errors');

const path = require('path');
const User = require('../models/user');
const { getUser, getUsers, updateUserRole, updateUser } = require('../services/users');
const jwt = require('jsonwebtoken');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../avatars/'))
    },
    filename: (req, file, cb) => {
        cb(null, req.body.image)
    }
})

const upload = multer({storage: storage});

app.get('/', tokenVerification, async (req, res, next) => {
    try {
        const users = await getUsers();
        res.status(200).json({
            users
        })
    } catch(err) {
        return next(err);
    }
})

app.get('/:_id', tokenVerification, async (req, res, next) => {
    try {
        if(req.params._id === undefined) {
            throw new ErrorHandler(404, '_id param mandatory');
        }
        const user = await getUser(req.params._id);
        res.status(200).json({
            user
        })
    } catch (err) {
        return next(err);
    }
})

app.post('/avatar', tokenVerification, upload.single('file'), async (req, res, next) => {
    try {
        let userSaved = await updateUser(req.file.filename.substring(0, 24), {avatarFileName: req.file.filename})
        const token = jwt.sign({
                _id: userSaved._id,
                name: userSaved.name,
                role: userSaved.role,
                avatarFileName: userSaved.avatarFileName
            }, 'dhgjshgdj', {expiresIn: 30 * 60})
        res.cookie('token', token, {httpOnly: true, secure: true, sameSite: 'none', maxAge: 30 * 60 * 1000 });
        res.status(200).json({
            message: 'La imagen fue actualizada correctamente',
            userSaved
        })
    } catch(err) {
        return next(err);
    }
})

app.put('/role/:_id', tokenVerification, async (req, res, next) => {
    try {
        if(req.params._id === undefined) {
            throw new ErrorHandler(404, '_id param mandatory');
        }
        if(req.body.role === undefined) {
            throw new ErrorHandler(404, 'role field mandatory');
        }
        const userUpdated = await updateUserRole(req.params._id, req.body.role);
        res.status(200).json({
            message: 'El usuario fue actualizado',
            userUpdated
        })
    } catch (err) {
        return next(err);
    }
})

app.put('/:_id', tokenVerification, async (req, res, next) => {
    try {
        if(req.params._id === undefined) {
            throw new ErrorHandler(404, '_id param mandatory');
        }
        if(req.body.email !== undefined ||
           req.body.password !== undefined ||
           req.body.role !== undefined) {
              throw new ErrorHandler(404, 'Email, password and role can\'t be updated');
        }
        const userUpdated = await updateUser(req.params._id, req.body);
        res.status(200).json({
            message: 'El usuario fue actualizado correctamente',
            userUpdated
        })
    } catch(err) {
        return next(err);
    }
})

module.exports = app;