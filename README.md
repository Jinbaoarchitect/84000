# amm × sw — :NOW 網站 demo

雙擊 `index.html` 即可在瀏覽器打開（建議 Chrome，16:9 全屏體驗；視窗比例 ≤ 1:1 或手機上自動切到手機版，見第六輪）。

## 結構

```
index.html        頁面骨架（intro / home / section / page / detail 五個視圖）
css/style.css     全部樣式：6 column 柵格、三欄配色、菜單、canvas；末尾 @media (max-aspect-ratio: 1/1) 為手機版
js/config.js      PocketBase 地址
js/cms.js         從 PocketBase 讀取作品，連不上時回退 demo 數據
js/data.js        demo 圖片清單（src / 寬高），來自 Links/ 壓縮版
js/main.js        交互邏輯與 demo 數據
js/pages.js       journey / biography（設計稿 p.64–71）與 media / contact / acknowledgments（Update Request 0919 設計稿）五個功能頁 + 其 demo 文案
js/canvas.js      多圖界面（infinite canvas）demo 圖清單（assets/canvas/）
assets/img/       demo 圖片（長邊 1600px，源圖仍在 Links/）
assets/intro/     開場兩張靜幀（來自 Update Request 0919/0 - opening）
assets/journey/   journey demo 配圖（1972 郵票、2019 文化博物館，取自設計稿）
assets/bio/       biography demo 肖像（取自設計稿 p.70）
assets/media/     media 頁八張縮圖（客戶 InDesign 資料夾 Links/；logo 已裁去白邊）
assets/contact/   84000 communications logo（從設計稿 PDF 取出的向量 svg，網站內置，不走 CMS）
assets/canvas/    多圖界面 demo 圖，分區 sw / amm / xsw（Update Request 0919/7，長邊 1600）
assets/fonts/     Helvetica Neue webfont（從素材 .ttc 提取）
cms/              PocketBase：schema、啓動腳本、中文錄入界面 admin.html、一鍵導入 import.html、錄入説明
cms/import/       demo-260918 處理後的素材 + manifest.json（原始素材在 material for demo-260918/）
84000/            靜態 review 版（網站 + content/ 內容快照；原名 amm-x-sw-web，已改名並推到 GitHub Pages）；用 ./export-review.sh 同步
export-review.sh  把網站與 cms/import 的內容同步到 84000/（可帶參數指定別的資料夾）
```

## 字號

- `--fs`（≈16px @1920）：列表説明、詳情頁正文等基礎字號；底部 contact / shop / acknowledgments 也用此字號
- `--fs-lg`（= `--fs` × 1.25，≈20px @1920）：首頁三欄名字與時鐘、section / detail 左右側標籤、banner 菜單、search / filter 標題條、detail 頁首行（標題 + 年份 / 類別）
- detail 頁首行的標題與年份 / 類別按 70% 底色遮罩下的圖片採樣取黑或白（`openDetail` 裏的 `heroTones`）；年份 / 類別與標題**同色**（第十九輪修正：設計稿整條中線同一顏色，只有末尾 credits 的標籤和列表説明用灰）
- `--lh-label`（1.2）：以上元素共用的行高；side label 與菜單第一行用同一條規則貼中線，所以 banner 出現時中線上的名字不會位移；菜單行間設為實排（一行一行貼着），組與組之間空一行

## 內容管理

正式內容走 PocketBase，啓動和錄入方法見 **`cms/README.md`**。
用 `cms/start.sh` 啓動後，網站從 <http://127.0.0.1:8090/> 打開即讀取 CMS 數據；
直接雙擊 `index.html` 打開、或 CMS 未啓動時，自動顯示內置 demo 數據。

## 已實現（核心流程）

- **intro**：:NOW 翻頁板（split-flap）——兩張靜幀（`assets/intro/opening-1.jpg` → `opening-2.jpg`）是同一塊翻頁機的照片，以中縫為軸：直接顯示第一張 → 上半頁翻下露出第二張 → 整層（含 16:9 以外的黑邊）一起淡出進入首頁，全程 3 秒內；中縫位置 `css/style.css` 的 `--seam`，時間節點 `js/main.js` `playIntro` 的 `T`，翻頁時長 `FLIP_MS`
- **首頁三欄**：白 stanley wong ｜黑 anothermountainman ｜灰 amm × sw；
  hover 名字切換為 1980 - present / 2000 - present（只在每欄垂直居中 35% 的區域內觸發，`js/main.js` 的 `HOME_HOVER_BAND`）；每 3 秒隨機作品圖 fade in / fade out；標籤與時鐘顏色按當前圖片文字條區域採樣，在黑 / 白 / 灰中取最易讀者，三欄各自獨立（`js/main.js` 的 `toneFor`；用 file:// 直接打開時瀏覽器禁止讀像素，回退為白字）；右側時鐘持續計時
