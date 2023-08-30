const adminRoutes = require('./admin')
const balancesRoutes = require('./balances')
const contractsRoutes = require('./contracts')
const jobsRoutes = require('./jobs')

const apiUrl = '/api/v1'
const routes = (app) => {
    app.use(apiUrl, adminRoutes)
    app.use(apiUrl, balancesRoutes)
    app.use(apiUrl, contractsRoutes)
    app.use(apiUrl, jobsRoutes)
}

module.exports = {
    routes,
}