import CryptoJS from 'crypto-js'
import { Base64 } from '../base64'
import parser from 'fast-xml-parser'
import TransWorker from '../transcode.worker'
import Recorder from './recorder'

const APPID = '6031c0ef'
const API_SECRET = 'dbf6ff23d5bcd4062297b1395a947d80'
const API_KEY = 'afe668f1eb12e05e76faf6ecce295d24'

const transWorker = new TransWorker()

class RecorderWrapper {
    constructor({ action, ent, language, accent, appId, text } = {}) {
        let self = this
        this.recorder = new Recorder()
        this.recorder.onprogress = function (params) {
            if (self.status === 'ing') {
                transWorker.postMessage(params.data)
            }
        }
        this.status = 'null'
        this.action = action || 'read_sentence'
        this.ent = ent || 'cn_vip'
        this.language = language || 'zh_cn'
        this.accent = accent || 'mandarin'
        this.appId = '6031c0ef'
        // 记录音频数据
        this.audioData = []
        // 记录评测结果
        this.resultText = ''
        // wpgs下的评测结果需要中间状态辅助记录
        this.resultTextTemp = ''
        transWorker.onmessage = function (event) {
            self.audioData.push(...event.data)
        }
        this.text = text || 'how are you today'
    }
    start() {
        this.recorder.start()
        this.initWebsocket()
    }
    stop() {
        this.recorder.stop()
        this.setStatus('end')
    }
    play() {
        this.recorder.play()
    }
    // 修改录音评测状态
    setStatus(status) {
        // this.onWillStatusChange && this.status !== status && this.onWillStatusChange(this.status, status)
        this.status = status
    }
    setResultText(setResultXml = '') {
        this.onTextChange && this.onTextChange(setResultXml || '')
    }
    // 修改评测参数
    setParams({ language, accent } = {}) {
        language && (this.language = language)
        accent && (this.accent = accent)
    }
    setText(text) {
        this.text = text || 'how are you today'
    }
    // 向webSocket发送数据
    webSocketSend() {
        let self = this
        if (this.webSocket.readyState !== 1) {
            return
        }
        let audioData = this.audioData.splice(0, 1280)
        var params = {
            common: {
                app_id: this.appId,
            },
            business: {
                category: self.action, // read_syllable/单字朗读，汉语专有 read_word/词语朗读  read_sentence/句子朗读 https://www.xfyun.cn/doc/Ise/IseAPI.html#%E6%8E%A5%E5%8F%A3%E8%B0%83%E7%94%A8%E6%B5%81%E7%A8%8B
                rstcd: 'utf8',
                group: 'pupil',
                sub: 'ise',
                ent: self.ent,
                tte: 'utf-8',
                cmd: 'ssb',
                auf: 'audio/L16;rate=16000',
                aus: 1,
                aue: 'raw',
                text: '\uFEFF' + self.text
            },
            data: {
                status: 0,
                encoding: 'raw',
                data_type: 1,
                data: this.toBase64(audioData),
            },
        }
        this.webSocket.send(JSON.stringify(params))
        this.handlerInterval = setInterval(() => {
            // websocket未连接
            if (this.webSocket.readyState !== 1) {
                this.audioData = []
                clearInterval(this.handlerInterval)
                return
            }
            // 最后一帧
            if (this.audioData.length === 0) {
                if (this.status === 'end') {
                    this.webSocket.send(
                        JSON.stringify({
                            business: {
                                cmd: 'auw',
                                aus: 4,
                                aue: 'raw'
                            },
                            data: {
                                status: 2,
                                encoding: 'raw',
                                data_type: 1,
                                data: '',
                            },
                        })
                    )
                    this.audioData = []
                    clearInterval(this.handlerInterval)
                }
                return false
            }
            audioData = this.audioData.splice(0, 1280)
            // 中间帧
            this.webSocket.send(
                JSON.stringify({
                    business: {
                        cmd: 'auw',
                        aus: 2,
                        aue: 'raw'
                    },
                    data: {
                        status: 1,
                        encoding: 'raw',
                        data_type: 1,
                        data: this.toBase64(audioData),
                    },
                })
            )
        }, 40)
    }
    result(resultData) {
        // 识别结束
        let jsonData = JSON.parse(resultData)
        if (jsonData.data && jsonData.data.data) {
            let data = Base64.decode(jsonData.data.data)
            let grade = parser.parse(data, {
                attributeNamePrefix: '',
                ignoreAttributes: false
            })
            this.setResultText(grade)
        }
        if (jsonData.code === 0 && jsonData.data.status === 2) {
            this.webSocket.close()
        }
        if (jsonData.code !== 0) {
            this.webSocket.close()
            console.log(`${jsonData.code}:${jsonData.message}`)
        }
    }
    getWebSocketUrl() {
        var url = 'wss://ise-api.xfyun.cn/v2/open-ise'
        var host = 'ise-api.xfyun.cn'
        var apiKey = API_KEY
        var apiSecret = API_SECRET
        var date = new Date().toGMTString()
        var algorithm = 'hmac-sha256'
        var headers = 'host date request-line'
        var signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/open-ise HTTP/1.1`
        var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
        var signature = CryptoJS.enc.Base64.stringify(signatureSha)
        var authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
        var authorization = btoa(authorizationOrigin)
        url = `${url}?authorization=${authorization}&date=${date}&host=${host}`
        return url
    }
    initWebsocket() {
        if (APPID === 'APPID' || !APPID) {
            return false;
        }
        const url = this.getWebSocketUrl()
        let iseWS
        if ('WebSocket' in window) {
            iseWS = new window.WebSocket(url)
        } else if ('MozWebSocket' in window) {
            iseWS = new window.MozWebSocket(url)
        } else {
            return false
        }
        this.webSocket = iseWS
        this.setStatus('init')
        iseWS.onopen = e => {
            this.setStatus('ing')
            setTimeout(() => {
                this.webSocketSend()
            }, 500)
        }
        iseWS.onmessage = e => {
            this.result(e.data)
        }
        iseWS.onerror = e => {
            this.stop()
        }
        iseWS.onclose = e => {
            this.stop()
        }
    }
    // 对处理后的音频数据进行base64编码
    toBase64(buffer) {
        var binary = ''
        var bytes = new Uint8Array(buffer)
        var len = bytes.byteLength
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        return window.btoa(binary)
    }
    dispose(){
        this.recorder.destroy()
    }
}

export default RecorderWrapper
