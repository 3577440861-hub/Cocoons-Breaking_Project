/**
 * ================================================
 *  破茧实验 1 - B站标题抓取插件 (教学注释版)
 *  
 *  这是一个 Content Script（内容脚本），它会被注入到网页中运行。
 *  这份代码包含了超详细的中文注释，帮助你理解前端开发。
 * ================================================
 */

// ========================================================================
// 【知识小课堂 1】console.log
// console.log 是你最好的朋友！它可以在浏览器的控制台里打印信息，
// 就像 Python 里的 print() 一样，用来调试和看结果。
// ========================================================================
console.log("=== 破茧实验 1：B站标题抓取插件已成功加载！ ===");


/**
 * ========================================================================
 *  【核心函数】scrapeTitles()
 *  
 *  功能：抓取当前页面上所有的 B 站视频标题，并打印出来。
 *  
 *  类比：如果你把网页比作一棵大树，这个函数就是在树上找“苹果”（标题）。
 * ========================================================================
 */
function scrapeTitles() {
  
  // ======================================================================
  // 【知识小课堂 2】DOM & document.querySelectorAll
  // 
  // DOM = Document Object Model（文档对象模型）
  // 简单理解：浏览器把网页 HTML 代码变成了一棵“树”，每个标签都是一个“节点”。
  // 
  // document 就是这棵树的根。
  // querySelectorAll(选择器) 就是用“魔法咒语”找出树上所有符合条件的节点。
  // 
  // '.bili-video-card__info--tit' 是一个 CSS 选择器。
  // 它的意思是：“找 class 属性等于 bili-video-card__info--tit 的所有元素”。
  // ======================================================================
  
  // 这里我们尝试了两种可能的选择器，因为 B 站有时候会改版换类名
  const titleElements = document.querySelectorAll(
    '.bili-video-card__info--tit, .bili-video-card .info-title'
  );

  // ======================================================================
  // 【知识小课堂 3】判断与长度
  // if 语句：如果...就...
  // Array.length：数组（列表）的长度。这里是找到了多少个标题。
  // ======================================================================
  if (titleElements.length === 0) {
    console.log("⚠️  未找到视频标题，可能页面还在加载中，请稍后再试...");
    return; // 退出函数，不往下执行了
  }

  // 打印一个漂亮的分隔符和统计信息
  console.log(`\n🎬 成功抓取 ${titleElements.length} 个视频标题：`);
  console.log("----------------------------------------");
  
  // ======================================================================
  // 【知识小课堂 4】循环 (Loop) - forEach
  // 
  // 我们找到了一堆标题元素，现在需要把它们一个个拿出来看。
  // forEach 就是说：“对列表里的每一个元素，都做同样的事情”。
  // 类比：就像点名，点到谁，就把谁的名字读出来。
  // 
  // (titleElement, index) 是参数：
  // - titleElement：当前这一个元素（DOM 节点对象）
  // - index：这是第几个元素（从 0 开始的数字）
  // ======================================================================
  titleElements.forEach((titleElement, index) => {
    
    // ====================================================================
    // 【知识小课堂 5】获取文本内容 (innerText)
    // 
    // DOM 节点不仅有标签，还有里面的文字内容。
    // .innerText 属性可以把那个标签包裹的纯文本提取出来。
    // .trim() 是字符串的方法，用来去掉首尾的空格和换行，干净一点。
    // ====================================================================
    const titleText = titleElement.innerText.trim();

    // 过滤掉空字符串（有的元素可能藏得比较深，没文字）
    if (titleText) {
      // 打印序号和标题。注意：index 是从 0 开始的，所以打印时 +1 会更符合人类习惯
      console.log(`${index + 1}. ${titleText}`);
    }
  });
  
  console.log("----------------------------------------\n");
}


// ========================================================================
// 【问题】网页加载需要时间！
// 
// 如果代码跑得太快，网页的视频还没刷出来，我们就抓不到东西了。
// 这就好比你去快递站拿快递，去早了货还没卸车。
// 
// 【解决方案 1】setTimeout (定时炸弹)
// 
// setTimeout(函数, 毫秒数)
// 意思是：“等一会儿（例如 2000 毫秒 = 2秒），再执行这个函数”。
// ========================================================================

// 页面加载完等 2 秒，给 B 站一点时间去加载视频数据
setTimeout(() => {
  console.log("⏳ 等待 2 秒后开始首次抓取...");
  scrapeTitles();
}, 2000);


// ========================================================================
// 【问题 2】B站是无限滚动的！
// 
// 当你往下滑，网页会自动加载更多新视频。
// 旧的 setTimeout 只会运行一次，抓不到新出来的视频。
// 
// 【解决方案 2】MutationObserver (监听器)
// 
// 这是一个高级的 API，专门用来盯着网页看：
// “喂，网页如果有任何变化（比如新加载了东西），记得叫我！”
// ========================================================================

// 定义一个变量，记录上一次我们抓到了多少个标题
let lastKnownTitleCount = 0;

