const CURRENT_VERSION = Android.getAppVersion() || "1.0.0";
const VERSION_URL =
  "https://raw.githubusercontent.com/ishak9988/Tintora/main/version.json";

Android.nativeCall("GET", VERSION_URL, null, null, "onUpdateCheckResult");

const onUpdateCheckResult = (response) => {
  try {
    const data = JSON.parse(response);
    if (!data || data.length === 0) return;
    const { version, changelog } = data[0];
    if (version !== CURRENT_VERSION) {
      alert("New version available! Changelog: " + changelog);

      Android.downloadFile(
        `https://github.com/ishak9988/Tintora/releases/download/v${version}/Tintora.apk`,
        "Tintora.apk"
      );
    } else {
      console.log("App is up to date.");
    }
  } catch (error) {
    console.error("Failed to check for updates:", error);
  }
};
