const FeedbackPage = (params, el) => {
  const rightSec = html`
    <button
      id="sendBtn"
      class="ripple-container text-blue-400 flex size-12 h-full rounded-3xl items-center justify-center"
    >
      <span class="solar--plain-2-bold-duotone"></span>
    </button>
  `;

  const Content = html`
    <section
      class="flex flex-col mt-6 items-center justify-start text-center bg-[#121212] p-4 rounded-3xl border border-[#2A2A2A]"
    >
      <h1 class="text-2xl font-semibold text-white mb-1">Send Feedback</h1>
      <p class="text-gray-400 text-sm mb-6 max-w-[260px]">
        Tell us what you think. Your feedback helps improve the experience.
      </p>

      <form
        id="feedbackForm"
        action="https://formbold.com/s/3wgR8"
        method="POST"
        class="w-full grid gap-4 text-left"
      >
        <input
          type="hidden"
          style="display:none"
          name="appName"
          value="Tintora"
          class="hidden"
        />
        <div>
          <label class="text-gray-300 text-sm mb-1 block">Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            class="w-full px-4 py-3 rounded-xl bg-[#1b1b1b] border border-[#2e2e2e] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#4a81f6] outline-none"
            required
          />
        </div>

        <div>
          <label class="text-gray-300 text-sm mb-1 block">Subject</label>
          <input
            type="text"
            name="subject"
            placeholder="Feedback subject"
            class="w-full px-4 py-3 rounded-xl bg-[#1b1b1b] border border-[#2e2e2e] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#4a81f6] outline-none"
            required
          />
        </div>

        <div>
          <label class="text-gray-300 text-sm mb-1 block">Message</label>
          <textarea
            name="message"
            placeholder="Type your message..."
            rows="7"
            class="w-full px-4 py-3 rounded-xl bg-[#1b1b1b] border border-[#2e2e2e] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#4a81f6] outline-none resize-none"
            required
          ></textarea>
        </div>
      </form>
    </section>
  `;

  afterPageLoad(() => {
    const sendBtn = el.querySelector("#sendBtn");
    const feedbackForm = el.querySelector("#feedbackForm");

    if (sendBtn && feedbackForm) {
      let sendCount = Number(localStorage.getItem("feedbackSendCount") || 0);

      sendBtn.addEventListener("click", () => {
        AnimUtils.shake(sendBtn, { intensity: 1.1 });
        if (sendCount >= 3) {
          Toast.show("Max 3 feedbacks reached");
          return;
        }

        feedbackForm.requestSubmit();
        // Increment and save
        sendCount++;
        localStorage.setItem("feedbackSendCount", sendCount);
      });
    }
  });

  return Layout(Content, {
    title: "Feedback",
    showRightSection: rightSec,
  });
};
