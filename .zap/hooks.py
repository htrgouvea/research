INTENTIONAL_POC_PATHS = (
    r"https://heitorgouvea\.me/public/payloads/.*",
    r"https://heitorgouvea\.me/public/browser-anti/.*",
)

NON_HTML_ASSETS = (
    r"https://heitorgouvea\.me/.*\.(?:avif|css|gif|ico|jpe?g|js|mp3|mp4|pdf|png|svg|webm|webp|woff2?)(?:\?.*)?$"
)


def zap_started(zap, target):
    for pattern in INTENTIONAL_POC_PATHS:
        zap.spider.exclude_from_scan(pattern)
        zap.ascan.exclude_from_scan(pattern)

    zap.ascan.exclude_from_scan(NON_HTML_ASSETS)