// 1. 创建一个监听器对象
// 回调函数 (callback)：只要网页一变，这个函数就会被触发
const observer = new MutationObserver(() => {
  
  // 每次变化时，我们重新数一遍现在有多少个标题
  const currentTitles = document.querySelectorAll(
    '.bili-video-card__info--tit, .bili-video-card .info-title'
  );
  
  // 如果现在的数量和上次不一样，说明来了新视频！
  if (currentTitles.length !== lastKnownTitleCount) {
    console.log(`🔄 检测到页面变化！旧数量: ${lastKnownTitleCount}, 新数量: ${currentTitles.length}`);
    lastKnownTitleCount = currentTitles.length; // 更新记录
    scrapeTitles(); // 重新抓取并打印所有标题
  }
});

// 2. 启动监听器
// observe(观察谁, 配置选项)
observer.observe(
  document.body, // 我们观察整个网页正文
  { 
    childList: true, // 观察节点的增删
    subtree: true    // 不仅观察直接子节点，还要深入观察里面的所有后代节点（嵌套结构）
  }
);

// ========================================================================
// 【实验 2】给插件加个按钮，自动搜索“考研英语”
// ========================================================================

/**
 * 【核心函数】createAutoSearchButton()
 * 
 * 功能：在网页右下角创建一个悬浮按钮，点击后自动执行搜索。
 */
function createAutoSearchButton() {
  // 1. 创建按钮元素
  const btn = document.createElement('button');
  
  // 2. 设置按钮显示的文字
  btn.innerText = "🚀 考研英语 (自动搜索)";
  
  // 3. 给按钮穿上“衣服”（设置 CSS 样式）
  // 我们让它固定在屏幕右下角，看起来像个悬浮球
  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '9999',
    padding: '12px 20px',
    backgroundColor: '#00aeec', // B站标志性的蓝色
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s'
  });

  // 鼠标放上去变深色一点（简单的交互反馈）
  btn.onmouseover = () => btn.style.backgroundColor = '#008ac5';
  btn.onmouseout = () => btn.style.backgroundColor = '#00aeec';

  // 4. 给按钮绑定点击事件（核心逻辑）
  btn.onclick = () => {
    console.log("🖱️ 自动搜索按钮被点击了！正在尝试输入并跳转...");

    // 【知识小课堂 6】自动控制表单
    // 就像你自己操作浏览器一样，我们需要：
    // a) 找到输入框
    // b) 把字打进去
    // c) 找到搜索按钮并点击（或者按回车）

    // B站搜索框的选择器，可能会随版本变化
    const searchInput = document.querySelector('.nav-search-input') || 
                        document.querySelector('.search-input-el');
    
    // B站搜索按钮的选择器
    const searchBtn = document.querySelector('.nav-search-btn') || 
                      document.querySelector('.search-button');

    if (searchInput && searchBtn) {
      // 第一步：把“考研英语”填进去
      searchInput.value = "考研英语";
      
      // 注意：有些网页需要触发 input 事件，程序才会发现文字变了
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));

      // 第二步：稍微等一下（模拟真实感），然后点下搜索按钮
      setTimeout(() => {
        searchBtn.click();
        console.log("✅ 已成功执行搜索跳转！");
      }, 300);
    } else {
      console.error("❌ 找不到搜索框或按钮，B站可能改版了！");
      alert("找不到搜索框，请检查 B 站页面结构。");
    }
  };

  // 5. 把按钮塞进网页里（添加到 body 的最后面）
  document.body.appendChild(btn);
  console.log("✨ 自动搜索按钮已注入页面！");
}

// ========================================================================
// 【实验 3】AI 智能筛选：把标题发给 ChatGPT/DeepSeek 分类
// ========================================================================

/**
 * 【核心函数】createAIAnalysisButton()
 * 
 * 功能：在搜索按钮上方再加一个 AI 筛选按钮。
 */
function createAIAnalysisButton() {
  const btn = document.createElement('button');
  btn.innerText = "🤖 AI 筛选 (实验 3)";
  
  // 样式微调：放在搜索按钮上方
  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '80px', // 比实验2的按钮高一点
    right: '20px',
    zIndex: '9999',
    padding: '12px 20px',
    backgroundColor: '#ff6699', // 漂亮的粉色，区分功能
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s'
  });

  btn.onmouseover = () => btn.style.backgroundColor = '#e65a8a';
  btn.onmouseout = () => btn.style.backgroundColor = '#ff6699';

  btn.onclick = async () => {
    console.log("🖱️ AI 筛选按钮被点击！准备分析标题...");
    
    // 1. 获取前 10 个标题
    const titles = Array.from(document.querySelectorAll('.bili-video-card__info--tit, .bili-video-card .info-title'))
      .slice(0, 10)
      .map(el => el.innerText.trim())
      .filter(t => t !== "");

    if (titles.length === 0) {
      alert("没找到标题，请等页面加载完再试！");
      return;
    }

    // 2. 获取 API Key（这里演示如何通过 prompt 让用户输入并保存）
    let apiKey = localStorage.getItem('破茧_API_KEY');
    if (!apiKey) {
      apiKey = prompt("请输入你的 OpenAI 或 DeepSeek API Key (仅保存在本地):");
      if (apiKey) localStorage.setItem('破茧_API_KEY', apiKey);
      else return;
    }

    btn.innerText = "⏳ AI 思考中...";
    btn.disabled = true;

    try {
      const result = await analyzeTitlesWithAI(titles, apiKey);
      showAIResult(result, "🤖 AI 筛选结果 (娱乐类)", "#ff6699");
    } catch (error) {
      console.error("AI 分析失败:", error);
      alert("AI 分析出错啦: " + error.message);
    } finally {
      btn.innerText = "🤖 AI 筛选 (实验 3)";
      btn.disabled = false;
    }
  };

  document.body.appendChild(btn);
  console.log("✨ AI 筛选按钮已注入页面！");
}

