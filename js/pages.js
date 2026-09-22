/* ————————————————————————————————————————————
   function pages — journey / biography / media / contact / acknowledgments
   design: amm x sw website v6.pdf p.64–71;
           Update Request 0919/amm x sw website - media- contact-acknowledgement.pdf
   content: PocketBase (journey_events · pages[biography|contact|acknowledgments] ·
            biography_entries · media_items) with the demo transcriptions below as fallback
   ———————————————————————————————————————————— */

/* ————— demo content — the full timeline (cms/import/timeline.json, transcribed from
   Update Request 0919/timeline.pdf). one record per paragraph, exactly the shape of a
   `journey_events` row: slot "above" = the pdf's left column (personal / anothermountainman),
   slot "below" = its right column (professional / stanley wong) ————— */
const DEMO_JOURNEY = [
  { year: 1960, slot: "above", en: "born in hong kong.", cn: "香港出生。" },
  { year: 1964, slot: "above", en: "rather frail, had to see doctor very often. suffered from motion sickness.", cn: "自小體弱多病。暈車浪，暈船浪。" },
  { year: 1972, slot: "above", image: "assets/journey/1972-stamp.jpg", size: "s", en: "inspired by kan tai-keung's stamp design for the year of the rat, realized the possibilities of design.", cn: "被靳埭強的鼠年郵票設計引發思考，設計的可能性。" },
  { year: 1975, slot: "above", en: "unable to memorize formulas and failed chemistry, no way to get into university in hong kong.", cn: "記不了公式，化學科不合格，已注定不能考進香港大學學府。" },
  { year: 1975, slot: "below", en: "got my first photography prize (2nd runner-up) in a school competition.", cn: "在學校比賽，第一次拿到攝影獎項（季軍）。" },
  { year: 1977, slot: "above", en: "as a tailor, father did not allow me to apply fashion courses in hong kong polytechnic, and made it clear that the family could not afford sending me to study in france.", cn: "任職裁縫的父親不贊成我報讀理工時裝科目，也表明沒經濟能力送我到法國留學。" },
  { year: 1980, slot: "above", en: "after a year of evening design course, the tutor discovered that i was not a full-time designer joining evening courses (application requirement at that time) and terminated my remaining 3-year course.", cn: "上了一年理工（晚間）設計課後，給老師知道我並非日間在職設計師在晚間進修（當時入學要求資格），停止了我繼續另外三年課程。" },
  { year: 1980, slot: "above", en: "got first pay check of $1500 and bought the first camera (canon f1), never stop taking photos since then.", cn: "用第一份收到的薪金一千五百元買了人生第一部相機（canon f1），往後就一直機不離身，在路上拍照。" },
  { year: 1980, slot: "below", en: "graduated from hong kong technical teachers' college (design and technology).", cn: "畢業於香港工商師範學院。" },
  { year: 1980, slot: "below", en: "starting working in a 3-person design firm as graphic designer.", cn: "開始在一間連兩老闆的三人設計公司當平面設計師。" },
  { year: 1985, slot: "below", en: "joined advertising firm to learn sound & visual production skills of tv commercials, from art director to creative director. from modern advertising, grey (hk), to j. walter thompson (hk).", cn: "為學習廣告片的聲╲畫製作技能，開始進入廣告公司；由美術指導，一直升至創作總監。由現代廣告到精英廣告到智威湯遜廣告。" },
  { year: 1990, slot: "below", en: "embraced success in advertising scene with the mtr tv commercial series (red light), a starting point of over 600 awards. not until i worked for 10 years did i receive my first award, not having so much luck.", cn: "憑地下鐵路（紅綠燈篇）電視廣告系列在圈內建立名聲，是六百多個獎項的起點。工作十年才得到第一個獎，也不算順利或有運氣。" },
  { year: 1993, slot: "above", en: "became a vegetarian to abstain from taking life.", cn: "為不想殺生，開始茹素。" },
  { year: 1993, slot: "above", en: "adopted the pseudonym \"anothermountainman\" with respect to bada shanren (mountain man of the eight greats), to create another identity away from stanley, who is related to commercial world, getting prepared for future personal creative works.", cn: "敬重八大山人，給自己別名又一山人，以另外身份識別從事商業創作的黃炳培，為將來個人創作準備。" },
  { year: 1993, slot: "above", en: "set goals to voice for people's harmony and values of peace through communication creation skills.", cn: "決心定下目標，以溝通創作能力，為人之和諧，和平價值發聲。" },
  { year: 1993, slot: "below", en: "held the first solo photography exhibition named \"1 ordinary man, 10 years, 100,000 kilometres on the road.\"", cn: "舉辦人生首場攝影個展「一個人。十年。十萬公里路。」。" },
  { year: 1994, slot: "below", en: "to try new tasks and challenges, quitted the job as creative director of the mtr account after four and a half years of partnership. a position where i could give full play to creativity, receive awards every year, and with 100% trust from clients. industry insiders were pretty shocked indeed.", cn: "為要自己接受不同嘗試和挑戰，毅然辭任合作了四年半的地下鐵路廣告創作總監；一個能無限發揮，極得客戶信任，每年拿獎的工作。行內譁然了一陣子。" },
  { year: 1996, slot: "below", en: "without any prior planning, joined bartle bogle hegarty as regional creative director and moved to singapore, became the first chinese to undertake this position within the asian industry.", cn: "在沒有任何計劃下，答應擔任 bartle bogle hegarty 亞太區創作總監，遠赴新加坡開荒，為亞洲廣告圈中首位華人出任此職位。" },
  { year: 1998, slot: "below", en: "moved back to hong kong, since bbh had developed into a scale of 40 teammates, and everything was on track, and that regional (asian) advertising lacks colloquial language, which restricted creation.", cn: "至 bbh 發展到四十員工，一切上軌道之後，有感亞洲廣告欠缺地道語言，文字創作受制肘，斷然回歸香港從事有語文創作的廣告。" },
  { year: 1998, slot: "below", en: "became chief executive officer and executive creative director of tbwa(hk).", cn: "出任香港 tbwa 之行政總裁及行政創作總監。" },
  { year: 2000, slot: "above", en: "realized on the day of my 40th birthday that the dream of becoming a film director was yet to explore, felt like everything has to start all over again.", cn: "四十歲生日當天，有感於導演夢還未打開。感覺一切由零開始。" },
  { year: 2000, slot: "below", en: "losing confidence in the professionalism and future of the entire advertising scene in hong kong, left the family of 4a advertising.", cn: "對香港整個廣告業之專業和行業未來失去信心，終於離開 4A 廣告的大家庭。" },
  { year: 2000, slot: "below", en: "joined centro digital as chief creative officer.", cn: "出任先濤數碼創作總監。" },
  { year: 2001, slot: "above", en: "been constantly invited by creative schools and agencies in the creative industry to share experience, embarked on 20 years of creative education work, treating it as social responsibility.", cn: "相繼獲各大創意院校及創意業界單位邀請，開始二十年馬不停蹄的創意教育工作，視為社會責任。" },
  { year: 2001, slot: "below", en: "invited by wang xu, designer from mainland china, to take up photography work for clothing design brand exception de mixmind, working very close with clothing designer ma ke, then began working on marketing and creative work with cultural enterprises in the mainland since then.", cn: "獲國內設計師王序邀請負責服裝設計品牌「例外」攝影工作，之後跟設計師馬可合作無間。從而開啟中國國內文化企業之市場推廣及創意之路。" },
  { year: 2001, slot: "below", en: "invited by sabrina fung to join \"art window\" project and started personal creative works ever since. has been active in both local and overseas art scene, participated in more than 150 shows.", cn: "獲馮美瑩邀請參與「藝術窗」項目開始，正式開展個人創作，活躍於香港及國際藝壇，參與超過一百五十場大小展覽。" },
  { year: 2001, slot: "below", en: "\"redwhiteblue\" poster made debut in hong kong heritage museum and enjoyed great popularity as being down-to-earth. with \"redwhiteblue \\ build hong kong\" as a beginning, the series kept developing and continued to promote positive social values. was therefore named \"mr. redwhiteblue\".", cn: "「紅白藍」海報首次展出於香港文化博物館，地道親民的反應感受熱烈。往後從「紅白藍╲香港建築」出發持續發展，推動正面積極的社會價值，後被冠名「紅白藍先生」。" },
  { year: 2002, slot: "below", en: "left centro digital and set up threetwoone film production limited with partner. has produced more than 200 tv commercials, mv and short clips, with own scripts and screenplays from advertising agencies.", cn: "離開先濤，與合夥人創立三二一聲畫製作有限公司。至今，拍了約二百個人家、自己的劇本，涵蓋電視廣告、MV 和短片。" },
  { year: 2003, slot: "above", en: "went dharma drum mountain in taiwan to join the first meditation retreat, and made the commitment to take refuge, given the name \"changchi\".", cn: "赴台灣法鼓山參加人生第一次禪修營，皈依聖嚴法師，法名「常持」。" },
  { year: 2003, slot: "below", en: "series of \"redwhiteblue\" poster was awarded the d&ad yellow pencil.", cn: "「紅白藍」海報系列獲倫敦 d&ad 黃鉛筆大獎。" },
  { year: 2004, slot: "below", en: "inducted into alliance graphique internationale (agi) as a member, also served in agi international executive committee (iec) for 4 years.", cn: "獲邀加入國際平面設計聯盟 agi 成為會員，為大會擔任四年幹事工作。" },
  { year: 2005, slot: "below", en: "\"redwhiteblue\" poster series was acquired by victoria & albert museum in london as permanent collection.", cn: "「紅白藍」海報系列被倫敦 victoria & albert museum 永久收藏。" },
  { year: 2005, slot: "below", en: "invited by hong kong heritage museum to curate \"building hong kong - redwhiteblue\" exhibition as guest curator, more than a hundred artists, designers and students joined the project to express values and perspectives of hong kong spirit using the material. after that, has curated various design, photography and art events in hong kong and mainland china.", cn: "受香港文化博物館邀請，客席策展「建：香港精神紅白藍」展覽，廣邀過百位藝術家、設計師和學生，以紅白藍創作提出香港精神價值觀點。及後也不斷在香港及中國內地策展設計、攝影和藝術活動。" },
  { year: 2005, slot: "below", en: "as one of two invited artists, presented in the 51st venice biennale representing hong kong, and showcased \"redwhiteblue / tea and chat\", which promotes face to face communication.", cn: "為兩名獲邀藝術家之一，代表香港參與威尼斯藝術雙年展，展出「紅白藍西遊記：飲杯茶．傾過飽」，提倡面對面溝通。" },
  { year: 2006, slot: "below", en: "invited to participate in exhibitions around the world, including zkm in germany, groninger museum in the netherlands, contemporary art museum kumamoto in japan, total museum of contemporary art in south korea, chinese arts centre in manchester, uk, and lianzhou foto etc.", cn: "之後十多年獲邀前往多國展出作品，包括德國 zkm、荷蘭 groninger museum、日本熊本市現代美術館、南韓 total museum of contemporary art、英國曼徹斯特 chinese arts centre、連州國際攝影年展等。" },
  { year: 2007, slot: "above", en: "since showing the \"half \\ half\" installation in central prison (now tai kwun), and after focusing on social issues, began to incorporate studies of buddhism into art works, such as \"impermanence\", \"to begin with, there's no matter\", \"heaven on earth\" etc.", cn: "從「一半一半」裝置展於舊中區監獄（現大館）起，「無常」、「本來無一事」、「凡非凡」等，繼社會議題後，以佛學╲哲學觀念為創作方向。" },
  { year: 2007, slot: "below", en: "set up 84000 communications limited, continued to contribute in brand building, design and promotion for commercial and cultural projects.", cn: "成立八萬四千溝通事務所，繼續致力商業及文化項目之設計、推廣及品牌顧問工作。" },
  { year: 2008, slot: "above", en: "exhibited large-scale redwhiteblue installation for the 1st hong kong international art fair, and continued voicing for \"positive hong kong\".", cn: "在首屆香港國際藝術展中，展出大型紅白藍裝置，繼續為「正面香港」發聲。" },
  { year: 2008, slot: "below", en: "received the outstanding achievements award from graphic arts association of hong kong.", cn: "獲香港印藝學會頒發「傑出成就大獎」。" },
  { year: 2011, slot: "above", en: "to summarize 30 years of work, curated \"what's next 30x30 creative exhibition\", and invited 30 units with the same vision to have dialogue and co-create, explore \"what is creativity and why we create\".", cn: "為總結三十年工作，策展「what's next 三十乘三十創意展」，邀請三十位志向相同的人，對話及共創，探討「何謂創作，為何創作」。" },
  { year: 2011, slot: "above", en: "awarded artist of the year (visual arts) from hong kong arts development awards. in my award acceptance speech, i said, \"i am not an artist, and i dare not compare myself with one. i simply wish to voice for society and dreams through creative works.\"", cn: "獲香港藝術發展獎頒發「年度最佳藝術家獎（視覺藝術）」。獲獎在台上發言：「我不是或不敢高攀藝術家，只是藉個人創作為社會和理想發聲。」" },
  { year: 2011, slot: "above", en: "joined a theravada novitiate program in hong kong, to experience the wisdom of understanding and implementing the idea of \"letting go\".", cn: "在香港參加南傳短期出家，深入體驗「放下」的理解和執行奧妙。" },
  { year: 2011, slot: "below", en: "worked with mao jihong and liao meili in planning and design, set up the first fangsuo in guangzhou in 2011. it became a new direction for cultural brands in mainland china, also a platform to interact with new generations in china, and explore spiritual and inner values together.", cn: "與毛繼鴻、廖美立共同策劃並設計方所書店，首間於二○一一年在廣州誕生。成為今天中國國內一重要文化品牌標竿，一個跟中國新一代互動，在精神及生活價值共修之平台。" },
  { year: 2012, slot: "above", en: "supported by exception de mixmind, created the first men's series \"time will tell: exception × wang wen-hsing × anothermountainman\", where the dream of clothing design finally came true. unfortunately, father passed away before the series launched, unable to witness how his son realized his long-time dream.", cn: "在例外服裝支持下，創作首個男裝系列「時間的見證 例外 × 王文興 × 又一山人」，終於一圓做衣服的志願。可惜父親黃祥（黃楚相）於系列發表前過世，未能見證兒子一直追求的夢想實現。" },
  { year: 2012, slot: "above", en: "in volume 2301 of ming pao weekly, introduced the creative work of \"final exercise\", previewing the very last piece of work in life.", cn: "在《明報周刊》第 2301 期，公開發表「最後習作」的創作項目。在雜誌上預展了人生最後一個發表的創意習作。" },
  { year: 2012, slot: "below", en: "13-minute short film jing yat, which was a personal work sponsored by commercial brand, received gold prize in direction in 4a awards. my first award since becoming a director.", cn: "商業品牌支持的個人十三分鐘短片「正一」獲得 4A 創意比賽之導演金獎。執導以來另一次零的突破。" },
  { year: 2012, slot: "below", en: "named as \"designer of the year\" by city magazine.", cn: "獲《號外》雜誌封為「年度最佳設計師」。" },
  { year: 2012, slot: "below", en: "installation of \"impermanence\" was given the hong kong contemporary art award.", cn: "「無常」裝置獲香港當代藝術獎。" },
  { year: 2013, slot: "below", en: "received tdc award at the tokyo type directors club annual awards.", cn: "獲東京字體指導俱樂部比賽 tdc 大獎。" },
  { year: 2013, slot: "below", en: "\"lanwei\" photography series, a total of 46 large photographs, was acquired by m+ in hong kong as collection.", cn: "「爛尾」攝影系列共四十六張大幅照片被香港 m+ 收藏。" },
  { year: 2014, slot: "above", en: "invited by hong kong heritage museum to hold a solo exhibition, agreeing to make time and process as the theme, and embarked a journey lasting 5.5 years, then have a dialogue with the public.", cn: "獲香港文化博物館邀請舉辦設計師個展，並答應以時間過程為題目，展開持續五年半的過程，然後跟大眾對話。" },
  { year: 2015, slot: "below", en: "invited by ggg in japan to hold solo creative exhibition (2 men show: stanley wong x anothermountainman), and was the 2nd hong kong designer to be invited by this world-class design gallery in the past 30 years. it was such an honour.", cn: "獲日本 ggg 邀請舉辦個人創意展（又一山人 × 黃炳培雙人展），是這世界級設計畫廊三十年來邀請的第二位香港設計師，實屬榮幸。" },
  { year: 2017, slot: "above", en: "made my first documentary movie dance goes on, expressing views on art, life and things about hong kong through three dancers, and send a message to hong kong: life goes on.", cn: "首齣紀錄長片「冇照跳」面世，透過三位舞者好友，道出藝術、人生、香港我城種種，並寄語香港 life goes on。" },
  { year: 2017, slot: "below", en: "a total of 40 items of design and advertising creative works were acquired by m+ in hong kong as collection.", cn: "香港 m+ 收藏設計╲廣告創作共四十項。" },
  { year: 2018, slot: "above", en: "established being hong kong with lung king-cheong and jessica wong, with the positioning of hong kong value, through texts and papers, interacts with readers by bringing out issues relating to life and living.", cn: "與龍景昌、三三及團隊創辦《就係香港》季刊。以香港價值定位，人本文本和紙本為本，對生存、生活和生命帶出議題，跟讀者互動。" },
  { year: 2019, slot: "above", en: "luoluo suosuo: what anothermountainman thought of, written, said and heard of in 60 years was published by joint publishing hk, co-written almost 100,000 words, hoping to shed light on values of being a person, and working in the creative industry and to explore the relationship and meaning between time and the ideas of life and living.", cn: "由三聯書店出版《囉囉唆唆——六十年 想過 寫過 聽過 說過的》，聯合編寫近十萬字，希望能帶給新一代人一點做人做創意的價值觀。希望跟大眾探討時間與生存、生活和生命之間的關係和意義。" },
  { year: 2019, slot: "above", image: "assets/journey/2019-heritage-museum.jpg", size: "l", en: "solo exhibition of \"anothermountainman × stanley wong / 40 years of work\" is launched in hong kong heritage museum.", cn: "個展「時間的見證 又一山人 × 黃炳培四十年創意展」於香港文化博物館展出。" },
  { year: 2019, slot: "above", en: "summarizing 40 years of work and reaching 60th birthday, i wish to hit the road and start again.", cn: "總結歸納四十年工作後，踏入六十歲，希望重生再上路。" },
  { year: 2019, slot: "below", en: "dance goes on was nominated in the chinese documentary section of the hong kong international documentary festival, and received bronze award. it is an enormous encouragement to someone first made a documentary film at the age of 57.", cn: "「冇照跳」入圍香港國際紀錄片節華語紀錄片競賽部分，並獲銅獎，對一個五十七歲高齡首作的電影人，是一個莫大的鼓勵。" },
].map((r) => ({
  year: r.year, slot: r.slot,
  rec: { text_en: r.en, text_cn: r.cn },              /* bilingual, read through txt() like a cms record */
  image: r.image ? { src: r.image } : null,
  size: r.size || "",
}));

