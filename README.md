# REST OAuth 3rd Party

## Setup

```
npm install -g bower
npm install
bower install
```

## Running

```
npm start
```

## Project Structure

```
.
├── README.md
├── app.js
├── config
│   └── config.json
├── controllers
│   ├── authController.js
│   ├── dashboardController.js
│   ├── indexController.js
│   ├── loginController.js
│   ├── logoutController.js
│   └── userController.js
├── helper
│   └── middleware.js
├── models
│   └── user.js
├── package.json
├── public
│   └── stylesheet
├── routes
│   ├── auth.js
│   ├── dashboard.js
│   ├── index.js
│   ├── login.js
│   ├── logout.js
│   ├── providers.js
│   └── signup.js
└── views
    ├── home.pug
    ├── index.pug
    ├── layout.pug
    ├── login.pug
    ├── profile.pug
    ├── signup.pug
    └── temp.pug

```

| Routes | HTTP | Description |
|-----|----------|------------|
| http://localhost:3000/ | GET | show menu |
| http://localhost:3000/login | GET | show form login |
| http://localhost:3000/login | POST | process form login |
| http://localhost:3000/signup | GET | show form signup |
| http://localhost:3000/signup/add | POST | process form signup |
| http://localhost:3000/dashboard | GET | show dashboard user |
| http://localhost:3000/auth/facebook | GET | get auth access from facebook |
| http://localhost:3000/auth/facebook | POST | process auth access from facebook |
| http://localhost:3000/auth/facebook//callback | GET | get callback auth access from facebook and return to dashboard |
| http://localhost:3000/auth/twitter | GET | get auth access from twitter |
| http://localhost:3000/auth/twitter | POST | process auth access from twitter |
| http://localhost:3000/auth/twitter//callback | GET | get callback auth access from twitter and return to dashboard |
| http://localhost:3000/auth/google | GET | get auth access from google |
| http://localhost:3000/auth/google | POST | process auth access from google |
| http://localhost:3000/auth/google//callback | GET | get callback auth access from google and return to dashboard |

## Contributor
Ken Duigraha Putra & Bagus Juang Wiantoro

## License
MIT