/**
 * 【核心函数】analyzeTitlesWithAI()
 * 
 * 功能：调用大模型 API 进行分类。
 */
async function analyzeTitlesWithAI(titles, apiKey) {
  // 这里以 DeepSeek 为例，它的 API 格式和 OpenAI 完全一样
  // 如果你想换成 OpenAI，把 URL 换成 https://api.openai.com/v1/chat/completions
  const API_URL = "https://api.deepseek.com/chat/completions"; 
  
  const prompt = `
    你是一个视频分类助手。请分析以下 10 个 B 站视频标题，
    找出哪些属于“娱乐类”（如：搞笑、综艺、游戏、鬼畜等）。
    
    标题列表：
    ${titles.map((t, i) => `${i + 1}. ${t}`).join('\n')}
    
    请直接返回属于娱乐类的标题序号和名称，如果没有则说“无”。
    回复格式示例：
    - 2. 某个搞笑视频
    - 5. 某个游戏解说
  `;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "deepseek-chat", // 或者 "gpt-3.5-turbo"
      messages: [
        { role: "system", content: "你是一个专业的网页内容筛选助手。" },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "网络请求失败");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * 【辅助函数】showAIResult()
 * 
 * 功能：在页面上弹出一个简单的层展示结果。
 * @param {string} content  AI 返回的内容
 * @param {string} title   弹窗标题（可选，默认"AI 分析结果"）
 * @param {string} color   主题色（可选，默认 #ff6699）
 */
function showAIResult(content, title = "🤖 AI 分析结果", color = "#ff6699") {
  const resultDiv = document.createElement('div');
  Object.assign(resultDiv.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 0 20px rgba(0,0,0,0.3)',
    zIndex: '10000',
    maxWidth: '80%',
    maxHeight: '70%',
    overflowY: 'auto',
    border: `2px solid ${color}`
  });

  resultDiv.innerHTML = `
    <h3 style="margin-top:0; color:${color};">${title}</h3>
    <pre style="white-space: pre-wrap; font-family: sans-serif; line-height: 1.5;">${content}</pre>
    <button id="close-ai-res" style="background:${color}; color:white; border:none; padding:8px 16px; border-radius:4px; cursor:pointer; float:right;">关闭</button>
  `;

  document.body.appendChild(resultDiv);
  document.getElementById('close-ai-res').onclick = () => resultDiv.remove();
}

// ========================================================================
// 【实验 4】用户画像分析：把全部视频标题发给 DeepSeek 分析你
// ========================================================================

/**
 * 【核心函数】createAutomaticCocoonsBreakingButton()
 * 
 * 功能：创建"Automatic Cocoons Breaking"按钮，点击后先下滑刷新，再进行分析。
 */
function createAutomaticCocoonsBreakingButton() {
  const btn = document.createElement('button');
  btn.innerText = "🦋 Automatic Cocoons Breaking";

  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '9999',
    padding: '12px 20px',
    backgroundColor: '#8e44ad',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s'
  });

  btn.onmouseover = () => btn.style.backgroundColor = '#7d3398';
  btn.onmouseout = () => btn.style.backgroundColor = '#8e44ad';

  btn.onclick = async () => {
    console.log("🖱️ Automatic Cocoons Breaking 按钮被点击！");

    // 先下滑刷新视频
    console.log("⬇️  开始下滑页面刷新视频...");
    await scrollPageDown();

    console.log("📋 准备收集视频标题...");
    const titles = Array.from(document.querySelectorAll('.bili-video-card__info--tit, .bili-video-card .info-title'))
      .map(el => el.innerText.trim())
      .filter(t => t !== "");

    if (titles.length === 0) {
      alert("没找到标题，请等页面加载完再试！");
      return;
    }

    const breakDirection = prompt("请输入你想要“破茧”的方向（例如：考研、就业、戒网瘾、学习新技能、健康生活等）：");
    if (!breakDirection || breakDirection.trim() === "") {
      alert("请输入一个破茧方向！");
      return;
    }

    localStorage.setItem('破茧方向', breakDirection);
    console.log(`🎯 破茧方向: ${breakDirection}`);
    console.log(`📊 共收集到 ${titles.length} 个视频标题，准备发送给 AI 分析...`);

    let apiKey = localStorage.getItem('破茧_API_KEY');
    if (!apiKey) {
      apiKey = prompt("请输入你的 DeepSeek API Key (仅保存在本地):");
      if (apiKey) localStorage.setItem('破茧_API_KEY', apiKey);
      else return;
    }

    btn.innerText = "⏳ AI 深度分析中...";
    btn.disabled = true;

    try {
      const result = await analyzeProfileWithAI(titles, apiKey, breakDirection);
      showAIResult(result, `🧠 破茧计划 (${breakDirection})`, "#8e44ad");
    } catch (error) {
      console.error("用户画像分析失败:", error);
      alert("分析出错啦: " + error.message);
    } finally {
      btn.innerText = "🦋 Automatic Cocoons Breaking";
      btn.disabled = false;
    }
  };

  document.body.appendChild(btn);
  console.log("✨ Automatic Cocoons Breaking 按钮已注入页面！");
}

