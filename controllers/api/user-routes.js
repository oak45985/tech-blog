const router = require('express').Router();
const { User, Entry, Observation } = require('../../models');
const checkAuth = require('../../utils/auth');

//GET ALL USERS
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password']}
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})

//GET ONE USER
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Entry,
                attributes: ['id', 'title', 'entry_url', 'created_at']
            },
            {
                model: Observation,
                attributes: ['id', 'observation_text', 'created_at'],
                include: {
                    model: Entry,
                    attributes: ['title']
                }
            }
        ]
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({ message: "No user found with ID" });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//POST NEW USER
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbNewUser => {
        req.session.save(() => {
            req.session.user_id = dbNewUser.id;
            req.session.username = dbNewUser.name;
            req.session.loggedIn = true;

            res.json(dbNewUser);
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if(!dbUserData) {
            res.status(400).json({ message: 'No user with this email' });
            return;
        }
        const goodPw = dbUserData.checkPw(req.body.password);
        if(!goodPw) {
            res.status(400).json({ message: 'Password incorrect' });
            return;
        }
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: "User logged in" });
        });
    });
});

router.put('/:id', (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUserUpdate => {
        if(!dbUserUpdate[0]) {
            res.status(404).json({ message: 'No user with this ID' });
            return;
        }
        res.json(dbUserUpdate);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//DELETE ONE USER
router.delete('/:id', checkAuth, (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user with this ID' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//USER LOG OUT
router.post('/logout', checkAuth, (req, res) => {
    if(req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;