# Project A 開發交接

更新日期：2026-11-25（Asia/Taipei）

> 本文件是目前狀態的主要交接摘要。功能需求與未決事項見 [REQUIREMENTS.md](./REQUIREMENTS.md)；專案簡介與 Gemini 操作說明見 [README.md](./README.md)。

## 專案與目前版本

- 專案：日常誌個人行程與任務管理系統（課程 Project A）。
- Repo：`saIntLin1116/w6-first-site`；正式網址：[GitHub Pages](https://saintlin1116.github.io/w6-first-site/)。
- 專案根目錄：Repo 根目錄（本機工作目錄依使用者電腦設定）。
- 目前 `main` 與 `origin/main` 同步於 `e99f73f`（`docs: update Gemini adoption deployment status`）。工作目錄有 `HANDOFF.md`、`REQUIREMENTS.md`、`index.html`、`script.js`、`style.css` 的未提交變更；最新介面與歷史快照等程式改動尚未 commit、push 或部署。
- 2026-11-25 登入 Firebase Console 後唯讀檢查：正式 Web App 在 AI Logic 頁顯示 App Check「已註冊（已強制執行）」；Gemini Developer API 已啟用，AI monitoring 已啟用。
- 2026-11-25 下午約 4:34–4:35（台北時間）正式頁受控測試後，聊天與今日規劃各有一筆失敗和一筆成功。失敗追蹤皆為 `INTERNAL`，對應先前確認的 `Overloaded prefill queue`；其後成功追蹤的實際模型都顯示 `gemini-3.5-flash-lite`：聊天回覆約 1.37 秒，今日規劃回覆約 1.25 秒。今日規劃回傳摘要、待辦優先順序及建議。這證實正式頁在模型過載後能切換備援，且兩項功能都成功取得並呈現結果；目前尚未觀察到主模型 `gemini-3.8-flash` 成功，不能把備援成功當成主模型已驗收。最近 24 小時監控約 11 次要求、成功率 18.2%，包含先前失敗，不能代表最新兩次受控測試仍失敗。先前 `403 appCheck/initial-throttle`／`appCheck/throttled` 是另外觀察到的 App Check token 錯誤，目前沒有證據顯示它造成模型端過載。未改 Firebase Console 設定。
- `script.js` 在明確模型過載時最多改用一次 `gemini-3.5-flash-lite` 備援，聊天與今日建議皆適用。本次正式測試已命中備援並成功；主模型仍待觀察。

## 專案目標與範圍

提供單一使用者管理個人行程與待辦的網站：前端以 GitHub Pages 發佈，使用 Google 登入和 Firestore 保存各帳號資料；Gemini 第一版採 Firebase AI Logic + Gemini Developer API 免費方案，並由 App Check 保護。主要課程交件方向與功能邊界見 [REQUIREMENTS.md](./REQUIREMENTS.md)。

目前不擴充多人協作、通知或未確認的照片／影片功能。XP 是課程主線完成後的延伸項目。今日時間線採行事曆單向顯示；待辦拖曳與卡片節點樣式、完成紀錄復原等功能已在目前 Pages 版本中，但尚未逐項操作驗收。最新本機變更另加入重要度分級、清單新增日期、移除空白資訊提示，以及從清單加入今天時預設插在現在時間點後最近位置；這些及昨天快照、明日預排、現在標記與 Gemini 擴充均尚未 commit、push 或部署。

## 開發進度與驗收狀態

「程式存在」不等於「正式網站已驗收」。下表依 Repo 程式、README 與本對話可取得的實測回報整理；未在本次重跑。

| 項目 | 程式狀態 | 實際驗收狀態 |
| --- | --- | --- |
| Google 登入／登出 | 已有 Firebase Auth；目前程式在 iOS 使用 popup、Android 等其他行動環境使用 redirect，桌面使用 popup；登入狀態由 `onAuthStateChanged` 監聽。 | 使用者在最新登入修正推送後回報「登入成功」。完整的登出、重新整理、不同手機瀏覽器與最新 Pages 版本驗收仍待確認。 |
| 待辦、重要度與清單資訊 | 已有新增、編輯、刪除、狀態切換、移入／移出今日、今日排序與完成紀錄。最新本機程式新增重要度「無／高／中／低」（預設無；無用中性色，三級重要度用不同色標示）、清單新增日期，沒有其他資料時不顯示「尚未設定其他資訊」。加入今天時依現在標記計算最近插入位置；若現在在行程時段內，排在該行程後面；插入到同一位置時沿用原任務順序。 | 這輪只做程式與文件修改，尚未瀏覽器驗收；既有資料的無重要度回退顯示及手機表單寬度也待檢查。 |
| 過期今日待辦回清單 | 現行日期篩選會把 `plannedDate` 不是今天的未完成待辦列在清單；跨日後待辦從今日視圖消失並出現在清單，狀態不會自動重設（例如「進行中」會保留）。舊 `plannedDate` 保留，不會自動清空；使用者加入今天或明天時才改日期並重設時間線位置。 | 程式邏輯可確認，實際跨日畫面未測。 |
| 昨天／今天／明天與更早快照 | 昨天從 `users/{uid}/dailySnapshots/{date}` 唯讀載入；今天持續保存並跨日封存；明天可預排待辦。更早歷史日期新增收合面板，按日期唯讀查看已保存快照，每頁 12 筆。瀏覽更早日期不會以現有資料補造舊快照；此前沒有保存的日期無法還原。 | 程式已加入，尚未登入操作 Firestore 驗收；不會改 Console、規則或使用者資料。Repo 規則 UID 範圍通配路徑涵蓋此子集合，但雲端規則仍待唯讀確認。 |
| 時間線現在位置 | 本機只在今天時間線顯示現在標記：若目前落在有明確起訖時間的行程內，標記該行程；否則標在行程間／前後空檔，節點為綠色。可把當日待辦拖到標記前後調整順序；這只保存前後順序，標記仍依行程時間定位，不代表待辦有實際開始時間。 | 僅完成程式與語法檢查；桌面／手機位置和跨時段更新尚未視覺驗收。 |
| 月曆、行程、分類 | 已有行程 CRUD、分類顏色、每日行程列表與月曆色點程式；日期顯示使用台北時區。 | 逐項 CRUD、重新載入保存、手機版顯示的測試結果未完整記錄；本次未測。 |
| 今日日期時鐘、表單配色與結束時間預設 | 今日頁在標題後同一行顯示不換行的亮色目前時間，台北日期置於標題下方且不加「今天是」前綴；全天勾選框和時間按鈕套用色票；結束時間空白時程式預設開始後一小時。23:00 起不支援跨午夜，須手動輸入結束時間。 | 已推送並部署；尚未操作驗收或檢查視覺效果。 |
| Firestore 個人資料隔離 | Repo 規則限制 `users/{uid}/...` 只能由相同 UID 存取；程式亦以 UID 分開保存。 | 使用者確認不同帳號的行程已分離。對話紀錄另有 Rules Playground 模擬結果：擁有者讀取允許、其他 UID 讀取／更新拒絕、未登入更新拒絕。模擬不等於真實文件操作；雲端目前發布的規則待唯讀確認。 |
| Gemini 今日／明日規劃與採用 | `script.js` 使用 Firebase AI Logic + App Check，主模型 `gemini-3.8-flash` 過載時最多切至 `gemini-3.5-flash-lite`。本機版將所選日未完成待辦、未安排／過期清單待辦及該日行程送去規劃。回傳排序、行程間位置及清單任務是否加入所選日；採用後才批次更新 `plannedDate`、`todayOrder`、`timelineAfterEventId`、`timelineOrder`。固定行程不變，不建待辦開始時間；標記前後排序另存於待辦位置欄位。 | 基礎採用流程在 `74efda9` 已部署；本輪擴充只在本機，未部署／未做 Gemini 實際呼叫驗收。先前正式頁聊天和今日建議透過備援模型成功，主模型成功仍待觀察。 |
| XP／等級 | XP 卡移到主要頁籤上方，標示 `LV`。參考資料夾內紅色 HUD、深色遊戲選單斜角框、青藍標籤與圓形儀表圖，採深色半透明玻璃、紅色細線、克制的藍灰儀表刻度、等寬字體與微光進度條；中文字沿用系統字體。 | 更深、更透明的 HUD 樣式已隨 `74efda9` 部署至 Pages；桌面／手機視覺仍待使用者驗收。XP 功能本身尚未操作驗收，且非 W11 第一版必交項目。 |
| 今日時間線整合當日行程 | 已改成統一清單：可把待辦拖曳到行程前後或兩個行程間；保存任務相對於行程的位置。若兩側行程時間完整且待辦預估總時長超過間隔，顯示警告。 | 已包含在目前 `main`／Pages 版本中，但拖曳保存、空檔警告和手機操作仍待完整驗收。 |
| 行程類別選擇與管理 | 新增按鈕改以表單建立類別。自訂類別可改名、改色及刪除；預設類別「課業、工作、生活、社交、其他」可改色或刪除但不可改名。預設類別以帳號內軟刪除標記停用；刪除類別時相關行程保留並轉到仍啟用的備援類別，優先「其他」，若其已刪除則使用其他仍啟用類別。選單本體與選項設定為浮動色 `#DED8DA`。 | 已在 `c1225e5` 推送並部署。功能、顏色保存、預設類別軟刪除、相關行程轉類別仍待操作驗收。 |
| 手機時間線資訊與標題排版 | 手機隱藏空白資訊／預估時間提示，將任務操作按鈕移到標題下方，避免卡片內容寬度太窄；今日頁標題與時間在手機保持單行。 | 已推送並部署；尚未在窄螢幕驗收。 |
| 完成紀錄與復原 | 今日和清單各自列出從該區完成的任務，最近五筆先顯示、可展開更多；顯示完成日期。勾選完成項目會回到未開始狀態與原排序，扣回該次 XP 與完成數；重新完成可再得 XP。完成紀錄保存來源與還原位置。 | 已在目前 Pages 版本，尚未操作 Firestore 驗收。舊紀錄若沒有來源資訊，暫以任務是否有 `plannedDate` 推定來源。 |
| 今日時間線待辦節點 | 勾選方框本身是左側節點，虛線上下連接；待辦本體只保留一層細灰框，操作按鈕同列靠右並盡量對齊行程分類欄。空檔提示軌道會延續虛線連到下一行程節點。 | 已在目前 Pages 版本；桌面和手機畫面尚未檢查。 |
| 重複行程 | 每週與自訂每 N 天／週／月，需設定結束日期；每次出現建立獨立文件，可分別編輯／刪除，最多 366 次。 | 已在目前 Pages 版本；使用者已同意規則，但建立、單筆編輯／刪除和上限仍待操作驗收。 |
| 時間選擇 | 小時／分鐘選擇器；鍵盤輸入 `13` 正規化為 `13:00`，`0930` 正規化為 `09:30`。 | 已在目前 Pages 版本；尚未檢查桌面與手機瀏覽器的選擇器行為。 |
| Gemini 對話視窗 | 已加入登入後右下角聊天入口、響應式對話窗、訊息顯示、送出與清除控制；主模型為 `gemini-3.8-flash`，遇明確模型過載時最多改用一次 `gemini-3.5-flash-lite`。對話只在頁面記憶體保留，傳送使用者輸入及最近 8 輪對話，不自動附帶 Firestore 任務／行程資料、不寫回 Firestore；登出、切換帳號與重新整理清除。 | 正式頁聊天已成功一次；Firebase AI Logic trace 顯示 `gemini-3.5-flash-lite` 備援模型成功回覆，約 1.37 秒。此前請求曾因模型過載失敗；尚無主模型成功紀錄。 |
| Gemini 排序與加入清單待辦 | 本機版 Gemini 可整理今日／明日待辦順序、安排在固定行程前後／間隔，並挑選清單待辦加入所選日；只在使用者按「採用 AI 建議」後批次寫入。固定行程日期／時間不變，也不替待辦設定開始時間。 | 新增的完整格式與寫入流程尚未在瀏覽器或 Gemini 實際驗收；舊版已部署的採用流程不等於本輪擴充已驗收。 |

### 已知問題與技術債

- 尚無可見的自動化測試、根目錄 `package.json`、測試或前端建置指令；前端是原生 HTML/CSS/JavaScript 靜態網站。
- 使用者先前曾在終端機回報 `npm`、`firebase` 指令不存在；2026-11-24 已在自己的終端機確認 Node `v26.13.1`、npm `11.20.0`、Firebase CLI `15.37.0` 可執行。Repo 的 Functions runtime 設定為 Node 20；本機 Node 版本與部署 runtime 不同，後續若安裝或部署出現 engine 警告需核對。
- 使用者提供的最新狀態：Firebase 專案為 Spark；Firebase AI Logic Gemini Developer API 已設定；`script.js` 使用的 Web App ID 對應第一筆 `Project A Web`。專案另有一筆同名但 ID 不同的 Web App。App Check 專頁及 AI Logic 概覽均顯示第一筆已註冊 Fraud Defense 且已強制執行，第二筆未註冊；因此目前正式頁使用的 App ID 對應受保護的 App。使用者回報重播保護關閉、先前 2 個 App Check 要求驗證通過。此 Spark 路線不需 AI Studio API Key、Cloud Functions Secret 或 Functions 部署。
- **2026-11-25 localhost Gemini 最新排查：** 使用者同意後，曾在 Google Cloud「行程管理」reCAPTCHA Enterprise 金鑰允許網域新增 `localhost`，原本的 `saintlin1116.github.io` 保留；Cloud Console 顯示更新成功，沒有改 App Check 強制設定。Chrome localhost 分頁目前仍載入舊版 `planner-older-snapshots-20261125-1` 程式，Console 顯示 `appCheck/recaptcha-error`，Gemini API 回 `401 UNAUTHENTICATED: Firebase App Check token is invalid.`；這次看見的錯誤是在舊頁載入後產生，不能判定新 debug flag 無效。Firebase 官方建議 localhost 使用 App Check debug provider；本機 `script.js` 已加入僅 `hostname === 'localhost'` 才啟用的 `FIREBASE_APPCHECK_DEBUG_TOKEN`，正式網域仍用 reCAPTCHA Enterprise。重新載入登入中的頁面會按現有程式更新今天快照並封存昨天快照到 Firestore；將 token 登記到 `daily-planner-project-a` 的 `Project A Web` 會讓持有該 token 的本機頁面通過 App Check。已向使用者說明這兩個影響並等待其即時確認；尚未重新載入、產生／登記 token，也未更動 Firestore 或 Console。`localhost` 仍在正式 reCAPTCHA 金鑰允許網域，debug token 流程完成後再移除。App Check 清單另有一筆同名但未註冊的 Web App。官方參考：[App Check Enterprise 設定](https://firebase.google.com/docs/app-check/web/recaptcha-enterprise-provider)／[Web debug provider](https://firebase.google.com/docs/app-check/web/debug-provider)
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

目前沒有自動化測試或前端 build 指令；前端是原生 HTML/CSS/JavaScript 靜態網站。2026-11-25 本輪只做 ES module 語法檢查與 `git diff --check`，沒有跑功能測試、瀏覽器操作或正式 Firebase 寫入。Spark 免費 Gemini 路線的 Firebase AI Logic 與 App Check 設定步驟見 [README.md](./README.md)；Console 設定由使用者操作。不要把 Gemini API Key 寫入前端或 Repo。

## 開發決策與注意事項

- 個人資料放在 `users/{uid}/...` 並由 Firestore Rules 再做存取限制，避免只依賴前端隱藏資料。
- Gemini 透過 Firebase AI Logic 代理呼叫；App Check 用於保護 Gemini API。使用者按鈕觸發後才傳送必要的任務／行程欄位。備註不傳送，建議不自動改動或寫回資料。
- XP 完成與復原使用 Firestore transaction 和完成紀錄；同一完成狀態不重複加分，復原後再次完成則再次加分；仍需實際測試。
- 登入流程曾遇手機登入後回到登入頁。近期調整了 iOS 與 Android 行動環境的登入方式，並修正登入狀態監聽不等待 redirect 結果；使用者後續回報登入成功。不要因此推定所有裝置與重新載入情境都已通過。
- 不要把學校 Gateway 憑證當成網站可用的 Gemini 憑證，也不要將 Gemini 私人 Key 放進前端或公開 Repo。
- 不修改 Firebase Console、Firestore 資料或規則，不部署、不 commit、不 push，除非使用者明確要求；變更外部雲端狀態前先說清楚動作。

## Firestore 容量與快照保存

- 截至 2026-11-25 查閱 Firebase 官方文件，Firestore Standard 免費額度為總儲存 1 GiB、每日 50,000 次文件讀取、20,000 次寫入、20,000 次刪除，以及每月 10 GiB 對外傳輸；每日額度約於太平洋時間午夜重設，每個 Firebase 專案只有一個資料庫享有免費額度。超過免費額度後是否產生費用取決於專案計費方案與用量，需在 Firebase Console 查看本專案實際方案／用量。官方資料：[定價與免費額度](https://firebase.google.com/docs/firestore/pricing)、[配額與限制](https://firebase.google.com/docs/firestore/quotas)。
- Standard Native Firestore 單份文件上限是 1 MiB。此專案每日快照把該日待辦及行程陣列存在同一份文件，因此單日內容增長可能先碰到單文件上限；快照目前沒有自動清除期限。以個人文字型資料來看，短期內較值得留意的是每日讀寫配額和單份快照文件大小，而不是只看總儲存容量；實際使用量尚未查 Console。
- 「查看更早以前的快照」面板預設收合，展開後查詢較早已保存日期，每頁最多顯示 12 筆；載入一頁會讀取該頁快照文件。只有按日期開啟時才另外讀取選中的快照（若已在記憶體快取則沿用）。不會自動刪除快照；從此清單瀏覽時，沒有保存的舊日期不會被目前資料補造。其他會修改過去資料的流程仍會先呼叫既有快照保護邏輯。

## 建議下一步（依優先順序）

1. **完成 localhost debug token 設定。** 目前 `script.js` 已只在 `localhost` 啟用 Firebase App Check debug 模式；重新載入頁面後 SDK 會在 DevTools 顯示 token。將它登記為 `Project A Web` 的 App Check debug token 前，需取得使用者在該安全性設定上的即時確認。正式 Pages 繼續使用 reCAPTCHA Enterprise。
2. **重測本機 Gemini 對話。** token 登記後用短訊息測試，須看到 API 成功回應及頁面回覆才算通過；重新載入登入中的本機頁可能觸發既有每日快照寫入流程。
3. **驗收 Gemini 今日／明日規劃擴充。** 確認未採用不寫入，採用後只更新選定待辦，固定行程不變；同時驗證資料改動後舊建議失效。
4. **驗收昨天／明天頁、歷史快照與現在時間標記。** 確認昨日唯讀、明日預排、無快照日期提示，以及跨現在標記只調整待辦排序。
5. **再決定 commit、push 和 Pages 部署。** 目前本機程式和文件有未提交變更；發布前先完成必要驗收並由使用者明確指示。

## 本次工作紀錄（2026-11-25）

- **本次完成事項：** 加入更早快照唯讀瀏覽面板、本機 App Check debug flag；新增待辦重要度「無／高／中／低」（預設無）與色標、清單新增日期、空白資訊行隱藏，以及加入今天時依目前時間標記插入最近位置。Gemini 規劃輸入增加重要度；只有明確指定高／中／低才參考權重。
- **驗證結果：** `node --check script.js` 與 `git diff --check` 通過；未做功能測試。Chrome localhost 仍載入舊版程式，當前舊版錯誤為 `401 Firebase App Check token is invalid`，新 debug flag 尚未驗證。重新載入會觸發現有每日快照寫入；登記 debug token 的影響已向使用者說明並等待即時確認。沒有改 Firestore／Console、commit、push 或部署。
- **尚未完成：** 等使用者回覆是否同意重新載入及登記 App Check debug token；完成後才可重測 localhost Gemini。重要度、時間點插入、清單日期與手機排版尚未瀏覽器驗收；正式 Pages 仍未部署本機變更。
- **下一步工作：** 先依使用者對 Firestore 快照寫入及 debug token 登記的回覆處理 Gemini 排查；再在本機驗收重要度顏色／編輯保存、清單新增日期、無資訊提示時的版面，以及加入今天後新待辦緊鄰現在標記且原排序不變。最後才由使用者決定是否 commit、push 或部署。
