
let showSignaturesButton = document.getElementById("show_signatures_button");
let addSignatureButton = document.getElementById("add_irma_signature");

showSignaturesButton.addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  let name = tab.url.substring('https://twitter.com/'.length);

  let signatures = await (await fetch(`http://localhost:3000/accounts/getSignatures?handle=${name}`)).json();
  let domains = signatures.map((signature) => signature.disclosed[1][0].rawvalue)

  await chrome.scripting.executeScript({
    target: {tabId: tab.id},
    func: showSignatures,
    args: [domains]
  });
});

addSignatureButton.addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  const request = {
    '@context': 'https://irma.app/ld/request/signature/v2',
    'message': tab.url,
    'disclose': [[[ 'irma-demo.pbdf.twitter.username' ]],  [['irma-demo.sidn-pbdf.email.domain']]]
  };

  irma.startSession('http://localhost:8088', request)
      .then(({ sessionPtr, token }) => irma.handleSession(sessionPtr, {server: 'http://localhost:8088', token: token}))
      .then(result => {
        console.log(result);
        $.ajax({
          type: 'post',
          url: 'http://localhost:3000/accounts/addSignature',
          data: JSON.stringify(result),
          dataType: 'json',
          contentType: 'application/json'
        });
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
