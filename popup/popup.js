const permissions = [
  { label: "Cookies", value: "cookies" },
  { label: "Javascript", value: "javascript" },
  { label: "Location", value: "location" },
  { label: "Microphone", value: "microphone" },
  { label: "Camera", value: "camera" },
  { label: "Notification", value: "notifications" },
  { label: "Popups", value: "popups" },
  { label: "Clipboard", value: "clipboard" },
  { label: "Images", value: "images" },
  // { label: "Sound", value: "sound" },
];

let currentTabOrigin = "";

let isIncognitoMode = false;

function renderPermissions() {
  permissions.forEach((permission) => {
    const permissionValue = permission.value;
    chrome.contentSettings[permissionValue]
      .get({ primaryUrl: currentTabOrigin })
      .then((properties) => {
        const enabled = properties.setting === "allow";
        const switchElement = document.createElement("div");
        switchElement.classList.add("switch-input");
        switchElement.id = permissionValue;
        document.getElementById("root").appendChild(switchElement);
        switchElement.addEventListener("click", handleClick);

        const id = `switch-${permissionValue}`;
        const inputElement = document.createElement("input");
        inputElement.setAttribute("type", "checkbox");
        inputElement.setAttribute("id", id);
        inputElement.checked = enabled;
        switchElement.appendChild(inputElement);

        const icon = document.createElement("div");
        icon.setAttribute("class", "icon");
        switchElement.appendChild(icon);

        const label = document.createElement("label");
        label.setAttribute("for", id);
        label.innerText = permission.label;
        switchElement.appendChild(label);
      });
  });
}

function handleClick(event) {
  const element = event.target.querySelector("input");
  const currentValue = element.checked;
  element.checked = !currentValue;

  chrome.contentSettings[event.target.id].set({
    primaryPattern: currentTabOrigin + "/*",
    scope: isIncognitoMode ? "incognito_session_only" : "regular",
    setting: currentValue ? "block" : "allow",
  });
}

document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    isIncognitoMode = chrome.extension.inIncognitoContext;
    const { url } = tab;
    if (url) {
      const urlParams = new URL(url);
      const { origin } = urlParams;
      currentTabOrigin = origin;
      renderPermissions();
    }
  });
});
