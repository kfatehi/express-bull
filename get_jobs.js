var Promise = require('bluebird')

module.exports = function(redisModel) {
  return function(state) {
    return new Promise(function(resolve, reject) {
      var promise = redisModel.getStatus(state)
      .then(redisModel.getJobsInList)
      .then(redisModel.formatKeys)
      if ( state === 'active' ) {
        promise.then(redisModel.getProgressForKeys)
      }
      promise.then(function(keyList){
        return redisModel.getStatusCounts().then(function(countObject){
          var model = {
            keys: keyList,
            counts: countObject
          };
          resolve(model);
        });
      }).error(reject).catch(reject)
    });
  }
}