const DEMO_BIO = {
  portrait: "assets/bio/portrait.jpg",
  /* statement html — same as cms/import/biography.json (pages[biography].body_en / body_cn);
     two blocks: the person, then 84000 communications; .b-lead = block heading.
     read through txt() like a cms record, so en · cn switches it */
  rec: {
    body_en: "<p class=\"b-lead\"><b>stanley wong (anothermountainman)</b><br>founder / creative director</p>" +
    "<p>born in 1960, stanley wong ping pui, better known as anothermountainman in the art scene, is a homegrown artist who received his education and professional training in hong kong.</p>" +
    "<p>following his graduation from the hong kong technical teachers’ college (design &amp; technology) in 1980, stanley worked as a graphic designer for five years before embarking on what was to become a productive and rewarding career in advertising. over the next ten years, he served on the creative teams of some of the most distinguished advertising agencies in town, including grey (hk) advertising and j. walter thompson (hk) advertising limited.</p>" +
    "<p>in 1996, stanley became the first chinese to undertake an overseas position in the asian advertising industry when he was appointed regional creative director at bartle bogle hegarty (asia pacific) in singapore. he returned to hong kong in 1999 as chief executive officer and executive creative director at tbwa (hk) advertising.</p>" +
    "<p>in 2000, stanley joined centro digital as chief creative officer / film director, where he experienced the joy of film directing for the first time. two years later, he set up threetwoone film production limited, specializing in advertising film production. since then, stanley has produced over 200 tv commercials.</p>" +
    "<p>in 2004, stanley was inducted into the alliance graphique internationale (agi), a prestigious institution whose membership comprises the world’s most elite graphic designers. he was also honoured to serve on the agi international executive committee (iec) for four years starting in 2007.</p>" +
    "<p>in 2007, he established 84000 communications and continues to devote himself to the brand consultancy and marketing communications of commercial and cultural projects across hong kong and mainland china.</p>" +
    "<p>he has won more than 600 local and international awards in graphic design, advertising, fine art, and photography, both at home and abroad. these include the d&amp;ad yellow pencil, two one show gold awards, tokyo tdc awards, three design for asia (dfa) grand awards, numerous hong kong designers association (hkda) global design awards, graphic design in china (gdc) awards, and most of hong kong and asian advertising creative awards, alongside multiple other gold and jury prizes.</p>" +
    "<p>wong is also passionate about photography and various creative mediums, with a strong focus on social issues. over the past two decades, he has gained international recognition with his “red white blue” series, which promotes the “positive spirit of hong kong” and was presented at the 51st venice biennale in 2005 representing hong kong.</p>" +
    "<p>many of his artworks have been exhibited in local and overseas galleries and museums in more than 200 exhibitions, including his 2015 solo show at tokyo ginza graphic gallery (ggg) and “time will tell: 40 years of work” at hong kong heritage museum in 2019. stanley’s design and art pieces are held in the permanent collections of many major institutions, including m+ and the hong kong museum of art in hong kong, as well as the v&amp;a museum in london and museums in mainland china.</p>" +
    "<p>in may 2012, wong was awarded artist of the year 2011 (visual arts) at the hong kong arts development awards, followed by the hong kong contemporary art awards 2012 from the hong kong museum of art.</p>" +
    "<p>in 2020, he was named the dfa world’s outstanding chinese designer.</p>" +
    "<p class=\"b-lead\"><b>84000 communications limited</b></p>" +
    "<p>84000 communications limited is one of hong kong’s most acclaimed creative agencies. specializing in brand consulting, graphic design, cultural promotion, photography, advertising, and multimedia communications, the firm delivers professional creative and communications consultancy services across a wide array of disciplines for the hong kong and mainland china markets.</p>" +
    "<p>key clients<br>mainland china: exception de mixmind / fangsuo commune / upperhills / vanke / the guangdong museum of art.<br>hong kong: cultural and creative industries development agency (ccida) / hong kong palace museum (hkpm) / hong kong design centre (hkdc) / the university of hong kong (hku) / the chinese university of hong kong (cuhk) / hong kong institute of construction (hkic) / hong kong museum of art (hkmoa) / art basel hong kong / ifc mall / hongkong land.</p>" +
    "<p>the agency was founded in 2007 by mr. stanley wong, a renowned designer and contemporary artist with over 40 years of industry experience. guided by his vision, 84000 communications continues to push the boundaries of visual culture, transforming strategic insights into meaningful, impactful creative solutions that drive real values for clients and resonate deeply with audiences across the region, both commercially and social values perspective.</p>",
    body_cn: "<p class=\"b-lead\"><b>黃炳培（又一山人）</b><br>創辦人 / 創作總監</p>" +
    "<p>黃炳培，一九六〇年生於香港，藝壇以「又一山人」之名為人熟知，是一位在香港接受教育及專業訓練、土生土長的藝術家。</p>" +
    "<p>一九八〇年畢業於香港工商師範學院（設計及工藝），其後任平面設計師五年，隨即展開一段成果豐碩的廣告生涯。往後十年，先後效力多家本地頂尖廣告公司的創作部，包括精英廣告及智威湯遜（香港）廣告有限公司。</p>" +
    "<p>一九九六年，獲委任為 bartle bogle hegarty（亞太區）新加坡辦公室的區域創作總監，成為亞洲廣告業界首位出任海外要職的華人。一九九九年回港，出任 tbwa（香港）廣告的行政總裁兼行政創作總監。</p>" +
    "<p>二〇〇〇年加入先濤數碼，任首席創作總監 / 電影導演，首次體會執導的樂趣。兩年後創立三二一聲畫製作有限公司，專注廣告片製作；至今執導的電視廣告已逾二百部。</p>" +
    "<p>二〇〇四年獲納為國際平面設計聯盟（agi）會員——該會匯聚全球最頂尖的平面設計師；並自二〇〇七年起於 agi 國際執行委員會（iec）服務四年。</p>" +
    "<p>二〇〇七年創立八萬四千溝通事務所，至今持續為香港及中國內地的商業與文化項目提供品牌顧問及市場推廣傳訊服務。</p>" +
    "<p>於平面設計、廣告、藝術及攝影範疇，在本地及國際間獲獎逾六百項，包括 d&amp;ad 黃鉛筆獎、兩項 one show 金獎、東京 tdc 獎、三項亞洲設計大獎（dfa）大獎、多項香港設計師協會（hkda）環球設計大獎及平面設計在中國（gdc）獎項，以及香港與亞洲廣告創意獎項的大部分殊榮，另有多項金獎及評審團獎。</p>" +
    "<p>黃氏亦醉心攝影及各種創作媒介，尤其關注社會議題。過去二十年，他以宣揚「正面香港精神」的「紅白藍」系列享譽國際，並於二〇〇五年代表香港參展第五十一屆威尼斯雙年展。</p>" +
    "<p>其作品曾於本地及海外畫廊與博物館展出，參與展覽逾二百場，包括二〇一五年於東京銀座圖形畫廊（ggg）的個展，以及二〇一九年於香港文化博物館舉行的「時間的見證：四十年創作展」。其設計及藝術作品獲多家重要機構永久收藏，包括香港的 m+ 及香港藝術館、倫敦的 v&amp;a 博物館，以及中國內地多間博物館。</p>" +
    "<p>二〇一二年五月，於香港藝術發展獎獲頒二〇一一年度藝術家獎（視覺藝術）；隨後獲香港藝術館頒發二〇一二年香港當代藝術獎。</p>" +
    "<p>二〇二〇年獲選為 dfa 世界傑出華人設計師。</p>" +
    "<p class=\"b-lead\"><b>八萬四千溝通事務所</b></p>" +
    "<p>八萬四千溝通事務所（84000 communications limited）是香港最備受推崇的創意機構之一，專注品牌顧問、平面設計、文化推廣、攝影、廣告及多媒體傳訊，為香港及中國內地市場提供跨領域的專業創意與傳訊顧問服務。</p>" +
    "<p>主要客戶<br>中國內地：例外 / 方所 / 深業上城 / 萬科 / 廣東美術館。<br>香港：文創產業發展處（ccida）/ 香港故宮文化博物館（hkpm）/ 香港設計中心（hkdc）/ 香港大學（hku）/ 香港中文大學（cuhk）/ 香港建造學院（hkic）/ 香港藝術館（hkmoa）/ 香港巴塞爾藝術展 / 國際金融中心商場 / 香港置地。</p>" +
    "<p>事務所於二〇〇七年由著名設計師及當代藝術家黃炳培先生創立，他擁有逾四十年業界經驗。在其願景引領下，八萬四千溝通事務所不斷拓展視覺文化的邊界，將策略洞察轉化為富意義、具影響力的創意方案，為客戶創造實在價值，並在商業與社會價值兩方面，與區內受眾產生深刻共鳴。</p>",
  },
  /* cv rows = cms/import/biography.json `entries` (biography_entries): section · date · type · title · venue, en / cn */
  entries: [
  [
    "solo exhibition",
    "2025 / 11",
    "art / design",
    "藝術 / 設計",
    "soul & social",
    "soul & social",
    "london / 3812 gallery",
    "倫敦 / 3812 畫廊"
  ],
  [
    "solo exhibition",
    "2025 / 10",
    "art / design",
    "藝術 / 設計",
    "hong kong walk on",
    "香港前行",
    "shanghai / atelier tai ping",
    "上海 / atelier tai ping"
  ],
  [
    "solo exhibition",
    "2025 / 07",
    "art / design",
    "藝術 / 設計",
    "hong kong walk on",
    "香港前行",
    "paris / atelier tai ping",
    "巴黎 / atelier tai ping"
  ],
  [
    "solo exhibition",
    "2025 / 04",
    "art / design",
    "藝術 / 設計",
    "hong kong walk on",
    "香港前行",
    "milan / atelier tai ping",
    "米蘭 / atelier tai ping"
  ],
  [
    "solo exhibition",
    "2023 / 12",
    "art / design",
    "藝術 / 設計",
    "redwhiteblue / tea and chat",
    "紅白藍 / 飲杯茶．傾過飽",
    "shenzhen / oct-loft",
    "深圳 / 華僑城創意文化園"
  ],
  [
    "solo exhibition",
    "2023 / 03",
    "art / design",
    "藝術 / 設計",
    "redwhiteblue / hong kong",
    "紅白藍 / 香港",
    "hong kong / art basel hong kong 2023",
    "香港 / 香港巴塞爾藝術展 2023"
  ],
  [
    "solo exhibition",
    "2019 / 11",
    "art / design",
    "藝術 / 設計",
    "time will tell / anothermountainman × stanley wong / 40 years of work",
    "時間的見證 / 又一山人 × 黃炳培 / 四十年創作展",
    "hong kong / hong kong heritage museum",
    "香港 / 香港文化博物館"
  ],
  [
    "solo exhibition",
    "2017 / 03",
    "photography",
    "攝影",
    "one day shoot. one day show.",
    "一日拍攝。一日展出。",
    "guangzhou, chengdu / fang suo",
    "廣州、成都 / 方所"
  ],
  [
    "solo exhibition",
    "2015 / 09",
    "art / design",
    "藝術 / 設計",
    "redwhiteblue",
    "紅白藍",
    "tokyo / ginza graphic gallery (ggg)",
    "東京 / 銀座圖形畫廊（ggg）"
  ],
  [
    "solo exhibition",
    "2015 / 05",
    "art / design",
    "藝術 / 設計",
    "2 men show: stanley wong × anothermountainman",
    "雙人展：黃炳培 × 又一山人",
    "singapore / nanyang academy of fine arts",
    "新加坡 / 南洋藝術學院"
  ],
  [
    "solo exhibition",
    "2014 / 01",
    "art",
    "藝術",
    "perceive emptiness",
    "觀．空",
    "singapore / hermès gallery",
    "新加坡 / 愛馬仕畫廊"
  ],
  [
    "solo exhibition",
    "2013 / 10",
    "installation",
    "裝置",
    "show flat 04",
    "示範單位 04",
    "hong kong / art basel / blindspot gallery",
    "香港 / 巴塞爾藝術展 / 刺點畫廊"
  ],
  [
    "solo exhibition",
    "2013 / 05",
    "photography",
    "攝影",
    "from su shi to bada shanren – the portrayal of illusion",
    "從蘇軾到八大山人——幻象的寫照",
    "hong kong / blindspot gallery",
    "香港 / 刺點畫廊"
  ],
  [
    "solo exhibition",
    "2012 / 10",
    "photography",
    "攝影",
    "lanwei",
    "爛尾",
    "hong kong / art basel / absolute",
    "香港 / 巴塞爾藝術展 / absolute"
  ],
  [
    "solo exhibition",
    "2012 / 05",
    "art installation",
    "藝術裝置",
    "building hong kong redwhiteblue 26 / show flat",
    "建．香港．紅白藍 26 / 示範單位",
    "hong kong / future industries",
    "香港 / future industries"
  ],
  [
    "solo exhibition",
    "2011 / 11",
    "photography",
    "攝影",
    "traces: on the road again",
    "痕跡：再上路",
    "hong kong / goethe–institut",
    "香港 / 歌德學院"
  ],
  [
    "solo exhibition",
    "2010 / 08",
    "photography",
    "攝影",
    "to begin with, there’s no matter.",
    "本來無一事。",
    "manchester / chinese arts centre",
    "曼徹斯特 / 華人藝術中心"
  ],
  [
    "solo exhibition",
    "2010 / 04",
    "photography",
    "攝影",
    "lanwei / decaying end",
    "爛尾",
    "toronto / lee ka-sing gallery",
    "多倫多 / 李家昇畫廊"
  ],
  [
    "solo exhibition",
    "2009 / 09",
    "photography",
    "攝影",
    "lanwei",
    "爛尾",
    "singapore / nanyang academy of fine arts",
    "新加坡 / 南洋藝術學院"
  ],
  [
    "solo exhibition",
    "2007 / 09",
    "photography",
    "攝影",
    "of things present",
    "眼前事",
    "hong kong / goethe–institut",
    "香港 / 歌德學院"
  ],
  [
    "solo exhibition",
    "2007 / 08",
    "photography",
    "攝影",
    "lanwei / abortive buildings",
    "爛尾 / 爛尾樓",
    "toronto / lee ka-sing gallery",
    "多倫多 / 李家昇畫廊"
  ],
  [
    "solo exhibition",
    "2006 / 09",
    "photography",
    "攝影",
    "future tense: redwhiteblue",
    "未來式：紅白藍",
    "hong kong / mtr arttube central station",
    "香港 / 港鐵中環站 arttube"
  ],
  [
    "solo exhibition",
    "2006 / 02",
    "installation",
    "裝置",
    "building hong kong 16 / redwhiteblue / faith/ hope/ love",
    "建．香港 16 / 紅白藍 / 信 / 望 / 愛",
    "london / edit gallery",
    "倫敦 / edit gallery"
  ],
  [
    "group exhibition",
    "2024 / 00",
    "art / design",
    "藝術 / 設計",
    "demo entry — to be replaced",
    "示範條目——待替換",
    "demo venue",
    "示範地點"
  ],
  [
    "group exhibition",
    "2022 / 00",
    "photography",
    "攝影",
    "demo entry — to be replaced",
    "示範條目——待替換",
    "demo venue",
    "示範地點"
  ],
  [
    "group exhibition",
    "2020 / 00",
    "installation",
    "裝置",
    "demo entry — to be replaced",
    "示範條目——待替換",
    "demo venue",
    "示範地點"
  ]
].map(([section, date, type_en, type_cn, title_en, title_cn, venue_en, venue_cn]) =>
    ({ section, date, rec: { type_en, type_cn, title_en, title_cn, venue_en, venue_cn } })),
};

