# Project A 開發交接

更新日期：2026-11-24（Asia/Taipei）

> 本文件是目前狀態的主要交接摘要。功能需求與未決事項見 [REQUIREMENTS.md](./REQUIREMENTS.md)；專案簡介與 Gemini 操作說明見 [README.md](./README.md)。

## 專案與目前版本

- 專案：日常誌個人行程與任務管理系統（課程 Project A）。
- Repo：`saIntLin1116/w6-first-site`；正式網址：[GitHub Pages](https://saintlin1116.github.io/w6-first-site/)。
- 專案根目錄：Repo 根目錄（本機工作目錄依使用者電腦設定）。
- 基準版本為 `1175a73`（`feat: use Firebase AI Logic for Gemini`）。Gemini 對話視窗功能提交 `d0aa88a`（`feat: add Gemini chat window`）已推送至 `main`；GitHub Pages 建置與部署已成功，正式頁已載入該功能的 HTML。此交接文件在部署後再更新；程式視覺與操作、Gemini 對話呼叫仍待驗收。
- 本次部署核對時，正式 Pages 回傳 HTTP 200，HTML 已包含 `gemini-chat-20261124-1` 資源版本及 Gemini 對話入口。這只確認上線的 HTML，不代表登入後已人工操作或 Gemini 呼叫成功。AI Logic 最近 24 小時監控先前記錄為 6 筆全失敗，P95 延遲 4.15 分鐘；最新一次正式呼叫在 9.51 秒後回傳 `INTERNAL`，錯誤本文指出高需求及重試用盡。這些紀錄不代表目前服務狀態。

## 專案目標與範圍

提供單一使用者管理個人行程與待辦的網站：前端以 GitHub Pages 發佈，使用 Google 登入和 Firestore 保存各帳號資料；Gemini 第一版採 Firebase AI Logic + Gemini Developer API 免費方案，並由 App Check 保護。主要課程交件方向與功能邊界見 [REQUIREMENTS.md](./REQUIREMENTS.md)。

目前不擴充多人協作、通知或未確認的照片／影片功能。XP 是課程主線完成後的延伸項目。使用者已確認今日頁採「行事曆單向顯示到今日時間線」的方向，但尚未實作。AI 調整時間仍待定案；Gemini 聊天視窗第一版規格已決定並完成程式，尚待實際呼叫驗收。

## 開發進度與驗收狀態

「程式存在」不等於「正式網站已驗收」。下表依 Repo 程式、README 與本對話可取得的實測回報整理；未在本次重跑。

| 項目 | 程式狀態 | 實際驗收狀態 |
| --- | --- | --- |
| Google 登入／登出 | 已有 Firebase Auth；目前程式在 iOS 使用 popup、Android 等其他行動環境使用 redirect，桌面使用 popup；登入狀態由 `onAuthStateChanged` 監聽。 | 使用者在最新登入修正推送後回報「登入成功」。完整的登出、重新整理、不同手機瀏覽器與最新 Pages 版本驗收仍待確認。 |
| 待辦、今日清單 | 已有新增、編輯、刪除、狀態切換、移入／移出今日、今日排序、完成紀錄等程式。 | 使用者曾大致驗收，但沒有逐項測試紀錄；本次未測。 |
| 過期今日待辦回清單 | 現行日期篩選已會把 `plannedDate` 不是今天的未完成待辦列在清單；跨日後舊待辦會從今日視圖消失並出現在清單。 | 程式邏輯可確認，實際跨日畫面未測。資料中的舊 `plannedDate` 不會自動清空；若使用者只要求回到清單，現有顯示邏輯符合方向。 |
| 月曆、行程、分類 | 已有行程 CRUD、分類顏色、每日行程列表與月曆色點程式；日期顯示使用台北時區。 | 逐項 CRUD、重新載入保存、手機版顯示的測試結果未完整記錄；本次未測。 |
| Firestore 個人資料隔離 | Repo 規則限制 `users/{uid}/...` 只能由相同 UID 存取；程式亦以 UID 分開保存。 | 使用者確認不同帳號的行程已分離。對話紀錄另有 Rules Playground 模擬結果：擁有者讀取允許、其他 UID 讀取／更新拒絕、未登入更新拒絕。模擬不等於真實文件操作；雲端目前發布的規則待唯讀確認。 |
| Gemini 今日規劃 | `script.js` 用 Firebase AI Logic SDK 的 `GoogleAIBackend` 呼叫 Gemini Developer API；App Check 使用 reCAPTCHA Enterprise。Spark 免費路線不使用舊 `functions/index.js`。 | AI Logic 最近 24 小時 6 筆要求皆失敗，成功率和詞元資料不可用，P95 延遲 4.15 分鐘。兩筆最新追蹤本文指出 Gemini 後端 prefill queue 過載且重試用盡（`INTERNAL`），另一筆在 prefill 階段逾時（`DEADLINE_EXCEEDED`）；目前證據明確指向服務端高負載／逾時。App Check 清單有兩筆同名 `Project A Web`，一筆 Fraud Defense 已註冊、一筆未註冊；`script.js` 的 App ID 對應第一筆，AI Logic 概覽確認第一筆已註冊且已強制執行，第二筆未註冊。追蹤沒有 App Check 拒絕證據。正式重測仍失敗，Gemini 未驗收通過。 |
| XP／等級 | 首次完成待辦加 XP、等級與完成紀錄的程式已存在。 | 使用者操作驗收未完成；不是 W11 第一版必交項目。 |
| 今日時間線整合當日行程 | 尚未實作。使用者已確認今日時間線要顯示今日待辦及行事曆中日期為今天的行程；行程只從行事曆單向顯示到今日頁，不把今日待辦新增到行事曆。 | 時間線順序、未定時待辦如何安排等細節待確認；見 [REQUIREMENTS.md](./REQUIREMENTS.md)。 |
| Gemini 對話視窗 | 已加入登入後右下角聊天入口、響應式對話窗、訊息顯示、送出與清除控制；使用 Firebase AI Logic `gemini-3.8-flash`。對話只在頁面記憶體保留，傳送使用者輸入及最近 8 輪對話，不自動附帶 Firestore 任務／行程資料、不寫回 Firestore；登出、切換帳號與重新整理清除。 | 功能程式已提交並部署；正式 Pages 的 HTML 已確認包含聊天入口。尚未登入後人工操作，也未送出聊天訊息。Gemini 後端近期 prefill 過載，待服務恢復後驗收回覆、連續對話、清除與登出清除。 |
| AI 改動今日順序／時間 | 尚未實作或定案。 | 待確認可修改欄位、衝突處理及採用前確認流程。 |

### 已知問題與技術債

- 尚無可見的自動化測試、根目錄 `package.json`、測試或前端建置指令；前端是原生 HTML/CSS/JavaScript 靜態網站。
- 使用者先前曾在終端機回報 `npm`、`firebase` 指令不存在；2026-11-24 已在自己的終端機確認 Node `v26.13.1`、npm `11.20.0`、Firebase CLI `15.37.0` 可執行。Repo 的 Functions runtime 設定為 Node 20；本機 Node 版本與部署 runtime 不同，後續若安裝或部署出現 engine 警告需核對。
- 使用者提供的最新狀態：Firebase 專案為 Spark；Firebase AI Logic Gemini Developer API 已設定；`script.js` 使用的 Web App ID 對應第一筆 `Project A Web`。專案另有一筆同名但 ID 不同的 Web App。App Check 專頁及 AI Logic 概覽均顯示第一筆已註冊 Fraud Defense 且已強制執行，第二筆未註冊；因此目前正式頁使用的 App ID 對應受保護的 App。使用者回報重播保護關閉、先前 2 個 App Check 要求驗證通過。此 Spark 路線不需 AI Studio API Key、Cloud Functions Secret 或 Functions 部署。
- Firebase 官方支援模型清單將 `gemini-3.8-flash` 列為穩定模型；目前沒有證據把它判定為失敗原因。
- AI 失敗的 `catch` 將請求錯誤和 `result.response.text()`／`JSON.parse()` 的回覆處理錯誤混在一起顯示；`console.error` 只輸出 `error.code || error.name`，沒有輸出 `error.message`。本次 Firebase AI Logic 追蹤本文已顯示部分失敗是 Gemini 後端 prefill 排隊過載與完成前逾時。證據支持錯誤發生於服務端推論負載階段；尚不能保證全部 6 筆失敗都同一原因，也不能代表服務現在已恢復。
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

1. **預覽並人工檢視 Gemini 聊天介面。** 相關檔案：`index.html`、`style.css`、`script.js`。使用者可先在本機登入後確認桌面與手機尺寸下的按鈕、對話框、捲動、關閉和清除狀態；本機登入需 Firebase Authentication 已允許 localhost。此步驟只驗證介面，不代表 Gemini 回覆成功。
2. **Gemini 服務恢復後驗收對話。** 最新可用監控紀錄為最近 24 小時 6 筆要求皆失敗，P95 延遲 4.15 分鐘；最新正式重測回傳 `INTERNAL`，追蹤本文指出 prefill queue 過載及重試用盡，另有 prefill 階段逾時紀錄。先前失敗證據不代表服務現在狀態。服務恢復後，從正式 Pages 依序測一次回覆、連續對話、清除及登出清除，並記錄實際結果；不要分享 Header、Cookie、App Check token 或私人資料。
3. **改善 Gemini 錯誤分類與使用者提示（如重測仍需）。** 相關檔案：`script.js` 的每日規劃錯誤處理。請求錯誤與回覆解析錯誤目前仍以相同提示呈現；驗收標準是能區分服務端過載／逾時與回覆格式錯誤，同時不顯示敏感內容。
4. **實作今日時間線單向整合。** 相關檔案：`script.js`、`index.html`、`style.css`。今日頁顯示今天的待辦與行事曆行程；行程沿用固定時間，不複製成待辦；待辦沿用現有排序和預估時長，不虛構開始時間；過期未完成待辦回到清單。全天／缺少結束時間行程在時間線的位置仍待使用者決定。驗收標準：當日行程依時間顯示、資料只存一份、跨日待辦出現在清單且日期正確。
5. **補齊正式 Pages 與交件驗收。** 驗證登入／登出／重新載入、待辦行程分類操作、跨帳號資料隔離，以及 Gemini 實際回覆；對照 README 和課程表單。規則雲端狀態需唯讀核對，任何 Firebase 設定、資料或規則變更均需先徵求使用者同意。

## 本次工作紀錄（2026-11-24）

- **本次完成事項：** 提交 Gemini 對話視窗與文件（功能提交 `d0aa88a`），推送至 `main`，並完成 GitHub Pages 部署；再更新本交接文件記錄正式頁驗證狀態。
- **驗證結果：** GitHub Pages workflow run `45356816240` 的 build、status report、deploy jobs 均成功。正式網址回傳 HTTP 200，下載的頁面包含聊天資源版本 `gemini-chat-20261124-1` 與 Gemini 對話入口。未執行自動化測試、未登入後人工操作介面，也未送出 Gemini 聊天訊息；因此部署已確認，聊天互動與模型回覆未驗收。
- **尚未完成：** 本機／正式頁登入後的桌面與手機介面檢視；回覆、連續對話、清除與登出清除的人工驗收；Gemini 服務恢復後的端到端呼叫驗收。
- **下一步工作：** 先登入正式 Pages 檢視聊天視窗與控制項，再於 Gemini 後端可用時測試單次回覆、連續對話、清除及登出清除；記下真實結果，不以部署成功代表功能驗收通過。
