const router = require('express').Router();
const sequelize = require('../config/connection');
const { Entry, User, Observation } = require('../models');

router.get('/', (req, res) => {
    console.log(req.session);
    Entry.findAll({
        attributes: [

        ],
        include: [
            {
                Model: Observation,
                attributes: ['id', 'observation_text', 'user_id', 'entry_id'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbEntryData => {
        const entries = dbEntryData.map(entry = entry.get({ plain: true }));
        res.render('homepage', {
            entries,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

module.exports = router;