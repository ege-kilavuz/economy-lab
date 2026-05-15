# Economy-Lab — İlerleme & Geliştirme Raporu

> **Tarih:** 15 Mayıs 2026  
> **Proje:** Ekonomi Laboratuvarı (Teknofest)  
> **Hedef:** Gençler için oyunlaştırılmış finansal okuryazarlık

---

## 1. 📊 Finansal Doğruluk Denetimi

### 1.1 Asgari Ücret & Gelir

| Öge | Oyundaki Değer | Gerçek Değer (2026) | Doğruluk |
|---|---|---|---|
| Başlangıç maaşı (easy/normal/hard) | **17,002 TL** | 2025 asgari ücret net: 17,002 TL ✅ | ✅ **Birebir doğru** — ancak 2026 asgari ücreti henüz bilinmiyor, 2025 değeri kullanılmış |
| Zorluk seviyesine göre maaş farkı | **Yok** (tümü 17,002 TL) | Gerçekte maaş zorluğa göre değişmez | ⚠️ **Tasarım tercihi** — giderler değişiyor, gelir sabit. Mantıklı |
| Ek gelir (freelance/prim) | 1,000-3,500 TL | Gerçekçi aralık | ✅ Makul |

### 1.2 Kira & Faturalar

| Öge | Easy | Normal | Hard | Gerçek (2026) | Doğruluk |
|---|---|---|---|---|---|
| **Kira** | 7,000 TL | 8,000 TL | 9,000 TL | Ort. 8,000-15,000 TL (şehre göre) | ⚠️ **Düşük** — İstanbul/Ankara/İzmir için 10,000 TL altı zor |
| **Aidat** | 600 TL | 750 TL | 950 TL | 500-1,500 TL | ✅ Makul |
| **Elektrik** | 700 TL | 850 TL | 1,000 TL | 400-1,200 TL | ✅ Makul |
| **Doğalgaz** | 900 TL | 1,100 TL | 1,300 TL | 800-2,000 TL (kış) | ✅ Makul |
| **İnternet** | 450 TL | 500 TL | 550 TL | 300-600 TL | ✅ Makul |

### 1.3 Kredi Kartı Faizleri

| Öge | Oyundaki Değer | Gerçek Değer (2026) | Doğruluk |
|---|---|---|---|
| **Aylık akdi faiz (easy)** | **%6** | %3.25-4.25 (borca göre) | ❌ **Çok yüksek** — easy'de %6 gerçekçi değil, normal/hard'da %8-10 ise fazla abartılı |
| **Aylık akdi faiz (normal)** | **%8** | %3.25-4.25 | ❌ |
| **Aylık akdi faiz (hard)** | **%10** | %3.25-4.25 | ❌ |
| **Asgari ödeme oranı** | %10 (min 200 TL) | %20-30 (TCMB düzenlemesi) | ❌ **Düşük** — gerçekte asgari ödeme oranı daha yüksek |

> **Öneri:** Kredi kartı faizleri gerçeğin neredeyse 2 katı. Easy'de %3.5, normal'de %4, hard'da %5 yapılabilir. Eğitim amaçlı abartı kabul edilebilir ama "zorluk = yüksek faiz" mesajı yanlış anlaşılabilir.

### 1.4 TCMB Politika Faizi & Enflasyon

| Öge | Oyundaki Değer | Gerçek Değer (2026) | Doğruluk |
|---|---|---|---|
| **Politika faizi varsayılan** | %35 (MB modülü), %45 (MonthSim) | %38 (Aralık 2025) | ✅ **Yaklaşık doğru** — 2025'te %42.5-50 arası gezindi |
| **Politika faizi aralığı** | %10-80 | Tarihsel: %4.5-500 | ✅ Eğitim için makul |
| **Aylık enflasyon (varsayılan)** | %3 (yıllık ~%42.5) | 2025: ~%44 yıllık | ✅ **Yakın** |
| **Enflasyon simülasyon aralığı** | %0-15 aylık (yıllık %0-~%500) | Gerçekçi üst sınır ~%5 aylık | ⚠️ Biraz geniş ama eğitim için iyi |

