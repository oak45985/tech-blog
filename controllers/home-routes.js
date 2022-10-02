const router = require('express').Router();
const sequelize = require('../config/connection');
const { Entry, User, Observation } = require('../models');

router.get('/', (req, res) => {
    Entry.findAll({
        attributes: [
            'id',
            'entry_url',
            'title',
            'entry_text'
        ],
        include: [
            {
                model: Observation,
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
        const entries = dbEntryData.map(entry => entry.get({ plain: true }));
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

router.get('/entry/:id', (req, res) => {
    Entry.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'title',
            'entry_url',
            'entry_text'
        ],
        include: [
            {
                model: Observation,
                attributes: ['id', 'observation_text', 'user_id', 'entry_id', 'created_at'],
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
        if (!dbEntryData) {
            res.status(404).json({ message: "No blog entry with this id" });
            return;
        }
        const entry = dbEntryData.get({ plain: true });

        res.render('single-entry', {
            entry,
            loggedIn: req.session.loggedIn
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;