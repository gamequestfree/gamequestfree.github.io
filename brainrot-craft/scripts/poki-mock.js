window.PokiSDK = {
    init: () => Promise.resolve(),
    gameLoadingStart: () => {},
    gameLoadingFinished: () => {},
    gameplayStart: () => {},
    gameplayStop: () => {},
    commercialBreak: () => Promise.resolve(),
    rewardedBreak: () => Promise.resolve(true),
    displayAd: () => Promise.resolve(),
    destroyAd: () => {},
    setDebug: () => {},
    captureError: () => {},
    logError: () => {},
    shareableURL: () => window.location.href,
    getURLParam: (param) => new URLSearchParams(window.location.search).get(param)
};

console.log('Poki SDK Mock loaded');