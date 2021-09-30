
let showSignaturesButton = document.getElementById("show_signatures_button");
let addSignatureButton = document.getElementById("add_irma_signature");

showSignaturesButton.addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  let name = tab.url.substring('https://twitter.com/'.length);

  let signatures = await (await fetch(`http://localhost:3000/accounts/getSignatures?handle=${name}`)).json();

  await chrome.scripting.executeScript({
    target: {tabId: tab.id},
    func: showSignatures,
    args: [signatures]
  });
});

addSignatureButton.addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

  $.ajax({
    type: 'post',
    url: 'http://localhost:3000/accounts/addSignature',
    data: JSON.stringify({username: tab.url.split('/').at(-1), message: $('#domain').val()}),
    dataType: 'json',
    contentType: 'application/json'
  });
});

showSignatures = function(signatures) {
  let name = window.location.pathname.substring(1);
  for (const span of document.querySelectorAll("span")) {
    if (span.textContent === `@${name}`) {
      let oldSignatures = document.getElementById('twid-signatures');
      if (oldSignatures) oldSignatures.remove();
      span.insertAdjacentHTML('afterend', `<div id="twid-signatures" style="color: red;">${signatures}</div>`);
      break;
    }
  }
}