/* ————— demo content — media / contact / acknowledgments —————
   transcribed from Update Request 0919/amm x sw website - media- contact-acknowledgement.pdf;
   the same text lives in cms/import/media.json · contact.json · acknowledgments.json for the importer
   and the static review build. media: one item per press piece (newest first); the picture is the
   16:9 thumbnail as supplied, `frame` = a logo (transparent png on the page grey, no box).
   every text carries an en and a cn (traditional chinese, hong kong usage) version. ————— */
const DEMO_MEDIA = [
  {
    "title_en": "anothermountainman (wong ping-pui, stanley): studio and beyond",
    "title_cn": "又一山人（黃炳培）：工作室以外",
    "date": "2026/05",
    "source_en": "visit hk museums",
    "source_cn": "visit hk museums",
    "url": "https://www.youtube.com/watch?v=VdEu1ImkoWM&t=40s",
    "image": "assets/media/01.jpg",
    "frame": false
  },
  {
    "title_en": "the philosophy of subtraction in the second half of life! artist anothermountainman's second life in kyoto: spending ten years building his temporary residence.",
    "title_cn": "人生下半場的減法哲學！藝術家又一山人的京都第二人生：花十年打造暫居之家",
    "date": "2026/05",
    "source_en": "gq hong kong",
    "source_cn": "gq 香港",
    "url": "https://gqhongkong.com/lifestyle/poliform-senzafine-wardrobe",
    "image": "assets/media/02.png",
    "frame": true
  },
  {
    "title_en": "anothermountain person’s home in kyoto: mountain people come down from the mountain and see impermanence under the trees",
    "title_cn": "又一山人的京都之家：山人既下山，樹下見無常",
    "date": "2026/05",
    "source_en": "elle decoration",
    "source_cn": "elle decoration 家居廊",
    "url": "https://mp.weixin.qq.com/s/Co2lUTZarquBlbRohum6_Q",
    "image": "assets/media/03.png",
    "frame": true
  },
  {
    "title_en": "i'm a buddhist; moving from hong kong to kyoto",
    "title_cn": "我是佛教徒；從香港移居京都",
    "date": "2026/01",
    "source_en": "financial times",
    "source_cn": "金融時報",
    "url": "https://www.ft.com/content/caf0c90e-2217-4ac8-b392-c5424fe522be",
    "image": "assets/media/04.png",
    "frame": true
  },
  {
    "title_en": "anothermountainman. seeing mountains from within the mountains.",
    "title_cn": "又一山人。山中看山。",
    "date": "2025/10",
    "source_en": "life magazine",
    "source_cn": "生活月刊",
    "url": "https://mp.weixin.qq.com/s/_uzeZZRGE9-TeAqH96mUmA",
    "image": "assets/media/05.png",
    "frame": true
  },
  {
    "title_en": "v music magazine vol. 2 anothermountainman",
    "title_cn": "v music magazine 第二期：又一山人",
    "date": "2025/03",
    "source_en": "v music magazine",
    "source_cn": "v music magazine",
    "url": "https://www.youtube.com/watch?v=yfkaYrMfeL0",
    "image": "assets/media/06.jpg",
    "frame": false
  },
  {
    "title_en": "artist sharing: anothermountainman | hkipf 2024",
    "title_cn": "藝術家分享：又一山人｜香港國際攝影節 2024",
    "date": "2024/11",
    "source_en": "hkipf",
    "source_cn": "香港國際攝影節",
    "url": "https://www.youtube.com/watch?v=OLMN3PuJrco",
    "image": "assets/media/07.jpg",
    "frame": false
  },
  {
    "title_en": "[concrete vs. forest] talking with everyday scenery: another mountain man connects cultures and lives in different places through art",
    "title_cn": "【石屋 vs 森林】與日常的風景共話：又一山人以藝術串連異地的文化與生命",
    "date": "2022/11",
    "source_en": "the culturist",
    "source_cn": "文化者",
    "url": "https://www.youtube.com/watch?v=eIguzffyIj4",
    "image": "assets/media/08.jpg",
    "frame": false
  }
].map((it, i) => ({ rec: it, date: it.date, url: it.url, image: it.image, frame: !!it.frame, sort: i }));

