# Project A 開發交接

更新日期：2026-11-25（Asia/Taipei）

> 本文件是目前狀態的主要交接摘要。功能需求與未決事項見 [REQUIREMENTS.md](./REQUIREMENTS.md)；專案簡介與 Gemini 操作說明見 [README.md](./README.md)。

## 專案與目前版本

- 專案：日常誌個人行程與任務管理系統（課程 Project A）。
- Repo：`saIntLin1116/w6-first-site`；正式網址：[GitHub Pages](https://saintlin1116.github.io/w6-first-site/)。
- 專案根目錄：Repo 根目錄（本機工作目錄依使用者電腦設定）。
- 最新程式提交為 `74efda9`（`feat: apply Gemini plans to today timeline`），`main` 與 `origin/main` 同步；GitHub Pages 部署工作已成功：[Pages build and deployment](https://github.com/saIntLin1116/w6-first-site/actions/runs/45604467756)。此版含 Gemini 建議採用功能及 LV 玻璃 HUD 樣式。這些最新變更尚未進行正式頁操作／視覺驗收。
- 2026-11-25 登入 Firebase Console 後唯讀檢查：正式 Web App 在 AI Logic 頁顯示 App Check「已註冊（已強制執行）」；Gemini Developer API 已啟用，AI monitoring 已啟用。
- 2026-11-25 下午約 4:34–4:35（台北時間）正式頁受控測試後，聊天與今日規劃各有一筆失敗和一筆成功。失敗追蹤皆為 `INTERNAL`，對應先前確認的 `Overloaded prefill queue`；其後成功追蹤的實際模型都顯示 `gemini-3.5-flash-lite`：聊天回覆約 1.37 秒，今日規劃回覆約 1.25 秒。今日規劃回傳摘要、待辦優先順序及建議。這證實正式頁在模型過載後能切換備援，且兩項功能都成功取得並呈現結果；目前尚未觀察到主模型 `gemini-3.8-flash` 成功，不能把備援成功當成主模型已驗收。最近 24 小時監控約 11 次要求、成功率 18.2%，包含先前失敗，不能代表最新兩次受控測試仍失敗。先前 `403 appCheck/initial-throttle`／`appCheck/throttled` 是另外觀察到的 App Check token 錯誤，目前沒有證據顯示它造成模型端過載。未改 Firebase Console 設定。
- `script.js` 在明確模型過載時最多改用一次 `gemini-3.5-flash-lite` 備援，聊天與今日建議皆適用。本次正式測試已命中備援並成功；主模型仍待觀察。

## 專案目標與範圍

提供單一使用者管理個人行程與待辦的網站：前端以 GitHub Pages 發佈，使用 Google 登入和 Firestore 保存各帳號資料；Gemini 第一版採 Firebase AI Logic + Gemini Developer API 免費方案，並由 App Check 保護。主要課程交件方向與功能邊界見 [REQUIREMENTS.md](./REQUIREMENTS.md)。

目前不擴充多人協作、通知或未確認的照片／影片功能。XP 是課程主線完成後的延伸項目。今日時間線採行事曆單向顯示；待辦拖曳與卡片節點樣式、完成紀錄復原等功能已在目前 Pages 版本中，但尚未逐項操作驗收。AI 自動調整時間仍待定案；Gemini 聊天與今日規劃已透過備援模型各成功一次，主模型成功仍待確認。

## 開發進度與驗收狀態

「程式存在」不等於「正式網站已驗收」。下表依 Repo 程式、README 與本對話可取得的實測回報整理；未在本次重跑。

| 項目 | 程式狀態 | 實際驗收狀態 |
| --- | --- | --- |
| Google 登入／登出 | 已有 Firebase Auth；目前程式在 iOS 使用 popup、Android 等其他行動環境使用 redirect，桌面使用 popup；登入狀態由 `onAuthStateChanged` 監聽。 | 使用者在最新登入修正推送後回報「登入成功」。完整的登出、重新整理、不同手機瀏覽器與最新 Pages 版本驗收仍待確認。 |
| 待辦、今日清單 | 已有新增、編輯、刪除、狀態切換、移入／移出今日、今日排序、完成紀錄等程式。 | 使用者曾大致驗收，但沒有逐項測試紀錄；本次未測。 |
| 過期今日待辦回清單 | 現行日期篩選已會把 `plannedDate` 不是今天的未完成待辦列在清單；跨日後舊待辦會從今日視圖消失並出現在清單。 | 程式邏輯可確認，實際跨日畫面未測。資料中的舊 `plannedDate` 不會自動清空；若使用者只要求回到清單，現有顯示邏輯符合方向。 |
| 月曆、行程、分類 | 已有行程 CRUD、分類顏色、每日行程列表與月曆色點程式；日期顯示使用台北時區。 | 逐項 CRUD、重新載入保存、手機版顯示的測試結果未完整記錄；本次未測。 |
| 今日日期時鐘、表單配色與結束時間預設 | 今日頁在標題後同一行顯示不換行的亮色目前時間，台北日期置於標題下方且不加「今天是」前綴；全天勾選框和時間按鈕套用色票；結束時間空白時程式預設開始後一小時。23:00 起不支援跨午夜，須手動輸入結束時間。 | 已推送並部署；尚未操作驗收或檢查視覺效果。 |
| Firestore 個人資料隔離 | Repo 規則限制 `users/{uid}/...` 只能由相同 UID 存取；程式亦以 UID 分開保存。 | 使用者確認不同帳號的行程已分離。對話紀錄另有 Rules Playground 模擬結果：擁有者讀取允許、其他 UID 讀取／更新拒絕、未登入更新拒絕。模擬不等於真實文件操作；雲端目前發布的規則待唯讀確認。 |
| Gemini 今日規劃與採用 | `script.js` 用 Firebase AI Logic SDK 的 `GoogleAIBackend` 呼叫 Gemini Developer API；App Check 使用 reCAPTCHA Enterprise。主模型為 `gemini-3.8-flash`；明確過載時最多切換一次 `gemini-3.5-flash-lite`。本機版本新增每個待辦的 `afterEventId` 插入點和「採用 AI 建議」按鈕；確認後只更新待辦 `todayOrder`、`timelineAfterEventId`、`timelineOrder`，不改行程、估時或建立待辦開始時間。 | 正式頁既有今日規劃曾透過備援成功一次；新增的插入點與採用寫入流程尚未測試，尚未部署。主模型成功仍待觀察。 |
| XP／等級 | XP 卡移到主要頁籤上方，標示 `LV`。參考資料夾內紅色 HUD、深色遊戲選單斜角框、青藍標籤與圓形儀表圖，採深色半透明玻璃、紅色細線、克制的藍灰儀表刻度、等寬字體與微光進度條；中文字沿用系統字體。 | 更深、更透明的 HUD 樣式已隨 `74efda9` 部署至 Pages；桌面／手機視覺仍待使用者驗收。XP 功能本身尚未操作驗收，且非 W11 第一版必交項目。 |
| 今日時間線整合當日行程 | 已改成統一清單：可把待辦拖曳到行程前後或兩個行程間；保存任務相對於行程的位置。若兩側行程時間完整且待辦預估總時長超過間隔，顯示警告。 | 已包含在目前 `main`／Pages 版本中，但拖曳保存、空檔警告和手機操作仍待完整驗收。 |
| 行程類別選擇與管理 | 新增按鈕改以表單建立類別。自訂類別可改名、改色及刪除；預設類別「課業、工作、生活、社交、其他」可改色或刪除但不可改名。預設類別以帳號內軟刪除標記停用；刪除類別時相關行程保留並轉到仍啟用的備援類別，優先「其他」，若其已刪除則使用其他仍啟用類別。選單本體與選項設定為浮動色 `#DED8DA`。 | 已在 `c1225e5` 推送並部署。功能、顏色保存、預設類別軟刪除、相關行程轉類別仍待操作驗收。 |
| 手機時間線資訊與標題排版 | 手機隱藏空白資訊／預估時間提示，將任務操作按鈕移到標題下方，避免卡片內容寬度太窄；今日頁標題與時間在手機保持單行。 | 已推送並部署；尚未在窄螢幕驗收。 |
| 完成紀錄與復原 | 今日和清單各自列出從該區完成的任務，最近五筆先顯示、可展開更多；顯示完成日期。勾選完成項目會回到未開始狀態與原排序，扣回該次 XP 與完成數；重新完成可再得 XP。完成紀錄保存來源與還原位置。 | 已在目前 Pages 版本，尚未操作 Firestore 驗收。舊紀錄若沒有來源資訊，暫以任務是否有 `plannedDate` 推定來源。 |
| 今日時間線待辦節點 | 勾選方框本身是左側節點，虛線上下連接；待辦本體只保留一層細灰框，操作按鈕同列靠右並盡量對齊行程分類欄。空檔提示軌道會延續虛線連到下一行程節點。 | 已在目前 Pages 版本；桌面和手機畫面尚未檢查。 |
| 重複行程 | 每週與自訂每 N 天／週／月，需設定結束日期；每次出現建立獨立文件，可分別編輯／刪除，最多 366 次。 | 已在目前 Pages 版本；使用者已同意規則，但建立、單筆編輯／刪除和上限仍待操作驗收。 |
| 時間選擇 | 小時／分鐘選擇器；鍵盤輸入 `13` 正規化為 `13:00`，`0930` 正規化為 `09:30`。 | 已在目前 Pages 版本；尚未檢查桌面與手機瀏覽器的選擇器行為。 |
| Gemini 對話視窗 | 已加入登入後右下角聊天入口、響應式對話窗、訊息顯示、送出與清除控制；主模型為 `gemini-3.8-flash`，遇明確模型過載時最多改用一次 `gemini-3.5-flash-lite`。對話只在頁面記憶體保留，傳送使用者輸入及最近 8 輪對話，不自動附帶 Firestore 任務／行程資料、不寫回 Firestore；登出、切換帳號與重新整理清除。 | 正式頁聊天已成功一次；Firebase AI Logic trace 顯示 `gemini-3.5-flash-lite` 備援模型成功回覆，約 1.37 秒。此前請求曾因模型過載失敗；尚無主模型成功紀錄。 |
| AI 改動今日順序／時間 | 尚未實作或定案。 | 待確認可修改欄位、衝突處理及採用前確認流程。 |

### 已知問題與技術債

- 尚無可見的自動化測試、根目錄 `package.json`、測試或前端建置指令；前端是原生 HTML/CSS/JavaScript 靜態網站。
- 使用者先前曾在終端機回報 `npm`、`firebase` 指令不存在；2026-11-24 已在自己的終端機確認 Node `v26.13.1`、npm `11.20.0`、Firebase CLI `15.37.0` 可執行。Repo 的 Functions runtime 設定為 Node 20；本機 Node 版本與部署 runtime 不同，後續若安裝或部署出現 engine 警告需核對。
- 使用者提供的最新狀態：Firebase 專案為 Spark；Firebase AI Logic Gemini Developer API 已設定；`script.js` 使用的 Web App ID 對應第一筆 `Project A Web`。專案另有一筆同名但 ID 不同的 Web App。App Check 專頁及 AI Logic 概覽均顯示第一筆已註冊 Fraud Defense 且已強制執行，第二筆未註冊；因此目前正式頁使用的 App ID 對應受保護的 App。使用者回報重播保護關閉、先前 2 個 App Check 要求驗證通過。此 Spark 路線不需 AI Studio API Key、Cloud Functions Secret 或 Functions 部署。
- Firebase 官方支援模型清單將 `gemini-3.8-flash` 列為穩定模型；目前沒有證據把它判定為失敗原因。
- 「採用 AI 建議」已部署至 Pages；使用者點擊後以 Firestore batch 儲存待辦時間線位置，套用前以當日待辦／行程快照防止過期建議覆蓋新資料。仍需操作驗收一般建議、空檔溢出提示、當日資料變更後要求重產生，以及登出／切帳號的狀態清理。
- 2026-11-25 已唯讀核對：Firebase AI Logic Gemini Developer API 已啟用；正式 App Check 已註冊並強制；AI monitoring 已啟用。正式頁聊天與今日規劃已各成功一次，trace 均顯示備援模型 `gemini-3.5-flash-lite`；其前的失敗 trace 指向模型端 `Overloaded prefill queue`。這已驗證目前備援流程可運作，但未驗證主模型 `gemini-3.8-flash` 成功。App Check token `403 appCheck/initial-throttle`／`appCheck/throttled` 是另見錯誤，沒有證據將其視為模型過載的根因。Cloud Browser key 的 API 限制清單包含 Firebase AI Logic 與 Firebase App Check；目前未改金鑰限制。
- 正式頁測試已確認 Gemini 3.5 Flash-Lite 備援成功；主模型及其恢復後的成功情況仍待觀察。Google 官方模型文件列出 Flash-Lite 為免費穩定的一般模型，並支援結構化輸出。
- 今日時間線現在以待辦文件保存 `timelineAfterEventId`、`timelineOrder`、`todayOrder`，不為待辦編造開始時間；行程仍是行事曆唯一來源。舊有未加這些欄位的待辦會沿用 `todayOrder`，預設放在第一筆行程前。
- 空檔警告只在相鄰兩筆行程的前一筆有結束時間、後一筆有開始時間，且待辦已設定預估時長時判斷；缺少任一資訊時不推測空檔。
- 重複行程會展開為有限個獨立 Firestore 文件，整組操作不支援；生成上限 366 筆以避免批次超過 Firestore 限制。
- 完成待辦時，transaction 同時寫入 `completionRecords/{taskId}` 與 `stats/progress`；完成紀錄保存來源、`plannedDate`、`todayOrder`、`timelineAfterEventId`、`timelineOrder`。復原時一律設為未開始，刪除該次完成紀錄、扣回該次 XP／完成數並還原任務位置欄位。舊完成資料缺少來源時，目前以 `plannedDate` 是否存在推定；尚未實測此回退流程。
- 舊 Cloud Function `generateDailyPlan` 的預檢 404/CORS 是舊版保留記錄；硬重新載入後的新請求已走 Firebase AI Logic，排查時不要再以舊記錄判讀。
- 先前查閱 Firebase 官方錯誤排查文件，頁面未列 500／503 專節；Google Cloud Service Health 的 Firebase AI Logic 公開事件頁當時顯示「No incidents reported」。本次專案追蹤本文明示單筆模型高需求及 prefill 逾時；公開健康頁無事件不排除個別模型／請求遇到負載問題。[錯誤排查文件](https://firebase.google.com/docs/ai-logic/error-codes)／[公開服務健康頁](https://status.cloud.google.com/products/xSLTSirYjsylAlwIqpBP/history)
- 最新登入修正的程式已在目前 Pages 版本；登入、登出和重新整理的最新正式頁操作尚待驗收。Firebase Console 中現行 Firestore 規則版本仍未唯讀核對。
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

1. **驗收正式頁採用 AI 建議。** 在正式 Pages 以一般待辦與有時間行程確認建議順序／插入點，採用後重新整理仍保留；檢查空檔超時提醒及建議後資料變更時拒絕舊結果。新流程目前尚未操作驗收。
2. **驗收 XP 卡片 HUD／玻璃樣式。** 檢查正式 Pages 桌面與手機版顯示；若需調整再修改樣式。之後用專用測試類別／行程驗收類別管理；刪除類別會寫入登入者的 Firestore 類別／行程文件。
3. **驗收重複行程與時間輸入。** 測試每週及自訂天／週／月頻率、結束日含當日行為、366 筆上限、單次編輯／刪除，以及 `13`、`0930` 和滾動選擇器。
4. **Gemini 主模型追蹤。** 聊天與今日建議已在正式頁透過 `gemini-3.5-flash-lite` 備援各成功一次。後續可在模型負載恢復時各測一次，確認 `gemini-3.8-flash` 是否成功；若又過載，應避免連續重送，直接查看 AI Logic trace。不要重設已核對的 Console 設定，也不要分享 Headers、Cookie、App Check Token 或完整請求內容。
5. **完成 W11 交件驗收與使用者測試。** 確認 Google 登入、Firestore 個人隔離、待辦／行程／分類和 AI 的實際結果，記錄真實操作；再核對老師表單要求與 Pages 正式版本。LINE 登入仍是可選項。

## 本次工作紀錄（2026-11-25）

- **本次完成事項：** 新增今日規劃的 AI 採用流程：Gemini 為每筆今日待辦指定建議順序與行程間錨點；使用者按「採用 AI 建議」後才保存三個時間線位置欄位，沿用既有空檔超時提示。`74efda9` 已推送，Pages Actions 部署成功；本次也部署了 LV 玻璃 HUD 樣式。
- **驗證結果：** GitHub Pages 部署工作成功。未執行功能測試或瀏覽器操作；需確認建議格式、採用後排序保存、空檔不足提醒及資料變更後拒絕舊建議。原有聊天／規劃備援模型正式追蹤成功是先前驗收結果。
- **尚未完成：** 新採用流程與最新 LV 樣式尚未作正式頁操作／視覺驗收；未確認 Gemini 在實際行程資料下都能輸出完整有效的任務順序與 `afterEventId`。
- **下一步工作：** 在正式頁以一般資料驗收採用流程，確認採用前後內容；不可用未確認或測試資料直接覆蓋真實今日安排。

- **本次完成事項：** 唯讀查看 Firebase AI Logic 正式追蹤與 Repo 模型設定；確認聊天與今日規劃各成功一次，兩筆成功都由 `gemini-3.5-flash-lite` 備援處理。記錄先前失敗與模型過載的關係；未修改 Firebase Console 或程式碼。更新本文件、README 與 REQUIREMENTS 的驗收狀態。
- **驗證結果：** 聊天 trace 狀態成功、回覆延遲約 1.37 秒；今日規劃 trace 狀態成功、回覆延遲約 1.25 秒，輸出有摘要、優先順序及建議。兩筆 trace 的實際模型都是 `gemini-3.5-flash-lite`，因此備援路徑已正式驗收；`gemini-3.8-flash` 主模型仍未驗收成功。
- **尚未完成：** 主模型在負載恢復時的實際成功尚待確認；舊錯誤及當日失敗仍反映在最近 24 小時 18.2% 成功率中。其他核心功能逐項驗收仍待安排。
- **下一步工作：** 不需重設 Console 或 API 設定。之後於模型狀態穩定時各執行一次聊天和今日規劃，從 trace 確認主模型是否命中；若出現過載，不要密集重送，使用備援結果並記錄即可。

- **本次完成事項：** 唯讀查看 Firebase Console 與 Google Cloud Browser key 設定；開啟 AI Logic 最近 24 小時監控和最新兩筆 trace。確認 Gemini Developer API 已啟用、正式 Web App App Check 已註冊並強制、兩筆 Gemini 請求皆抵達模型端，錯誤是 `Overloaded prefill queue`。在 `script.js` 為聊天與今日規劃加入明確過載時一次性的 `gemini-3.5-flash-lite` 備援及狀態提示；未改 Firebase／Google Cloud 設定。
- **驗證結果：** Firebase Console trace 直接回報模型高需求過載；`node --check script.js` 與 `git diff --check` 通過。Pages 部署完成後，備援效果待正式頁驗收。
- **尚未完成：** 需要於正式頁各做一次受控聊天與今日建議測試；如果備援也失敗，再由新 trace 判斷模型／服務問題。App Check `initial-throttle` 的服務端細節仍未取得，但目前沒有證據顯示它造成最新兩筆 Gemini 失敗。
- **下一步工作：** 確認 Pages 發布完成，並測聊天與今日規劃各一次；LV HUD 樣式仍保留本機預覽，未包含在本次發布。

- **本次完成事項：** 查看 `UI參考` 資料夾共 8 張圖片（含重複的遊戲選單參考），在原紅色 HUD 方向上加入深色遊戲選單的斜角框細節與圓形儀表刻度；依使用者回饋再降低 LV 卡底色不透明度、加深色調，保留磨砂模糊、高光和微光 XP 進度條。更新 HTML cache-bust。
- **驗證結果：** localhost `/` 已回應 `planner-ui-20261125-15`；重新載入後登入狀態恢復，螢幕截圖確認卡片底色較深且更通透，右下有低對比儀表刻度、右上有 HUD 角線。`git diff --check` 通過。只讀檢視頁面，未操作 Firestore 資料、未修改 Firebase Console／Rules，也未執行自動化測試。樣式尚未推送。
- **尚未完成：** 等待使用者確認這版深色透明 HUD 樣式；若採用，再由使用者決定是否 commit、push 與部署。類別管理、XP、時間線、完成復原、重複行程、時間輸入及手機版面仍需逐項操作驗收。Gemini App Check 403 根因與成功呼叫未解決。
- **下一步工作：** 使用者於 `http://localhost:8000/` 檢視目前 LV 卡片並回覆是否採用；之後再安排功能驗收。刪除類別等會寫入 Firestore 的驗收應使用專用測試資料。Gemini 節流解除後再受控重測。
