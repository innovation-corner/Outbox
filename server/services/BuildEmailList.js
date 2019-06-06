const 
  request = require('request');

module.exports = {
    buildEmailList(user) {
      return new Promise((resolve, reject) => {
        const options = {
          url: process.env.MAILCHIMP_URL,
          method: 'POST',
          headers: {
            'Authorization': `agroversity ${process.env.MAILCHIMP_KEY}`,
            'Content-Type': 'application/json'
          },
          json: {
            'email_address': user.email, 
            'status': 'subscribed'
          }
        };

        request(options, (error, response, body) => {
          if(error) {
            reject(error)
          }else {
            resolve(response, body)
          }
        })
      });
    }
}; 
