const Layout = (children, header) => {
  const {
    showBackBtn = true,
    title = "Tintora",
    showRightSection = "",
    backBtnRoute = "home",
  } = header || {};
  return html`${Header(showBackBtn, title, showRightSection, backBtnRoute)}
    <div class="p-2">${children}</div> `;
};