/**
 * 【核心函数】analyzeProfileWithAI()
 * 
 * 功能：把全部标题和破茧方向发给 DeepSeek，让它给出破茧计划和结构化的用户画像。
 */
async function analyzeProfileWithAI(titles, apiKey, breakDirection) {
  const API_URL = "https://api.deepseek.com/chat/completions";

  const prompt = `
你是一位专业的人生教练兼行为分析师。现在有一位 B 站用户，他想要“破茧”。
破茧方向是：【${breakDirection}】

这是他首页推荐的全部视频标题（共 ${titles.length} 个），代表了算法认为他感兴趣的内容：
${titles.map((t, i) => `${i + 1}. ${t}`).join('\n')}

请你根据以上信息，完成以下任务，并返回JSON格式的数据：

1. **现状诊断**：
   - 分析当前推荐流反映出的用户现状（时间分配、兴趣焦点、可能存在的内耗点）
   - 指出当前状态与“${breakDirection}”目标之间的差距

2. **破茧所需的技能树**：
   - 结合用户现状和目标，列出 3-5 个核心技能（Skill）
   - 每个技能要说明：为什么需要它？如何入门？（给出具体可操作的第一步）

3. **7天破茧执行计划**：
   - 给出一份具体、可落地的 7 天建议
   - 每天的建议要包含：在 B 站应该看什么（具体搜索词/内容方向）、以及“破茧”相关的具体行动
   - 建议中要包含如何“反向训练”算法：即主动搜索/观看什么内容来“净化”推荐流

4. **风险预警与心态建设**：
   - 预测破茧过程中可能遇到的困难（基于当前的视频推荐推断）
   - 给出 2-3 条保持动力的心理建议

5.**推送层面可执行的操作**
   - 该关注哪些UP主
   - 推荐的系列视频
   - 该拉黑哪些UP主
   - 该不感兴趣哪些视频   

注意事项：
- 语气要像一位可靠的教练，坚定但温暖，给人信心
- 所有建议必须结合用户提供的视频标题内容，不要空泛
- 技能和计划要尽可能具体，让用户看完就知道“今天该做什么”
- 如果推荐流中有明显与“${breakDirection}”冲突的娱乐内容，请友善地指出，但不要批判

{
  "fullAnalysis": "这里是完整的分析内容（与之前的要求相同）",
  "userProfile": {
    "categories": [
      { "name": "娱乐", "percentage": 35, "color": "#FF6384" },
      { "name": "学习", "percentage": 25, "color": "#36A2EB" },
      { "name": "游戏", "percentage": 20, "color": "#FFCE56" },
      { "name": "生活", "percentage": 12, "color": "#4BC0C0" },
      { "name": "其他", "percentage": 8, "color": "#9966FF" }
    ],
    "genderEmoji": "👨",
    "userImage": "一个热爱学习但偶尔会沉迷娱乐的年轻人",
    "shortTermAdvice": "本周每天花30分钟学习新技能，减少娱乐视频观看时间"
  },
  "searchKeywords": "考研英语,考研数学,编程入门,学习方法,高效学习"
}

注意：
1. fullAnalysis字段包含完整的破茧计划分析
2. userProfile.categories根据视频标题估算5-6个兴趣类别和占比，总和为100%
3. genderEmoji根据内容推测，用👨或👩
4. userImage用一句话描述用户形象
5. shortTermAdvice给出1-2条短期建议
6. searchKeywords是一个用逗号分隔的字符串，包含5个核心搜索关键词，这些关键词将直接放到B站搜索框里搜索
`.trim();

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "你是一位资深的用户行为分析师和心理辅导专家，你的语气温暖、真诚，像一位关心朋友的学长。你会结合具体内容给出分析，不说空洞的鸡汤。请返回有效的JSON格式数据。" },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "网络请求失败");
  }

  const data = await response.json();
  const aiResponse = data.choices[0].message.content;
  
  // 尝试解析JSON
  try {
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      saveUserProfile(parsed.userProfile);
      showUserProfilePanel(parsed.userProfile);
      
      // 将DS返回的searchKeywords直接赋值给搜索清单
      if (parsed.searchKeywords) {
        currentSearchList = parsed.searchKeywords.split(',').map(s => s.trim()).filter(s => s);
        console.log("📋 获取到DS推荐的搜索清单:", currentSearchList);
      }
      
      return parsed.fullAnalysis;
    }
  } catch (e) {
    console.warn("解析JSON失败，使用默认数据");
  }
  
  // 如果解析失败，使用默认数据
  const defaultProfile = {
    categories: [
      { name: "娱乐", percentage: 40, color: "#FF6384" },
      { name: "学习", percentage: 30, color: "#36A2EB" },
      { name: "游戏", percentage: 15, color: "#FFCE56" },
      { name: "生活", percentage: 10, color: "#4BC0C0" },
      { name: "其他", percentage: 5, color: "#9966FF" }
    ],
    genderEmoji: "👤",
    userImage: "正在破茧的用户",
    shortTermAdvice: "坚持每天进步一点点"
  };
  saveUserProfile(defaultProfile);
  showUserProfilePanel(defaultProfile);
  currentSearchList = [];
  return aiResponse;
}

