const config = {
    entry: {
        background: './src/background.js'
    },
    devtool: 'inline-source-map',
    output: {
        filename: '[name].js',
        path: __dirname + '/dist'
    }
};

module.exports = config;
