app.controller('DojoCtrl', DojoCtrl);

function DojoCtrl(dojoService) {
	var vm = this;
	vm.dojos = [];

	dojoService
	.get()
    .then(function(res) {
      vm.dojos = res.data;
      console.log(res.data);
    });
}