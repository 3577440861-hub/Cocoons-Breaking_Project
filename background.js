// ========================================================================
//  破茧实验 5 - 自动化执行助手 (Background Script)
//  
//  这个脚本在后台运行，管理标签页的创建和自动化执行。
// ========================================================================

console.log("🔧 破茧自动化助手 (Background) 已启动！");

// 全局状态
let searchList = [];
let currentSearchIndex = 0;
let isRunning = false;
let homeTabId = null;
let videoTabs = [];
let completedVideos = 0;
let totalVideosForCurrentSearch = 0;

// 监听来自 Content Script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("📨 Background 收到消息:", request.action);

  if (request.action === "startAutomation") {
    searchList = request.searchList;
    currentSearchIndex = 0;
    isRunning = true;
    videoTabs = [];
    completedVideos = 0;
    totalVideosForCurrentSearch = 0;
    console.log("🚀 自动化执行已启动，搜索列表:", searchList);
    
    // 保存首页标签ID
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        homeTabId = tabs[0].id;
        console.log("🏠 首页标签ID:", homeTabId);
      }
      startNextSearch();
    });
    sendResponse({ status: "started", taskCount: searchList.length * 10 });
  }

  if (request.action === "interactionComplete") {
    console.log("✅ 视频交互完成！");
    handleVideoComplete(sender.tab?.id);
    sendResponse({ status: "ok" });
  }

  if (request.action === "getState") {
    sendResponse({
      searchList: searchList,
      currentSearchIndex: currentSearchIndex,
      isRunning: isRunning,
      homeTabId: homeTabId
    });
  }

  if (request.action === "openMultipleVideos") {
    console.log("📋 收到视频链接列表:", request.videoLinks);
    videoTabs = [];
    completedVideos = 0;
    totalVideosForCurrentSearch = request.videoLinks.length;
    homeTabId = request.homeTabId;
    
    // 打开多个视频标签页
    openMultipleVideoTabs(request.videoLinks);
    sendResponse({ status: "ok" });
  }

  return true;
});

// 监听标签页关闭事件
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log(`🗑️  检测到标签页关闭: ${tabId}`);
  
  // 检查这个标签页是否在我们的视频标签列表中
  const tabIndex = videoTabs.indexOf(tabId);
  if (tabIndex !== -1 && isRunning) {
    console.log(`✅ 标签页 ${tabId} 是我们正在处理的视频，算作完成`);
    videoTabs.splice(tabIndex, 1);
    handleVideoComplete(tabId);
  }
});

// 打开多个视频标签页
function openMultipleVideoTabs(videoLinks) {
  console.log(`🎬 开始打开 ${videoLinks.length} 个视频标签页...`);
  
  videoLinks.forEach((link, index) => {
    setTimeout(() => {
      chrome.tabs.create({ url: link, active: false }, (tab) => {
        console.log(`📄 已打开标签页 ${index + 1}:`, tab.id);
        videoTabs.push(tab.id);
      });
    }, index * 500);
  });
}

// 开始下一个搜索
function startNextSearch() {
  if (currentSearchIndex >= searchList.length) {
    console.log("🎉 所有任务完成！");
    isRunning = false;
    if (homeTabId) {
      chrome.tabs.update(homeTabId, { active: true });
      chrome.tabs.sendMessage(homeTabId, { action: "allTasksComplete" });
    }
    return;
  }

  const keyword = searchList[currentSearchIndex];
  console.log(`🔍 [搜索 ${currentSearchIndex + 1}/${searchList.length}] 关键词: ${keyword}`);
  
  const searchUrl = `https://search.bilibili.com/all?keyword=${encodeURIComponent(keyword)}`;
  chrome.tabs.create({ url: searchUrl, active: true });
}

// 处理一个视频完成后的逻辑
function handleVideoComplete(tabId) {
  // 如果标签页还没关闭，先关闭它
  if (tabId) {
    chrome.tabs.get(tabId, (tab) => {
      if (!chrome.runtime.lastError && tab) {
        console.log(`🗑️  关闭已完成的标签页:`, tabId);
        chrome.tabs.remove(tabId);
      }
    });
  }
  
  completedVideos++;
  console.log(`✅ 已完成 ${completedVideos}/${totalVideosForCurrentSearch} 个视频`);

  // 如果当前关键词的视频都处理完了
  if (completedVideos >= totalVideosForCurrentSearch) {
    console.log(`✅ 搜索 ${currentSearchIndex + 1} 完成！`);
    currentSearchIndex++;
    completedVideos = 0;
    totalVideosForCurrentSearch = 0;
    videoTabs = [];
    
    // 激活首页标签并继续下一个搜索
    if (homeTabId) {
      chrome.tabs.update(homeTabId, { active: true }, () => {
        setTimeout(() => {
          startNextSearch();
        }, 1000);
      });
    } else {
      setTimeout(() => {
        startNextSearch();
      }, 1000);
    }
  }
}
