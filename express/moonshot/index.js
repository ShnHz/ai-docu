const bodyParser = require('body-parser')
const { createFile } = require('../utils/utils_createFile.js')
const OpenAI = require('openai')
const { moonshotKey } = require('../../config.js')
const fs = require('fs')
const multer = require('multer')
const { Readable } = require('stream')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './express/uploads/'
    fs.mkdirSync(dir, { recursive: true }) // 确保目录存在
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名（避免冲突）
    const uniqueName = `${Date.now()}-${file.originalname}`
    cb(null, uniqueName)
  },
})
const upload = multer({ storage })

module.exports = function (app) {
  // get 是否服务器已存在文件
  app.post('/moonshot/get', upload.single('file'), async (req, res) => {
    try {
      const { file } = req

      // 现在文件可以通过 req.file 获取
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: 'No file uploaded' })
      }

      const client = new OpenAI({
        apiKey: moonshotKey,
        baseURL: 'https://api.moonshot.cn/v1',
      })

      const filePath = req.file.path

      // 使用 fs.createReadStream 读取文件流
      const readStream = fs.createReadStream(filePath)

      const file_object = await client.files.create({
        file: readStream, // 使用 buffer
        purpose: 'file-extract',
      })

      let file_content = await (
        await client.files.content(file_object.id)
      ).text()

      const completion = await client.chat.completions.create({
        model: 'moonshot-v1-32k',
        messages: [
          {
            role: 'system',
            content: file_content,
          },
          {
            role: 'user',
            content:
              '请将这篇文献分段总结，每一段总结的开始要用“【第一部分】”这样的格式著明，而每一点则要用“（第1小点）”这样的格式著明（获得全文结构）',
          },
        ],
        temperature: 0.3,
      })

      res.json({
        success: true,
        data: completion.choices[0].message,
        originText: file_content,
      })
    } catch (e) {
      console.log(e)
      res.json({
        success: false,
      })
    }
  })
}
