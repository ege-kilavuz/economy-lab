# Batch Progress

## Batch 1 — Simülasyon motorlarını sağlamlaştırma
- Yapılan işler:
  - Ödeme akışında başarısız ödemelerin yanlışlıkla etki uygulamasını engelledim.
  - Fatura/kira ödemelerinde yalnızca başarılı ödeme sonrası `paid` durumunu işaretleyecek guard ekledim.
  - Oyun başlangıcı için opsiyonel `seed` desteği ekleyip motoru daha deterministik hale getirdim.
  - Month sim tip güvenliğini artırdım (`GameState` kullanımı, `any` azaltımı).
  - Build doğrulamasını açmak için iki küçük eski unused-var sorununu temizledim.
- Ana değişen dosyalar:
  - `src/game/engine.ts`
  - `src/game/types.ts`
  - `src/modules/monthSim.tsx`
  - `src/modules/interest.tsx`
  - `src/LearnScreen.tsx`
- Doğrulama:
  - `npm run build` ✅
  - `npm run lint` ⛔ Projede batch dışı mevcut lint borçları var; bu batchte temizlenmedi.
- Sıradaki batch:
  - Batch 2 — Öğrenme akışı ve görev tasarımı