// 保存用户画像到本地
function saveUserProfile(profile) {
  localStorage.setItem('破茧用户画像', JSON.stringify(profile));
  console.log("💾 用户画像已保存到本地");
}

// 从本地加载用户画像
function loadUserProfile() {
  const saved = localStorage.getItem('破茧用户画像');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  }
  return null;
}

// 绘制扇形图（使用CSS绘制）
function createPieChart(categories) {
  const container = document.createElement('div');
  container.style.cssText = `
    width: 150px;
    height: 150px;
    position: relative;
  `;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '150');
  svg.setAttribute('height', '150');
  svg.setAttribute('viewBox', '0 0 100 100');

  let currentAngle = 0;
  categories.forEach(cat => {
    const angle = (cat.percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;

    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`);
    path.setAttribute('fill', cat.color);
    svg.appendChild(path);

    currentAngle += angle;
  });

  // 中心白色圆
  const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  centerCircle.setAttribute('cx', '50');
  centerCircle.setAttribute('cy', '50');
  centerCircle.setAttribute('r', '20');
  centerCircle.setAttribute('fill', 'white');
  svg.appendChild(centerCircle);

  container.appendChild(svg);
  return container;
}

// 显示用户画像面板
function showUserProfilePanel(profile) {
  let panel = document.getElementById('cocoons-user-profile');
  if (panel) {
    panel.remove();
  }

  panel = document.createElement('div');
  panel.id = 'cocoons-user-profile';
  panel.style.cssText = `
    position: fixed;
    bottom: 80px;
    left: 20px;
    background: white;
    padding: 15px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    z-index: 9998;
    max-width: 220px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  `;

  const chartContainer = document.createElement('div');
  chartContainer.style.cssText = 'display: flex; justify-content: center; margin-bottom: 10px;';
  chartContainer.appendChild(createPieChart(profile.categories));

  const legendContainer = document.createElement('div');
  legendContainer.style.cssText = 'margin-bottom: 10px;';
  profile.categories.forEach(cat => {
    const item = document.createElement('div');
    item.style.cssText = 'display: flex; align-items: center; font-size: 11px; margin: 2px 0;';
    item.innerHTML = `
      <span style="display: inline-block; width: 12px; height: 12px; background: ${cat.color}; border-radius: 2px; margin-right: 6px;"></span>
      <span style="flex: 1;">${cat.name}</span>
      <span style="font-weight: bold;">${cat.percentage}%</span>
    `;
    legendContainer.appendChild(item);
  });

  const infoContainer = document.createElement('div');
  infoContainer.style.cssText = 'border-top: 1px solid #eee; padding-top: 10px; font-size: 12px;';
  infoContainer.innerHTML = `
    <div style="margin-bottom: 6px;"><strong>用户形象:</strong> ${profile.genderEmoji} ${profile.userImage}</div>
    <div style="color: #666;"><strong>短期建议:</strong> ${profile.shortTermAdvice}</div>
  `;

  panel.appendChild(chartContainer);
  panel.appendChild(legendContainer);
  panel.appendChild(infoContainer);

  // 添加关闭按钮
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '✕';
  closeBtn.style.cssText = `
    position: absolute;
    top: 5px;
    right: 8px;
    background: none;
    border: none;
    font-size: 14px;
    cursor: pointer;
    color: #999;
  `;
  closeBtn.onclick = () => panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  panel.appendChild(closeBtn);

  document.body.appendChild(panel);
  console.log("✨ 用户画像面板已显示");
}

// 页面加载完后，注入按钮
setTimeout(() => {
   createAutomaticCocoonsBreakingButton();
   
   // 如果是首页，显示已保存的用户画像
   if (pageType === 'home') {
     const savedProfile = loadUserProfile();
     if (savedProfile) {
       showUserProfilePanel(savedProfile);
     }
   }
 }, 1000);

console.log("👁️  已启动 MutationObserver，正在监听页面动态变化...");

// ========================================================================
//  【实验 5】自动化执行引擎
//  
//  根据当前页面类型（首页/搜索页/视频页）执行不同操作
// ========================================================================

// 全局变量：用于存放当前的执行计划
let currentSearchList = [];
let homeTabId = null;

// 判断当前是哪个页面
const pageType = detectPageType();

// 页面类型检测
function detectPageType() {
  if (window.location.pathname.startsWith('/video/')) {
    return 'video';
  } else if (window.location.hostname.includes('search.bilibili.com')) {
    return 'search';
  } else if (window.location.pathname === '/') {
    return 'home';
  }
  return 'other';
}

console.log(`🏠 当前页面类型: ${pageType}`);

// 根据页面类型执行相应逻辑
if (pageType === 'search') {
  handleSearchPage();
} else if (pageType === 'video') {
  handleVideoPage();
}

// 下滑页面刷新视频
async function scrollPageDown() {
  console.log("⬇️  开始下滑页面刷新视频...");
  for (let i = 0; i < 3; i++) {
    window.scrollBy(0, 500);
    await sleep(500);
  }
  window.scrollTo(0, 0);
  await sleep(1000);
  console.log("✅ 页面刷新完成");
}

// 处理搜索页
function handleSearchPage() {
  console.log("🔍 检测到搜索页，获取状态...");

  // 先从 Background 获取当前状态
  if (chrome && chrome.runtime) {
    chrome.runtime.sendMessage({ action: "getState" }, (response) => {
      if (!response || !response.isRunning) {
        console.log("❌ 自动化未运行，不执行操作");
        return;
      }

      console.log("📊 当前状态:", response);
      homeTabId = response.homeTabId;

      setTimeout(() => {
        const videoCards = document.querySelectorAll('.bili-video-card, .video-item, .bili-list-item');
        
        if (videoCards.length === 0) {
          console.warn("⚠️  未找到视频卡片，再等一下...");
          setTimeout(handleSearchPage, 1000);
          return;
        }

        // 获取前10个视频链接
        const videoLinks = [];
        for (let i = 0; i < Math.min(10, videoCards.length); i++) {
          const card = videoCards[i];
          const link = card.querySelector('a[href*="/video/"]') || card.querySelector('a');
          if (link) {
            videoLinks.push(link.href);
          }
        }

        console.log(`📋 获取到 ${videoLinks.length} 个视频链接:`, videoLinks);

        // 通知Background打开多个标签页
        if (chrome && chrome.runtime) {
          chrome.runtime.sendMessage({
            action: "openMultipleVideos",
            videoLinks: videoLinks,
            homeTabId: homeTabId
          });
        }
      }, 2000);
    });
  }
}

// 处理视频页
function handleVideoPage() {
  console.log("📺 检测到视频页，准备执行点赞、收藏、关注...");

  // 设置12秒自动关闭定时器
  let autoCloseTimeout = null;
  let actionCompleted = false;

  const triggerComplete = () => {
    if (!actionCompleted) {
      actionCompleted = true;
      if (autoCloseTimeout) {
        clearTimeout(autoCloseTimeout);
      }
      console.log("✅ 通知 Background 任务完成");
      if (chrome && chrome.runtime) {
        chrome.runtime.sendMessage({ action: "interactionComplete" });
      }
    }
  };

  // 12秒后自动完成（不检查点赞）
  autoCloseTimeout = setTimeout(() => {
    console.log("⏰ 12秒时间到，自动完成任务");
    triggerComplete();
  }, 12000);

  const performActions = async () => {
    console.log("⏳ 等待页面元素加载 (5秒)...");
    await sleep(5000);
    
    console.log("🔍 === 开始查找按钮 ===");
    
    // 检查是否能找到至少一个按钮，如果找不到直接关闭标签页（可能是课程视频）
    let likeBtn = findLikeButton();
    let collectBtn = findCollectButton();
    let followBtn = findFollowButton();
    
    if (!likeBtn && !collectBtn && !followBtn) {
      console.warn("⚠️  未找到任何交互按钮，可能是课程视频，直接关闭标签页");
      triggerComplete();
      return;
    }
    
    // ================= 1. 点赞 =================
    if (likeBtn) {
      console.log("✅ 找到点赞按钮:", likeBtn);
      if (!isElementActive(likeBtn)) {
        clickElement(likeBtn);
        console.log("👍 点赞成功");
      } else {
        console.log("🤷 已点赞，跳过");
      }
    } else {
      console.warn("⚠️  未找到点赞按钮");
    }
    
    await sleep(800);

    // ================= 2. 收藏 =================
    if (collectBtn) {
      console.log("✅ 找到收藏按钮:", collectBtn);
      clickElement(collectBtn);
      console.log("📦 点击收藏成功");
      await sleep(1200);
    } else {
      console.warn("⚠️  未找到收藏按钮");
    }
    
    await sleep(500);

    // ================= 3. 关注 UP 主 =================
    if (followBtn) {
      console.log("✅ 找到关注按钮:", followBtn);
      if (!isFollowed(followBtn)) {
        clickElement(followBtn);
        console.log("➕ 关注成功");
      } else {
        console.log("🤷 已关注，跳过");
      }
    } else {
      console.warn("⚠️  未找到关注按钮");
    }
    
    await sleep(1000);

    console.log("✅ === 视频页操作完成 ===");
    
    // 操作完成，触发完成
    triggerComplete();
  };

  performActions();
}

// ========= 改进的按钮查找函数 =========

function findLikeButton() {
  const selectors = [
    '.video-like-info',
    '[class*="like"] .video-toolbar-item',
    '.ops .like',
    '.toolbar-left .like',
    '[title="点赞"]',
    '.video-actions .action-item:nth-child(1)',
    '.video-interaction .video-like-btn'
  ];
  
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el && el.offsetHeight > 0) {
      const text = (el.innerText || '').toLowerCase();
      if (text.includes('点赞') || text.includes('like')) {
        return el;
      }
      return el;
    }
  }
  
  // 备用方法：查找包含"点赞"文本的元素
  return findElementByText(['点赞', '👍'], true);
}

function findCollectButton() {
  const selectors = [
    '.video-collect-info',
    '[class*="collect"] .video-toolbar-item',
    '.ops .collect',
    '.toolbar-left .collect',
    '[title="收藏"]',
    '.video-actions .action-item:nth-child(2)',
    '.video-interaction .video-coins-btn'
  ];
  
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el && el.offsetHeight > 0) {
      const text = (el.innerText || '').toLowerCase();
      if (text.includes('收藏') || text.includes('collect')) {
        return el;
      }
      return el;
    }
  }
  
  return findElementByText(['收藏', '⭐'], true);
}

function findFollowButton() {
  const selectors = [
    '.up-info .follow-btn',
    '.up-info .relation-btn',
    '[class*="follow"] button',
    '.user-info .follow',
    '[title="关注"]',
    '.up-detail .btn-follow',
    '.follow-panel button'
  ];
  
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el && el.offsetHeight > 0) {
      const text = (el.innerText || '').toLowerCase();
      if (text.includes('关注') || text.includes('+关注') || text.includes('follow')) {
        return el;
      }
      return el;
    }
  }
  
  return findElementByText(['+ 关注', '+关注', '关注'], true);
}

function findElementByText(keywords, findClickable = false) {
  const allElements = Array.from(document.querySelectorAll('*'));
  for (const el of allElements) {
    if (!el.offsetHeight || !el.offsetWidth) continue;
    
    const text = (el.innerText || '').trim();
    if (!text) continue;
    
    if (keywords.some(k => text.includes(k))) {
      if (findClickable) {
        let current = el;
        let depth = 0;
        while (current && depth < 5) {
          const style = window.getComputedStyle(current);
          if (style.cursor === 'pointer' || 
              current.tagName === 'BUTTON' || 
              current.tagName === 'DIV' ||
              current.onclick) {
            return current;
          }
          current = current.parentElement;
          depth++;
        }
      }
      return el;
    }
  }
  
  return null;
}

function clickElement(el) {
  try {
    el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    setTimeout(() => el.click(), 100);
  } catch (e) {
    el.click();
  }
}

function isElementActive(el) {
  return el.classList.contains('active') || 
         el.classList.contains('on') ||
         el.classList.contains('liked') ||
         el.style.color !== '';
}

function isFollowed(el) {
  const text = (el.innerText || '').toLowerCase();
  return text.includes('已关注') || 
         text.includes('取消') ||
         el.classList.contains('followed');
}

function dumpAllCandidates(type) {
  const all = Array.from(document.querySelectorAll('*'))
    .filter(el => el.innerText && el.innerText.includes(type) && el.offsetHeight > 0)
    .slice(0, 5);
  console.log(`� ${type} 候选元素:`, all);
}

// 辅助：睡眠函数
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ========================================================================
//  【功能扩展】在破茧计划弹窗中添加"一键执行"按钮
//  并修改 showAIResult 以保存搜索清单
// ========================================================================

// 重写 showAIResult，在里面加个执行按钮
const originalShowAIResult = window.showAIResult;

window.showAIResult = function(content, title, color) {
  const resultDiv = document.createElement('div');
  Object.assign(resultDiv.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 0 20px rgba(0,0,0,0.3)',
    zIndex: '10000',
    maxWidth: '80%',
    maxHeight: '70%',
    overflowY: 'auto',
    border: `2px solid ${color}`
  });

  // 如果DS已经提供了搜索清单，直接使用；否则用旧方法提取
  if (!currentSearchList || currentSearchList.length === 0) {
    currentSearchList = extractSearchKeywords(content);
  }

  resultDiv.innerHTML = `
    <h3 style="margin-top:0; color:${color};">${title}</h3>
    <pre style="white-space: pre-wrap; font-family: sans-serif; line-height: 1.5; margin-bottom: 20px;">${content}</pre>
    <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
      <p style="font-size: 13px; color: #666; margin-bottom: 10px;">
        💡 预计搜索清单 (${currentSearchList.length} 个): 
        <br><small>${currentSearchList.slice(0, 5).join('、')}${currentSearchList.length > 5 ? '...' : ''}</small>
      </p>
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button id="edit-search-list" style="background:#95a5a6; color:white; border:none; padding:8px 16px; border-radius:4px; cursor:pointer;">
          ✏️ 编辑清单
        </button>
        <button id="start-automation" style="background:${color}; color:white; border:none; padding:8px 16px; border-radius:4px; cursor:pointer;">
          🚀 开始执行破茧
        </button>
        <button id="close-ai-res" style="background:#95a5a6; color:white; border:none; padding:8px 16px; border-radius:4px; cursor:pointer;">关闭</button>
      </div>
    </div>
  `;

  document.body.appendChild(resultDiv);
  document.getElementById('close-ai-res').onclick = () => resultDiv.remove();
  
  document.getElementById('edit-search-list').onclick = () => {
    const newList = prompt("请输入搜索关键词（用逗号分隔）:", currentSearchList.join(','));
    if (newList) {
      currentSearchList = newList.split(',').map(s => s.trim()).filter(s => s);
      alert(`已更新搜索清单，共 ${currentSearchList.length} 个关键词`);
    }
  };

  document.getElementById('start-automation').onclick = () => {
    if (currentSearchList.length === 0) {
      alert("搜索清单为空，请先编辑清单！");
      return;
    }
    
    if (confirm(`确定要开始执行吗？\n\n将依次搜索 ${currentSearchList.length} 个关键词，\n并对每个前10个视频进行点赞、收藏、关注。`)) {
      resultDiv.remove();
      
      if (chrome && chrome.runtime) {
        chrome.runtime.sendMessage({
          action: "startAutomation",
          searchList: currentSearchList
        }, (response) => {
          console.log("Background 响应:", response);
          if (response && response.status === "started") {
            alert(`🚀 破茧执行已启动！\n\n共 ${response.taskCount} 个任务。`);
          }
        });
      } else {
        alert("❌ 无法连接到 Background Script，请刷新插件后重试。");
      }
    }
  };
};

// 简单的关键词提取函数（从 AI 返回的内容里找“搜索词”、“看什么”之类的）
function extractSearchKeywords(text) {
  const keywords = [];
  
  // 1. 先找一些常见的方向词
  const commonSubjects = ["考研英语", "考研数学", "Java", "Python", "前端", "Vue", "React", 
                          "算法", "数据结构", "托福", "雅思", "考公", "教资", 
                          "PS教程", "剪辑教程", "健身", "读书", "冥想"];
  
  commonSubjects.forEach(subject => {
    if (text.includes(subject)) {
      if (!keywords.includes(subject)) keywords.push(subject);
    }
  });
  
  // 2. 如果 AI 没提到常见词，根据破茧方向自动补几个
  if (keywords.length === 0) {
    const direction = localStorage.getItem('破茧方向') || "学习";
    keywords.push(`${direction}教程`, `${direction}入门`, `${direction}学习方法`);
  }
  
  // 3. 保底
  if (keywords.length === 0) {
    keywords.push("考研英语", "编程入门", "健身计划");
  }
  
  return keywords.slice(0, 5); // 最多 5 个
}

// 监听来自 Background 的消息
if (chrome && chrome.runtime) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "allTasksComplete") {
      showSuccessModal();
      sendResponse({ status: "ok" });
    }
    return true;
  });
}

// 显示最终成功界面
function showSuccessModal() {
  const modal = document.createElement('div');
  Object.assign(modal.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '99999'
  });

  modal.innerHTML = `
    <div style="
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 60px 80px;
      border-radius: 24px;
      text-align: center;
      color: white;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      max-width: 600px;
    ">
      <div style="font-size: 80px; margin-bottom: 20px;">🦋</div>
      <h1 style="font-size: 36px; margin: 0 0 15px 0; font-weight: bold;">破茧成功！</h1>
      <p style="font-size: 20px; opacity: 0.95; margin: 0 0 30px 0;">
        祝您早日羽化成蝶！
      </p>
      <button id="close-success" style="
        background: white;
        color: #764ba2;
        border: none;
        padding: 14px 40px;
        border-radius: 50px;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      ">
        继续前行 ✨
      </button>
    </div>
  `;

  document.body.appendChild(modal);
  document.getElementById('close-success').onclick = () => modal.remove();
}