- **section 列表頁**：點擊任一欄進入（從首頁進入時先是純底色 2 秒淡入，期間右側時鐘顯示 back home；底色到位後作品列表由上而下逐行出現，時鐘恢復計時）；對應底色 + 左側名字 + 中欄作品列表 + 右側時鐘
- **banner 菜單**：hover 左側三分之一出現（section 與 detail 頁均可用）；三個身份互切、search / filter / journey / biography / media / en·cn；底部 contact / shop / acknowledgments
- **時鐘**：hover 顯示 `: now`，點擊回到 intro 重新開始（計時歸零）
- **infinite canvas**：右下角按鈕切換；雙向無限拖拽（帶慣性），滾輪平移；點擊作品進 detail
- **detail 項目頁**：全屏頭圖 + 中線信息帶（左名字固定 / 中標題 / 右年份類別）；
  向下滾動依次為 statement、大圖、六格圖排、長段落、雙圖 + 文字、
  colophon（material / collection / exhibition）；點擊任意圖片放大（lightbox），× 或 Esc 逐級退出；
  大圖最下方一行圖片説明（CMS 每張「其他圖片」可填英 / 中，空則不顯示；顏色跟隨白 / 黑 / 灰區）

## 新增（第二輪）

- **多圖作品**：每個作品帶多張圖；列表 hover 時縮略圖輪換，進入 section 時前幾行有進場輪換動效
- **search 頁**（淺灰底）：實時全文檢索（標題 / 年份 / 類別 / tags），無結果顯示 not found；demo tags 見 `js/main.js` 的 `DEMO_TAGS`（含 "hong kong" 等）
- **filter 頁**（淺灰底）：year / category 自定義下拉，選擇即過濾
- **動態菜單**：當前頁面的條目永遠排在第一行（貼中線），同組其他項在其下，
  其餘組依次往下；在 search / filter 頁因控件在左三分之一內，菜單改為貼左邊緣（約 120px）觸發

## 第三輪（demo-260918 素材接入）

- 詳情頁改為**版式引擎**：每個作品的 `layout` 描述圖片排布（row / grid / video / caption，6 欄柵格 span），
  白區 5 個作品按參考稿逐頁配置，其餘作品自動排；colophon 改為自由的 label / value 列表（client / collaboration / award …）
- 影片塊：黑底 + 播放鍵，點擊內嵌播放
- 首頁三欄改為 **同步三聯圖組**（`home_sets`），按順序輪播
- 全站使用 Helvetica Neue webfont
- 一鍵導入頁 `cms/import.html`；中文錄入界面新增視頻 / 信息條目 / 版式 / 首頁圖組

## 第四輪（journey / biography，設計稿 p.64–71）

- **journey**（`js/pages.js`）：中線上一條 1960 → 今年的時間軸，左右各留 `--x-axis`（9.4vw）；
  三個身份是疊在軸上的色帶——白（stanley wong，1980–）壓在中線上、黑（anothermountainman，2000–）在其上、灰（amm × sw，2000–）再上，
  黑帶前有 1993–2000 的刻度引入（筆名 → 首個個人創作）；色帶起止年份在 `JOURNEY.bands`
- 一條通高細線是光標，**鼠標滑到哪它就在哪**——不用按鍵、不用滾輪，與作品縮略圖上的划線同一邏輯
  （觸屏改為拖動）；內容錨在自己的年份上，光標越過某年即亮起該年，到下一個年份再換（`journeyEventAt`）；方向鍵在年份間跳；圖片點擊放大；
- 內容 = `timeline.pdf` 全文（`cms/import/timeline.json`，30 個年份 59 段，中英對照；同一份整理成 `Update Request 0919/timeline.docx`）：
  **一段一條記錄**，`slot` 上方 above = 時序表左欄（個人 / 又一山人），下方 below = 右欄（專業 / 黃炳培）；
  同一年的段落合併成上下兩塊，年份只標在最上一塊；塊太長時自動上移以避開軸線 / 視窗邊（`--j-clear` / `--j-edge`，`layoutJourney`）
  跟手的緩動係數 `JOURNEY.ease`；`JOURNEY.anchor` 切換事件是釘在自己年份上（默認 `year`，光標會穿過文字）還是隨光標一起走（`cursor`）
- 文字默認在光標右側，靠近軸末端自動改到左側並右對齊（上下塊頂邊 `--j-above` / `--j-below` 取自設計稿）；
  圖片在光標另一側、與文字貼中線一邊對齊（右側文字時），或同側另一塊的位置（左側文字時；若上下都有文字則排在文字外側）；大小 `l`（1.5 欄）/ `s`（0.7 欄）
- journey 頁與 search / filter 一樣只在 hover「journey」字樣時出菜單（事件文字會出現在左三分之一）
- **biography**：肖像在 3–5 欄、底邊距中線 6.3vh；正文首行壓中線（正文 = 2026-09-19 提供的黃炳培簡介 + 84000 communications limited 簡介，兩塊各有粗體標題行 `.b-lead`，
  全站小寫慣例；源文件 `cms/import/biography.json`，`cms/import.html` 會寫入 `pages[biography]`）；下方履歷表從 `--x-axis` 到 `--x-axis`，
  列位 = 類型標籤 / 日期 / 類別 / 名稱 / 地點（設計稿 150 / 288 / 418 / 555 / 1088 @1600）；
  每個類型一組，組標籤（帶短橫線）隨滾動**停在中線**直到該組滾完
- 內容來自 PocketBase：`journey_events`（新增 `image_size`、`slot` 兩個可選字段——重新導入一次 `pb_schema.json`；`cms/import.html` 會把 `timeline.json` 一併導入）、
  `pages[biography]`（正文 + 第一張圖為肖像）、`biography_entries`（按 section 分組、日期倒序）；連不上時顯示設計稿轉錄的 demo 文案
- en · cn 切換會即時重繪這兩頁（`PAGES.refresh()`）

## 第五輪（0919 素材修正）

