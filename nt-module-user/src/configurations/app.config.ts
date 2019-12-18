export const APP_CONFIG = {
    banner: `

                                             _            _     _
                                 _ __   ___ | |_ __ _  __| | __| |
                                | "_ \\ / _ \\| __/ _\` |/ _\` |/ _\` |
                                | | | | (_) | || (_| | (_| | (_| |
                                |_| |_|\\___/ \\__\\__,_|\\__,_|\\__,_|

`,
SERVICE:({
    DEV: {
        CHAT_SERVER: 'yumingvvv.thanks.echosite.cn',
        REST_SERVER: 'wwwv.thanks.echosite.cn',
        AI_SERVER: '39.97.224.231:5007'
    },
    RELEASE: {
        CHAT_SERVER: '39.97.224.231:3000',
        REST_SERVER: '39.97.224.231:50054',
        AI_SERVER: '39.97.224.231:5007'
    }
})['RELEASE']
}
;