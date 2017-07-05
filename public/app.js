angular.module('s3Test', [])

.run(function() {
   console.log('Working')
})

.service('s3Service', function($http) {
   this.getSignedUrl = function(file) {
      return $http.get(`/api/s3?file_name=${file.name}&file_type=${file.type}`)
   }
   this.uploadFile = function(file, signed_request) {
      return $http.put(signed_request, file, {headers: {'x-amz-acl': 'public-read'}})
   }
})

.controller('s3Controller', function($scope, s3Service) {
   var url;
   document.getElementById('file-input')
   .addEventListener('change', function(e) {
      console.log(e.target.files)
      var file = e.target.files[0]
      s3Service.getSignedUrl(file)
      .then(function(response) {
         console.log(response)
         url = response.data.url
         return s3Service.uploadFile(file, response.data.signed_request, response.data.url)
      })
      .then(function(response) {
         console.log(response)
         $scope.imageUrl = url
      })
   })
   
})
