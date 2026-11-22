# Project A｜日常誌個人行程與任務管理系統

「日常誌」是以原生 HTML、CSS 和 JavaScript 製作的個人行程與待辦管理網站，使用 Firebase Google 登入與 Firestore 保存個人資料。

- 正式網站：[GitHub Pages](https://saintlin1116.github.io/w6-first-site/)
- GitHub Repo：[`saIntLin1116/w6-first-site`](https://github.com/saIntLin1116/w6-first-site)
- [查看 main 分支的提交紀錄](https://github.com/saIntLin1116/w6-first-site/commits/main)

## 目前功能

### 登入與個人資料

- 使用 Google 登入與登出；桌面使用彈出視窗，手機使用重新導向登入；登入後才顯示個人行程和待辦。
- 日期以台北時區顯示。
- 任務、行程和類別分別保存在登入者自己的 Firestore UID 路徑。
- 登出或切換帳號時清除畫面上的舊帳號資料。

### 待辦清單與今日安排

- 可新增待辦、編輯名稱與資訊、刪除待辦。
- 待辦可加入今日、移回清單，並在今日畫面上移或下移調整順序。
- 狀態包含「未開始、進行中、已完成」；點選狀態可切換，清單中的進行中待辦也可退回未開始。
- 今日畫面會把排序第一項放在「現在先做這一件」，可直接標記完成、編輯資訊或移回清單。
- 可為待辦設定選填的截止日期、預估分鐘、主觀難度與備註。
- 已完成待辦會收在完成紀錄中，可恢復為待辦。
- 清單顯示未安排待辦數量，今日畫面顯示今日任務數量。

### 月曆與每日行程

- 月曆可切換月份、回到今天並選取日期查看該日行程。
- 有行程的日期依類別顏色顯示色點；每個日期最多顯示三點，超過時以「+N」表示。
- 可新增、編輯及刪除行程，設定名稱、日期、類別、全天、開始時間、選填的結束時間與備註。
- 開始時間支援鍵盤輸入，例如輸入 `0930` 會整理成 `09:30`；結束時間可留空，若有填寫須晚於開始時間。
- 每日行程列表顯示時間範圍、行程類別、備註，以及類別顏色標記。
- 類別可新增並設定固定顏色，顏色會保存在自己的帳號中；再次選取同一類別時沿用已保存顏色。

### Gemini 今日規劃（第一版）

- 根據今日未完成待辦和今日行程，產生待辦優先順序、排序理由、建議專注時間與簡短安排提醒。
- 使用者按下「整理今日安排」才會送出資料；待辦備註和行程備註不會送出。
- 建議只供參考，不會自動改動待辦、不會寫回 Firestore，也不會保存 AI 回覆。
- Gemini API Key 由 Firebase Functions Secret Manager 提供給伺服器端；前端不含 Gemini 私人 Key。
- 前後端程式已加入，但雲端 Secret、Functions 部署及正式網站端到端驗收尚未完成，因此正式 Pages 目前還不能使用此功能。

### 經驗值與等級

- 待辦首次完成時增加 10 XP；每累積 100 XP 升一級，今日畫面顯示總 XP、等級、升級進度、已記錄完成數與最近 10 筆完成紀錄。
- 取消完成不扣 XP；同一待辦再次完成不重複加分。
- 已完成待辦刪除後，XP 總數與完成紀錄會保留；行程與 Gemini 建議不給 XP。
- 資料存在登入者自己的 Firestore 路徑；此版本已加入前端程式，功能仍待驗收。

### 介面

- 支援手機窄螢幕版面。
- 目前色票：深色背景 `#181D26`、浮動區塊 `#DED8DA`、主色 `#B30715`、輔助色 `#C4979C` 和 `#7B8DA6`。

## 驗收進度

截至 2026-11-22，GitHub Pages 已部署 `f295454`，包含 Gemini 前端與 XP 第一版。XP 尚待功能操作驗收；Gemini Secret 與 Functions 尚未設定及部署，因此 Gemini 呼叫仍不可用。先前對較早版本的初步查看不代表這次更新已完成系統測試。

尚待完成或補上紀錄：

- 完整驗收桌面與手機的 Google 登入、登出及重新載入後的登入狀態。
- 逐項測試待辦、行程、分類的新增、編輯、狀態變更、刪除及資料保存。
- 核對已發布的 Firestore 規則及實際操作，確認不同帳號無法存取彼此資料；第二個真實帳號的網站端測試尚待完成。
- 記錄功能性測試與至少一次使用者測試的真實結果。
- 部署 Gemini Functions、在 Firebase Secret Manager 設定 API Key，並完成正式網站端到端驗收。
- 最後檢查正式網站與交件表單資料。

經驗值（XP）是 W11 交件後再評估的延伸功能，不列入目前必交範圍。

## 資料與安全

Firestore 個人資料路徑如下：

- `users/{uid}/tasks`
- `users/{uid}/events`
- `users/{uid}/categories`
- `users/{uid}/stats/progress`：累積 XP 與首次完成待辦數。
- `users/{uid}/completionRecords/{taskId}`：首次完成紀錄；刪除待辦時保留。

`firestore.rules` 限制使用者只能讀寫自己的 UID 路徑。先前進度記錄指出規則曾發布至 Firebase；最近的程式提交沒有重新發布規則，雲端目前狀態應在 Firebase Console 唯讀核對。前端介面本身不能取代資料庫安全規則。

`script.js` 中的 Firebase Web 設定是瀏覽器端公開設定，不是 Gemini 或其他 AI 的私人 API Key。Gemini 僅由 `functions/index.js` 的伺服器端程式呼叫，私人 Key 需透過 Firebase Secret Manager 設定；不可把私人 AI Key 放進前端或公開 Repo，也不可把學校 Gateway 憑證當成 APP 憑證。Gemini 會收到待辦名稱、狀態、截止日、預估時間、難度，以及行程名稱、時間與類別；任務／行程備註不會送出。每位使用者每日最多呼叫 12 次，計數存在後端私有 Firestore 集合。

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
- `functions/index.js`：驗證登入者、限制 AI 呼叫次數，並在伺服器端呼叫 Gemini。
- `firebase.json`、`.firebaserc`、`functions/package.json`：Firebase Functions 部署設定。

## Gemini Functions 部署

此功能目前只有程式碼，尚未建立雲端 Secret 或部署 Function。部署前須先確認 Firebase 專案的 Functions 與 Secret Manager 可用。準備好後，在專案根目錄執行：

```sh
cd functions
npm install
cd ..
firebase functions:secrets:set GEMINI_API_KEY
firebase deploy --only functions:generateDailyPlan
```

CLI 會提示輸入 Secret；不要將 API Key 貼到聊天、README、程式碼或 Repo。以上雲端設定與部署尚未執行。

## 後續構想

外接行事曆與追蹤回顧仍待 W11 交件後確認用途與資料保存方式。XP 第一版已部署至 Pages，尚待功能驗收。