/* the 84000 communications logo is part of the site (vector from the pdf), not cms content */
const CONTACT_LOGO = "assets/contact/84000-communications.svg";

/* body text as the admin stores it: lines joined with <br>, a blank line between groups */
const DEMO_CONTACT = { rec: { body_en: "84000 communications<br><br>tel /<br>+852 2887 1321<br><br>email /<br>0002@84000.com.hk<br>0001@84000.com.hk<br><br>address /<br>room i, eaton house, 4/f, 380 nathan road, kowloon, hong kong", body_cn: "八萬四千溝通事務所<br><br>電話 /<br>+852 2887 1321<br><br>電郵 /<br>0002@84000.com.hk<br>0001@84000.com.hk<br><br>地址 /<br>香港九龍彌敦道 380 號 eaton house 4 樓 i 室" }, images: [] };

/* first paragraph = the statement (bold, first line on the centre line), then the credit groups.
   "yongran zhang" corrected from the pdf's "rongran zhang" (client, 2026-09-22) */
const DEMO_ACK = { rec: { body_en: "looking back, i realise that none of the work was ever made alone.<br>behind every idea, every image and every project were people<br>who shared their time, trust, patience and passion with me.<br>my wife, my team, the artists, colleagues, clients and friends<br>i have worked with over the years —<br>each of you has been part of the journey in your own way.<br>there were long nights, difficult moments, unexpected turns,<br>good conversations and plenty of laughter.<br>some things worked, some did not. but all of them became part of the story.<br>in the end, perhaps the work is not the most important thing we leave behind.<br>it is the people we meet,<br>the things we make together, and the memories we carry with us.<br>thank you for being part of mine.<br><br>special thanks //<br>jessie law<br><br>creative collaboration in advertising career //<br>fornita wong / milker ho / lee chun chung / dennis chang /<br>sam wong / jen halim / david cheung / gary chui /<br>ringo tang / fornita wong / sandy lee / iris lo /<br>tan shen guan / keith ho / kelvin hung / andy wong /<br>patrick lai / shirley chow / louis ng / nelson ng /<br>romeo diaz / david cheung / ...<br><br>creative collaboration //<br>william chang / wong kar-wai / tony leung chiu-wai / fung lam /<br>jihong mao / wang xu / kung chi-shing / ...<br><br>production //<br>a yan / ...<br><br>team of 84000 communications //<br>jessie law / ... / jennifer ip / kwok wai-ki /<br>chan hong-ning / benber lee / yongran zhang / ...<br><br>website design //<br>senw design (benber lee / jinbao zhong / shoupeng zhu)", body_cn: "回望過去，我發現沒有一件作品是獨自完成的。<br>每一個意念、每一幅影像、每一個項目背後，<br>都有人與我分享他們的時間、信任、耐性和熱情。<br>我的太太、我的團隊、藝術家、同事、客戶和朋友，<br>多年來與我共事的每一位——<br>你們都以各自的方式，成為這段旅程的一部分。<br>有過漫漫長夜、艱難時刻、意料之外的轉折，<br>也有過暢快的對話和許多歡笑。<br>有些事成了，有些沒有；但它們都成為了故事的一部分。<br>到頭來，或許作品並不是我們留下的最重要的東西。<br>重要的是我們遇上的人、<br>一起創造的事，以及我們帶着走的回憶。<br>感謝你成為我回憶的一部分。<br><br>特別鳴謝 //<br>jessie law<br><br>廣告生涯中的創作夥伴 //<br>fornita wong / milker ho / lee chun chung / dennis chang /<br>sam wong / jen halim / david cheung / gary chui /<br>ringo tang / fornita wong / sandy lee / iris lo /<br>tan shen guan / keith ho / kelvin hung / andy wong /<br>patrick lai / shirley chow / louis ng / nelson ng /<br>romeo diaz / david cheung / ……<br><br>創作夥伴 //<br>william chang / wong kar-wai / tony leung chiu-wai / fung lam /<br>jihong mao / wang xu / kung chi-shing / ……<br><br>製作 //<br>a yan / ……<br><br>八萬四千溝通事務所團隊 //<br>jessie law / …… / jennifer ip / kwok wai-ki /<br>chan hong-ning / benber lee / yongran zhang / ……<br><br>網站設計 //<br>東南西北設計 senw design（benber lee / jinbao zhong / shoupeng zhu）" }, images: [] };

