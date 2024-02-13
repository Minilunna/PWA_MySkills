module.exports = (app) => {
    app.use('/api/auth/', require('./auth.routes'));
    app.use('/api/skills/', require('./skills.routes'));
    app.use('/api/users/', require('./user.routes'));
}