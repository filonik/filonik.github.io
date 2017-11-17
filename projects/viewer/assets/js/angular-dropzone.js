(function() {
  'use strict';
  
  angular.module('reusableThings', []).directive('dropzone', function() {
    return {
      restrict: 'EA',
      scope: {
        file: '=',
        fileName: '=',
        onLoadFile: "&",
      },
      link: function(scope, element, attrs) {
        function isFile(event) {
            var dt = event.dataTransfer;
            for (var i = 0; i < dt.types.length; i++) {
                if (dt.types[i] === "Files") {
                    return true;
                }
            }
            return false;
        }
        
        var validMimeTypes = attrs.validMimeTypes;
        var isTypeValid = function(type) {
          if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
            return true;
          } else {
            alert("Invalid file type. File must be one of following types " + validMimeTypes + ".");
            return false;
          }
        };
        var isSizeValid = function(size) {
          var _ref;
          if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
            return true;
          } else {
            alert("Invalid file size. File must be smaller than " + attrs.maxFileSize + " MB.");
            return false;
          }
        };
        
        var domElement = angular.element(element)[0];
        
        function showOverlay() {
          domElement.style.visibility = "";
          domElement.style.opacity = 1;
        }
        function hideOverlay() {
          domElement.style.visibility = "hidden";
          domElement.style.opacity = 0;
        }
        
        var counter = 0;
        
        window.addEventListener('dragover', function(event) {
          //console.log('dragover', event.target);
          event.preventDefault();
          event.dataTransfer.dropEffect = 'copy'; 
        });
        
        window.addEventListener('dragenter', function(event) {
          //console.log('dragenter', event.target);
          event.preventDefault();
          if (isFile(event)) {
            counter++;
          }
          if (counter == 1) { 
            showOverlay();
          }
        });
        
        window.addEventListener('dragleave', function(event) {
          //console.log('dragleave', event.target);
          event.preventDefault();
          if (isFile(event)) {
            counter--;
          }
          if (counter == 0) { 
            hideOverlay();
          }
        });
        
        window.addEventListener('drop', function(event) {
          //console.log('drop', event);
          var name, size, type;
          event.preventDefault();
          hideOverlay();
          
          var reader = new FileReader();
          reader.onload = function(evt) {
            //console.log("load", evt.target.result);
            if (isTypeValid(type) && isSizeValid(size)) {
              var file = evt.target.result;
              if (scope.onLoadFile) {
                scope.onLoadFile({file: file, fileName: name});
              }
              return scope.$apply(function() {
                scope.file = file;
                if (angular.isString(scope.fileName)) {
                  return scope.fileName = name;
                }
              });
            }
          };
          var file = event.dataTransfer.files[0];
          name = file.name;
          type = file.type;
          size = file.size;
          reader.readAsText(file);
          //reader.readAsDataURL(file);
          return false;
        });
      }
    };
  });
  
}).call(this);