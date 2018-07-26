# Introduction

A web application to help students sell and purchase books from college pears. It allows posting ads
and filter them according to the distance of the seller's college.

This is a prototype and hence, not suitable for hosting.

![screenshot](https://i.imgur.com/4oBh7GG.png)

# Installing

- Go to `config/` and create a file with the name `dev.js`. Paste the following code in the file:

```
module.exports = {
  google: {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET
  },
  facebook: {
    appID: FACEBOOK_APP_ID,
    appSecret: FACEBOOK_APP_SECRET
  },
  mongoURI: MONGO_URI,
  cookieKey: COOKIE_KEY
}
```

- Replace GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET with client ID and secret you receive from Google Developers console.

- Replace FACEBOOK_APP_ID and FACEBOOK_APP_SECRET with app ID and secret you receive from Facebook.

- Replace MONGO_URI with your local or remote mongoDB uri.

- Replace COOKIE_KEY with a random string.

- Run by typing `npm start`.
