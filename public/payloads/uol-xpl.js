fetch('https://paywall.folha.uol.com.br/digital.json')
  .then((response) => response.json())
  .then((data) => console.log(data));