- **白邊裁切**：對 `cms/import/works/`、`cms/import/home/`、`assets/img/` 全部圖片做了均勻白邊檢測，
  裁掉了匯出頁面 / 拼圖殘留的白框（s002/07、s003 的 01–07·10–14·16、s004/18·19、x002/01–03·08、x003/22·23、x005/04·08、
  assets/img 的 w39·w40·w46，`js/data.js` 的寬高已同步）。作品封面（00.jpg）、首頁三欄圖組（固定 640×1080）、
  以及本身就是白底構圖的海報 / 產品圖 / logo（如 x003/21、x005/09·10·12、s004/03）保持原樣。
  所有輸出仍為 JPG · sRGB · 品質 82 · 長邊 ≤ 2400
- **a003 hong kong walk on** 按更新後的素材資料夾重做：去掉舊的 `making of3` 拼圖，
  新增太平地氈 6 張製作過程照（畫布格網 → 簇絨進度 → 紗線 → 工匠）；圖序 00 封面（航拍）/ 01–02 展場 / 03 俯拍 / 04–09 製作 / 10–28 地氈細節，
  `rug 12` 頂部白條已裁；版式：展場大圖 → 雙圖 → 製作四格 → 紗線·工匠直圖一對 → 地氈三張一排（13b 橫圖單排）
- **黑區五個作品按 `Update Request 0919/【black】… project layout 260917.pdf` 逐頁配置**（從 PDF 讀出每張圖的欄位，
  換算成 6 欄 span：邊距 25 / 欄距 320 / 欄寬 270 @1920，圖與素材用相似度比對對上）：
  a001 標題改 `i see ikebana. it is ikebana.`，封面圖也在正文出現（複製為 25.jpg）；
  a002 封面換成 PDF 的頭圖（字言。字語 1 的局部），原封面移入正文，標題兩行、類別 painting、award 2023 tokyo tdc；
  a003 封面換成俯拍局部（making of.png 裁切），航拍圖移到正文（29.jpg），標題 `hong kong walk on / one`、
  類別 installation / product / photography、client / producer / award；陳述只留詩句，兩段散文改為版式裏的段落
  （一段在第 4 欄與詩並列、一段在俯拍圖旁）；a004 年份 `2007 / 2009 / 2012`、special thanks / award；
  a005 封面換成 impermanence 3、年份 2009、類別 installation / furniture，兩張手繪稿從 `_with instruction.png` 拆開，award / collection
- 版式引擎為此加了三種能力（`js/main.js` renderLayout，`cms/layout-editor.js` 原樣保留、JSON 可編）：
  `par` 段落塊（`text_en / text_cn`，正文色；`caption` 仍是灰色説明）；格子可帶 `span:[a,b]`（在柵格上的絕對位置，
  用於一排格子不等距，例如 a003 第 2 欄留空的一排、右側第 5 欄疊四張小圖）、`text_en / text_cn`（圖旁一段文字）
  或 `blocks:[…]`（格子裏再疊圖排，例如 a001 左邊兩張直圖 + 右邊「小雙圖 + 大圖」）；
  兩行標題：頭圖與末尾的標題第一行壓中線、第二行往下（`.d-title` / `.c-title` 改為 pre-line）
- **白區五個作品同樣按 `6 - layout for reference/【white】… project layout 260917.pdf` 逐頁重配**，
  黑白十頁改為同一支轉換腳本生成：從 PDF 讀圖框 → 對回素材（裁過白邊的圖用模板匹配找回內容框，所以 s003 那批書頁
  雖然裁掉了白邊，內容仍落在 PDF 的位置）→ 依上下重疊分排、左右重疊分欄、欄內再分排（遞迴）→ 輸出 span / 格子 span / 嵌套。
  為了連垂直間距也一致，塊和格子新增 `top`（與上一塊底邊 / 本排頂邊的精確距離，單位同 span；網站自身的塊間距
  `--bgap` / 格內 `--lgap` 會被扣掉，所以量到的就是 PDF 上的距離）；s004 陳述左邊那張圖用 `aside:"statement"`
  （與陳述同一行，`.d-head`）；s001 / s005 的影片塊、s005 左圖下的説明文字都按 PDF 位置；s002 / s004 標題兩行。
  第一塊與陳述之間仍用網站預設間距（陳述高度隨文字變）
- **取色修正**：頭圖行的標題 / 年份與首頁三欄的名字 / 時鐘取色，原先在黑白對比幾乎相等時（中灰天空隔着 70% 遮罩正好落在
  白黑各 4.4:1 的平衡點）會擲硬幣，heaven on earth 因此變成黑字。現在 `toneFor` 帶 `prefer`（該區本來的文字色：白區黑、黑區白、灰區黑），
  另一色要好過 1.6 倍才會換，十個作品頭圖全部與所在區一致
