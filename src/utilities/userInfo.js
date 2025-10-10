export async function getUserInfo() {
  // Get public IP
  const res = await fetch("https://api64.ipify.org?format=json");
  const { ip } = await res.json();

  // Generate GUID
 // const guid = crypto.randomUUID();
 const ua = navigator.userAgent;
  let deviceName = "Desktop";
  let deviceOS = "Unknown";

  if (/Tablet|iPad/i.test(ua)) {
    deviceName = "Tablet";
    deviceOS = /iPad|iPhone|iPod/.test(ua) ? "iOS" : "Android";
  } else if (/Mobi|Android/i.test(ua)) {
    deviceName = "Mobile";
    if (/Android/i.test(ua)) {
      deviceOS = "Android";
    } else if (/iPhone|iPad|iPod/i.test(ua)) {
      deviceOS = "iOS";
    }
  }

  // Get device info (modern API if available)
  let deviceInfo = {
    language: navigator.language,
    deviceName, // Desktop / Mobile / Tablet
    deviceOS,   // Android / iOS / Unknown
  };

  if (navigator.userAgentData) {
    try {
      const uaData = await navigator.userAgentData.getHighEntropyValues([
        "platform",
        "platformVersion",
        "architecture",
        "model",
        "uaFullVersion",
      ]);
      deviceInfo = {
        ...deviceInfo,
        platform: uaData.platform,         
        platformVersion: uaData.platformVersion,
        architecture: uaData.architecture,
        model: uaData.model,                    
        browserVersion: uaData.uaFullVersion,
      };
    } catch (err) {
      console.warn("userAgentData not fully supported:", err);
      deviceInfo = {
        ...deviceInfo,
        userAgent: navigator.userAgent,  
        platform: navigator.platform,    
      };
    }
  } else {
    // Fallback for older browsers
    deviceInfo = {
      ...deviceInfo,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
    };
  }
  return { ip, deviceInfo };
}