/* live content — replaced by the CMS when it answers */
let MEDIA = DEMO_MEDIA;
let CONTACT = DEMO_CONTACT;
let ACK = DEMO_ACK;

/* group order of the CV = order of the CMS select */
const BIO_SECTIONS = ["solo exhibition", "group exhibition", "award", "collection", "talk"];

/* live content — replaced by the CMS when it answers */
let JOURNEY_EVENTS = DEMO_JOURNEY;
let BIO = DEMO_BIO;

/* ————————————————————————————————————————————
   journey — one axis, 1960 → now, on the centre line.
   the three identities sit on it as bands stacked upward
   (white 1980– · black 2000– with a dashed lead-in from 1993 · grey 2000–).
   a full-height cursor stands wherever the pointer is — no button,
   no wheel, the way the scrub line follows the pointer over a work's
   thumbnail. records are one paragraph each and group by year: the
   personal column of the timeline (slot "above") hangs above the axis,
   the professional column (slot "below") below it; a year stays lit
   while the cursor is between it and the next. touch drags instead;
   arrow keys hop from year to year.
   ———————————————————————————————————————————— */
const JOURNEY = {
  start: 1960,
  born: 1960,                                     /* mobile year list shows the age in brackets: 1964 [4] */
  end: new Date().getFullYear(),                  /* right end of the axis = now */
  bands: [
    { who: "sw",  from: 1980 },                   /* white — stanley wong           */
    { who: "amm", from: 2000, leadIn: 1993 },     /* black — anothermountainman;
                                                     ticks from the pseudonym (1993)
                                                     to the first personal work (2000) */
    { who: "xsw", from: 2000 },                   /* grey — amm × sw                 */
  ],
  textMax: 0.31,                                  /* text block width, share of viewport */
  ease: 0.35,                                     /* cursor follow: share of the gap to the pointer closed per frame */
  anchor: "year",                                 /* "year": the event stays at its year and the cursor
                                                     passes through it (as the scrub line crosses a thumbnail);
                                                     "cursor": the lit event rides along with the cursor */
};

