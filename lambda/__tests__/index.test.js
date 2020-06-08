const { S3PersistenceAdapter } = require('ask-sdk-s3-persistence-adapter')

describe('#index.js', () => {
    let request = {
        "version": "1.0",
        "session": {},
        "request": {
            "type": "LaunchRequest",
            "requestId": "amzn1.echo-api.request.XXXXXXXX",
            "timestamp": "2020-06-08T08:31:50Z",
            "locale": "ja-JP",
            "reason": "USER_INITIATED"
        }
    }

    describe('welcome', () => {
        let target
        const mockUserContext = (data) => {
            const spy = jest.spyOn(S3PersistenceAdapter.prototype, 'getAttributes').mockImplementation(() => {
                return data
            })
            return spy
        }

        beforeEach(() => {
            // sessionが継続する作りなので、テストするときは毎回新規に読み込む
            target = require('../index')
            jest.restoreAllMocks()
        })

        it('1st welcome', done => {
            mockUserContext({})
            return target.handler(request, {}, (err, data) => {
                try {
                    console.log(data)
                    expect(data.response.outputSpeech.ssml).toMatch(
                        /妄想トリップへようこそ。このスキルを使うと、家に居ながらどこか違う町に旅行した気分になれるかも？あなたの今行ってみたい場所はどこですか？/
                    )
                    done()
                } catch (error) {
                    done(error)
                }
            }) 
        });

        it('2nd welcome', done => {
            mockUserContext({
                visit: 1,
                lastVisitCity: 'アムステルダム'
            })
            return target.handler(request, {}, (err, data) => {
                try {
                    console.log(data)
                    expect(data.response.outputSpeech.ssml).toMatch(
                        /おかえりなさい。今日は 2 回目の旅行ですね。前回 の アムステルダム への旅行はどうでしたか？ 今回はどこに行きましょうか？/
                    )
                    done()
                } catch (error) {
                    done(error)
                }
            })
        });

        it('3rd welcome', done => {
            mockUserContext({
                visit: 2,
                lastVisitCity: 'パリ'
            })
            return target.handler(request, {}, (err, data) => {
                try {
                    console.log(data)
                    expect(data.response.outputSpeech.ssml).toMatch(
                        /おかえりなさい。もう 3 回目の旅行になりました。前回は、パリ に行きましたね。今日はどちらに行きますか？/
                    )
                    done()
                } catch (error) {
                    done(error) 
                }
            })           
        });

        it('more than 4 times welcome', done => {
            mockUserContext({
                visit: 3,
                lastVisitCity: '東京'
            })
            return target.handler(request, {}, (err, data) => {
                try {
                    console.log(data)
                    expect(data.response.outputSpeech.ssml).toMatch(
                        /おかえりなさい。もう 4 回目の旅行になりました。前回は、東京 に行きましたね。今日はどちらに行きますか？/
                    )
                    done()
                } catch (error) {
                    done(error) 
                }
            })           
        });            
    });

    describe('go to the city', () => {
        let request = {
            "version": "1.0",
            "session": {},
            "request": {
                "type": "IntentRequest",
                "requestId": "amzn1.echo-api.request.3eb4fe87-fc2f-437a-89a5-203b3ae979be",
                "timestamp": "2020-06-08T12:58:19Z",
                "locale": "ja-JP",
                "intent": {
                    "name": "DestinationCityIntent",
                    "confirmationStatus": "NONE",
                    "slots": {
                        "city": {
                            "name": "city",
                            "value": "ニューヨーク",
                            "confirmationStatus": "NONE",
                            "source": "USER"
                        }
                    }
                }
            }
        }
        const target = require('../index')
        const mockUserContext = (data) => {
            jest.spyOn(S3PersistenceAdapter.prototype, 'getAttributes').mockImplementation(() => {
                return data
            })
            const spy = jest.spyOn(S3PersistenceAdapter.prototype, 'saveAttributes').mockImplementation(() => {
                return true
            })
            return spy
        }

        beforeEach(() => {
            jest.restoreAllMocks()
        })

        it('departure and save history', done => {
            const spy = mockUserContext({
                visit: 0,
                lastVisitCity: ''
            })
            return target.handler(request, {}, (err, data) => {
                try {
                    console.log(data)
                    expect(data.response.outputSpeech.ssml).toMatch(
                        /楽しんできてくださいね/
                    )
                    expect(spy).toHaveBeenCalledWith(request, {
                        visit: 1,
                        date: Date.now(),
                        lastVisitCityDetail: {},
                        lastVisitCity: 'ニューヨーク'
                    })
                    done()
                } catch (error) {
                    done(error) 
                }
            })           
        }); 
    })
});