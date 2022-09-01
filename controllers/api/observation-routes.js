const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Entry, User, Observation } = require('../../models');
const checkAuth = require('../../utils/auth');

//GET ALL OBSERVATIONS
router.get('/', (req, res) => {
    Observation.findAll({
        order: [['created_at', 'DESC']],
        attributes: [
            'id',
            'observation_text'
        ],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['id', 'username']
            },
            {
                model: Entry,
                attributes: ['id', 'title', 'entry_url']
            }
        ]
    })
    .then(dbObsData => res.json(dbObsData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//CREATE OBSERVATION
router.post('/', checkAuth, (req, res) => {
    if(req.session) {
        Observation.create({
            observation_text: req.body.observation_text,
            entry_id: req.body.entry_id,
            user_id: req.session.user_id
        })
        .then(dbObsData => res.json(dbObsData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    }
});

//DELETE OBSERVATION
router.delete('/:id', checkAuth, (req, res) => {
    Observation.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbObsData => {
        if (!dbObsData) {
            res.status(404).json({ message: 'No observation with this ID' });
            return;
        }
        res.json(dbObsData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    }) 
});

module.exports = router;