/* pos / target: cursor position as a fraction of the axis (0 = 1960, 1 = now).
   touched: the page starts as the bare axis; the first input brings the cursor in */
const J = { pos: 0, target: 0, touched: false, built: false, raf: null, cur: -1, years: [] };

const yearFrac = (y) => Math.min(1, Math.max(0, (y - JOURNEY.start) / (JOURNEY.end - JOURNEY.start)));
const fracYear = (f) => JOURNEY.start + f * (JOURNEY.end - JOURNEY.start);

/* records → years: { year, above: [rec…], below: [rec…] } in year order */
function journeyYears() {
  const map = new Map();
  JOURNEY_EVENTS.forEach((r) => {
    if (!map.has(r.year)) map.set(r.year, { year: r.year, above: [], below: [] });
    map.get(r.year)[r.slot === "below" ? "below" : "above"].push(r);
  });
  return [...map.values()].sort((a, b) => a.year - b.year);
}

function buildJourney(stage) {
  const years = journeyYears();
  J.years = years;
  const bands = JOURNEY.bands.map((b) => {
    const lead = b.leadIn
      ? `<div class="j-ticks j-${b.who}" style="left:${yearFrac(b.leadIn) * 100}%;width:${(yearFrac(b.from) - yearFrac(b.leadIn)) * 100}%"></div>`
      : "";
    return lead + `<div class="j-band j-${b.who}" style="left:${yearFrac(b.from) * 100}%"></div>`;
  }).join("");

  const group = (y, slot, withYear) => {
    const recs = y[slot];
    if (!recs.length) return "";
    const img = recs.find((r) => r.image);
    return `<div class="j-group ${slot}${img ? " has-img" : ""}">
        <div class="j-text">${withYear ? `<span class="j-year">${y.year}</span>` : ""}${recs.map((r) => `<span class="j-body">${txt(r, "text")}</span>`).join("")}</div>
        ${img ? `<div class="j-img size-${img.size || "l"}" data-src="${img.image.full || img.image.src}"><img src="${img.image.src}" alt="" draggable="false"></div>` : ""}
      </div>`;
  };

  stage.innerHTML = `
    <div id="journey">
      <div class="j-field">
        <div class="j-axis"><div class="j-line"></div>${bands}</div>
        <div class="j-cursor"></div>
        ${years.map((y, i) => {
          const fr = yearFrac(y.year);
          /* text to the right of the cursor unless it would run past the axis end */
          const side = fr + JOURNEY.textMax / (1 - 2 * 0.094) > 1 ? "left" : "right";
          return `<div class="j-event side-${side}" data-i="${i}" style="left:${fr * 100}%">
              ${group(y, "above", true)}${group(y, "below", !y.above.length)}
            </div>`;
        }).join("")}
      </div>
    </div>`;

  stage.querySelectorAll(".j-img img").forEach((im) => im.addEventListener("load", layoutJourney));
  J.built = true;
  layoutJourney();
}

