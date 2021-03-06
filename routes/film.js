const router = require('express').Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//model
const Film = require('../model/Film');
const { route } = require('./user');

router.get('/', async (req, res) => {
    // pagination ( test -> Postman: localhost:8000/api/user?page=2&limit=3 )
    const page = parseInt(req.query.page || 1) 
    const limit = parseInt(req.query.limit || 10)
    const startOffset = (page -1) * limit
    // page = 1 -> (1-1) * 10 -> 0
    // page = 2 (2-1) * 10 -> 10

    const endOffset = startOffset + limit
    // page = 1 -> 0 + 10 => 10
    // page = 2 -> 10 + 10 => 20

    try {
        const films = await Film.find().sort({data: -1});
        const total = films.length
        const result = {
            data: films,
            page,
            limit,
            total,
            isSuccess: true
        }
        if (total===0) return res.status(200).json(result)
        result.data = films.slice(startOffset, endOffset)
        // page = 1 -> users.slice(0,10)
        // page = 2 -> users.slice(10, 20)
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({
            msg: 'Server Error',
            isSuccess: false
        })
    }
})

// @eoute POST api/film/create
// @desc Create film
// @access Public
router.post('/film/create', async(req,res) => {
    const title = req.body.title || '';
    const yearRelease = req.body.yearRelease || '';
    const cast = req.body.cast || '';
    const image = req.body.image || '';
    const description = req.body.description || '';

    // check film exist
    const isFilmExist = await Film.findOne({ title });
    if (isFilmExist) {
        return res.status(400).json({
            msg: 'Film already exists',
            isSuccess: false
        })
    }

    // create a new film
    const film = new Film({
        title,
        yearRelease,
        cast,
        image,
        description
    })
    try {
        await film.save();
        res.json({
            msg: 'Create successfully',
            isSuccess: true
        })
    } catch(err) {
        res.status(500).json({
            msg: err,
            isSuccess: false
        })
    }
})

module.exports = router;