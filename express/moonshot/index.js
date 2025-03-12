const bodyParser = require('body-parser')
const { createFile } = require('../utils/utils_createFile.js')
const OpenAI = require('openai')
const { moonshotKey } = require('../../config.js')

module.exports = function (app) {
  // get 是否服务器已存在文件
  app.get('/moonshot/get', bodyParser.json(), async (req, res) => {
    try {
      const { modalName } = req.query

      const client = new OpenAI({
        apiKey: moonshotKey,
        baseURL: 'https://api.moonshot.cn/v1',
      })
      const completion = await client.chat.completions.create({
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content:
              '你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。',
            role: 'user',
            content: '你好，我叫李雷，1+1等于多少？',
          },
        ],
        temperature: 0.3,
      })

      res.json({
        success: true,
        data: completion.choices[0].message,
      })
    } catch (e) {
      console.log(e)
      res.json({
        success: false,
      })
    }
  })
}