/* vertical fit + image ↔ text alignment (needs measured text heights).
   upper block: top at --j-above, pushed up if it would reach the axis;
   lower block: top at --j-below, pushed up if it would leave the viewport */
function layoutJourney() {
  const root = $("#journey");
  if (!root) return;
  const H = root.clientHeight;
  const cs = getComputedStyle(root);
  const vh = (v) => parseFloat(v) / 100 * H;
  const aboveTop = vh(cs.getPropertyValue("--j-above")), belowTop = vh(cs.getPropertyValue("--j-below"));
  const clear = vh(cs.getPropertyValue("--j-clear")), edge = vh(cs.getPropertyValue("--j-edge"));

  root.querySelectorAll(".j-event").forEach((ev) => {
    const left = ev.classList.contains("side-left");
    const gA = ev.querySelector(".j-group.above"), gB = ev.querySelector(".j-group.below");
    const place = (g, above) => {
      const text = g.querySelector(".j-text");
      const h = text.offsetHeight;
      let top = above ? Math.min(aboveTop, H / 2 - clear - h) : Math.min(belowTop, H - edge - h);
      top = Math.max(above ? edge : H / 2 + clear, top);
      text.style.top = `${top}px`;
      const img = g.querySelector(".j-img");
      if (!img) return;
      img.style.top = img.style.bottom = img.style.right = "";
      const otherBusy = above ? !!gB : !!gA;
      if (!left) {
        /* opposite side of the cursor, same slot, flush with the text's edge nearest the axis */
        if (above) img.style.bottom = `${H - (top + h)}px`; else img.style.top = `${top}px`;
      } else if (!otherBusy) {
        /* same side as the text, in the free slot */
        if (above) img.style.top = `${H / 2 + clear}px`; else img.style.bottom = `${H / 2 + clear}px`;
      } else {
        /* both slots taken: beside the text, further from the cursor */
        img.style.right = `calc(${text.offsetWidth}px + var(--j-gap) * 2)`;
        if (above) img.style.bottom = `${H - (top + h)}px`; else img.style.top = `${top}px`;
      }
    };
    if (gA) place(gA, true);
    if (gB) place(gB, false);
  });
}

/* the event in force at a position: the last one whose year the cursor has reached */
function journeyEventAt(frac) {
  const y = fracYear(frac) + 1e-6;
  let cur = -1;
  (J.years || []).forEach((ev, i) => { if (ev.year <= y) cur = i; });
  return cur;
}

/* paint: cursor at J.pos, the event in force lit */
function paintJourney() {
  const root = $("#journey");
  if (!root) return;
  const cur = root.querySelector(".j-cursor");
  cur.style.left = `${J.pos * 100}%`;
  cur.classList.toggle("on", J.touched);
  const i = J.touched ? journeyEventAt(J.target) : -1;
  if (i !== J.cur) {
    J.cur = i;
    root.querySelectorAll(".j-event").forEach((el) => {
      const on = Number(el.dataset.i) === i;
      el.classList.toggle("on", on);
      if (JOURNEY.anchor === "cursor" && !on) el.style.left = `${yearFrac(J.years[el.dataset.i].year) * 100}%`;
    });
  }
  if (JOURNEY.anchor === "cursor" && i >= 0) root.querySelector(`.j-event[data-i="${i}"]`).style.left = `${J.pos * 100}%`;
}

/* the cursor eases toward the target every frame — direct, but not jittery */
function journeyTick() {
  J.raf = null;
  const d = J.target - J.pos;
  if (Math.abs(d) < 0.0004) J.pos = J.target;
  else { J.pos += d * JOURNEY.ease; J.raf = requestAnimationFrame(journeyTick); }
  paintJourney();
}

/* move the target (fraction of the axis); immediate = no easing (drag) */
function journeySet(frac, { immediate = false } = {}) {
  J.touched = true;
  J.target = Math.min(1, Math.max(0, frac));
  if (immediate) { J.pos = J.target; paintJourney(); return; }
  if (!J.raf) J.raf = requestAnimationFrame(journeyTick);
}

/* reset to the bare axis (page open) or restore (language switch) */
function journeyReset(keep) {
  if (!keep) { J.pos = J.target = 0; J.touched = false; }
  J.cur = -2;
  paintJourney();
}

/* arrow keys: hop to the previous / next event */
function journeyHop(dir) {
  const evs = J.years || [];
  const y = fracYear(J.target);
  let to = null;
  /* half a year of tolerance: the cursor is rarely on the exact year after a scrub */
  if (dir > 0) to = evs.find((ev) => ev.year > y + 0.5);
  else { const before = evs.filter((ev) => ev.year < y - 0.5); to = before[before.length - 1]; }
  if (to) journeySet(yearFrac(to.year));
}

/* ————— input —————
   mouse / pen: the cursor is wherever the pointer is — no button, no wheel,
   exactly like the scrub line on a work's thumbnail. touch: drag.
   arrow keys hop between events (until the pointer moves again). */
function bindJourneyInput(stage) {
  const journeyOn = () => pageVisible() && currentPage === "journey" && !lightboxVisible();
  const fracAt = (x) => { const r = stage.querySelector(".j-field").getBoundingClientRect(); return (x - r.left) / r.width; };

  stage.addEventListener("pointermove", (e) => {
    if (!journeyOn() || e.pointerType === "touch") return;
    journeySet(fracAt(e.clientX));
  });

  /* touch: drag relative to where the finger landed */
  stage.addEventListener("pointerdown", (e) => {
    if (!journeyOn() || e.pointerType !== "touch") return;
    const x0 = e.clientX, grab = J.touched ? J.target : fracAt(x0);
    stage.setPointerCapture(e.pointerId);
    const move = (ev) => journeySet(grab + fracAt(ev.clientX) - fracAt(x0), { immediate: true });
    const up = () => { stage.removeEventListener("pointermove", move); stage.removeEventListener("pointerup", up); stage.removeEventListener("pointercancel", up); };
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerup", up);
    stage.addEventListener("pointercancel", up);
  });

  /* images enlarge, like every image on the site */
  stage.addEventListener("click", (e) => {
    const img = e.target.closest(".j-img");
    if (!img || !journeyOn()) return;
    openLightbox(img.dataset.src);
  });

  addEventListener("keydown", (e) => {
    if (!journeyOn()) return;
    if (["ArrowRight", "ArrowDown", " ", "PageDown"].includes(e.key)) { e.preventDefault(); journeyHop(1); }
    if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key))          { e.preventDefault(); journeyHop(-1); }
    if (e.key === "Home") journeySet(0);
    if (e.key === "End")  journeySet(1);
  });

  addEventListener("resize", () => { if (J.built) layoutJourney(); });
}

/* ————————————————————————————————————————————
   journey on mobile (design Mobile.pdf p.30) — the years one under another:
   a rule across the column, the year [age], the paragraphs one blank line
   apart (personal column first, then professional), the picture under them
   ———————————————————————————————————————————— */
function renderJourneyList(body) {
  const years = journeyYears();
  body.innerHTML = `<div id="journey-list">${years.map((y) => {
    const recs = [...y.above, ...y.below];
    const img = recs.find((r) => r.image);
    const age = y.year - JOURNEY.born;
    return `<section class="jl-year">
        <div class="jl-head"><span class="jl-y">${y.year}</span>${age > 0 ? `<span class="jl-age">[${age}]</span>` : ""}</div>
        ${recs.map((r) => `<p class="jl-body">${txt(r, "text")}</p>`).join("")}
        ${img ? `<div class="jl-img size-${img.size || "l"}" data-src="${img.image.full || img.image.src}"><img src="${img.image.src}" alt="" loading="lazy"></div>` : ""}
      </section>`;
  }).join("")}</div>`;
  body.querySelectorAll(".jl-img").forEach((el) => el.addEventListener("click", () => openLightbox(el.dataset.src)));
}

/* ————————————————————————————————————————————
   biography — portrait above the centre line, statement starting on it
   (columns 3–5), then the cv: one group per section, the section label
   holding the centre line while its rows scroll past
   ———————————————————————————————————————————— */