- 右下角 × 改為兩條 1.5px 細線畫出（`.close-btn::before/::after`），尺寸 `--fs × 1.5` 方框，三處共用
- **en · cn 介面文字**：`js/main.js` 頂部的 `UI_CN` 字典 + `t()`；按 cn 時網站自己說的話全部換成繁體中文（香港用法）：
  黃炳培 / 又一山人 / 又一山人 × 黃炳培、1980 - 至今、搜索 · 篩選、歷程 · 簡歷 · 媒體、聯絡 · 商店 · 鳴謝，
  搜索 / 篩選頁的 年份 · 類別 · 全部 · 沒有結果 與類別選項，詳情頁末尾的 客戶 · 合作 · 廣告代理 · 獎項 · 收藏 · 物料 · 製作 · 特別鳴謝，
  簡歷的 個展 · 聯展 · 獎項 · 收藏 · 講座；首頁三欄名字與 hover 的年期、左側名字也一起換。
  作品本身的標題 / 類別 / 陳述 / credits 仍讀 CMS 的 `_cn` 欄位，空則回退英文。切換時當前畫面就地更新
  （詳情頁保持捲動位置）。字典裏沒有的英文標籤保持原樣；`<html lang>` 同步為 zh-Hant-HK / en，
  字體堆疊在 Helvetica Neue 之後加了 PingFang HK / TC、Noto Sans TC、微軟正黑
- 圖片改動只在 `cms/import/` 與 `assets/`，PocketBase 裡的舊圖要重新匯入一次：
  啟動 `cms/start.sh` 後打開 <http://127.0.0.1:8090/cms/import.html> 點「開始導入」（會更新已有記錄，不會重複建）；
  a003 中文陳述首行「裝飾」來自 docx 原文，疑似多餘，未改

## 第六輪（手機版，設計稿 `Update Request 0919/amm x sw website - Mobile.pdf`）

- **觸發條件是視窗比例，不是寬度**：`css/style.css` 末尾的 `@media (max-aspect-ratio: 1/1)`，
  視窗成 1:1 或更窄（9:16、iPhone 任何機型、桌面瀏覽器縮到直幅）即切到手機版；`js/main.js` 的 `isMobile()` 是同一條件，
  跨過 1:1 時當前頁面會自動重排。設計稿畫幅 1080 × 1810，所有尺寸按此換算成 vw：
  邊距 `--inset` 40 → 3.7vw、名字 / 時鐘 / 菜單 48 → `--fs-lg` 4.44vw、説明與正文 36 → `--fs` 3.33vw、
  陳述 / journey / biography 42 → `--fs-body` 3.9vw（都帶 clamp，方形大視窗不會無限放大）；
  上下邊距另加 `env(safe-area-inset-*)`，頭圖用 `100dvh`（iPhone 地址欄伸縮不跳）
- **中線讓位給四角**：名字在左上、時鐘在左下、× 與列表 / 格網切換在右下；首頁三欄改為上中下三條橫幅（各 1/3 高），
  名字在各條左上，時鐘在灰條左下；點任一條進入該區
- **作品列表**一欄（120 → 960 @1080），説明在圖下方；**左右滑動切換三個身份**（白 → 黑 → 灰，首頁順序，
  舊列表滑出、新列表滑入，`swipeSection`）；右下角圖標切到**兩欄瀑布格網**（`buildCanvasMobile`，可上下滾動，
  代替桌面的無限拖拽畫布）
- **菜單**：點左上角名字（或 search / filter / journey / biography 字樣）打開，第一行落在名字原位，內容變暗；
  點空白處關閉；contact / shop / acknowledgments 在時鐘上方一行
- **詳情頁**：頭圖一屏高（標題在 35% 高、年份類別在 69% 高，兩者顏色仍按圖片採樣），隨頁滾走（不再釘住），
  70% 遮罩滾半屏即褪盡；陳述通欄；**版式自動重排**（`mobileBlocks`）：一排最多兩張並列（寬度比按原柵格）、
  更長的一排兩張兩張折行、格子裏的嵌套與 grid 攤平進同一序列、單張圖保持原來的左 / 中 / 右位置但不窄於半欄、
  圖旁的段落改為圖後通欄、`top` 偏移忽略；colophon 不再佔一屏，順排在最後（標題、空兩行、條目各空一行）
- **journey** 改為逐年清單（`renderJourneyList`）：每年一條橫線、年份加 [年齡]（`JOURNEY.born`）、段落各空一行、圖在段落下
  （`s` 30vw / `l` 通欄）；桌面的滑軸邏輯不變
- **biography**：肖像通欄、正文在下；履歷表折成「日期 ｜ 類別 / 名稱 / 地點」三行一條（純 CSS，數據不變）
- 首頁三條橫幅：第十三輪已改用客戶提供的橫圖（`home_sets` 的手機字段）；設計稿裏的黑區 hong kong walk on 是示意排版（圖與現有素材不同），
  網站按上面的通用規則重排，未逐頁手排

### 第六輪補（手機端修正）

- × 與列表 / canvas 切換鍵和左下角時鐘共用同一行框（同底邊、同高度），中心對齊時鐘；兩者同為 `--m-line`（1.25px）細線，× 寬約一個名字字號，切換鍵 5.5 × 4vw
- 手機端 canvas 不再是只能上下捲的兩欄格網，改為與網頁端相同的無限畫布（雙向環繞、任意方向拖、帶慣性），欄寬約兩欄可見；canvas 打開時左右滑不切換身份
- 詳情頁重排改為只有單圖與雙圖：柵格上寬過一半的格子通欄，窄的兩張一行等寬，落單的保持原左 / 中 / 右位置半欄寬；grid 與嵌套一律攤平
- 底色：`html` 透明、`body` 隨分區（白 / 黑 / 灰 / 淺灰）換色，`<meta theme-color>` 由 `setBodyTheme()` 同步，捲動容器關回彈——Safari 工具欄與回彈區不再露黑

## 第七輪（多圖界面 / infinite canvas 的圖源）

