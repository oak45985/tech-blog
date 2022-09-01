const router = require('express').Router();
const userRoutes = require('./user-routes');
const entryRoutes = require('./entry-routes');
const obserRoutes = require('./observation-routes');

router.use('/users', userRoutes);
router.use('/entries', entryRoutes);
router.use('/observations', obserRoutes);

module.exports = router;