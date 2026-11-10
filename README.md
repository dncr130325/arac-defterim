# Araç Defterim

Aracın muayene, trafik sigortası, kasko, MTV, egzoz emisyon ve bakım tarihlerini takip eden Android uygulaması. Tarih yaklaşınca bildirim gönderir; kayıtlar telefonda saklanır, ayarlar ekranından yedek alınır.

## APK'yı indirme

Sağ taraftaki **Releases** bölümünden en yeni sürümü aç ve `.apk` dosyasını telefonuna indir.
Android "bilinmeyen kaynaklardan yükleme" izni isterse, tarayıcına bu izni ver.

## iPhone (ücretsiz web sürümü)

iPhone'da Safari ile https://dncr130325.github.io/arac-defterim/app/ adresini aç,
Paylaş › Ana Ekrana Ekle de. Hatırlatmalar için uygulamada Ayarlar › Takvime ekle.
Web sürümü `docs/app` klasöründedir; güncellemek için `npm run web`.

## Yeni sürüm

`main` dalına yapılan her değişiklikten sonra GitHub Actions yeni bir APK derler ve Releases'e ekler.
Uygulamanın web kısmı `www/index.html` dosyasındadır.
