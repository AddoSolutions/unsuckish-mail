//require("babel-core").transform("code", {});
var Q = require('q');


var myPromise = Q.defer();

myPromise.promise.then(function(data){
	console.log(data);
});
myPromise.promise.catch(function(err){
	console.log(err);
});

var i = 0;
setInterval(function(){
	myPromise.resolve({"abc": i});
	i++;
}, 1000)