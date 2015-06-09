module.exports = {
  ip: '1.1.1.1',
  host: 'localhost',
  port: 3000,
  protocol: 'http',
  email: 'user@gmail.com',
  emailTransport: {
    service: 'Gmail',
    auth: {
      user: 'user@gmail.com',
      pass: 'pass'
    }
  },
  siteName: 'Site',
  mongoUrl: 'mongodb://localhost/db'
};