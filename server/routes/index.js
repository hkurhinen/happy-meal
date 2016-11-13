var auth = require('../auth');
var request = require('request');
var Device = require('../model/device');
var Role = auth.Role;

module.exports = (app, passport) => {

  app.get('/', auth.authenticate([Role.ADMIN, Role.USER]), (req, res) => {
    res.render('index', {title: 'Happy Meal', user: req.user, role: Role});
  });

  app.post('/device', auth.authenticate([Role.ADMIN]), (req, res) => {
    var deviceId = req.body.deviceId;
    var deviceName = req.body.deviceName;
    var device = new Device();
    device.deviceId = deviceId;
    device.name = deviceName;
    device.save((err, device) => {
      if(err) {
        res.status(502).send(err);
      } else {
        res.send(device);
      }
    });
  });

  app.post('/device/:id', auth.authenticate([Role.ADMIN]), (req, res) => {
    var id = req.params.id;
    Device.findById(id, (err, device) => {
      if(err) {
        res.status(500).send(err);
      } else {
        if(!device) {
          res.status(404).send();
        } else {
          var food = {
            name: req.body.name.en,
            energy: req.body.energyKcal,
            protein: req.body.protein,
            fat: req.body.fat,
            alcohol: req.body.alcohol,
            organicAcids: req.body.organicAcids,
            sugarAlcohol: req.body.sugarAlcohol,
            saturatedFat: req.body.saturatedFat,
            fiber: req.body.fiber,
            sugar: req.body.sugar,
            carbohydrate: req.body.carbohydrate,
            salt: req.body.salt
          }
          device.food = food;
          device.save((err, device) => {
            if(err) {
              res.status(500).send(err);
            } else {
              res.send(device);
            }
          });
        }
      }
    })
  });

  app.get('/login', (req, res) => {
    res.render('login', { title: 'Login', message: req.flash('message') });
  });

  app.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/register', (req, res) => {
    res.render('register', { title: 'Register', message: req.flash('message') });
  });

  app.post('/register', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: true
  }));

  app.get('/system', auth.authenticate([Role.ADMIN]), (req, res) => {
    Device.find({}, (err, devices) => {
      if(err) {
        res.status(500).send(err);
      } else {
        res.render('system', {title: 'System settings', user: req.user, role: Role, devices: devices});
      }
    });
  });

  app.get('/foods/:query', (req, res) => {
    var query = req.params.query;
    request('https://fineli.fi/fineli/api/v1/any?lang=fi&q='+query, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(body);
      } else {
        res.send([]);
      }
    })
  });

  app.get('/food/:deviceId', (req, res) => {
    var deviceId = req.params.deviceId;
    Device.find({deviceId: deviceId}, (err, devices) => {
      if (err) {
        res.status(500).send(err);
      } else {
        if(!devices.length) {
          res.status(404).send();
        } else {
          var device = devices[0];
          res.render('device-idle', {device: device});
        }
      }
    })
  });

}