# Batch Progress

## Batch 1 — Simülasyon motorlarını sağlamlaştırma
- Yapılanlar:
  - Başarısız ödeme durumlarında yanlış state güncellemelerini engelleyen guard'lar eklendi.
  - Kira/fatura akışında yalnızca başarılı ödeme sonrası `paid` işaretleme korunacak şekilde ayrım netleştirildi.
  - Oyun başlangıcına opsiyonel `seed` desteği eklendi; günlük görev ve akış daha deterministik hale geldi.
  - Sim motoru dosyaları ayrıştırıldı (`lifeSimEngine`, `dailySimulation`) ve tip güvenliği güçlendirildi.
- Ana dosyalar:
  - `src/game/engine.ts`
  - `src/game/lifeSimEngine.ts`
  - `src/game/dailySimulation.ts`
  - `src/game/types.ts`
- Doğrulama:
  - `npm run build`
- Commitler:
  - `be20369` `economy-lab: batch 1 sim engine hardening`
  - `1e8e3eb` `economy-lab: batch 1 modularize life sim engine`
  - `fa628c8` `economy-lab: batch 1 extract daily sim helpers`
- Sıradaki batch:
  - Batch 2

## Batch 2 — Öğrenme akışı ve görev tasarımı
- Yapılanlar:
  - Öğrenme ekranına önerilen öğrenme yolu ve kategori bazlı ilerleme özeti eklendi.
  - Quiz bitişinde sonraki önerilen kategori akışı görünür yapıldı.
  - Öğrenme kartları ve soru havuzları çeşitlendirilerek tekrar eden placeholder içerik azaltıldı.
- Ana dosyalar:
  - `src/LearnScreen.tsx`
  - `src/learn/content.ts`
- Doğrulama:
  - `npm run build`
- Commitler:
  - `012d194` `economy-lab: batch 2 learning flow`
- Sıradaki batch:
  - Batch 3

## Batch 3 — UI/UX ve görsel anlatım
- Yapılanlar:
  - Oyna sekmesine bağlamsal açıklama ve aktif mod özeti eklendi.
  - Simülasyon kartlarına seviye, format ve "en iyi kullanım" etiketleri eklendi.
  - Simülasyon ekranına hızlı seçim rehberi kartı eklendi.
- Ana dosyalar:
  - `src/App.tsx`
  - `src/SimulationsScreen.tsx`
- Doğrulama:
  - `npm run build`
- Commitler:
  - `31e9b2b` `economy-lab: batch 3 improve play navigation`
- Sıradaki batch:
  - Batch 4

## Batch 4 — Senaryo kütüphanesi ve içerik doğruluğu
- Yapılanlar:
  - Öğrenme ekranına sınıf içi kullanıma uygun vaka kartlarından oluşan senaryo kütüphanesi eklendi.
  - Senaryolar ilgili öğrenme kategorilerine bağlandı; kullanıcı doğrudan ilişkili içeriğe geçebiliyor.
  - İçerik anlatımı nominal/reel gelir, acil fon, asgari ödeme ve faiz kararı gibi temel başlıklarda daha öğretilebilir hale getirildi.
- Ana dosyalar:
  - `src/LearnScreen.tsx`
  - `src/learn/scenarios.ts`
- Doğrulama:
  - `npm run build`
- Commitler:
  - `edd8e0b` `economy-lab: batch 4 add scenario library`
- Sıradaki batch:
  - Batch 5

## Batch 5 — Ölçümleme ve geri bildirim altyapısı
- Yapılanlar:
  - Quiz tamamlanma durumu ve açılan laboratuvarlar localStorage tabanlı ilerleme katmanına alındı.
  - Öğrenme ekranında ilerleme ritmine göre hafif geri bildirim etiketi eklendi.
  - Simülasyon ekranında açılan laboratuvar sayısı ve son oyun tarihi görünür hale getirildi.
- Ana dosyalar:
  - `src/LearnScreen.tsx`
  - `src/SimulationsScreen.tsx`
  - `src/ui/progress.ts`
- Doğrulama:
  - `npm run build`
- Commitler:
  - `04eb329` `economy-lab: batch 5 add progress feedback`
- Sıradaki batch:
  - Batch 6

## Batch 6 — Test ve kalite
- Yapılanlar:
  - Ayrı `typecheck` script'i eklendi.
  - Sim motoru için seed, ödeme guard'ı, kart borcu ve gün ilerleme davranışlarını doğrulayan smoke test eklendi.
  - TypeScript test çalıştırmak için hafif `tsx` bağımlılığı eklendi.
- Ana dosyalar:
  - `package.json`
  - `package-lock.json`
  - `scripts/engine-smoke.ts`
- Doğrulama:
  - `npm run typecheck`
  - `npm run test:smoke`
- Commitler:
  - `daa4c9c` `economy-lab: batch 6 add engine smoke checks`
- Sıradaki batch:
  - Batch 7

## Batch 7 — Öğretmen / sınıf modu
- Not:
  - Repo'da gerçek sınıf yönetimi / roster / backend olmadığı için en yakın teknik karşılık seçildi: öğretmen sunum modlu rehber akış.
- Yapılanlar:
  - Simülasyon ekranına aç/kapatılabilir öğretmen modu eklendi.
  - Her laboratuvar için sınıf içi tartışma soruları ve debrief/kapanış cümlesi tanımlandı.
  - Seçili laboratuvar açıldığında öğretmen modu özet kartı gösterilmeye başlandı.
- Ana dosyalar:
  - `src/SimulationsScreen.tsx`
- Doğrulama:
  - `npm run build`
  - `npm run test:smoke`
- Commitler:
  - `4c0cd10` `economy-lab: batch 7 add teacher mode prompts`
- Sıradaki batch:
  - Tüm mevcut batch'ler tamamlandı
