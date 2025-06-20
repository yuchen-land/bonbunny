export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">服務條款</h1>

      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. 總則</h2>
          <p className="text-muted mb-4">
            歡迎使用 BonBunny
            線上訂購平台（以下簡稱「本網站」）。當您使用本網站時，
            即表示您同意遵守本服務條款的所有規定。本公司保留隨時修改本條款的權利。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. 會員服務</h2>
          <div className="space-y-4 text-muted">
            <p>
              2.1 您必須年滿18歲或在父母或監護人的監督下才能使用本網站服務。
            </p>
            <p>
              2.2
              您有責任維護您的帳號和密碼的安全性，且對使用該帳號進行的所有活動負責。
            </p>
            <p>2.3 如發現任何未經授權使用您帳號的情況，請立即通知我們。</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. 訂購與付款</h2>
          <div className="space-y-4 text-muted">
            <p>3.1 所有商品價格均以新台幣計價，且已含稅。</p>
            <p>3.2 訂單送出後將立即進行扣款程序。</p>
            <p>3.3 本公司保留接受或拒絕訂單的權利。</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. 配送政策</h2>
          <div className="space-y-4 text-muted">
            <p>4.1 本公司提供全台灣配送服務。</p>
            <p>4.2 配送時間可能因天氣、交通等因素而有所變動。</p>
            <p>4.3 商品送達時，請確認商品狀況後再簽收。</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. 退換貨政策</h2>
          <div className="space-y-4 text-muted">
            <p>5.1 食品安全衛生考量，除商品瑕疵外，恕不接受退換貨。</p>
            <p>5.2 商品瑕疵請於收到商品後24小時內通知我們。</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. 智慧財產權</h2>
          <div className="space-y-4 text-muted">
            <p>
              6.1 本網站所有內容，包括但不限於文字、圖片、標誌、設計等，
              均為本公司所有，受智慧財產權法保護。
            </p>
            <p>6.2 未經本公司書面許可，禁止任何形式的複製或使用。</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. 免責聲明</h2>
          <div className="space-y-4 text-muted">
            <p>
              本公司不對任何間接、附帶或衍生性損害承擔責任，包括但不限於利潤損失、
              商譽損失、資料損失等。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. 聯絡我們</h2>
          <p className="text-muted">
            如對本服務條款有任何疑問，請聯絡我們：
            <br />
            電話：02-2345-6789
            <br />
            電子郵件：service@bonbunny.com
          </p>
        </section>
      </div>
    </div>
  );
}
