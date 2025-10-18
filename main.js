const el = (id) => document.getElementById(id);
const setTxt = (id, v) => el(id) && (el(id).textContent = v);

// 1) Init HoodEngage SDK (primer: zameni stvarnim globalom/metodom)
async function initHood() {
  try {
    // Primer ako SDK pravi global HOODENGAGE:
    // await window.HOODENGAGE.init({ workspaceId: window.HOOD.workspaceId, env: window.HOOD.env });
    setTxt("sdk-status", "loaded (fake)");
  } catch (e) {
    setTxt("sdk-status", "failed");
    console.error("SDK init failed", e);
  }
}

// 2) Service Worker (za push)
async function registerSW() {
  if (!("serviceWorker" in navigator)) { setTxt("sw-status", "unsupported"); return; }
  try {
    const reg = await navigator.serviceWorker.register("/sw.js");
    setTxt("sw-status", "registered");
    console.log("SW registered", reg);
  } catch (e) {
    setTxt("sw-status", "failed");
    console.error("SW register failed", e);
  }
}

// 3) Open modal (zameni stvarnim SDK pozivom)
function openTestModal() {
  // primer: window.HOODENGAGE.showModal("myModalId");
  alert("Call your SDK here: showModal('...')");
}

// 4) Push subscribe (placeholder — zameni vašim SDK-om ili native Web Push flow)
async function subscribePush() {
  try {
    setTxt("push-status", "requesting...");
    // Ako vaš SDK ima helper tipa HOODENGAGE.subscribePush(), pozovi to umesto native:
    // await window.HOODENGAGE.subscribePush();

    // Native primer (VAPID itd. – u praksi, ovo ide uz backend):
    // const reg = await navigator.serviceWorker.ready;
    // const sub = await reg.pushManager.subscribe({
    //   userVisibleOnly: true,
    //   applicationServerKey: urlBase64ToUint8Array("PUBLIC_VAPID_KEY")
    // });
    // console.log("Push sub", sub);

    setTxt("push-status", "subscribed (fake)");
  } catch (e) {
    setTxt("push-status", "denied/failure");
    console.error(e);
  }
}

// UX hooks
document.addEventListener("DOMContentLoaded", () => {
  initHood();
  registerSW();

  const btnModal = el("btn-open-modal");
  btnModal && btnModal.addEventListener("click", openTestModal);

  const btnPush = el("btn-subscribe-push");
  btnPush && btnPush.addEventListener("click", subscribePush);
});
