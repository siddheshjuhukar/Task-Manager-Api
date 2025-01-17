const express = require('express')
const router = new express.Router
const Users = require('../models/Users')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeMail, sendCancellationemail } = require('../email/account')

router.post('/users', async (req, res) => {
    const user = new Users(
        req.body
    )

    try {
        await user.save()
        sendWelcomeMail(user.email, user.name)
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send()
    }
})

router.post('/users/login', async (req, res) => {

    try {
        const user = await Users.validateUserCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        req.user.save()
        res.send()
    } catch (e) {
        res.status(500).save()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
    
        req.user.tokens = []
        req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

const upload = multer({
    
    limits: {
        fileSize: 100000
    },
    fileFilter(req, file, callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            callback(new Error('File must be in pdf, jpg or jpeg format'))
        }
        callback(undefined, true)
    }
})

router.post('/users/profile/avatar', auth, upload.single('uploads'), async(req, res) => {
    
    try{
        const Buffer = await sharp(req.file.buffer).resize(width=300, height=300).png().toBuffer()
        req.user.avatar = Buffer
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})

router.get('/users/profile', auth, async (req, res) => {

    try{
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})

router.patch('/users/profile', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const validateUpdte = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if(!validateUpdte) {
        return res.status(400).send({ 'error': 'Invalid update parameter' })
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        
        res.send(req.user)
    } catch(error) {
        res.status(500).send()
    }
})

router.delete('/users/profile', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancellationemail(req.user.email, req.user.name)
        res.send(req.user)
    } catch(error) {
        res.status(500).send()
    }
})

router.delete('/users/profile/avatar', auth, async(req, res) => {
    try{
        if(req.user.avatar === undefined){
            return res.status(400).send()
        }

        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch(error) {
        res.status(500).send()
    }
})

router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await Users.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send()
    }
})

module.exports = router