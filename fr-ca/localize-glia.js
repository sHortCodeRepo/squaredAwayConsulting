// This function sets the Glia locale to Canadian French
function setGliaLocaleFrenchCA() {
  // Check if the 'sm' object is available
  if (typeof sm !== 'undefined' && sm.getApi) {
    sm.getApi({version: 'v1'}).then(function(api){
      api.setLocale('bulles-francais');
      console.log("Glia locale set to bulles-francais.");
    });
  } else {
    console.log("Glia API not ready, will try again.");
    // Optional: you could add a retry mechanism here
  }
}

// Attempt to set the locale once the main Glia script has likely loaded
// A simple timeout can work for this demonstration
setTimeout(setGliaLocaleFrenchCA, 2000); // Wait 2 seconds
