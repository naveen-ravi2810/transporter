function getIPv4Address(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.ipify.org?format=json', true);
    
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        var ipAddress = response.ip;
        callback(ipAddress);
      }
    };
    
    xhr.onerror = function () {
      callback(null);
    };
    
    xhr.send();
  }
  
  getIPv4Address(function(ipAddress) {
    console.log("IPv4 Address:", ipAddress);
  });  