function renderBiography(body) {
  const bio = BIO;
  const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
  /* statement: html as is (cms editor / demo); plain text → paragraphs */
  const raw = bio.rec ? (txt(bio, "body") || "") : bio.body;
  const statement = /^\s*</.test(raw) ? raw
    : esc(raw).split(/\n\s*\n/).map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("");

  const groups = BIO_SECTIONS
    .map((section) => ({ section, rows: bio.entries.filter((e) => e.section === section) }))
    .filter((g) => g.rows.length);

  body.innerHTML = `
    <div id="bio">
      <div class="b-head">${bio.portrait ? `<img class="b-portrait" src="${bio.portrait}" alt="">` : ""}</div>
      <div class="b-statement">${statement}</div>
      <div class="b-cv">
        ${groups.map((g) => `
          <section class="b-group">
            <div class="b-label"><span>${t(g.section)}</span></div>
            <div class="b-rows">
              ${g.rows.map((e) => `<div class="b-row">
                <span class="b-date">${esc(e.date)}</span>
                <span class="b-type">${esc(txt(e, "type"))}</span>
                <span class="b-title">${esc(txt(e, "title"))}</span>
                <span class="b-venue">${esc(txt(e, "venue"))}</span>
              </div>`).join("")}
            </div>
          </section>`).join("")}
      </div>
    </div>`;
  const portrait = body.querySelector(".b-portrait");
  if (portrait) portrait.addEventListener("click", () => openLightbox(bio.portraitFull || bio.portrait));
}

/* ————————————————————————————————————————————
   body text helpers (contact / acknowledgments)
   the admin's textarea stores lines joined with <br> and html-escaped; the importer and
   the static json store plain newlines. richText() brings both to paragraphs (blank line =
   new paragraph, single line breaks kept) and links e-mail addresses, phone numbers and urls.
   html that already comes as <p>/<div> (biography-style) is used as is.
   ———————————————————————————————————————————— */
const escHtml = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const unescHtml = (s) => String(s || "").replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
function autoLink(s) {
  return s
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
    .replace(/([\w.+-]+@[\w-]+\.[\w.-]+\w)/g, '<a href="mailto:$1">$1</a>')
    .replace(/(\+\d[\d ]{6,}\d)/g, (m) => `<a href="tel:${m.replace(/\s+/g, "")}">${m}</a>`);
}
function richText(raw) {
  raw = String(raw || "");
  if (/^\s*<(p|div|h\d)\b/i.test(raw)) return raw;
  const text = unescHtml(raw.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")).replace(/\r/g, "");
  return text.trim().split(/\n[ \t]*\n+/).map((p) => `<p>${autoLink(escHtml(p.trim())).replace(/\n/g, "<br>")}</p>`).join("");
}

/* ————————————————————————————————————————————
   media — design: media- contact-acknowledgement.pdf p.1
   the list starts at the top of the viewport and scrolls under the label on the
   centre line. one row per item: text in columns 2–3 (title, then date · source · url
   in the sub tone), the thumbnail in column 4 (16:9, 270 @1920), rows 50 @1920 apart,
   text top-aligned with the picture. the whole row is the link (new tab).
   ———————————————————————————————————————————— */
function renderMedia(body) {
  body.innerHTML = `<div id="media">${MEDIA.map((m) => {
    const title = txt(m, "title"), source = txt(m, "source"), url = m.url || "";
    const tag = url ? "a" : "div";
    return `<${tag} class="m-item"${url ? ` href="${escHtml(url)}" target="_blank" rel="noopener"` : ""}>
        <div class="m-text">
          <span class="m-title">${escHtml(title)}</span>
          ${m.date ? `<span class="m-meta">${escHtml(m.date)}</span>` : ""}
          ${source ? `<span class="m-meta">${escHtml(source)}</span>` : ""}
          ${url ? `<span class="m-meta m-url">${escHtml(url)}</span>` : ""}
        </div>
        ${m.image ? `<div class="m-thumb${m.frame ? " frame" : ""}"><img src="${m.image}" alt="" loading="lazy" draggable="false"></div>` : ""}
      </${tag}>`;
  }).join("")}</div>`;
}

/* ————————————————————————————————————————————
   contact — p.2: the 84000 communications logo centred on the centre line in the
   text column, the details 50 @1920 below it at the label size, one blank line
   between groups (tel / · email / · address /)
   ———————————————————————————————————————————— */
function renderContact(body) {
  const c = CONTACT;
  body.innerHTML = `<div id="contact">
      <div class="ct-logo"><img src="${CONTACT_LOGO}" alt="84000 communications" draggable="false"></div>
      <div class="ct-body">${richText(txt(c, "body"))}</div>
    </div>`;
}

/* ————————————————————————————————————————————
   acknowledgments — p.3: the statement in bold at the label size, its first line on
   the centre line; two blank lines; then the credit groups one blank line apart,
   all in columns 2–4. the first paragraph of the body is the statement.
   ———————————————————————————————————————————— */
function renderAcknowledgments(body) {
  body.innerHTML = `<div id="ack"><div class="ak-body">${richText(txt(ACK, "body"))}</div></div>`;
  const lead = body.querySelector(".ak-body > p");
  if (lead) lead.classList.add("ak-lead");
}

/* ————————————————————————————————————————————
   page registry — used by openPage() in main.js
   ———————————————————————————————————————————— */
const PAGES = {
  journey: {
    open(bar, { keep = false } = {}) {
      bar.innerHTML = `<span class="bar-label">${t("journey")}</span>`;
      if (isMobile()) { renderJourneyList($("#page-body")); return; }   /* portrait: a scrolling year list */
      const stage = $("#page-stage");
      if (!stage.dataset.bound) { bindJourneyInput(stage); stage.dataset.bound = 1; }
      buildJourney(stage);
      journeyReset(keep);
    },
  },
  biography: {
    open(bar) {
      bar.innerHTML = `<span class="bar-label">${t("biography")}</span>`;
      renderBiography($("#page-body"));
    },
  },
  media: {
    open(bar) {
      bar.innerHTML = `<span class="bar-label">${t("media")}</span>`;
      renderMedia($("#page-body"));
    },
  },
  contact: {
    open(bar) {
      bar.innerHTML = `<span class="bar-label">${t("contact")}</span>`;
      renderContact($("#page-body"));
    },
  },
  acknowledgments: {
    open(bar) {
      bar.innerHTML = `<span class="bar-label">${t("acknowledgments")}</span>`;
      renderAcknowledgments($("#page-body"));
    },
  },
  /* language switch while a page is open */
  refresh() {
    if (!pageVisible() || !PAGES[currentPage]) return;
    if (currentPage === "journey") PAGES.journey.open($("#page-bar"), { keep: true });
    else { const top = $("#page-scroll").scrollTop; PAGES[currentPage].open($("#page-bar")); $("#page-scroll").scrollTop = top; }
  },
};

/* ————— CMS ————— */
CMS.loadJourney().then((list) => {
  if (!list) return;
  JOURNEY_EVENTS = list;
  console.info(`cms: ${list.length} journey events`);
  if (pageVisible() && currentPage === "journey") PAGES.journey.open($("#page-bar"), { keep: true });
});
CMS.loadBiography().then((bio) => {
  if (!bio) return;
  BIO = bio;
  console.info(`cms: biography (${bio.entries.length} entries)`);
  if (pageVisible() && currentPage === "biography") PAGES.refresh();
});
CMS.loadMedia().then((list) => {
  if (!list) return;
  MEDIA = list;
  console.info(`cms: ${list.length} media items`);
  if (pageVisible() && currentPage === "media") PAGES.refresh();
});
CMS.loadTextPage("contact").then((page) => {
  if (!page) return;
  CONTACT = page;
  if (pageVisible() && currentPage === "contact") PAGES.refresh();
});
CMS.loadTextPage("acknowledgments").then((page) => {
  if (!page) return;
  ACK = page;
  if (pageVisible() && currentPage === "acknowledgments") PAGES.refresh();
});