- **demo**：`Update Request 0919/7 - website 多图界面 - 素材` 的 62 張（白 23 / 黑 25 / 灰 14）處理成 `assets/canvas/<sw|amm|xsw>/NN.jpg`
  （長邊 1600 · JPG q82 · sRGB，CMYK 已轉、PNG 已壓平），清單在 `js/canvas.js`（`CANVAS_DEMO`）與 `cms/import/canvas.json`（含原文件名）。
  網頁端與手機端共用同一套：連不上 CMS 時，canvas = 該分區作品封面 ＋ 這批圖
- **正式版（CMS）**：canvas 圖池 = 該分區所有作品的**封面** ＋ 作品「其他圖片」裏勾了 **canvas** 的圖（`image_captions` 每項多一個 `canvas: true`，
  中文錄入界面每張圖下方有勾選框）＋ 新 collection **`canvas_items`**（左欄「canvas 圖庫」：分區 / 圖片 / 關聯作品編號 / 備註 / 順序 / 啓用）。
  點封面或作品圖進該作品；圖庫的圖填了編號則進該作品，否則點開放大。錄入界面登錄時若庫裏還沒有 `canvas_items` 會自動建立（`pb_schema.json` 也已加入）；
  `cms/import.html` 會把 62 張 demo 圖寫入 `canvas_items`（按原文件名去重，可重複運行）
- 每次進 canvas 圖池洗牌後逐張發（`buildCanvas` 的 deck），一張圖出完一輪才會重複；`canvasPool(who)` 是唯一取圖的地方

## 第八輪（review 版 / GitHub Pages）

- **`amm-x-sw-web/`** 是可以直接 `git init` 上傳的靜態 review 版：網站 + 內容快照，不需要 PocketBase。
  `js/config.js` 裏 `PB_URL = ""`、`CONTENT_URL = "content/"`；`js/cms.js` 新增 **靜態內容模式**（`STATIC`）：
  沒有 CMS 時直接讀 `content/` 裏與一鍵導入相同的 json（manifest / timeline / biography / canvas）與圖片、影片；
  讀不到（例如雙擊 file:// 打開）才回退內置 demo 數據。主項目的 config.js 不變，仍走 PocketBase
- 內容更新：在主項目改好 → `./export-review.sh`（同步網站文件與 `cms/import/*` 到 `amm-x-sw-web/content/`，影片缺席時轉 720p）→ 到 `amm-x-sw-web` 裏 commit / push。
  首次上傳與 GitHub Pages 設置見 `amm-x-sw-web/README.md`；review 版的 CV 履歷表暫用網站內置的轉錄清單（`biography_entries` 未匯出）
- **en · cn 介面文字**（重建）：`js/main.js` 頂部 `UI_CN` + `t()`，`applyLang()` 就地更新當前畫面（詳情頁保持捲動位置、search / filter 只換標籤）、
  `<html lang>` 同步 zh-Hant-HK / en；`toneFor` 加回 `prefer`（`TONE_NATIVE`，另一色須好過 `TONE_SWITCH` = 1.6 倍才換）；字體堆疊加 PingFang HK / TC、Noto Sans TC、微軟正黑。
  ——這些原本在 9/19 已由另一個 session 寫入 main.js，9/20 手機版第二輪覆蓋文件時被抹掉（當時只按上一輪的快照改），現按 README 的描述重建；若當時還有其他未寫進 README 的改動，需要再補

## 第九輪（banner 觸發區、Vimeo）

- **網頁端 banner 菜單**只在左側三分之一、且**從首頁名字反應帶的上緣（視窗 32.5% 高）往下**的區域 hover 才出現，左上角與首頁一樣安靜；離開這個區域即收起（`js/main.js` mousemove 的 `inZone`，與 `HOME_HOVER_BAND` 共用同一高度）。search / filter / journey 頁仍只由字樣觸發
- **影片改 Vimeo 內嵌**：作品新增 `video_url`（Vimeo 連結；CMS 字段由錄入界面登錄時自動補上，`pb_schema.json` 也已加），
  詳情頁的影片塊仍是封面幀 + 播放鍵，點擊換成 `player.vimeo.com` 的 iframe（`vimeoId()` 從連結取 id；沒有連結才用 mp4 文件）。
  三個作品：s001 full moon → vimeo.com/977511137、s005 red light / wheel → vimeo.com/366693695、x002 life is beautiful → vimeo.com/298339302；
  `cms/import/video/` 與 review 版的 mp4 已刪，只留封面幀；重跑 `cms/import.html` 會寫入連結並清掉 PocketBase 裏的舊 mp4

## 第十輪（media / contact / acknowledgments；多圖界面點擊）

設計稿：`Update Request 0919/amm x sw website - media- contact-acknowledgement.pdf`（1920 畫幅；素材在同名 InDesign 資料夾）。
三頁共用簡歷頁的文字欄位（第 2 欄起，`--b-left`），左側標籤與右側時鐘照舊壓中線；手機版都是標籤下一欄通排。

- **media**（`renderMedia`）：清單從視窗頂端開始往下捲，標籤留在中線上。一則報道一行：左邊 2–3 欄是標題（黑）＋ 日期 / 來源 / 網址（灰、網址底線），
  右邊第 4 欄是 16:9 縮圖（270 × 152 @1920），文字與圖頂對齊，行距 50 @1920；整行是鏈接，點擊新窗口打開。
  影片截圖滿版；刊物 logo（`frame`）白底加細框、內縮顯示。內容按日期由新到舊。
  demo 八則（設計稿全部）在 `js/pages.js` 的 `DEMO_MEDIA`，同一份在 `cms/import/media.json`；縮圖 `assets/media/01–08`
