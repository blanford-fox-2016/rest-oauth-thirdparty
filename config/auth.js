//config to auth fb ,twitter, google with id or key
module.exports = {

    'facebookAuth' : {
        'clientID'        : '1716146965371452', // your App ID
        'clientSecret'    : '1bc67bc42c6a48c41d27cb03be902425', // your App Secret
        'callbackURL'     : 'http://localhost:3000/auth/facebook/callback',
        'profileURL'      : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'

    },

    'twitterAuth' : {
        'consumerKey'        : 'uOxMpuYSDtKMEQv4Zf3xjVYj7',
        'consumerSecret'     : 'R2Ak10g03PqV8UweLwaQUIuglCZEkNT5s7hwE2SWaz58buZvhA',
        'callbackURL'        : 'http://localhost:3000/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'         : 'asdasd',
        'clientSecret'     : 'asdasdasd',
        'callbackURL'      : 'http://localhost:8080/auth/google/callback'
    }

};
