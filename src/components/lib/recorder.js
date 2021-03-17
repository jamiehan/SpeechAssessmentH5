import CryptoJS from 'crypto-js'
import { Base64 } from './base64'
import parser from 'fast-xml-parser'
import TransWorker from './transcode.worker'

const APPID = '6031c0ef'
const API_SECRET = 'dbf6ff23d5bcd4062297b1395a947d80'
const API_KEY = 'afe668f1eb12e05e76faf6ecce295d24'

const transWorker = new TransWorker()

class IseRecorder {
    constructor({ action, ent, language, accent, appId, text } = {}) {
        let self = this
        this.status = 'null'
        this.action = action || 'read_sentence'
        this.ent = ent || 'cn_vip'
        this.language = language || 'zh_cn'
        this.accent = accent || 'mandarin'
        this.appId = '6031c0ef'
        // 记录音频数据
        this.audioData = []
        // 原始音频数据
        this.audioDatas = []
        // 记录评测结果
        this.resultText = ''
        // wpgs下的评测结果需要中间状态辅助记录
        this.resultTextTemp = ''
        transWorker.onmessage = function (event) {
            self.audioData.push(...event.data)
            self.audioDatas.push(...event.data)
        }
        this.text = text || 'how are you today'
    }

    // 修改录音评测状态
    setStatus(status) {
        this.onWillStatusChange && this.status !== status && this.onWillStatusChange(this.status, status)
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
    // 连接websocket
    connectWebSocket() {
        if (APPID === 'APPID' || !APPID) {
            alert('请填写APPID、APISecret、APIKey，可从控制台-我的应用-语音评测（流式版）页面获取。')
            return false;
        }
        return this.getWebSocketUrl().then(url => {
            let iseWS
            if ('WebSocket' in window) {
                iseWS = new window.WebSocket(url)
            } else if ('MozWebSocket' in window) {
                iseWS = new window.MozWebSocket(url)
            } else {
                return
            }
            this.webSocket = iseWS
            this.setStatus('init')
            iseWS.onopen = e => {
                e
                this.setStatus('ing')
                // 重新开始录音
                setTimeout(() => {
                    this.webSocketSend()
                }, 500)
            }
            iseWS.onmessage = e => {
                this.result(e.data)
            }
            iseWS.onerror = e => {
                console.log(e)
                this.recorderStop()
            }
            iseWS.onclose = e => {
                e
                this.recorderStop()
            }
        })
    }
    initRecorder() {
        navigator.getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia
        return new Promise((resolve, reject) => {
            // 创建音频环境
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
                this.audioContext.resume()
                if (!this.audioContext) {
                    reject({
                        success: false,
                        message: '浏览器不支持webAudioApi相关接口'
                    })
                }
            } catch (e) {
                if (!this.audioContext) {
                    reject({
                        success: false,
                        message: '浏览器不支持webAudioApi相关接口'
                    })
                }
            }
            // 获取浏览器录音权限
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices
                    .getUserMedia({
                        audio: true,
                        video: false,
                    })
                    .then(stream => {
                        getMediaSuccess(stream)
                        resolve({
                            success: true,
                            message: '获取录音权限成功'
                        })
                    })
                    .catch(e => {
                        getMediaFail(e)
                        reject({
                            success: false,
                            message: '获取录音权限失败'
                        })
                    })
            } else if (navigator.getUserMedia) {
                navigator.getUserMedia(
                    {
                        audio: true,
                        video: false,
                    },
                    stream => {
                        getMediaSuccess(stream)
                        resolve({
                            success: true,
                            message: '获取录音权限成功'
                        })
                    },
                    function (e) {
                        getMediaFail(e)
                        reject({
                            success: false,
                            message: '获取录音权限失败'
                        })
                    }
                )
            } else {
                this.audioContext && this.audioContext.close()
                if (navigator.userAgent.toLowerCase().match(/chrome/) && location.origin.indexOf('https://') < 0) {
                    reject({
                        success: false,
                        message: 'chrome下获取浏览器录音功能，因为安全性问题，需要在localhost或127.0.0.1或https下才能获取权限'
                    })
                } else {
                    reject({
                        success: false,
                        message: '无法获取浏览器录音功能，请升级浏览器或使用chrome'
                    })
                }
            }
            // 获取浏览器录音权限成功的回调
            const self = this
            let getMediaSuccess = stream => {
                console.log('getMediaSuccess')
                // 创建一个用于通过JavaScript直接处理音频
                self.scriptProcessor = self.audioContext.createScriptProcessor(0, 1, 1)
                self.scriptProcessor.onaudioprocess = e => {
                    // 去处理音频数据
                    if (self.status === 'ing') {
                        // self.audioDatas = self.audioDatas.concat(e.inputBuffer.getChannelData(0))
                        transWorker.postMessage(e.inputBuffer.getChannelData(0))
                        // console.log(e.inputBuffer.getChannelData(0))
                    }
                }
                // 创建一个新的MediaStreamAudioSourceNode 对象，使来自MediaStream的音频可以被播放和操作
                self.mediaSource = self.audioContext.createMediaStreamSource(stream)
                // 连接
                self.mediaSource.connect(self.scriptProcessor)
                self.scriptProcessor.connect(self.audioContext.destination)
                self.connectWebSocket()
            }

            let getMediaFail = (e) => {
                alert('请求麦克风失败')
                console.log(e)
                this.audioContext && this.audioContext.close()
                this.audioContext = undefined
                // 关闭websocket
                if (this.webSocket && this.webSocket.readyState === 1) {
                    this.webSocket.close()
                }
            }

        })
    }
    // 初始化浏览器录音
    recorderInit() {
        navigator.getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia

        // 创建音频环境
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
            this.audioContext.resume()
            if (!this.audioContext) {
                alert('浏览器不支持webAudioApi相关接口')
                return
            }
        } catch (e) {
            if (!this.audioContext) {
                alert('浏览器不支持webAudioApi相关接口')
                return
            }
        }

        // 获取浏览器录音权限
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
                .getUserMedia({
                    audio: true,
                    video: false,
                })
                .then(stream => {
                    getMediaSuccess(stream)
                })
                .catch(e => {
                    getMediaFail(e)
                })
        } else if (navigator.getUserMedia) {
            navigator.getUserMedia(
                {
                    audio: true,
                    video: false,
                },
                stream => {
                    getMediaSuccess(stream)
                },
                function (e) {
                    getMediaFail(e)
                }
            )
        } else {
            if (navigator.userAgent.toLowerCase().match(/chrome/) && location.origin.indexOf('https://') < 0) {
                alert('chrome下获取浏览器录音功能，因为安全性问题，需要在localhost或127.0.0.1或https下才能获取权限')
            } else {
                alert('无法获取浏览器录音功能，请升级浏览器或使用chrome')
            }
            this.audioContext && this.audioContext.close()
            return
        }
        // 获取浏览器录音权限成功的回调
        const self = this
        let getMediaSuccess = stream => {
            console.log('getMediaSuccess')
            // 创建一个用于通过JavaScript直接处理音频
            self.scriptProcessor = self.audioContext.createScriptProcessor(0, 1, 1)
            self.scriptProcessor.onaudioprocess = e => {
                // 去处理音频数据
                if (self.status === 'ing') {
                    transWorker.postMessage(e.inputBuffer.getChannelData(0))
                    // console.log(e.inputBuffer.getChannelData(0))
                }
            }
            // 创建一个新的MediaStreamAudioSourceNode 对象，使来自MediaStream的音频可以被播放和操作
            self.mediaSource = self.audioContext.createMediaStreamSource(stream)
            // 连接
            self.mediaSource.connect(self.scriptProcessor)
            self.scriptProcessor.connect(self.audioContext.destination)
            self.connectWebSocket()
        }

        let getMediaFail = (e) => {
            alert('请求麦克风失败')
            console.log(e)
            this.audioContext && this.audioContext.close()
            this.audioContext = undefined
            // 关闭websocket
            if (this.webSocket && this.webSocket.readyState === 1) {
                this.webSocket.close()
            }
        }
    }
    recorderStart() {
        if (!this.audioContext) {
            this.recorderInit()
        } else {
            this.audioContext.resume()
            this.connectWebSocket()
        }
    }
    // 暂停录音
    recorderStop() {
        // safari下suspend后再次resume录音内容将是空白，设置safari下不做suspend
        if (!(/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgen))) {
            this.audioContext && this.audioContext.suspend()
        }
        this.setStatus('end')
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
            // console.log(grade)
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
    start() {
        this.recorderStart()
        this.setResultText()
    }
    stop() {
        this.recorderStop()
    }
    getWebSocketUrl() {
        return new Promise((resolve) => {
            // 请求地址根据语种不同变化
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
            resolve(url)
        })
    }
    replay(audio){
        // console.log(this.mediaSource)
        // var biquadFilter = this.audioContext.createBiquadFilter();
        // biquadFilter.type = "lowshelf";
        // biquadFilter.frequency.value = 1000;
        // biquadFilter.gain.value = 50;
        // this.mediaSource.connect(biquadFilter);

        // range.oninput = function() {
        //     biquadFilter.gain.value = range.value;
        // }
        console.log(this.audioDatas)
        // let source = this.audioContext.createBufferSource()// audioCtx.createBufferSource();
        // let buffer = this.audioContext.decodeAudioData(this.audioDatas)
        // console.log(buffer)
        // let au = document.createElement('audio')
        // var source = this.audioContext.createMediaElementSource(au);
        // document.body.appendChild(au)
        // au.play()
        // source.start()
    }
}

export default IseRecorder
