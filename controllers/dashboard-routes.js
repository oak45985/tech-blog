const router = require('express').Router();
const sequelize = require('../config/connection');
const { Entry, User, Observation } = require('../models');
const checkAuth = require('../utils/auth');

router.get('/', checkAuth, (req, res) => {
    Entry.findAll({
        where: {
            user_id: req.session.user_id
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
                attributes: ['id', 'observation_text', 'user_id', 'entry_id'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username',]
            }
        ]
    })
    .then(dbEntryData => {
        const entries = dbEntryData.map(entry => entry.get({ plain: true }));
        res.render('dashboard', {
            entries,
            loggedIn: true
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/update/:id', checkAuth, (req, res) => {
    Entry.findByPk(req.params.id, {
        attributes: [ 'id', 'entry_url', 'title', 'entry_text', 'created_at'],
        include: [
            {
                model: Observation,
                attributes: ['id', 'observation_text', 'entry_id', 'user_id', 'created_at'],
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
        if (dbEntryData) {
            const entry = dbEntryData.get({ plain: true });

            res.render('update-entry', {
                entry,
                loggedIn: true
            });
        } else {
            res.status(404).end();
        }
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

module.exports = router;