const Layout = (children, header) => {
  const {
    showBackBtn = true,
    title = "Tintora",
    showRightSection = "",
  } = header || {};
  return html`${Header(showBackBtn, title, showRightSection)}
    <div class="p-2">${children}</div> `;
};
