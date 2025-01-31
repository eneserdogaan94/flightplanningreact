# ✈️ Flight Planning React

Bu proje, **uçuş planlama ve yönetimi** amacıyla geliştirilmiş bir **React** uygulamasıdır.  
Kullanıcılar ve yöneticiler, uçuşları listeleyebilir, filtreleyebilir ve yönetebilir.  

🚀 **Admin** kullanıcıları uçuş ekleyebilir ve listeleyebilir.  
👤 **Kullanıcılar** kendilerine uygun uçuşları filtreleyerek görüntüleyebilir.

---

## 📌 **Özellikler**
- 🔐 **Yetkilendirme & Kimlik Doğrulama**
  - Kullanıcı ve Admin giriş yapabilir.
  - Yetkilendirme **JWT Token** ile sağlanır.

- ✈️ **Uçuş Yönetimi**
  - Uçuşları listeleme, detayları görüntüleme.
  - **Filtreleme:** Kalkış şehri, varış şehri ve tarih bazlı dinamik filtreleme.
  - **Renk Kodları:** 
    - **🔴 Kırmızı:** Geçmiş uçuşlar
    - **🟠 Turuncu:** Yaklaşan uçuşlar (3 gün içinde)
    - **🔵 Mavi:** 3 günden sonraki uçuşlar

- 🎛 **Admin Paneli**
  - Adminler yeni uçuş ekleyebilir.
  - **30 dakikalık kural** kontrol edilir (aynı şehirde çakışan uçuşlar engellenir).

- ⚡ **Pagination & Responsive Tasarım**
  - Sayfa başına uçuş gösterimini belirleyebilirsiniz.
  - **Material UI** ile modern ve şık arayüz.

---

## 🛠 **Kurulum**
### **1️⃣ Gerekli Bağımlılıkları Yükleyin**
Öncelikle projenin bağımlılıklarını yükleyin:
```bash
npm install

2️⃣ Çevre Değişkenlerini (Environment Variables) Ayarlayın
REACT_APP_API_URL değişkenini .env dosyasına ekleyin:
REACT_APP_API_URL=http://localhost:8080/api

3️⃣ Projeyi Çalıştırın
Projeyi geliştirme modunda başlatın:
npm start
Tarayıcıdan http://localhost:3000 adresine giderek uygulamayı görüntüleyebilirsiniz.

🚀 Kullanım
1️⃣ Kullanıcı Girişi
Kullanıcılar Kullanıcı Adı & Şifre ile giriş yapar.
Başarıyla giriş yaptıktan sonra:
Adminler → /admin-home sayfasına yönlendirilir.
Kullanıcılar → /user-home sayfasına yönlendirilir.
2️⃣ Uçuş Listesi & Filtreleme
Filtreleme seçenekleri:
✈️ Kalkış Şehri
🌍 Varış Şehri
🗓 Tarih
Filtreler dinamik olarak çalışır, ayrı bir butona gerek yoktur.
"Temizle" butonu ile tüm filtreler sıfırlanır.
3️⃣ Uçuş Ekleme (Admin)
Adminler /admin-home/add-flight sayfasında yeni uçuş ekleyebilir.
Uçuş planlaması kuralları otomatik olarak kontrol edilir.
Aynı şehirde 30 dakika içinde iniş/kalkış çakışması olamaz.
Kalkış saati geçmişte olamaz.
Kalkış ve varış havalimanı aynı olamaz.
