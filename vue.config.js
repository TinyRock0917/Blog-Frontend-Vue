module.exports = {

    css: {
        loaderOptions: {
            sass: {
                data: `
                    @import "@/scss/_main.scss";
                `
            }
        }
    },

    devServer: {
        host: '0.0.0.0',
        port: 3007,
        hot: true,
        disableHostCheck: true
    },

    pwa: {
        themeColor: '#673AB7',
        msTileColor: '#F5F6FA',
        manifestPath: 'manifest.json',
        workboxPluginMode: 'GenerateSW'
    }

};