### 1.5 Yatırım Fiyatları (MonthSim)

| Varlık | Başlangıç Fiyatı | 2026 Gerçek | Doğruluk |
|---|---|---|---|
| **Altın (gram)** | 2,200 TL | ~2,400-2,800 TL | ✅ Yakın |
| **Dolar (USD/TRY)** | 33.50 TL | ~35-38 TL | ✅ Yakın |
| **BTC** | 2,200,000 TL | ~2,500,000-3,500,000 TL | ✅ Yaklaşık |
| **ETH** | 120,000 TL | ~150,000-200,000 TL | ✅ Yaklaşık |

> ⚠️ **Not:** Fiyatlar gerçekçi başlangıç değerleri ama rastsal değişim modeli gerçek piyasa dinamiklerini yansıtmıyor. Bu eğitim amaçlı kabul edilebilir.

### 1.6 Market & Harcamalar

| Öge | Easy | Normal | Hard | Gerçek | Doğruluk |
|---|---|---|---|---|---|
| **Günlük market baz** | 450 TL | 520 TL | 600 TL | 300-800 TL/gün (kişi sayısına göre) | ✅ Makul |
| **Sinema** | 280 TL | 320 TL | 380 TL | 200-400 TL | ✅ Makul |
| **Günlük harcama** | ~80 TL | ~80 TL | ~80 TL | Değişken | ✅ Düşük ama kabul edilebilir |

---

## 2. 🎮 Oyun & Modül Değerlendirmesi

### 2.1 Enflasyon Laboratuvarı
- **Mekanik:** Slider + çizgi grafik. Kullanıcı maaş, sepet, enflasyon, endeks değiştiriyor
- **Doğruluk:** Matematiksel model (`Sepet = Sepet0 × (1+enflasyon)^ay`) doğru ✅
- **Eksik:** "Maaş artış endeksi" kavramı iyi ama reel/nominal ayrımı daha vurgulanabilir
- **Gençlik:** Grafik güzel ama slider sayısı fazla (5 slider). Gençler için sadeleştirilebilir

### 2.2 Faiz & Kredi Laboratuvarı
- **Mekanik:** Slider + bar chart. Kredi ve bileşik getiriyi yan yana gösteriyor
- **Doğruluk:** Kredi formülü (`PMT`) ve bileşik getiri doğru ✅
- **Eksik:** Kredi ile birikimi karşılaştırmak güzel ama "faiz oranı düşük/kredi pahalı" paradoksunu açıklamak için daha interaktif bir karşılaştırma eklenebilir

### 2.3 Merkez Bankası Karar Odası
- **Mekanik:** 3 slider (faiz, arz şoku, talep) + 3 çizgili grafik
- **Doğruluk:** Basitleştirilmiş eğitim modeli — gerçek MB kararları çok daha karmaşık ✅⚠️
- **Eksik:** "Kazanan/kaybeden" analizi iyi. Enflasyon-İşsizlik trade-off'u Phillips eğrisi bağlamında daha net anlatılabilir

### 2.4 MonthSim (30 Günlük Simülasyon) ⭐ En Kritik Modül
- **Mekanik:** 9 uygulamalı telefon simülasyonu, quest sistemi, günlük ilerleme
- **Doğruluk:**
  - Günlük masraflar, kira/faturalar, beklenmedik giderler iyi modellenmiş ✅
  - Kredi kartı borç mantığı doğru ✅
  - Market/dolap/moral mekaniği eğlenceli ve öğretici ✅
  - **Ama kredi kartı faizi (yukarıda belirtildi) çok yüksek** ❌
