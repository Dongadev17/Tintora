const CURRENT_VERSION = Android.getAppVersion() || "1.0.0";
const MAIN_REPO = "Dongadev17/Tintora";
const VERSION_URL = `https://raw.githubusercontent.com/${MAIN_REPO}/main/version.json`;

let checkingForUpdate = false;

if (!checkingForUpdate) {
  Android.nativeCall("GET", VERSION_URL, null, null, "onUpdateCheckResult");
}

const onUpdateCheckResult = (response) => {
  try {
    const data = JSON.parse(response);
    if (!data || data.length === 0) return;
    const body = JSON.parse(data.body);
    const { version, changelog } = body[0];
    if (version !== CURRENT_VERSION) {
      const updateSheet = new BottomSheet({
        content: html`
          <div class="pb-6 ">
            <h3 class="text-lg font-medium mb-4">Update Available</h3>
            <p class="mb-4 opacity-70">
              A new version (${version}) is available. You are currently using
              ${" "}version ${CURRENT_VERSION}.
            </p>
            <h4 class="text-md font-medium mb-2">Changelog:</h4>
            <pre class="bg-[#303030] p-3 rounded mb-4 overflow-x-auto">
${changelog.length > 0 ? changelog.join("\n") : "No changelog available."}
          </pre
            >
            <p class="mb-4 opacity-70">
              Please download the latest version to enjoy new features and
              ${" "}improvements.
            </p>
            <div class="flex justify-end gap-3">
              <button
                id="laterBtn"
                class="ripple-container px-6 py-3 font-medium bg-gray-600 text-white rounded-full hover:bg-gray-700 transition"
              >
                Later
              </button>
              <button
                id="downloadBtn"
                class="ripple-container px-6 py-3 font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              >
                Download
              </button>
            </div>
          </div>
        `,
      });
      updateSheet.show().then((sheet) => {
        const downloadBtn = sheet.querySelector("#downloadBtn");
        const laterBtn = sheet.querySelector("#laterBtn");

        laterBtn.addEventListener("click", () => {
          updateSheet.dismiss();
        });

        downloadBtn.addEventListener("click", () => {
          const appName = "Tintora.apk";
          updateSheet.dismiss().then(() => {
            Android.downloadFile(
              `https://github.com/${MAIN_REPO}/releases/download/v${version}/${appName}`,
              appName
            );
          });
        });
      });
    } else {
      console.log("App is up to date.");
    }
  } catch (error) {
    console.error("Failed to check for updates:", error);
  } finally {
    checkingForUpdate = true;
  }
};
