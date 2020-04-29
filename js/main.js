var host = "heitorgouvea.me"

if (window.location.host == host && window.location.protocol != "https:") {
	window.location.protocol = "https:"
}
