app.factory('dojoService', dojoService);

function dojoService($http) {
  var service = this;
  service.get = get;
  return service;

  function get() {
    return $http({
      method: 'GET',
      url: '/assets/json/product.json'
    })
    .then(function(res) {
      return res;
    },
      function(err) {
      console.error(err);
    });
  };
};