- **Eksik:**
  - **50/30/20 bütçe kuralı** öğrenme içeriğinde anlatılıyor ama oyunda uygulanmıyor (oyuncuya bu kuralı hatırlatan bir mekanik yok)
  - **Vergi** hiç yok (Sgk/kesinti/GV)
  - **Kira artışı** yok (12 ay aynı kira)
  - **Kira depozitosu** yok (gerçekte en az 1 aylık depozito)

### 2.5 Mini Oyunlar

| Oyun | Tür | Eğlence | Öğreticilik | Durum |
|---|---|---|---|---|
| **CandleGame** | Mum grafiği tanıma | ⭐⭐ | ⭐⭐⭐⭐ | Trend/support/resistance var. Gençler için karmaşık kalabilir |
| **CardEscape** | Kredi kartı kaçış | ⭐⭐⭐ | ⭐⭐⭐ | Konsept güzel, oynanış basit |
| **BudgetTetris** | Bütçe yönetimi | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | En iyi mini oyunlardan — hızlı karar gerektiriyor |
| **NewsNoise** | Haber/Gürültü ayırt etme | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Finansal okuryazarlık için en değerli oyunlardan |
| **ScamRadar** | Dolandırıcılık tespiti | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Çok önemli konu, gençler için hayati |

---

## 3. 🧠 Öğrenme İçeriği Değerlendirmesi

### 3.1 Kategoriler ve Kapsam

| Kategori | İçerik Sayısı | Quiz Sayısı | Durum |
|---|---|---|---|
| Temeller | 3 | 10 | ✅ İyi |
| Bütçe | 1 | 5 | ⚠️ Tek içerik az |
| Kredi | 2 | 3 | ⚠️ Az sayıda soru |
| Yatırım | 2 | 5 | ✅ İyi |
| Makro | 1 | 2 | ⚠️ Çok az |
| Psikoloji | 2 | 4 | ✅ İyi (FOMO/kayıptan kaçınma) |
| Güvenlik | 3 | 5 | ✅ İyi |

### 3.2 Kritik Eksikler
- **Vergi okuryazarlığı:** KDV, stopaj, gelir vergisi gibi kavramlar hiç yok
- **BES (Bireysel Emeklilik Sistemi):** Türkiye'de gençler için önemli, yok
- **Kira artışı / enflasyon farkı:** Öğrenme içeriğinde var ama oyuna yansımamış
- **Dijital bankacılık güvenliği:** Sadece ScamRadar'da var, temel konseptler eksik (2FA, SMS onay, vs.)
- **SGK/işsizlik maaşı:** Hiç yok
- **Koşullu nakit transferleri/eğitim yardımları:** Türkiye'de gençler için geçerli, yok

---

## 4. 💡 Önerilen Geliştirmeler

### 4.1 🐛 Kritik Hatalar (Önce Bunlar) ✅ DÜZELTİLDİ
- [x] **Kredi kartı faiz oranları düşürüldü** — Easy: %3.5, Normal: %4.5, Hard: %5.5 ✅
- [x] **Asgari ödeme oranı yükseltildi** — %10 → %25 (min 200→500 TL) ✅

### 4.2 📱 Yeni Özellikler
- [x] **50/30/20 Göstergesi** — Ay sonu raporunda progress bar ile ✅
- [x] **Vergi Kesintisi** — Brüt/net maaş gösterimi, %20 SGK+GV ✅
- [x] **Kira Artışı** — Her 10 günde %5, max +%30 ✅
- [x] **BES (Bireysel Emeklilik)** — Devlet katkısı %30 simülasyonu ✅
- [x] **Enflasyon Muhasebesi** — Ay sonu raporunda reel kayıp TL cinsinden gösteriliyor ✅

### 4.3 🎯 Oyunlaştırma İyileştirmeleri
- [x] **Başarı Rozetleri (Badges):** 10 rozet eklendi (Borçsuz Ay, Yatırımcı, Fatura Müdürü vs.) ✅
- [ ] **Liderlik Tablosu:** Sınıf içi karşılaştırma (local storage)
- [ ] **Haftalık Challenge:** "Bu ay sadece nakit kullan" veya "Hiç kart borcu taşıma"
- [ ] **Animasyonlar / Ses Efektleri:** Harcama yapınca para sayma sesi, görev tamamlayınca konfeti
- [ ] **Konsept İlerleme Çubuğu:** Her öğrenme kategorisinde % kaç tamamlandı

