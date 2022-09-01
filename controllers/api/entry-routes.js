const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Entry, User, Observation } = require('../../models');
const checkAuth = require('../../utils/auth');

//GET ALL ENTRIES
router.get('/', (req, res) => {
    Entry.findAll({
        order: [['created_at', 'DESC']],
        attributes: [
            'id',
            'entry_url',
            'title',
            'created_at',
        ],
        order: [['created_at', 'DESC']],
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
    .then(dbEntryData => res.json(dbEntryData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//GET ONE ENTRY
router.get('/:id', (req, res) => {
    Entry.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'entry_url',
            'title',
            'created_at'
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbEntryData => {
        if (!dbEntryData) {
            res.status(404).json({ message: 'No entry found with ID' });
            return;
        }
        res.json(dbEntryData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//CREATE ENTRY
router.post('/', checkAuth, (req, res) => {
    Entry.create({
        title: req.body.title,
        entry_url: req.body.entry_url,
        user_id: req.session.user_id
    })
    .then(dbEntryData => res.json(dbEntryData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//UPDATE ENTRY
router.put('/:id', checkAuth, (req, res) => {
    Entry.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbEntryData => {
        if (!dbEntryData) {
            res.status(404).json({ message: "No entry found with ID" });
            return;
        }
        res.json(dbEntryData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//DELETE ENTRY
router.delete('/:id', checkAuth, (req, res) => {
    Entry.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbEntryData => {
        if (!dbEntryData) {
            res.status(404).json({ message: "No entry with this ID" });
            return;
        }
        res.json(dbEntryData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;