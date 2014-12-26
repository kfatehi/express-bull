var redisModel = require('./redis_model')
  , getJobs = require('./get_jobs')(redisModel)

module.exports = function (config) {
  var router = config.router;
  var redisClient = config.redisClient;
  if (!router) throw new Error("Config must provide an express Router at key 'router'");
  if (!redisClient) throw new Error("Config must provide a redis client at key 'redisClient'");

  redisModel.setClient(redisClient)

  var states = [ 'active', 'wait', 'failed', 'complete' ]

  states.forEach(function(state) {
    router.route('/'+state)
    .get(function (req, res, next) {
      getJobs(state).then(function(data){
        res.json(data);
      }).error(next).catch(next)
    })
  })

  router.route('/pending/id/:type/:id')
  .get(function (req, res, next) {
    var id = req.params.id
      , type = req.params.type
    redisModel.makePendingById(type, id).then(function(results){
      res.json(results);
    }).error(next).catch(next)
  });


  router.route('/delete/id/:type/:id')
  .get(function (req, res, next) {
    var id = req.params.id
      , type = req.params.type
    redisModel.deleteJobById(type, id).then(function(results){
      res.json(results);
    }).error(next).catch(next)
  });

  router.route('/delete/status/:type')
  .get(function (req, res, next) {
    var type = req.params.type
    redisModel.deleteJobByStatus(type).then(function(results){
      res.json(results);
    }).error(next).catch(next)
  });

  return router;
}
