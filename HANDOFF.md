# Project A 開發交接

更新日期：2026-11-25（Asia/Taipei）

> 本文件是目前狀態的主要交接摘要。功能需求與未決事項見 [REQUIREMENTS.md](./REQUIREMENTS.md)；專案簡介與 Gemini 操作說明見 [README.md](./README.md)。

## 專案與目前版本

- 專案：日常誌個人行程與任務管理系統（課程 Project A）。
- Repo：`saIntLin1116/w6-first-site`；正式網址：[GitHub Pages](https://saintlin1116.github.io/w6-first-site/)。
- 專案根目錄：Repo 根目錄（本機工作目錄依使用者電腦設定）。
- 本輪修改前，`main` 最新已推送提交為 `975d2dc`，Pages 已部署該版本。2026-11-25 在正式頁發現新增類別因 `prompt()` 不受瀏覽器支援而失效，管理類別因變數名稱不一致拋出 `ReferenceError`；手機時間線另有空白提示過長及待辦標題過度換行。本輪已修正這些問題，並依使用者要求加入預設類別改色／刪除；功能操作驗收仍待完成。Gemini 對話視窗提交 `d0aa88a` 先前亦已部署。Gemini 測試仍失敗，瀏覽器 Console 顯示 `fetch-error`。
- 2026-11-25 正式頁單次測試的 Console 另顯示 Firebase App Check token 取得 `403 appCheck/initial-throttle`，其後請求被 `appCheck/throttled` 節流，提示約一天後才可再試。唯讀核對 Firebase Console 後，程式使用的 reCAPTCHA Enterprise site key 與註冊值一致；Google Cloud Fraud Defense 顯示同一網站金鑰屬於網站類型，網域為 `saintlin1116.github.io`，狀態為「受保護」。因此目前未見明顯的金鑰不一致或網域漏列，但原始 403 原因仍未知，也沒有證據證明本次 Gemini 請求抵達模型端。先前 AI Logic 上的 `DEADLINE_EXCEEDED`／`SHEDDABLE` 追蹤仍是較早請求，不能當成本次失敗原因。

## 專案目標與範圍

提供單一使用者管理個人行程與待辦的網站：前端以 GitHub Pages 發佈，使用 Google 登入和 Firestore 保存各帳號資料；Gemini 第一版採 Firebase AI Logic + Gemini Developer API 免費方案，並由 App Check 保護。主要課程交件方向與功能邊界見 [REQUIREMENTS.md](./REQUIREMENTS.md)。

目前不擴充多人協作、通知或未確認的照片／影片功能。XP 是課程主線完成後的延伸項目。今日時間線採行事曆單向顯示；待辦拖曳與卡片節點樣式、完成紀錄復原等新版功能都尚未操作驗收或部署。AI 自動調整時間仍待定案；Gemini 聊天視窗第一版尚待實際呼叫驗收。

## 開發進度與驗收狀態

「程式存在」不等於「正式網站已驗收」。下表依 Repo 程式、README 與本對話可取得的實測回報整理；未在本次重跑。

| 項目 | 程式狀態 | 實際驗收狀態 |
| --- | --- | --- |
| Google 登入／登出 | 已有 Firebase Auth；目前程式在 iOS 使用 popup、Android 等其他行動環境使用 redirect，桌面使用 popup；登入狀態由 `onAuthStateChanged` 監聽。 | 使用者在最新登入修正推送後回報「登入成功」。完整的登出、重新整理、不同手機瀏覽器與最新 Pages 版本驗收仍待確認。 |
| 待辦、今日清單 | 已有新增、編輯、刪除、狀態切換、移入／移出今日、今日排序、完成紀錄等程式。 | 使用者曾大致驗收，但沒有逐項測試紀錄；本次未測。 |
| 過期今日待辦回清單 | 現行日期篩選已會把 `plannedDate` 不是今天的未完成待辦列在清單；跨日後舊待辦會從今日視圖消失並出現在清單。 | 程式邏輯可確認，實際跨日畫面未測。資料中的舊 `plannedDate` 不會自動清空；若使用者只要求回到清單，現有顯示邏輯符合方向。 |
| 月曆、行程、分類 | 已有行程 CRUD、分類顏色、每日行程列表與月曆色點程式；日期顯示使用台北時區。 | 逐項 CRUD、重新載入保存、手機版顯示的測試結果未完整記錄；本次未測。 |
| 今日日期時鐘、表單配色與結束時間預設 | 今日頁在標題後同一行顯示不換行的亮色目前時間，台北日期置於標題下方且不加「今天是」前綴；全天勾選框和時間按鈕套用色票；結束時間空白時程式預設開始後一小時。23:00 起不支援跨午夜，須手動輸入結束時間。 | 本機已修改，尚未操作驗收或檢查視覺效果。 |
| Firestore 個人資料隔離 | Repo 規則限制 `users/{uid}/...` 只能由相同 UID 存取；程式亦以 UID 分開保存。 | 使用者確認不同帳號的行程已分離。對話紀錄另有 Rules Playground 模擬結果：擁有者讀取允許、其他 UID 讀取／更新拒絕、未登入更新拒絕。模擬不等於真實文件操作；雲端目前發布的規則待唯讀確認。 |
| Gemini 今日規劃 | `script.js` 用 Firebase AI Logic SDK 的 `GoogleAIBackend` 呼叫 Gemini Developer API；App Check 使用 reCAPTCHA Enterprise。Spark 免費路線不使用舊 `functions/index.js`。 | 2026-11-25 正式頁單次測試顯示「目前無法產生建議」，Console 記錄 `Gemini 今日規劃失敗：fetch-error`。同一瀏覽器有 App Check token 取得 `403 appCheck/initial-throttle` 及後續 `appCheck/throttled` 訊息；本次 Gemini 是否抵達 AI Logic 尚待確認。Firebase Console 與 Google Cloud 已唯讀確認註冊 site key、程式 site key 相同，且允許網域列出 `saintlin1116.github.io`；原始 403 原因仍待確認。今日規劃尚未驗收通過。 |
| XP／等級 | XP 卡移到主要頁籤上方，標示 `LV`；文字說明改為分數與進度條。 | 已改本機程式，尚未操作驗收或部署；XP 仍非 W11 第一版必交項目。 |
| 今日時間線整合當日行程 | 已改成統一清單：可把待辦拖曳到行程前後或兩個行程間；保存任務相對於行程的位置。若兩側行程時間完整且待辦預估總時長超過間隔，顯示警告。 | 已包含在目前 `main`／Pages 版本中，但拖曳保存、空檔警告和手機操作仍待完整驗收。 |
| 行程類別選擇與管理 | 新增按鈕改以表單建立類別。自訂類別可改名、改色及刪除；預設類別「課業、工作、生活、社交、其他」可改色或刪除但不可改名。預設類別以帳號內軟刪除標記停用；刪除類別時相關行程保留並轉到仍啟用的備援類別，優先「其他」，若其已刪除則使用其他仍啟用類別。選單本體與選項設定為浮動色 `#DED8DA`。 | 正式頁已確認舊版 `prompt()` 不受支援、管理舊版有 `managedCategoryFields is not defined` 錯誤。本機已替換新增流程、修正變數參照及補上預設類別管理，尚未驗收。 |
| 手機時間線資訊與標題排版 | 手機隱藏空白資訊／預估時間提示，將任務操作按鈕移到標題下方，避免卡片內容寬度太窄；今日頁標題與時間在手機保持單行。 | 已改本機 CSS，尚未在窄螢幕驗收。 |
| 完成紀錄與復原 | 今日和清單各自列出從該區完成的任務，最近五筆先顯示、可展開更多；顯示完成日期。勾選完成項目會回到未開始狀態與原排序，扣回該次 XP 與完成數；重新完成可再得 XP。完成紀錄保存來源與還原位置。 | 已改本機程式，尚未操作 Firestore 操作驗收。舊紀錄若沒有來源資訊，暫以任務是否有 `plannedDate` 推定來源。 |
| 今日時間線待辦節點 | 勾選方框本身是左側節點，虛線上下連接；待辦本體只保留一層細灰框，操作按鈕同列靠右並盡量對齊行程分類欄。空檔提示軌道會延續虛線連到下一行程節點。 | 已改本機結構與樣式，桌面和手機畫面尚未檢查。 |
| 重複行程 | 本機新增每週與自訂每 N 天／週／月，需設定結束日期；每次出現建立獨立文件，可分別編輯／刪除，最多 366 次。 | 使用者已同意此規則；尚未操作驗收或部署。 |
| 時間選擇 | 本機增加小時／分鐘選擇器；鍵盤輸入 `13` 正規化為 `13:00`，`0930` 正規化為 `09:30`。 | 尚未檢查桌面與手機瀏覽器的選擇器行為。 |
| Gemini 對話視窗 | 已加入登入後右下角聊天入口、響應式對話窗、訊息顯示、送出與清除控制；使用 Firebase AI Logic `gemini-3.8-flash`。對話只在頁面記憶體保留，傳送使用者輸入及最近 8 輪對話，不自動附帶 Firestore 任務／行程資料、不寫回 Firestore；登出、切換帳號與重新整理清除。 | 2026-11-25 正式頁登入成功，單次送出通用文字測試後仍顯示失敗提示；Console 記錄 `Gemini 對話失敗：fetch-error`。同一瀏覽器有 App Check token 取得 `403 appCheck/initial-throttle` 及後續節流訊息；site key 與網域已唯讀核對一致，尚未確認 403 根因或本次 Gemini 是否抵達模型端。聊天仍未驗收成功。 |
| AI 改動今日順序／時間 | 尚未實作或定案。 | 待確認可修改欄位、衝突處理及採用前確認流程。 |

### 已知問題與技術債

- 尚無可見的自動化測試、根目錄 `package.json`、測試或前端建置指令；前端是原生 HTML/CSS/JavaScript 靜態網站。
- 使用者先前曾在終端機回報 `npm`、`firebase` 指令不存在；2026-11-24 已在自己的終端機確認 Node `v26.13.1`、npm `11.20.0`、Firebase CLI `15.37.0` 可執行。Repo 的 Functions runtime 設定為 Node 20；本機 Node 版本與部署 runtime 不同，後續若安裝或部署出現 engine 警告需核對。
- 使用者提供的最新狀態：Firebase 專案為 Spark；Firebase AI Logic Gemini Developer API 已設定；`script.js` 使用的 Web App ID 對應第一筆 `Project A Web`。專案另有一筆同名但 ID 不同的 Web App。App Check 專頁及 AI Logic 概覽均顯示第一筆已註冊 Fraud Defense 且已強制執行，第二筆未註冊；因此目前正式頁使用的 App ID 對應受保護的 App。使用者回報重播保護關閉、先前 2 個 App Check 要求驗證通過。此 Spark 路線不需 AI Studio API Key、Cloud Functions Secret 或 Functions 部署。
- Firebase 官方支援模型清單將 `gemini-3.8-flash` 列為穩定模型；目前沒有證據把它判定為失敗原因。
- AI 失敗的 `catch` 將請求錯誤和 `result.response.text()`／`JSON.parse()` 的回覆處理錯誤混在一起顯示；`console.error` 只輸出 `error.code || error.name`，沒有輸出 `error.message`。2026-11-25 正式頁 Console 顯示聊天與今日規劃皆為 `fetch-error`，另有 App Check token 取得 `403 appCheck/initial-throttle` 及後續 `appCheck/throttled`，重試時間約一天後。Firebase Console 註冊值與程式 site key 一致；Google Cloud 金鑰頁列出的網域為 `saintlin1116.github.io` 且顯示「受保護」。原始 403 的服務回應內容仍待取得，因此尚不能斷定原因；較早 AI Logic 追蹤的 prefill 過載／逾時不得套用成本次錯誤原因。
- 今日時間線現在以待辦文件保存 `timelineAfterEventId`、`timelineOrder`、`todayOrder`，不為待辦編造開始時間；行程仍是行事曆唯一來源。舊有未加這些欄位的待辦會沿用 `todayOrder`，預設放在第一筆行程前。
- 空檔警告只在相鄰兩筆行程的前一筆有結束時間、後一筆有開始時間，且待辦已設定預估時長時判斷；缺少任一資訊時不推測空檔。
- 重複行程會展開為有限個獨立 Firestore 文件，整組操作不支援；生成上限 366 筆以避免批次超過 Firestore 限制。
- 完成待辦時，transaction 同時寫入 `completionRecords/{taskId}` 與 `stats/progress`；完成紀錄保存來源、`plannedDate`、`todayOrder`、`timelineAfterEventId`、`timelineOrder`。復原時一律設為未開始，刪除該次完成紀錄、扣回該次 XP／完成數並還原任務位置欄位。舊完成資料缺少來源時，目前以 `plannedDate` 是否存在推定；尚未實測此回退流程。
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
- XP 完成與復原使用 Firestore transaction 和完成紀錄；同一完成狀態不重複加分，復原後再次完成則再次加分；仍需實際測試。
- 登入流程曾遇手機登入後回到登入頁。近期調整了 iOS 與 Android 行動環境的登入方式，並修正登入狀態監聽不等待 redirect 結果；使用者後續回報登入成功。不要因此推定所有裝置與重新載入情境都已通過。
- 不要把學校 Gateway 憑證當成網站可用的 Gemini 憑證，也不要將 Gemini 私人 Key 放進前端或公開 Repo。
- 不修改 Firebase Console、Firestore 資料或規則，不部署、不 commit、不 push，除非使用者明確要求；變更外部雲端狀態前先說清楚動作。

## 建議下一步（依優先順序）

1. **驗收本輪類別修正和手機版面。** 相關檔案：`index.html`、`script.js`、`style.css`。在本機確認新增類別表單可建立並選中類別；五個預設類別都可改色／刪除（不可改名），刪除「其他」後選單與行程可改用其他啟用類別，刪除最後一類別會被阻止；自訂類別改名／改色／刪除正常。手機時間線不顯示空白提示，待辦標題不逐字換行、標題與目前時間保持單行。
2. **驗收本機新版 UI／時間線。** 確認 XP 卡位於頁籤上方；待辦可拖曳到兩個行程間並於重新整理後保留順序；空檔超時警告正確；檢查完成復原、空狀態與手機觸控拖曳。
3. **驗收重複行程與時間輸入。** 測試每週及自訂天／週／月頻率、結束日含當日行為、366 筆上限、單次編輯／刪除，以及 `13`、`0930` 和滾動選擇器。
4. **Gemini 與交件驗收。** 節流解除後取得 App Check 403 的原始回應 `status`／`message` 並和 AI Logic trace 比對；不要複製 Headers、Cookie、App Check Token 或完整請求內容。已核對 site key 與網域，暫不重設。再完成登入／登出及正式網站驗收。
5. **繼續功能操作驗收。** 本輪程式提交與 Pages 發布由使用者明確要求；查看 [GitHub Pages Actions](https://github.com/saIntLin1116/w6-first-site/actions) 的最新 `pages build and deployment` 結果。預設類別刪除會改寫使用該類別的行程，驗收時用專用測試資料。

## 本次工作紀錄（2026-11-25）

- **本次完成事項：** 接續類別管理修正，讓預設類別可改色或刪除但不可重新命名；預設類別使用 Firestore 軟刪除標記停用，刪除時既有行程轉到仍啟用類別（優先「其他」），並使「其他」停用後的預設選取改用實際啟用類別。管理標題改為「管理行程類別」，確認訊息顯示實際備援類別且阻止刪除最後一類別。同步更新 README、REQUIREMENTS、HANDOFF 與 cache-bust。
- **驗證結果：** `git diff --check` 通過；本輪未執行自動化測試，也未操作功能或 Firestore 資料。推送後 Pages 發布狀態以 [GitHub Pages Actions](https://github.com/saIntLin1116/w6-first-site/actions) 最新 `pages build and deployment` 結果為準。未修改 Firebase Console 或 Firestore Rules。
- **尚未完成：** 在 localhost 實際驗收預設及自訂類別改色／刪除、既有行程備援轉移、最後一類別保護及手機版面；先前時間線、完成復原、重複行程等仍待驗收。Gemini App Check 403 根因與成功呼叫未解決。
- **下一步工作：** 由使用者於 localhost 操作驗收類別管理及手機窄版面；刪除類別會寫入該登入者的類別／行程文件，建議先建立專用測試類別與行程。Gemini 節流解除後再受控重測。
