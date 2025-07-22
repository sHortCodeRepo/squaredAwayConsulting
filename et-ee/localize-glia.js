// This function sets the Glia locale to Estonian.
function setGliaLocaleEstonian() {
  // Check if the 'sm' object from Glia's script is available.
  if (typeof sm !== 'undefined' && sm.getApi) {
    sm.getApi({version: 'v1'}).then(function(api){
      // Set the locale as requested.
      // Note: The standard IETF format is typically 'et-EE'. 
      // Using 'eestikeel' as specifically requested.
      api.setLocale('eestikeel');
      console.log("Glia locale set to eestikeel.");
    });
  } else {
    // If the Glia API is not ready, log it. A retry mechanism could be added here.
    console.log("Glia API not ready, will try again.");
  }
}

// Attempt to set the locale after a short delay to allow the main Glia script to load.
// A more robust solution would use a callback or event listener if Glia provides one.
setTimeout(setGliaLocaleEstonian, 2000); // Wait 2 seconds before executing.
