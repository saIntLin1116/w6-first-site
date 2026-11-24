# Project A｜日常誌個人行程與任務管理系統

「日常誌」是以原生 HTML、CSS 和 JavaScript 製作的個人行程與待辦管理網站，使用 Firebase Google 登入與 Firestore 保存個人資料。

- 正式網站：[GitHub Pages](https://saintlin1116.github.io/w6-first-site/)
- GitHub Repo：[`saIntLin1116/w6-first-site`](https://github.com/saIntLin1116/w6-first-site)
- [查看 main 分支的提交紀錄](https://github.com/saIntLin1116/w6-first-site/commits/main)
- [開發交接與目前待辦](./HANDOFF.md)｜[需求與尚待確認事項](./REQUIREMENTS.md)

## 目前功能

### 登入與個人資料

- 使用 Google 登入與登出；桌面使用彈出視窗，手機使用重新導向登入；登入後才顯示個人行程和待辦。
- 日期以台北時區顯示。
- 任務、行程和類別分別保存在登入者自己的 Firestore UID 路徑。
- 登出或切換帳號時清除畫面上的舊帳號資料。

### 待辦清單與今日安排

- 可新增待辦、編輯名稱與資訊、刪除待辦。
- 待辦可加入今日或移回清單；今日頁可拖曳待辦，安排它與固定行程的先後位置。
- 狀態包含「未開始、進行中、已完成」；點選狀態可切換，清單中的進行中待辦也可退回未開始。
- 今日時間線將待辦與行事曆行程放在同一條清單；待辦保留預估時長但不編固定開始時間，行程沿用開始／結束時間與分類顏色。
- 今日待辦可拖曳到兩個行程之間；若預估時長超過行程間空檔，會顯示警告。排序保存到使用者自己的 Firestore 任務資料。
- 可為待辦設定選填的截止日期、預估分鐘、主觀難度與備註。
- 已完成待辦會收在完成紀錄中，可恢復為待辦。
- 清單顯示未安排待辦數量，今日畫面顯示今日任務數量。

### 月曆與每日行程

- 月曆可切換月份、回到今天並選取日期查看該日行程。
- 有行程的日期依類別顏色顯示色點；每個日期最多顯示三點，超過時以「+N」表示。
- 可新增、編輯及刪除行程，設定名稱、日期、類別、全天、開始時間、選填的結束時間與備註。
- 開始與結束時間支援滾動選擇；也可直接輸入，例如 `0930` 會整理成 `09:30`，輸入 `13` 會整理成 `13:00`。結束時間可留空，若有填寫須晚於開始時間。
- 可建立每週重複或自訂每 N 天／週／月的行程，需設定結束日期；每次出現是獨立行程，可分別編輯或刪除。單一系列最多建立 366 次。
- 每日行程列表顯示時間範圍、行程類別、備註，以及類別顏色標記。
- 類別可新增並設定固定顏色，顏色會保存在自己的帳號中；再次選取同一類別時沿用已保存顏色。

### Gemini 今日規劃（第一版）

- 根據今日未完成待辦和今日行程，產生待辦優先順序、排序理由、建議專注時間與簡短安排提醒。
- 使用者按下「整理今日安排」才會送出資料；待辦備註和行程備註不會送出。
- 建議只供參考，不會自動改動待辦、不會寫回 Firestore，也不會保存 AI 回覆。
- 透過 Firebase AI Logic 的 Gemini Developer API 及 App Check 呼叫 Gemini；私人 Gemini API Key 不放入前端或 Repo。
- 使用模型 `gemini-3.8-flash`；Firebase 官方模型清單列為穩定模型。可用模型及請求量仍受 Google 配額限制。
- 正式 Pages 已載入 Firebase AI Logic 路線，但使用者實測呼叫失敗；詳見下方驗收狀態。App Check 已註冊並強制基本驗證。
- 已新增登入後顯示的 Gemini 對話視窗，使用同一 Firebase AI Logic 後端。聊天只傳送使用者輸入的文字與最近 8 輪對話，不會自動附帶待辦／行程，也不寫入 Firestore；登出或重新整理會清除。
- 聊天視窗已隨 `d0aa88a` 部署到正式 Pages。2026-11-24 登入後送出一般測試訊息，頁面顯示無法回覆；聊天功能尚未驗收成功。

### 經驗值與等級

- 待辦首次完成時增加 10 XP；每累積 100 XP 升一級。XP 卡片顯示於頁面切換列上方，等級使用 `LV` 標示，並以 XP 分數與進度條呈現升級進度。
- 取消完成不扣 XP；同一待辦再次完成不重複加分。
- 已完成待辦刪除後，XP 總數與完成紀錄會保留；行程與 Gemini 建議不給 XP。
- 資料存在登入者自己的 Firestore 路徑；此版本已加入前端程式，功能仍待驗收。

### 介面

- 支援手機窄螢幕版面。
- 目前色票：深色背景 `#181D26`、浮動區塊 `#DED8DA`、主色 `#B30715`、輔助色 `#C4979C` 和 `#7B8DA6`。

## 驗收進度

截至 2026-11-25，使用者回報不同帳號的行程已分離，並在手機登入修正推送後回報登入成功；核心功能的完整逐項驗收仍待補。最新的合併時間線、拖曳、XP 版面、時間選擇與重複行程變更目前只在本機工作目錄，尚未推送或部署，也未操作驗收。正式 Pages 仍是先前已部署版本。Gemini 聊天與今日建議測試均失敗，Console 記錄 `fetch-error` 和 App Check token 的 `403 appCheck/initial-throttle`／`appCheck/throttled`；403 原始原因仍待查，也未確認本次請求是否抵達 AI Logic。Gemini 兩項功能仍未驗收通過。

下一步從 Chrome Network 面板取得 App Check 403 的 response status/message（不分享 Headers、Cookie、Token 或完整 payload）；不要重設已核對相符的 site key／網域，也避免在節流期間反覆重試。節流解除後再各做一次受控 Gemini 測試，對照 AI Logic trace。`script.js` 現在只記錄 SDK 錯誤代碼／名稱，尚未記錄錯誤訊息；必要時再補安全遮蔽後的訊息摘要。官方參考：[Firebase AI Logic 錯誤排查](https://firebase.google.com/docs/ai-logic/error-codes)、[Google Cloud Firebase AI Logic 服務健康](https://status.cloud.google.com/products/xSLTSirYjsylAlwIqpBP/history)。不可分享 Request Headers、Cookie、App Check token 或私人資料。

接下來的 Gemini 錯誤排查步驟、Rules Playground 模擬與實際測試的差異，以及其他待辦，請以[開發交接文件](./HANDOFF.md)為準。

經驗值（XP）是 W11 交件後再評估的延伸功能，不列入目前必交範圍。

## 資料與安全

Firestore 個人資料路徑如下：

- `users/{uid}/tasks`
- `users/{uid}/events`
- `users/{uid}/categories`
- `users/{uid}/stats/progress`：累積 XP 與首次完成待辦數。
- `users/{uid}/completionRecords/{taskId}`：首次完成紀錄；刪除待辦時保留。

`firestore.rules` 限制使用者只能讀寫自己的 UID 路徑。先前進度記錄指出規則曾發布至 Firebase；最近的程式提交沒有重新發布規則，雲端目前狀態應在 Firebase Console 唯讀核對。前端介面本身不能取代資料庫安全規則。

`script.js` 中的 Firebase Web 設定與 reCAPTCHA Enterprise site key 都是瀏覽器端公開設定；不可放入 Gemini 私人 API Key。Gemini 透過 Firebase AI Logic 代理呼叫，並以 App Check 保護。不要把學校 Gateway 憑證當成 APP 憑證。Gemini 會收到待辦名稱、狀態、截止日、預估時間、難度，以及行程名稱、時間與類別；任務／行程備註不會送出。免費路線依 Google Gemini Developer API 的模型與用量配額限制，沒有舊 Cloud Function 的每日 12 次伺服器端計數。

本網站使用 Firebase CDN 模組，需要網路連線。請透過本機 HTTP 伺服器或正式 HTTPS 網址開啟，不能直接用 `file://` 執行。

## 本機使用

1. 下載或複製 Repo。
2. 從專案資料夾啟動本機 HTTP 伺服器，或開啟正式 Pages 網站。
3. 使用 Google 登入。
4. 在「清單」新增待辦，在「今日」安排任務，或在「行事曆」新增行程。

## 專案檔案

- `index.html`：頁面結構、待辦／行程表單及編輯對話框。
- `style.css`：色票、版面、狀態樣式與手機版響應式樣式。
- `script.js`：Firebase 初始化、登入狀態、頁面互動、待辦與行程操作，以及 Firestore 讀寫。
- `firestore.rules`：Firestore 使用者 UID 存取規則。
- `functions/index.js`：保留的舊版 Cloud Functions Gemini 後端；Spark 免費路線不使用或部署它。
- `firebase.json`、`.firebaserc`、`functions/package.json`：Firebase Functions 部署設定，免費路線不需部署。

## Gemini 免費路線設定

在 Firebase Console 的 **AI Services → AI Logic** 啟用 **Gemini Developer API**。接著到 **Security → App Check**，為網站註冊 Fraud Defense (reCAPTCHA Enterprise) provider，並將 `saintlin1116.github.io` 加入 reCAPTCHA key 的允許網域。將 site key 填入 `script.js` 的 `appCheckSiteKey`；Firebase App Check 使用 site key，不需要把 reCAPTCHA secret key 放入網站程式碼或聊天。免費方案由 Firebase AI Logic 管理 Gemini API 金鑰，不需 Secret Manager 或 Cloud Functions 部署。若使用 localhost，另依 Firebase App Check debug provider 設定開發環境。

## 後續構想

外接行事曆與追蹤回顧仍待 W11 交件後確認用途與資料保存方式。XP 第一版已部署至 Pages，尚待功能驗收。
