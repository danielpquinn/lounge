module.exports = {
  host: 'localhost',
  port: 3000,
  protocol: 'http',
  email: 'user@gmail.com',
  emailTransport: {
    service: 'Gmail',
    auth: {
      user: 'user@gmail.com',
      pass: 'secretpassword'
    }
  },
  siteName: 'My Site',
  mongoUrl: 'mongodb://localhost/dbname'
};