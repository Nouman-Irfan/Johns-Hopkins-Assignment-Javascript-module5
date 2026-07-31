(function (global) {
  "use strict";

  var ajaxUtils = {};

  ajaxUtils.sendGetRequest = function (requestUrl, responseHandler, isJsonResponse) {
    fetch(requestUrl)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        return isJsonResponse === false ? response.text() : response.json();
      })
      .then(responseHandler)
      .catch(function (error) {
        console.error("Request failed:", error);
        responseHandler(null);
      });
  };

  global.$ajaxUtils = ajaxUtils;
})(window);
