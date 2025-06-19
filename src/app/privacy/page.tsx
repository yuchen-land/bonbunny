export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">隱私權政策</h1>

      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. 資料收集</h2>
          <div className="space-y-4 text-muted">
            <p>
              我們收集的個人資料包括但不限於：
            </p>
            <ul className="list-disc pl-6">
              <li>姓名</li>
              <li>聯絡電話</li>
              <li>電子郵件地址</li>
              <li>配送地址</li>
              <li>購物紀錄</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. 資料使用</h2>
          <div className="space-y-4 text-muted">
            <p>我們使用您的個人資料於：</p>
            <ul className="list-disc pl-6">
              <li>處理您的訂單</li>
              <li>提供客戶服務</li>
              <li>發送訂單狀態更新</li>
              <li>提供個人化的購物體驗</li>
              <li>寄送行銷資訊（經您同意後）</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. 資料保護</h2>
          <div className="space-y-4 text-muted">
            <p>
              我們採取適當的技術和組織措施來保護您的個人資料，包括：
            </p>
            <ul className="list-disc pl-6">
              <li>使用加密技術保護資料傳輸</li>
              <li>定期更新安全系統</li>
              <li>限制員工訪問個人資料</li>
              <li>定期進行安全審核</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Cookie 使用</h2>
          <div className="space-y-4 text-muted">
            <p>
              我們使用 cookie 來改善您的購物體驗。Cookie 可能收集：
            </p>
            <ul className="list-disc pl-6">
              <li>購物車內容</li>
              <li>瀏覽歷史</li>
              <li>登入狀態</li>
              <li>網站偏好設定</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. 第三方分享</h2>
          <p className="text-muted">
            我們不會將您的個人資料販售給第三方。但在以下情況下可能會分享您的資料：
          </p>
          <ul className="list-disc pl-6 mt-4 text-muted">
            <li>物流公司（用於配送目的）</li>
            <li>支付服務提供商（用於處理付款）</li>
            <li>依法律要求必須提供時</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. 您的權利</h2>
          <div className="space-y-4 text-muted">
            <p>根據個人資料保護法，您有權：</p>
            <ul className="list-disc pl-6">
              <li>查詢或請求閱覽個人資料</li>
              <li>請求製給複製本</li>
              <li>請求補充或更正個人資料</li>
              <li>請求停止蒐集、處理或利用個人資料</li>
              <li>請求刪除個人資料</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. 聯絡我們</h2>
          <p className="text-muted">
            如對本隱私權政策有任何疑問，請聯絡我們：<br />
            電話：02-2345-6789<br />
            電子郵件：service@bonbunny.com<br />
            地址：台北市大安區甜點街123號
          </p>
        </section>
      </div>
    </div>
  );
}