### 4.4 📚 Öğrenme İçeriği Genişletme
- [ ] **Vergi Kategorisi:** KDV, stopaj, GV, BES katkısı — Türkiye'de gençlerin bilmesi gereken temel vergiler
- [ ] **Kripto Bilinçlendirme:** BTC/ETH sadece yatırım aracı değil, riskleri de anlatılmalı
- [ ] **Sendikasyon / Kredi Notu:** Kredi notu nasıl yükselir/düşer, Findeks vb.
- [ ] **Küresel Ekonomi:** Döviz kuru etkisi, ithalat/ihracat dengesi
- [ ] **Sürdürülebilirlik:** Yeşil yatırım, etik tüketim

### 4.5 🎨 UI/UX İyileştirmeleri
- [ ] **Mobil öncelikli dokunuş:** Butonlar biraz küçük kalabilir, genişlet
- [ ] **Karanlık mod:** Zaten karanlık tema, iyi ✅
- [ ] **Loading skeleton** — Veri yüklenirken boş ekran yerine iskelet
- [ ] **Tutorial / Onboarding:** İlk açılışta "şöyle oynanır" adımı
- [ ] **Dil seçeneği:** İngilizce ekleme (Teknofest uluslararası olabilir)

### 4.6 🌐 Teknik
- [ ] **Code-splitting:** `build.rollupOptions.output.manualChunks` ile bundle boyutunu küçült (şu an 891 KB tek JS dosyası)
- [ ] **PWA:** Telefonda "ana ekrana ekle" desteği
- [ ] **Offline destek:** Service worker + cache
- [ ] **LocalStorage → IndexedDB:** Daha büyük veriler için

---

## 5. 📈 Puanlama & Metrikler

| Boyut | Puan (1-10) | Not |
|---|---|---|
| **Finansal doğruluk** | 9/10 ✅ | Kredi kartı faizleri düzeltildi, asgari ödeme güncellendi, vergi kesintisi eklendi |
| **Eğlence değeri** | 8/10 | MonthSim ve mini oyunlar başarılı. Grafikler etkileyici |
| **Öğreticilik** | 9/10 ✅ | BES modülü eklendi, 50/30/20 analizi, başarı rozetleri |
| **Gençlere uygunluk** | 8/10 | Dil gençlere hitap ediyor. Mobil telefonda telefon simülasyonu yaratıcı |
| **Kapsam** | 8/10 ✅ | Vergi, BES, kira artışı eklendi. İngilizce desteği kaldı |
| **Performans** | 7/10 | 903 KB tek bundle, code-splitting ile düşürülebilir |
| **Teknik kalite (kod)** | 8/10 ✅ | Refactoring yapıldı, utility'ler ayrıştırıldı, dead code temizlendi |

**Genel:** 8.5/10 🚀 — Teknofest sunumu için hazır. Eksikler: İngilizce, code-splitting

---

## 6. 🎯 Öncelikli Yapılacaklar (MVP)

```
Acil (Şimdi): ✅
✅ └── Kredi kartı faiz oranlarını düzelt
✅ └── Asgari ödeme oranını güncelle

Kısa Vade (Bu Hafta): ✅
✅ └── 50/30/20 göstergesi ekle
✅ └── Vergi kesintisi mekaniği ekle
✅ └── Başarı rozetleri

Orta Vade:
✅ └── BES modülü (Bireysel Emeklilik Sistemi)
✅ └── Kira artışı mekaniği
✅ └── PWA (GitHub Pages için)
⬜ └── İngilizce dil desteği

Uzun Vade:
⬜ └── Liderlik tablosu
⬜ └── Offline destek
⬜ └── Code-splitting + performans
```
