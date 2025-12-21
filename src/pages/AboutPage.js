const AboutPage = () => {
  const Content = html`
    <section class="py-6 px-1 flex items-center justify-center">
      <div class="max-w-2xl w-full">
        <!-- Header Section -->
        <div class="flex justify-between items-center text-center mb-6">
          <h1
            class="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          >
            Tintora
          </h1>

          <p class="text-slate-300 text-sm font-medium">
            Version ${(window.Android && Android.getAppVersion()) || "1.2.0"}
          </p>
        </div>

        <!-- Legal Content Cards -->
        <div class="space-y-4 mb-8">
          <!-- Copyright Card -->
          <div class="bg-[#181818] border border-[#2d2d2d] rounded-2xl p-6">
            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 class="text-slate-200 font-semibold mb-2">
                  Copyright Protection
                </h3>
                <p class="text-slate-400 text-sm leading-relaxed">
                  This software and its content are protected by copyright laws
                  ${" "}and international treaties. Unauthorized reproduction,
                  ${" "}distribution, or modification of this software is
                  ${" "}strictly ${" "}prohibited.
                </p>
              </div>
            </div>
          </div>

          <!-- License Card -->
          <div class="bg-[#181818]  border border-[#2d2d2d] rounded-2xl p-6">
            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 class="text-slate-200 font-semibold mb-2">License Terms</h3>
                <p class="text-slate-400 text-sm leading-relaxed">
                  You are granted a limited, non-exclusive, non-transferable
                  ${" "}license to use this software for personal or internal
                  ${" "}business ${" "}purposes only. Commercial use,
                  ${" "}redistribution, ${" "}or reverse ${" "}engineering is
                  ${" "}prohibited unless explicitly ${" "}authorized in
                  ${" "}writing by HMI.
                </p>
              </div>
            </div>
          </div>

          <!-- Disclaimer Card -->
          <div class="bg-[#181818]  border border-[#2d2d2d] rounded-2xl p-6">
            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 class="text-slate-200 font-semibold mb-2">Disclaimer</h3>
                <p class="text-slate-400 text-sm leading-relaxed">
                  This software is provided "as-is" without warranty of any
                  ${" "}kind, either expressed or implied, including but not
                  ${" "}limited ${" "}to warranties of merchantability or
                  ${" "}fitness for ${" "}a particular ${" "}purpose. HMI shall
                  ${" "}not be ${" "}liable for any ${" "}damages arising from
                  ${" "}the use of ${" "}this software.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  return Layout(Content, { title: "About" });
};
