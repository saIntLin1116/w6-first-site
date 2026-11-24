# Project A 開發交接

更新日期：2026-11-25（Asia/Taipei）

> 本文件是目前狀態的主要交接摘要。功能需求與未決事項見 [REQUIREMENTS.md](./REQUIREMENTS.md)；專案簡介與 Gemini 操作說明見 [README.md](./README.md)。

## 專案與目前版本

- 專案：日常誌個人行程與任務管理系統（課程 Project A）。
- Repo：`saIntLin1116/w6-first-site`；正式網址：[GitHub Pages](https://saintlin1116.github.io/w6-first-site/)。
- 專案根目錄：Repo 根目錄（本機工作目錄依使用者電腦設定）。
- 基準版本為 `1175a73`（`feat: use Firebase AI Logic for Gemini`）。Gemini 對話視窗功能提交 `d0aa88a`（`feat: add Gemini chat window`）已推送至 `main`；GitHub Pages 建置與部署已成功，正式頁已載入該功能的 HTML。今日時間線整合已在本機工作目錄實作，尚未操作驗收或部署。2026-11-25 正式頁 Gemini 測試仍失敗；瀏覽器 Console 顯示 `fetch-error`。
- 2026-11-25 正式頁單次測試的 Console 另顯示 Firebase App Check token 取得 `403 appCheck/initial-throttle`，其後請求被 `appCheck/throttled` 節流，提示約一天後才可再試。唯讀核對 Firebase Console 後，程式使用的 reCAPTCHA Enterprise site key 與註冊值一致；Google Cloud Fraud Defense 顯示同一網站金鑰屬於網站類型，網域為 `saintlin1116.github.io`，狀態為「受保護」。因此目前未見明顯的金鑰不一致或網域漏列，但原始 403 原因仍未知，也沒有證據證明本次 Gemini 請求抵達模型端。先前 AI Logic 上的 `DEADLINE_EXCEEDED`／`SHEDDABLE` 追蹤仍是較早請求，不能當成本次失敗原因。

## 專案目標與範圍

提供單一使用者管理個人行程與待辦的網站：前端以 GitHub Pages 發佈，使用 Google 登入和 Firestore 保存各帳號資料；Gemini 第一版採 Firebase AI Logic + Gemini Developer API 免費方案，並由 App Check 保護。主要課程交件方向與功能邊界見 [REQUIREMENTS.md](./REQUIREMENTS.md)。

目前不擴充多人協作、通知或未確認的照片／影片功能。XP 是課程主線完成後的延伸項目。今日時間線採「行事曆單向顯示到今日頁」；程式已在本機工作目錄實作，尚未操作驗收或部署。AI 調整時間仍待定案；Gemini 聊天視窗第一版規格已決定並完成程式，尚待實際呼叫驗收。

## 開發進度與驗收狀態

「程式存在」不等於「正式網站已驗收」。下表依 Repo 程式、README 與本對話可取得的實測回報整理；未在本次重跑。

| 項目 | 程式狀態 | 實際驗收狀態 |
| --- | --- | --- |
| Google 登入／登出 | 已有 Firebase Auth；目前程式在 iOS 使用 popup、Android 等其他行動環境使用 redirect，桌面使用 popup；登入狀態由 `onAuthStateChanged` 監聽。 | 使用者在最新登入修正推送後回報「登入成功」。完整的登出、重新整理、不同手機瀏覽器與最新 Pages 版本驗收仍待確認。 |
| 待辦、今日清單 | 已有新增、編輯、刪除、狀態切換、移入／移出今日、今日排序、完成紀錄等程式。 | 使用者曾大致驗收，但沒有逐項測試紀錄；本次未測。 |
| 過期今日待辦回清單 | 現行日期篩選已會把 `plannedDate` 不是今天的未完成待辦列在清單；跨日後舊待辦會從今日視圖消失並出現在清單。 | 程式邏輯可確認，實際跨日畫面未測。資料中的舊 `plannedDate` 不會自動清空；若使用者只要求回到清單，現有顯示邏輯符合方向。 |
| 月曆、行程、分類 | 已有行程 CRUD、分類顏色、每日行程列表與月曆色點程式；日期顯示使用台北時區。 | 逐項 CRUD、重新載入保存、手機版顯示的測試結果未完整記錄；本次未測。 |
| Firestore 個人資料隔離 | Repo 規則限制 `users/{uid}/...` 只能由相同 UID 存取；程式亦以 UID 分開保存。 | 使用者確認不同帳號的行程已分離。對話紀錄另有 Rules Playground 模擬結果：擁有者讀取允許、其他 UID 讀取／更新拒絕、未登入更新拒絕。模擬不等於真實文件操作；雲端目前發布的規則待唯讀確認。 |
| Gemini 今日規劃 | `script.js` 用 Firebase AI Logic SDK 的 `GoogleAIBackend` 呼叫 Gemini Developer API；App Check 使用 reCAPTCHA Enterprise。Spark 免費路線不使用舊 `functions/index.js`。 | 2026-11-25 正式頁單次測試顯示「目前無法產生建議」，Console 記錄 `Gemini 今日規劃失敗：fetch-error`。同一瀏覽器有 App Check token 取得 `403 appCheck/initial-throttle` 及後續 `appCheck/throttled` 訊息；本次 Gemini 是否抵達 AI Logic 尚待確認。Firebase Console 與 Google Cloud 已唯讀確認註冊 site key、程式 site key 相同，且允許網域列出 `saintlin1116.github.io`；原始 403 原因仍待確認。今日規劃尚未驗收通過。 |
| XP／等級 | 首次完成待辦加 XP、等級與完成紀錄的程式已存在。 | 使用者操作驗收未完成；不是 W11 第一版必交項目。 |
| 今日時間線整合當日行程 | 已在本機工作目錄實作今日待辦與今日行事曆行程的唯讀整合；行事曆仍是行程資料唯一來源。待辦區沿用今日排序和預估時長；行程全天列前、固定時間依開始時間、未設定開始時間列後。 | 尚未做本機或手機畫面操作驗收，也未部署；功能寫好不代表已測通。 |
| Gemini 對話視窗 | 已加入登入後右下角聊天入口、響應式對話窗、訊息顯示、送出與清除控制；使用 Firebase AI Logic `gemini-3.8-flash`。對話只在頁面記憶體保留，傳送使用者輸入及最近 8 輪對話，不自動附帶 Firestore 任務／行程資料、不寫回 Firestore；登出、切換帳號與重新整理清除。 | 2026-11-25 正式頁登入成功，單次送出通用文字測試後仍顯示失敗提示；Console 記錄 `Gemini 對話失敗：fetch-error`。同一瀏覽器有 App Check token 取得 `403 appCheck/initial-throttle` 及後續節流訊息；site key 與網域已唯讀核對一致，尚未確認 403 根因或本次 Gemini 是否抵達模型端。聊天仍未驗收成功。 |
| AI 改動今日順序／時間 | 尚未實作或定案。 | 待確認可修改欄位、衝突處理及採用前確認流程。 |

### 已知問題與技術債

- 尚無可見的自動化測試、根目錄 `package.json`、測試或前端建置指令；前端是原生 HTML/CSS/JavaScript 靜態網站。
- 使用者先前曾在終端機回報 `npm`、`firebase` 指令不存在；2026-11-24 已在自己的終端機確認 Node `v26.13.1`、npm `11.20.0`、Firebase CLI `15.37.0` 可執行。Repo 的 Functions runtime 設定為 Node 20；本機 Node 版本與部署 runtime 不同，後續若安裝或部署出現 engine 警告需核對。
- 使用者提供的最新狀態：Firebase 專案為 Spark；Firebase AI Logic Gemini Developer API 已設定；`script.js` 使用的 Web App ID 對應第一筆 `Project A Web`。專案另有一筆同名但 ID 不同的 Web App。App Check 專頁及 AI Logic 概覽均顯示第一筆已註冊 Fraud Defense 且已強制執行，第二筆未註冊；因此目前正式頁使用的 App ID 對應受保護的 App。使用者回報重播保護關閉、先前 2 個 App Check 要求驗證通過。此 Spark 路線不需 AI Studio API Key、Cloud Functions Secret 或 Functions 部署。
- Firebase 官方支援模型清單將 `gemini-3.8-flash` 列為穩定模型；目前沒有證據把它判定為失敗原因。
- AI 失敗的 `catch` 將請求錯誤和 `result.response.text()`／`JSON.parse()` 的回覆處理錯誤混在一起顯示；`console.error` 只輸出 `error.code || error.name`，沒有輸出 `error.message`。2026-11-25 正式頁 Console 顯示聊天與今日規劃皆為 `fetch-error`，另有 App Check token 取得 `403 appCheck/initial-throttle` 及後續 `appCheck/throttled`，重試時間約一天後。Firebase Console 註冊值與程式 site key 一致；Google Cloud 金鑰頁列出的網域為 `saintlin1116.github.io` 且顯示「受保護」。原始 403 的服務回應內容仍待取得，因此尚不能斷定原因；較早 AI Logic 追蹤的 prefill 過載／逾時不得套用成本次錯誤原因。
- 今日時間線將未定時待辦與固定時間行程分區顯示，不為待辦推算時間；行程列表讀取今日行程，不建立新的 Firestore 文件。行程在「全天／有開始時間／無開始時間」的排序屬目前 UI 呈現決策，尚未操作驗收。
- 舊 Cloud Function `generateDailyPlan` 的預檢 404/CORS 是舊版保留記錄；硬重新載入後的新請求已走 Firebase AI Logic，排查時不要再以舊記錄判讀。
- 先前查閱 Firebase 官方錯誤排查文件，頁面未列 500／503 專節；Google Cloud Service Health 的 Firebase AI Logic 公開事件頁當時顯示「No incidents reported」。本次專案追蹤本文明示單筆模型高需求及 prefill 逾時；公開健康頁無事件不排除個別模型／請求遇到負載問題。[錯誤排查文件](https://firebase.google.com/docs/ai-logic/error-codes)／[公開服務健康頁](https://status.cloud.google.com/products/xSLTSirYjsylAlwIqpBP/history)
- 最新登入修正的 Pages 部署狀態，以及 Firebase Console 中現行 Firestore 規則版本，尚未在本次讀取雲端核對。
- 沒有正式的功能測試表或使用者測試紀錄；既有「大概驗收」不足以代表所有功能通過。

## 專案結構與執行方式

- `index.html`：頁面、表單、今日／清單／行事曆區塊及對話框。
- `style.css`：版面、色票和響應式樣式；目前主色為 `#181D26`、`#DED8DA`、`#B30715`、`#C4979C`、`#7B8DA6`。
- `script.js`：Firebase 初始化、Google 登入、待辦／行程／類別操作、Firestore 監聽和 XP／Gemini 前端流程。
- `firestore.rules`：使用 UID 限制 `users/{uid}` 底下資料的讀寫。
- `functions/index.js`：舊版 Gemini Cloud Function，免費路線不使用。
- `firebase.json`、`.firebaserc`、`functions/package.json`：保留的 Firebase Functions 設定；Firebase 專案別名目前指向 `daily-planner-project-a`。
- `functions/package-lock.json`：後端 npm 相依套件鎖定檔。

### 本機執行

在專案根目錄啟動簡易 HTTP 伺服器，再用瀏覽器開啟 `http://localhost:8000`：

```sh
python3 -m http.server 8000
```

這是靜態前端，沒有根目錄依賴安裝或建置步驟；不能以 `file://` 直接開啟。此指令本次只記錄，未執行。若要驗證本機 Google 登入，Firebase Authentication 的授權網域也必須允許 localhost；雲端設定變更需先取得使用者確認。

後端依 `functions/package.json` 使用 Node.js 20。具備 Node/npm 與 Firebase CLI 後，安裝相依套件：

```sh
cd functions
npm install
```

目前沒有自動化測試或前端 build 指令。Spark 免費 Gemini 路線的 Firebase AI Logic 與 App Check 設定步驟見 [README.md](./README.md)；Console 設定由使用者操作。不要把 Gemini API Key 寫入前端或 Repo。

## 開發決策與注意事項

- 個人資料放在 `users/{uid}/...` 並由 Firestore Rules 再做存取限制，避免只依賴前端隱藏資料。
- Gemini 透過 Firebase AI Logic 代理呼叫；App Check 用於保護 Gemini API。使用者按鈕觸發後才傳送必要的任務／行程欄位。備註不傳送，建議不自動改動或寫回資料。
- XP 首次完成的判斷使用 Firestore transaction 與完成紀錄，預期避免同一待辦重複加分；仍需實際測試。
- 登入流程曾遇手機登入後回到登入頁。近期調整了 iOS 與 Android 行動環境的登入方式，並修正登入狀態監聽不等待 redirect 結果；使用者後續回報登入成功。不要因此推定所有裝置與重新載入情境都已通過。
- 不要把學校 Gateway 憑證當成網站可用的 Gemini 憑證，也不要將 Gemini 私人 Key 放進前端或公開 Repo。
- 不修改 Firebase Console、Firestore 資料或規則，不部署、不 commit、不 push，除非使用者明確要求；變更外部雲端狀態前先說清楚動作。

## 建議下一步（依優先順序）

1. **取得 App Check 403 的原始回應原因。** 可在 Chrome 開發人員工具的 Network 面板篩選 Firebase App Check 請求，讀取 403 回應的錯誤 `status`／`message`；不要複製 Request Headers、Cookie、App Check Token 或完整請求內容。已核對 site key 與授權網域，故不要重設這些值。若回應指出其他設定錯誤，再提出明確修正項目。
2. **驗收今日時間線。** 相關檔案：`index.html`、`script.js`、`style.css`。先開本機頁面核對待辦順序、預估時長、行程分類顏色、全天／未定時間／固定時間排序；測試新增／編輯／刪除行程後今日顯示同步，且待辦不會寫入行事曆。再檢查手機窄畫面。不要用本機驗收替代正式 Pages 驗收。
3. **等待 App Check 節流解除再做一次受控重測。** Console 顯示首次 403 後約一天才可重試；不要反覆送 Gemini 請求。節流解除後先送一次通用聊天，再送一次今日建議，檢查 Console 與 AI Logic trace 是否有對應請求／結果。
4. **若 App Check 已正常但仍失敗，再排查 AI Logic。** 查看同一次請求的 trace、錯誤碼與服務端訊息；只有在確認請求抵達 Firebase AI Logic 後，才將重點轉向模型配額、過載或 JSON 回覆格式。相關程式為 `script.js` 兩個 Gemini `catch` 區塊；目前錯誤訊息尚未輸出，必要時再加上遮蔽後的安全摘要。
5. **補齊正式 Pages 與交件驗收。** 驗證登入／登出／重新載入、待辦行程分類操作、跨帳號資料隔離，以及 Gemini 實際回覆；對照 README 和課程表單。規則雲端狀態需唯讀核對，任何 Firebase 設定、資料或規則變更均需先徵求使用者同意。

## 本次工作紀錄（2026-11-25）

- **本次完成事項：** 重新載入正式 Pages 並檢查 Gemini 錯誤；在本機程式加入今日待辦與行程的時間線顯示，並更新 `README.md`、`REQUIREMENTS.md`。
- **驗證結果：** Gemini 聊天與今日建議正式頁測試仍顯示失敗；Console 記錄 `fetch-error` 與 App Check token 403／節流。今日時間線程式已寫入本機，但依照本次工作範圍未執行自動化測試或瀏覽器／手機操作驗收，也未部署；`git diff --check` 通過。Firebase 設定、Firestore 資料和規則沒有變更。
- **尚未完成：** 驗收時間線資料排序、空狀態、分類顏色、行程 CRUD 同步與手機版面；Gemini App Check 403 根因與成功呼叫也仍待確認。
- **下一步工作：** 先在本機預覽並操作驗收今日時間線，修正任何顯示問題；之後取得 App Check 403 回應摘要，節流解除後受控重測 Gemini。尚未 commit、push 或部署。
