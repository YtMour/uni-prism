# RateLens image2 素材生成计划

本文档定义 RateLens 第一批产品视觉素材的统一风格、输出清单和 image2 生成策略。

## 统一风格

- 风格名：Gallerist Minimalism
- 视觉关键词：当代艺术画廊、旅行杂志、高级纸张质感、通透留白、柔和阴影、克制金融感
- 主背景：羊皮纸白 `#FBF9F5`、清透浅灰 `#F2F2F2`
- 强调色：松石绿 `#2E5A44`、靛蓝 `#1C2D42`
- 材质：磨砂玻璃、亚光纸张、细腻石材、轻微纸纹
- 避免：高饱和红绿涨跌大盘、霓虹渐变、密集股票图表、加密货币投机感、厚重深色金融后台感

## 第一批素材

| 文件 | 用途 | 尺寸 | 说明 |
| --- | --- | --- | --- |
| `ratelens-product-hero.png` | README、官网、商店首图 | 2048x1152 | 展示产品气质和手机界面 |
| `ratelens-home-screen.png` | 首页页面设计图 | 1024x1536 | 多币种联动换算首页 |
| `ratelens-travel-calculator.png` | 旅行计算器页面设计图 | 1024x1536 | 税费、小费、AA 分摊 |
| `ratelens-settings-screen.png` | 设置页面设计图 | 1024x1536 | 本币、关注币种、语言、缓存 |
| `ratelens-app-icon.png` | App 图标概念 | 1024x1024 | 统一品牌标识，后续可转矢量 |

## 生成命令

需要先在本机环境设置 `OPENAI_API_KEY`。不要把 key 粘贴到聊天里。

```powershell
$env:OPENAI_API_KEY="你的 key"
python C:\Users\Yt\.codex\skills\.system\imagegen\scripts\image_gen.py generate-batch `
  --input tmp\imagegen\ratelens-image2-prompts.jsonl `
  --out-dir output\imagegen\ratelens `
  --concurrency 2 `
  --quality high `
  --force
```

## 验收标准

- 五张图必须使用同一视觉语言，不出现互相冲突的配色或材质。
- 页面设计图必须像真实 App 截图，而不是营销海报。
- UI 文本尽量少，避免模型生成乱码；核心内容以币种代码、数字和图形结构为主。
- App 图标必须简洁，能在小尺寸下识别，不依赖长文字。
- 不出现第三方品牌、真实银行 logo、商店 logo 或水印。