- **contact**（`renderContact`）：84000 communications logo（`assets/contact/84000-communications.svg`）壓中線、置於文字欄，
  下方隔 50 @1920 是聯絡資料，字號同標籤（`--fs-lg`、行高 1.2），組與組空一行；電郵 / 電話 / 網址自動變成鏈接（`autoLink`）
- **acknowledgments**（`renderAcknowledgments`）：鳴謝辭粗體、首行壓中線（與標籤同一規則），空兩行後是各組名單，組間空一行，寬度 2–4 欄；
  正文的第一段（到第一個空行）就是鳴謝辭，其餘每段一組。設計稿裏的 rongran zhang 已按客戶更正為 **yongran zhang**；
  另外統一了幾處斜線前後的空格（jen halim / david cheung、kelvinhung → kelvin hung、patrick lai / shirley chow、nelson ng 行末補斜線）
- **CMS**：`media_items` 改為 media 頁的一則報道：`title` / `date`（2026/05）/ `source`（刊物 / 頻道）/ `url` / `image`（縮圖）/ `frame`（logo 勾選）/ `kind`（可選）；
  錄入界面登錄時自動補上新字段（`pb_schema.json` 也已更新）。contact / acknowledgments 走 `pages[key]` 正文（純文字，空一行分段）。
  `cms/import.html` 會把 `media.json`（按網址去重）、`contact.json`、`acknowledgments.json` 一併導入；靜態 review 版讀同名 json
- **多圖界面點擊**：demo 圖池的 62 張已與已上傳的作品圖做相似度比對，14 張是作品裏的同一張圖（`js/canvas.js` 與 `cms/import/canvas.json` 的 `work`，
  導入時寫進 `canvas_items.work`），點擊即進該作品；其餘沒有對應作品的圖，點擊**隨機進同一分區的一個作品**（demo 階段作品少，先這樣示意；
  `js/main.js` 的 `CANVAS_ORPHAN` 改成 `"lightbox"` 就回到點開放大）
- `export-review.sh` 改為同步到 `84000/`（review 版資料夾已改名並上傳），並帶上三個新 json
- **review 版圖片壓縮**（`tools/compress-review.py`，`export-review.sh` 每次同步後自動跑）：只動 `84000/` 裏的圖，主項目原圖不變、代碼不變、檔名與比例不變。
  作品封面長邊 1920 · q76，其他作品圖 1600 · q72，首頁圖組 1080 · q75，canvas 圖 1000 · q70，demo 圖池 1200 · q70；漸進式 jpeg、去 metadata。整站 162 MB → 約 76 MB。需要 `pip3 install pillow`

## 第十一輪（繁體中文補齊）

- 以美術館 / 媒體專訪的書面語、香港用法，補齊所有仍缺繁體中文的內容：**biography** 正文（黃炳培簡介 + 八萬四千溝通事務所簡介，`biography.json` 的 `body_cn`）與履歷表全部條目
  （類別 / 名稱 / 地點，`biography.json` 新增 `entries`，每條含 en / cn；`cms/import.html` 會寫入 `biography_entries`，靜態 review 版也直接讀它——此前的「未匯出履歷表」已補上）；
  **media** 八則的標題與來源；**contact**、**acknowledgments** 正文；作品 **x001**（香港故宮文化博物館 / 器惟求新——展覽官方中文名）的標題、類別、陳述；
  各作品 credits 的中文值（客戶 / 合作 / 廣告公司 / 獎項 / 收藏；人名清單保留英文）
- 介面字典（`js/main.js` `UI_CN`）改香港用法：search → 搜尋、not found → 找不到結果、agency → 廣告公司、producer → 監製
- demo 文案（`js/pages.js` 的 `DEMO_BIO` / `DEMO_MEDIA` / `DEMO_CONTACT` / `DEMO_ACK`）與 json 同步，均為 en / cn 雙語；`DEMO_BIO` 改為 `rec {body_en, body_cn}` + 雙語 `entries`
- 未能查證官方中文名、由譯者擬定的展覽名：觀．空（perceive emptiness）、眼前事（of things present）、一日拍攝。一日展出。、從蘇軾到八大山人——幻象的寫照、痕跡：再上路、未來式：紅白藍——請客戶核對；
  contact 地址的 eaton house 未見官方中文名，保留英文

## 第十二輪（客戶批註修正）

- media 的刊物 logo 改為透明 png 放在頁面灰底上，16:9 的黑色細框保留（不再白底；`assets/media/02–05.png`，黑色 logo 取墨色為 alpha，FT 方塊內的白色保留）；手機版縮圖只佔屏幕一半寬
- contact 的 84000 logo 向左微移 5% 字高，讓「8」的弧線與下方文字視覺對齊
- 詳情頁：作品陳述改為與標題同一字號（`--fs-lg`）；末尾 credits 改小一級（`--fs`），標題不變
- 作品列表：標題中的換行保留（a002「seeing words in hong kong / redwhiteblue //」第二行「words talking / self talking」）
- acknowledgments：producer → production（中文 製作）

## 第十三輪（手機版開場與首頁）

