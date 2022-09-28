const router = require('express').Router();
const sequelize = require('../config/connection');
const { Entry, User, Observation } = require('../models');

router.get('/', (req, res) => {
    Entry.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'entry_url',
            'title',
            'entry_text'
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

module.exports = router;