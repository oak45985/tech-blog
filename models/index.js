const User = require('./User');
const Entry = require('./Entry');
const Observation = require('./Observation');

User.hasMany(Entry, {
    foreignKey: 'user_id'
});

Entry.belongsTo(User, {
    foreignKey: 'user_id'
});

Observation.belongsTo(User, {
    foreignKey: 'user_id'
});

Observation.belongsTo(Entry, {
    foreignKey: 'entry_id'
});

User.hasMany(Observation, {
    foreignKey: 'user_id'
});

Entry.hasMany(Observation, {
    foreignKey: 'entry_id'
});

module.exports = { User, Entry, Observation }