- **開場翻頁更順**（只影響手機版）：手機用 960 寬的兩張靜幀（`assets/intro/opening-*-m.jpg`，各約 10 KB），載入後先 `decode()` 再開始翻，
  等待上限放寬到 2.5 秒；作品 / canvas 圖池 / journey / biography / media 等重內容改在開場播完後才載入（`js/main.js` 的 `afterIntro`），
  不再與翻頁動畫搶主線程——之前手機上「卡一下」多半是同時解碼幾十張大圖造成的。網頁端流程不變（仍是並行載入、原尺寸靜幀）
- **手機首頁三條橫幅改用客戶提供的橫圖**：`Update Request 0919/1 - mobile - homepage - images of 3 zones`（每區 12 張，1080 × 604，按檔名 zone1/4/7… 分成 12 組，與桌面 12 組一一對應）
  → `cms/import/home/setNN-<sw|amm|xsw>-m.jpg`；`manifest.json` 每組多 `sw_m / amm_m / xsw_m`；`home_sets` 多三個可選的手機檔案字段（錄入界面「手機版三條橫幅」，登錄時自動補字段；`import.html` 一併寫入）；
  網站在手機模式取 `_m` 圖，沒有就退回直圖居中裁切；視窗跨過 1:1 時首頁會換到對應的一組圖

## 第十四輪（首頁輪播閃一下）

- 原因：換圖時是先把新圖設成背景、立即開始淡入，0.65 秒後就把舊圖層拿掉——第一次看、圖還沒下載完時，新圖層是空的，
  舊圖一撤就露出底色，圖片再「啪」一下出現。用 1.5 Mbps 模擬測：原本 27 次換圖全部在圖片載完之前就開始淡入
- 修法（`js/main.js` `warmImage` / `warmHomeSets`）：每張圖先 fetch + `decode()` 完成才開始交叉淡入（等待從淡入開始才計時，慢網只會延後、不會縮短停留）；
  每個分區在停留期間預熱自己的下一張；整套 12 組在首頁出現後錯開 0.35 秒逐組預熱；`home_sets` 一到就先預熱第一組三張。
  同樣的模擬下換圖 25 次、0 次在載完前開始。桌面與手機共用同一套（手機取 `_m` 圖）

## 第十五輪（頁面切換淡入）

- 所有視圖切換改為 0.55 秒的溶接（`js/main.js` `show()`，`css` `.view-in / .view-out`）：列表 → 作品、作品 → 列表、菜單 → journey / biography / media / contact / acknowledgments、search / filter、關閉回列表。
  規則：只動一層——新視圖在舊視圖之上（z-index）就淡入蓋住它，在之下就讓舊視圖淡出露出它，中途不會透出底色。首頁 → 分區仍是原本的 2 秒底色漸入
- 進作品頁會先等頭圖解碼完成再淡入（上限 0.7 秒，慢圖不會卡住點擊），頁面溶接之外頭圖自身再從分區底色浮出（1.1 秒），標題行與正文慢 0.3 秒跟上——列表與作品頁同底色，只靠整頁溶接在黑 / 白區幾乎看不出來；同一視圖內換內容（菜單裏換分區、換功能頁）則是內容淡入（`contentIn`）；語言切換不淡
- 手機版同一套

## 第十六輪（手機版作品頁重排：整幅 / 半幅 / 一對）

- 手機上的作品頁不再「窄的一律兩張並排」。每張圖只有三種尺寸（照 Mobile.pdf 的 hong kong walk on 示意）：**整幅**、**半幅獨立**、**一對**。
  規則（`js/main.js` `mobileBlocks`）：橫圖（寬高比 ≥ 1.15）一律整幅——半幅的橫圖只剩郵票大；桌面版式裏本來就超過半欄的格子整幅；
  直圖 / 方圖遇到下一張也是直圖就配成一對，否則半幅獨立，靠桌面格子原來的左 / 中 / 右（沒有位置資料就左右交替）。grid 與嵌套照樣攤平，文字段落通欄排在圖後
- 橫直判斷需要圖片尺寸：`manifest.json` 每個作品新增 `sizes`（檔名 → [寬, 高]）；PocketBase 存進 `image_captions[i].w / h`——
  錄入界面保存時對新上傳的圖自動量尺寸，`import.html` 導入時寫入（保留已有的説明和 canvas 勾選）。沒有尺寸的舊記錄，手機打開時先量一次（上限 1.5 秒）再排

## 第十七輪（灰區五個作品按 `Update Request 0919/4 - grey…/【grey】… project layout 260923.pdf` 重做）

- 五個作品（x001 器惟求新 / x002 life is beautiful / x003 redwhiteblue 330 / x004 a bowl of life / x005 fang suo）的圖片全部改用 `Update Request 0919/4 - grey_anothermountainman x stanley wong` 這批素材：
  封面 = 各資料夾的 `cover image.*`（設計稿因版面長度限制封面未必顯示正確，照客戶意思沿用模板、只換封面圖）；正文圖按設計稿順序編號，資料夾裏設計稿沒用到的圖接在後面。
  流程與黑白區相同（`.claude-tmp/grey/build.py`）：`pdftohtml -xml` 讀圖框與文字位置 → 圖片相似度對回素材（全部 ≥ 0.99；三張是素材的裁切，用模板匹配找回裁切框；
  方所那張印章畫在 PDF 裏旋轉了 90°、pdftohtml 漏掉，手動補上）→ 上下重疊分排、左右重疊分欄、欄內遞迴 → `span / top` 精確到設計稿距離
