# 團隊中的 OpenSpec

其他指南中的所有內容，無論你是獨自開發還是加入二十人的團隊都適用。團隊使用時唯一的不同，是邊緣場景的問題：規格文件要存放在哪裡、隊友如何審查方案，以及這些流程如何融入我們既有的 Pull Request 工作流？

簡單來說：一次變更僅僅是一堆檔案，OpenSpec 永遠不會碰觸 Git。因此它能融入你既有的工作流，而非取代它。本頁說明經過驗證的適用慣例。

## 唯一規則：OpenSpec 不會碰觸 Git

OpenSpec 僅讀寫 `openspec/` 目錄下的純 Markdown 檔案。它永遠不會對你的專案執行提交、建立分支、推送或拉取操作，也不會自行克隆或同步 [store](stores-beta/user-guide.md)。這代表：

- **你可以像提交其他原始碼一樣提交 `openspec/` 目錄**。規格文件、進行中的變更以及歸檔內容都屬於專案歷史的一部分。（沒錯，請提交整個資料夾——詳見 [FAQ](faq.md#should-i-commit-the-openspec-folder-to-git)。）
- **一次變更就是一個可像程式碼一樣進行版本控制的資料夾**。`openspec/changes/add-dark-mode/` 本質上就是分支上的一堆檔案。
- **以下所有內容都是慣例，而非強制要求**。OpenSpec 不會強制你遵循這些做法，只是這些方式能無縫融入既有流程。

## 日常開發循環

能良好運作的工作流會將一次變更對應到一個分支和一個 Pull Request：

```
git switch -c add-dark-mode        start a branch, as usual
   │
/opsx:propose add-dark-mode        draft the plan (proposal + specs + tasks)
   │
REVIEW THE PLAN                    you read it before any code — see Reviewing a Change
   │
/opsx:apply                        build it; artifacts + code change together
   │
git commit && open a PR            the PR contains the spec delta AND the code
   │
teammate reviews, merges
   │
/opsx:archive                      fold the delta into specs/, move the change to archive/
```

方案和程式碼並存於同一個分支中，因此隊友可以同時審查兩者；六個月後歸檔的規格文件仍然能解釋程式碼為何是現在的模樣。

## 在 Pull Request 中審查規格文件

這是團隊能感受到價值的地方。當 PR 包含變更的差異規格時，審查者能在閱讀任何一行程式碼之前，就獲得原始差異檔永遠無法提供的東西：**用白話文闡述本次變更預期實現的功能**。

審查者推薦的審查順序：
1. **閱讀 `proposal.md`** —— 本次要解決的問題和範圍是否正確？
2. **閱讀 `specs/` 下的差異規格** —— 「完成」的定義是否準確？（這就是 [審查變更](reviewing-changes.md) 中的兩分鐘快速審查，現在在 PR 中完成即可。）
3. **再閱讀程式碼差異** —— 程式碼是否完全符合這些需求？

如果審查者不同意本次*實作方案*，可以直接在方案文件下方提出異議，成本極低，不用再針對 300 行程式碼重新爭論。請將差異規格放在 PR 描述的最上方，或指引審查者前往變更資料夾，讓他們從規格開始審查。

## 何時歸檔

歸檔操作會將變更的差異內容合併到主要的 `openspec/specs/` 目錄中，並將變更資料夾移動到 `openspec/changes/archive/YYYY-MM-DD-<name>/`。由於 `specs/` 是**團隊共享的權威來源**，歸檔時機在團隊協作中非常重要。有兩種可行的慣例：

- **PR 合併後再歸檔（推薦）**。分支上會保留進行中的變更；一旦變更合併到主分支，即可在該處執行歸檔（通常是一個極小的後續提交，或是排程清理任務）。這樣能確保共享的 `specs/` 只隨著實際上線的內容同步更新。
- **在 PR 內部完成歸檔**。對小型團隊更簡單：新增程式碼的同一份 PR 同時執行同步和歸檔。缺點是 `specs/` 的差異和程式碼差異會一起提交，可能讓 PR 內容更雜亂。

選擇其中一種方式並保持一致。無論採用哪種，`/opsx:archive` 都會檢查任務是否全部完成，並優先提示同步，避免有未完成的內容意外合併。

## 兩人並行開發多個變更

由於每個變更都是獨立的資料夾，因此不會發生衝突：

- **不同變更、不同開發者——完全沒問題**。`add-dark-mode` 和 `rate-limit-login` 是不同分支上的獨立資料夾；在兩者都完成歸檔前，永遠不會互相干擾。
- **一個變更對應一位負責人**。兩人同時編輯同一個變更資料夾時，會出現和兩人同時編輯同一份檔案完全相同的衝突。請確保一個變更只有單一作者，或是將其拆分為兩個變更（這也是[適度調整變更規模](writing-specs.md#right-size-the-change)的另一個原因）。
- **唯一可能出現衝突的地方是 `specs/`**。如果兩個變更同時修改了*同一項需求*，歸檔第二個變更時會在 `openspec/specs/…/spec.md` 產生衝突——請像處理其他合併衝突一樣解決它，保留符合實際情況的需求。這種情況非常少見，而且這正是 Git 的設計特性：它告訴你兩個變更對系統的行為產生了分歧。

## 當規劃需求超出單一專案範圍

以上所有內容都預設方案存放在程式碼專案自身的 `openspec/` 資料夾中，這也是正確的預設設定。當你的規劃確實橫跨多個專案或團隊時——例如單一功能涉及三個服務，或是需求由一個團隊擁有、其他團隊消費——這時就可以使用測試版的 **stores** 功能：規劃會有自己獨立的專案，任何程式碼專案都可以指向它。請先閱讀 [Stores 使用者指南](stores-beta/user-guide.md)。

## 下一步閱讀

- [審查變更](reviewing-changes.md) —— 現在可以在 PR 內完成的審查流程。
- [撰寫優質規格文件](writing-specs.md) —— 包含如何適度調整變更規模，使其符合單一分支的開發節奏。
- [Stores 使用者指南](stores-beta/user-guide.md) —— 橫跨多個專案與團隊的規劃方式。