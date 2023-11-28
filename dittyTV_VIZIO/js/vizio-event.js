//SECOND - bind the event handlers
// Primary handler
document.addEventListener("VIZIO_LIBRARY_DID_LOAD", function (e) {
    // all secondary handlers inside the primary
    // Device ID
    window.VIZIO.getDeviceId(function (deviceId) {
        console.log("Unique Device Id: " + deviceId);
    });

    // IFA - ID for Advertisement
    window.VIZIO.setAdvertiserIDListener(function (AdvertiserID) {
        console.log("Advertiser ID: " + AdvertiserID.IFA)
        console.log("Advertiser ID Type: " + AdvertiserID.IFA_TYPE)
        console.log("Limit Ad Tracking: " + AdvertiserID.LMT)
    });

    // TTS
    document.addEventListener("VIZIO_TTS_ENABLED", function (e) {
        console.log(e, "TTS ENABLED");
        // document.getElementById("tts-state").innerHTML = "ON";
    }, false);

    document.addEventListener("VIZIO_TTS_DISABLED", function (e) {
        console.log(e, "TTS DISABLED");
        // document.getElementById("tts-state").innerHTML = "OFF";
    }, false);

    // Closed Captions
    window.VIZIO.setClosedCaptionHandler(function (isCCEnabled) {
        console.log(isCCEnabled);
        if (isCCEnabled) {
            console.log("Closed captioning enabled");
            // document.getElementById("cc-state").innerHTML = "ON";
        } else {
            console.log("Closed captioning disabled");
            // document.getElementById("cc-state").innerHTML = "OFF";
        }
    });

    //Connection Status
    window.addEventListener('offline', function (e) {
        console.log('The display is offline');
    });
    window.addEventListener('online', function (e) {
        console.log('The display is online');
    });

    /**
    * Device Language Handler
    *
    * Callback Parameters:
    *
    * @param {Object} language
    * ex: {code: "en", name: "English"}
    * ex: {code: "fr", name: "French"}
    * ex: {code: "es", name: "Spanish"}
    *
    * @param {Function} cb - Event callback function with formatted response
    */
    window.VIZIO.setDeviceLanguageHandler(function (language) {
        console.log(language);
    });


    /**
    * Get Firmware Version
    * @param {Function} cb - Event callback function with formatted response
    */
    // window.VIZIO.getFirmwareVersion(cb)

    window.VIZIO.getFirmwareVersion(function (firmwareVersion) {
        console.log("Device Firmware Version: " + firmwareVersion)
    });

    //VIZIO companion library provides a property to get the Device Model.
    window.VIZIO.deviceModel

    /**
    * Get Device Playback Qualities
    *
    * Callback expects an array of qualities for partners to use.
    *
    * At most the array will contain these qualities: ["UHD", "HD", "SD"]
    * @param {Function} cb - Event callback function with formatted response
    */
    // window.VIZIO.getDevicePlaybackQualities(cb)
    window.VIZIO.getDevicePlaybackQualities(function (qualities) {
        console.log("Device Playback Qualities: " + qualities)
    });


    /**
    * Get Device HDR Capabilities
    * Callback expects an array of capabilities for partners to use.
    * At most the array will contain these capabilities: ["DolbyVision",
    "HDR10"]
    * @param {Function} cb - Event callback function with formatted response
    */
    // window.VIZIO.getDeviceHDRCapabilities(cb)
    window.VIZIO.getDeviceHDRCapabilities(function (capabilities) {
        console.log("Device HDR Capabilities: " + capabilities)
    })

}, false);