- 標題 / 年份 / 類別 / 陳述 / 末尾 credits 也按設計稿更新：x001 標題改為兩行 `the quest for originality / contemporary design` + `and traditional craft in dialogue`（中文 器惟求新 / 當代設計對話古代工藝），年份 `2021-2026`、類別加 `film`；
  x005 年份 `2011-now`；credits 標籤按設計稿（client / creative collaboration / award；x004 是 green bowl-scape / yu tek-li）；`creative collaboration` 中文 創作合作
- **x001 兩段影片**（artisans / designer）：`cms/import/video/x001-artisans.mp4`、`x001-designer.mp4`（原檔 1080p 228 MB / 1.1 GB，壓成 720p 18 / 43 MB）+ 封面幀。
  版式引擎的影片塊新增 `file`（作品 `videos` 裏的檔名）與 `poster`：一個作品可以有多段影片，各在自己的位置；沒有 `file` 的影片塊仍用作品的 Vimeo 連結 / 單一 mp4（x002 仍是 Vimeo）。
  CMS：`works` 新增 `videos`（多檔）與 `video_posters`（封面幀，檔名開頭對應）兩個字段，錄入界面登錄時自動補；`import.html` 一併上傳。
  **不上 GitHub**：`84000/.gitignore` 擋住 `content/video/*.mp4`，`export-review.sh` 只把檔複製到 `84000/content/video/`——本機 `python3 -m http.server` 演示看得到，線上版只有封面幀（點了沒有反應）
- 方所 logo（`fang suo logo.svg`）轉成透明 png（`x005/02.png`）放在設計稿位置

## 第十八輪（網頁端菜單不再搶走圖片 / 影片的操作）

- 左側三分之一的 hover 菜單改為：指針在**圖片或影片**上（作品頁的圖、影片塊與播放控制條、列表縮圖、canvas 圖、journey 圖、肖像、media 縮圖）時**不觸發**，
  只有在空白底色、或中線左側的名字上才會打開（`js/main.js` `MENU_HOVER_IGNORE`）；並且要在觸發區停留 **250 毫秒**才打開（`MENU_HOVER_DELAY`），指針只是路過不會閃出菜單。
  已打開的菜單照舊在離開區域時收起。手機版不受影響
- 起因：作品頁影片塊從第 2 欄開始，播放鍵與播放後的控制條落在左三分之一，一靠近就被菜單蓋住

## 第十九輪（作品頁頭圖行顏色）

- 頭圖行的年份 / 類別原本用比標題淺一級的灰（深灰 #3c3c3c / 淺灰 #d2d2d2），與設計稿不符：白 / 黑 / 灰三份版式 PDF 裏整條中線（名字、標題、年份、類別、時鐘）都是同一顏色。已改為與標題同色（仍按頭圖採樣取黑或白）。
  同類檢查：末尾 credits 的標籤（client / award …）在 PDF 是 #7f7f7f 灰——保留；作品列表的年份 / 類別、media 的日期 / 來源、簡歷表的類別 / 地點按各自設計稿本來就是灰——保留
- 靜態版讀 json 改為 `cache: "no-cache"`（每次向伺服器確認，未改動時只是 304）：本機 http.server 或 GitHub Pages 更新後不會再看到舊的 manifest（例如舊標題）

## 第二十輪（瀏覽時間統計 / a003 地氈段落）

- `js/track.js`：正式上線（客戶伺服器跑 PocketBase）後，每次訪問在 `visits` 集合留一筆記錄——只計頁面在畫面上的秒數（切分頁、鎖屏不算），並按開場 / 首頁 / 分區 / 作品 / 頁面分配。
  停留滿 5 秒才建立記錄（跳出與爬蟲不計），之後每 20 秒更新一次，離開頁面時（visibilitychange / pagehide，fetch keepalive）再送一次；手機 Safari 不一定觸發離開事件，最多少算約 20 秒。
  不用 cookie、不存 IP；瀏覽器開了 Do Not Track / GPC 則不記錄；靜態審閱版（84000，無 PocketBase）不啟用
- 權限：公眾只能新增；只有持有該次訪問隨機 `sid` 的頁面能更新（`@request.body.sid = sid`）；只有管理員能讀
- 後台新增「瀏覽統計」：7 / 30 / 90 / 365 天，每日訪問數、平均 / 中位數停留、手機 / 電腦、停留時間分佈、各作品與分區 / 頁面的時間、來源網站
- 首次以管理員登入後台會自動建立 `visits`（或匯入 `cms/pb_schema.json`）。順帶修正：PocketBase 0.23+ 的 404 訊息是 “wasn't found”，原來的判斷沒認出，canvas_items 的自動建立也有同一問題
- a003 地氈長段：按客戶紅線在 “photo reference.” 與 “processing.” 後換行（中文對應在「直接上畫及織造。」與「來織造此地氈。」後）

## Demo 階段的簡化（後續待做）

- 三個時期共用全部 55 張圖隨機混用；正式版在 `js/main.js` 的 `WORKS`
  處按時期分配圖片、真實標題 / 年份 / 類別 / tags（或改為讀取 JSON/CMS）
- shop 為佔位頁；biography 的第二組（group exhibition）為 demo 佔位行，
  設計稿 p.71 只列到 2006 / 02，更早條目待錄入
- en · cn 切換隻有狀態樣式，未接雙語文案
- detail 頁的文字與 colophon 信息均為 demo 佔位，版式已按設計稿排好
