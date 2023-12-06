module.exports = {
    apps: [{
        name: 'bkmrkd-app',
        script: 'nodemon server.js',
        watch: '.',
        env: {
            'NODE_ENV': 'development'
        }
    }],
}