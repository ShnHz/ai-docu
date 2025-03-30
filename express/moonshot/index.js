const bodyParser = require('body-parser')
const { createFile } = require('../utils/utils_createFile.js')
const OpenAI = require('openai')
const { moonshotKey } = require('../../config.js')
const fs = require('fs')
const multer = require('multer')
const { Readable } = require('stream')
const axios = require('axios')

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

      // // 使用 fs.createReadStream 读取文件流
      const readStream = fs.createReadStream(filePath)

      const file_object = await client.files.create({
        file: readStream, // 使用 buffer
        purpose: 'file-extract',
      })

      console.log(
        '----------------------------正在解析文件----------------------------'
      )
      let file_content = await (
        await client.files.content(file_object.id)
      ).text()
      console.log(
        '----------------------------文件解析成功----------------------------'
      )
      console.log(
        '----------------------------正在创建缓存----------------------------'
      )
      const cacheTag = filePath
      // const cacheTag = '123'
      try {
        const r = await axios.post(
          `${client.baseURL}/caching`,
          {
            model: 'moonshot-v1',
            messages: [
              {
                role: 'system',
                content: file_content,
              },
            ],
            max_tokens: 1000000,
            ttl: 300,
            tags: [cacheTag],
          },
          {
            headers: {
              Authorization: `Bearer ${client.apiKey}`,
            },
          }
        )
        if (r.status != 200) {
          throw new Error(r.data)
        }
      } catch (e) {}

      const fileCache = [
        {
          role: 'cache',
          content: `tag=${cacheTag};reset_ttl=300`,
        },
      ]
      console.log(
        '----------------------------缓存创建成功----------------------------'
      )

      console.log(
        `----------------------------正在分析文章----------------------------`
      )
      await setTimeout(() => {}, 2000)
      const completion = await client.chat.completions.create({
        model: 'moonshot-v1-32k',
        messages: [
          ...fileCache,
          {
            role: 'user',
            content:
              '请将这篇文献分段总结，每一段总结的开始要用“【第一部分】”这样的格式著明，而每一点则要用“（第1小点）”这样的格式著明（获得全文结构）',
          },
        ],
        temperature: 0.3,
      })
      const step1Res = completion.choices[0].message.content
      // const step1Res = `【第一部分】\n（第1小点）引言：文章介绍了基于血浆中无细胞DNA（cfDNA）的基因组分析，这是一种无创血液生物标志物方法，用于癌症检测和疾病监测。目前的方法主要依赖于靶向肿瘤特异性突变或甲基化分析来识别循环肿瘤DNA（ctDNA）。新兴的方法则是基于识别癌症患者中cfDNA片段化的全基因组改变。\n\n【第二部分】\n（第2小点）cfDNA的特征：文章讨论了健康个体中cfDNA的特征以及这些特征在癌症患者中的变化，并评估了基于靶向方法的cfDNA分析策略，这些策略依赖于检测体细胞突变或DNA甲基化，以及这些方法的局限性。\n\n【第三部分】\n（第3小点）cfDNA的基因组特征：文章详细讨论了靶向检测体细胞突变的方法，包括PCR扩增子测序和杂交捕获区域选择，以及这些方法在早期癌症检测中的挑战。\n\n【第四部分】\n（第4小点）癌症筛查的挑战：文章强调了尽管在预防和治疗方面做出了努力，癌症仍然是全球主要的死亡原因之一。文章讨论了现有的癌症筛查方法，如Pap测试，以及全球组织支持的广泛筛查计划。\n\n【第五部分】\n（第5小点）cfDNA的表观遗传特征：文章探讨了基于靶向DNA甲基化的早期癌症检测方法，这些方法在经过亚硫酸盐处理后检测甲基化位点，以及全基因组cfDNA甲基化分析的挑战。\n\n【第六部分】\n（第6小点）cfDNA片段分析：文章讨论了基于cfDNA片段大小分布、特定片段末端序列基序的频率或cfDNA片段的“锯齿状”末端等整体cfDNA测量方法的研究进展。\n\n【第七部分】\n（第7小点）cfDNA片段组的全基因组分析：文章强调了全基因组方法在提高低覆盖度全基因组测序（WGS）的信息内容和检测方法的灵敏度方面的潜力，并介绍了DELFI方法，这是一种通过浅层WGS分析cfDNA的方法。\n\n【第八部分】\n（第8小点）早期癌症检测：文章讨论了cfDNA检测在高风险人群中早期癌症检测中的应用，包括提高现有筛查计划的效果或检测目前没有筛查方法的癌症类型。\n\n【第九部分】\n（第9小点）结论：文章总结了基于cfDNA的早期癌症检测和筛查方法的进展，并强调了这些测试的成本效益和可访问性对于广泛采用的重要性。\n\n【第十部分】\n（第10小点）其他应用：文章还提到了cfDNA检测在癌症治疗分层、疾病监测和微小残留疾病检测等其他临床场景中的应用。\n\n【第十一部分】\n（第11小点）未来展望：文章对cfDNA检测技术的未来发展方向进行了展望，包括新的测序技术、同时分析序列和甲基化变化的新方法，以及通过药物增加cfDNA丰度的策略。\n\n【第十二部分】\n（第12小点）致谢和作者贡献：文章感谢了实验室成员对手稿的批判性审查，并声明了研究资助来源和作者贡献。\n\n【第十三部分】\n（第13小点）竞争利益声明：文章披露了作者与Johns Hopkins University提交的与cfDNA分析相关的专利申请的关系，以及与Delfi Diagnostics的利益冲突。`
      const sectionList = getStep2Params(step1Res)

      const result = []
      for (let i = 0, len = sectionList.length; i < 1; i++) {
        console.log(
          `----------------------------正在分析${sectionList[i]} 1----------------------------`
        )
        const completion = await client.chat.completions.create({
          model: 'moonshot-v1-32k',
          messages: [
            ...fileCache,
            {
              role: 'system',
              content: step1Res,
            },
            {
              role: 'user',
              content: `以上分段总结中，“【${sectionList[i]}】”对应的原始文献内容是什么，请完整列出，不要缺少字句，而后在恰当的地方插入以“【】”为格式的小标题，保证最终小标题数量为2-5。并进行要点总结（【】为线索提取某个大部分的所有内容，进行亚结构理解）`,
            },
          ],
          temperature: 0.3,
        })
        const step2Res = completion.choices[0].message.content

        console.log(
          `----------------------------正在分析${sectionList[i]} 2----------------------------`
        )
      await setTimeout(() => {}, 2000)
        const completion2 = await client.chat.completions.create({
          model: 'moonshot-v1-32k',
          messages: [
            ...fileCache,
            {
              role: 'system',
              content: step1Res,
            },
            {
              role: 'system',
              content: step2Res,
            },
            {
              role: 'user',
              content: `我是一名生物研究工作者，请翻译这段文字为中文。然后进行要点总结，关键的数值不能丢失，同时给出每个点对应的参考文献序号。翻译的要求为通顺，像是课本一样。（【】为线索针对每个亚结构部分进行翻译、总结）`,
            },
          ],
          temperature: 0.3,
        })
        const step3Res = completion2.choices[0].message.content

        result.push([
          {
            title: sectionList[i],
            content1: step2Res,
            content2: step3Res,
          },
        ])
      }
      res.json({
        success: true,
        data: result,
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

function getStep2Params(text) {
  const cleanedText = text
    .replace(/\n/g, '')
    .replace(/\s+/g, ' ')
    .replaceAll(/【/g, '[')
    .replaceAll(/】/g, ']')
    .replaceAll(/（/g, '(')
    .replaceAll(/）/g, ')')

  const pattern = /(\[第.+?部分\]\(第.+?小点\))/g
  const sections = cleanedText.split(pattern)

  const result = {}
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    if (section) {
      const matchResult = section.match(pattern)
      if (matchResult) {
        const nextstr = sections[i + 1]
        const title = section
          .replaceAll('[', '')
          .replaceAll(']', '')
          .replace('第', '')
          .replaceAll('部分', '')
          .replace(/\(第(.+)小点\)/, '')
        const subtitle = section.replace(`[第${title}部分]`, '')

        if (!result[title]) {
          result[title] = {
            title: `第${title}部分`,
            key: `第${title}部分`,
            children: [
              {
                title: `${subtitle
                  .replace('(', '')
                  .replace(')', '')} ${nextstr}`,
                key: section,
                value: nextstr,
              },
            ],
          }
        } else {
          result[title].children.push({
            title: `${subtitle.replace('(', '').replace(')', '')} ${nextstr}`,
            key: section,
            value: nextstr,
          })
        }
        i++
      }
    }
  }

  const sectionList = []
  for (let k in result) {
    sectionList.push(result[k].title)
  }

  return sectionList
}
