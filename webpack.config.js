const config = {
    entry: {
        background: './src/background.js'
    },
    mode: 'production',
    output: {
        filename: '[name].js',
        path: __dirname + '/dist'
    }
};

module.exports = config;
