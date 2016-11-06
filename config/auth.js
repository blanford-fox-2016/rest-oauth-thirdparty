//config to auth fb ,twitter, google with id or key
module.exports = {

    'facebookAuth' : {
        'clientID'        : '1793981720842185', // your App ID
        'clientSecret'    : '769279add4fb1ec29877a201bafcee43', // your App Secret
        'callbackURL'     : 'http://localhost:3000/auth/facebook/callback',
        'profileURL'      : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'

    },

    'twitterAuth' : {
        'consumerKey'        : 'uOxMpuYSDtKMEQv4Zf3xjVYj7',
        'consumerSecret'     : 'R2Ak10g03PqV8UweLwaQUIuglCZEkNT5s7hwE2SWaz58buZvhA',
        'callbackURL'        : 'http://localhost:3000/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'         : '1025941266446-olt5jfg237sntnc0o37a22jkqotnmga6.apps.googleusercontent.com',
        'clientSecret'     : 'd7ttpvs-HVPTD8JLLLyYm69m',
        'callbackURL'      : 'http://localhost:3000/auth/google/callback'
    }

};
