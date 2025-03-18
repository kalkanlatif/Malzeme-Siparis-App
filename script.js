// Ürünler için veri modeli
class Urun {
    constructor(ad, miktar = 0, tur = "Genel") {
        this.ad = ad;
        this.miktar = miktar;
        this.tur = tur;
    }
  }
  
  // Yerel depolama yönetimi
  const Depolama = {
    kaydetUrunler(urunler) {
        localStorage.setItem('urunler', JSON.stringify(urunler));
    },
    yukleUrunler() {
        const kaydedilen = localStorage.getItem('urunler');
        return kaydedilen ? JSON.parse(kaydedilen).map(u => new Urun(u.ad, u.miktar, u.tur)) : [
            new Urun("Cola", 0, "Getränk"),
            new Urun("Fanta", 0, "Getränk"),
            new Urun("Ayran", 0, "Getränk"),
            new Urun("Tavuk Döner", 0, "Döner Zutaten"),
            new Urun("Dana Döner", 0, "Döner Zutaten"),
            new Urun("Mozzarella", 0, "Pizza Zutaten"),
            new Urun("Sucuk", 0, "Pizza Zutaten"),
            new Urun("Domates", 0, "Gemüse"),
            new Urun("Salatalık", 0, "Gemüse"),
            new Urun("Dondurma", 0, "Gefrorene Zutaten")
        ];
    },
    kaydetSiparis(siparis) {
        let siparisGecmisi = JSON.parse(localStorage.getItem('siparisGecmisi')) || [];
        siparisGecmisi.push(siparis);
        localStorage.setItem('siparisGecmisi', JSON.stringify(siparisGecmisi));
    },
    yukleSiparisGecmisi() {
        return JSON.parse(localStorage.getItem('siparisGecmisi')) || [];
    },
    siparisSil(index) {
        let siparisGecmisi = JSON.parse(localStorage.getItem('siparisGecmisi')) || [];
        siparisGecmisi.splice(index, 1);
        localStorage.setItem('siparisGecmisi', JSON.stringify(siparisGecmisi));
    },
    gecmisiSil() {
        localStorage.setItem('siparisGecmisi', JSON.stringify([]));
    }
  };
  
  // Uygulama durumu
  let urunler = Depolama.yukleUrunler();
  
  // Arayüz yönetim modülü
  const Arayuz = {
    urunleriYukle() {
        const urunListesi = document.getElementById('urunListesi');
        urunListesi.innerHTML = '';
  
        const turler = [...new Set(urunler.map(urun => urun.tur))].sort();
        
        turler.forEach(tur => {
            const turBaslik = document.createElement('div');
            turBaslik.classList.add('kategori-baslik');
            turBaslik.innerHTML = `<h3>${tur}</h3>`;
            urunListesi.appendChild(turBaslik);
            
            const turUrunleri = urunler.filter(urun => urun.tur === tur);
            
            const turContainer = document.createElement('div');
            turContainer.classList.add('kategori-container');
            
            turUrunleri.forEach((urun, globalIndex) => {
                const realIndex = urunler.findIndex(u => u.ad === urun.ad && u.tur === urun.tur);
                
                const urunDiv = document.createElement('div');
                urunDiv.classList.add('urun');
                urunDiv.innerHTML = `
                    <span>${urun.ad}</span>
                    <button onclick="azalt(${realIndex})"><i class="fas fa-minus"></i></button>
                    <span class="urun-miktar" id="miktar-${realIndex}">${urun.miktar}</span>
                    <button onclick="arttir(${realIndex})"><i class="fas fa-plus"></i></button>
                    <button onclick="urunSil(${realIndex})"><i class="fas fa-trash"></i></button>
                `;
                turContainer.appendChild(urunDiv);
            });
            
            urunListesi.appendChild(turContainer);
        });
    },
    ozetGoster(ozet) {
        document.getElementById('siparisOzeti').innerHTML = ozet;
    },
    temizleOzet() {
        document.getElementById('siparisOzeti').innerHTML = '';
    },
    gecmisSiparisleriYukle() {
        const gecmisDiv = document.getElementById('siparisGecmisi');
        const siparisGecmisi = Depolama.yukleSiparisGecmisi();
        gecmisDiv.innerHTML = '';
  
        if (siparisGecmisi.length === 0) {
            gecmisDiv.innerHTML = '<p>Henüz kaydedilmiş sipariş yok.</p>';
        } else {
            siparisGecmisi.forEach((siparis, index) => {
                let siparisHTML = `
                    <div class="siparis-kaydi">
                        <p><strong>Sipariş ${index + 1} - Tarih:</strong> ${siparis.tarih}</p>
                        <button class="btn danger sil-btn" onclick="siparisSil(${index})">
                            <i class="fas fa-trash"></i> Bu Siparişi Sil
                        </button>
                        <table>
                            <tr>
                                <th>Ürün Adı</th>
                                <th>Kategori</th>
                                <th>Miktar</th>
                            </tr>
                `;
                siparis.urunler.forEach(urun => {
                    siparisHTML += `
                        <tr>
                            <td>${urun.ad}</td>
                            <td>${urun.tur}</td>
                            <td>${urun.miktar} adet</td>
                        </tr>
                    `;
                });
                siparisHTML += `
                        <tr>
                            <td colspan="2"><strong>Toplam Ürün:</strong></td>
                            <td><strong>${siparis.toplamUrun}</strong></td>
                        </tr>
                    </table>
                    </div>
                `;
                gecmisDiv.innerHTML += siparisHTML;
            });
        }
    }
  };
  
  // İş mantığı fonksiyonları
  function arttir(index) {
    urunler[index].miktar++;
    document.getElementById(`miktar-${index}`).innerText = urunler[index].miktar;
    Depolama.kaydetUrunler(urunler);
  }
  
  function azalt(index) {
    if (urunler[index].miktar > 0) {
        urunler[index].miktar--;
        document.getElementById(`miktar-${index}`).innerText = urunler[index].miktar;
        Depolama.kaydetUrunler(urunler);
    }
  }
  
  function urunSil(index) {
    if (confirm(`${urunler[index].ad} ürününü silmek istediğinizden emin misiniz?`)) {
        urunler.splice(index, 1);
        Depolama.kaydetUrunler(urunler);
        Arayuz.urunleriYukle();
    }
  }
  
  function yeniUrunEkle() {
    const yeniUrunAdi = document.getElementById('yeniUrunAdi').value.trim();
    const yeniUrunTuru = document.getElementById('yeniUrunTuru').value.trim();
    
    if (yeniUrunAdi && !urunler.some(u => u.ad.toLowerCase() === yeniUrunAdi.toLowerCase())) {
        urunler.push(new Urun(yeniUrunAdi, 0, yeniUrunTuru));
        Depolama.kaydetUrunler(urunler);
        Arayuz.urunleriYukle();
        document.getElementById('yeniUrunAdi').value = '';
    } else if (!yeniUrunAdi) {
        alert('Lütfen bir ürün adı girin.');
    } else {
        alert('Bu ürün zaten listede var.');
    }
  }
  
  function siparisSil(index) {
    if (confirm(`Sipariş ${index + 1}'i silmek istediğinizden emin misiniz?`)) {
        Depolama.siparisSil(index);
        Arayuz.gecmisSiparisleriYukle();
    }
  }
  
  function gecmisiSil() {
    if (confirm('Tüm sipariş geçmişini silmek istediğinizden emin misiniz?')) {
        Depolama.gecmisiSil();
        Arayuz.gecmisSiparisleriYukle();
    }
  }
  
  function siparisTopla() {
    const tarih = new Date().toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    const secilenUrunler = urunler.filter(urun => urun.miktar > 0);
    let tabloHTML = `
        <table>
            <tr>
                <th>Ürün Adı</th>
                <th>Kategori</th>
                <th>Miktar</th>
            </tr>
    `;
    
    if (secilenUrunler.length === 0) {
        tabloHTML += `
            <tr>
                <td colspan="3">Seçilen ürün yok.</td>
            </tr>
        `;
    } else {
        const kategoriler = [...new Set(secilenUrunler.map(urun => urun.tur))].sort();
        
        kategoriler.forEach(kategori => {
            const kategoriUrunleri = secilenUrunler.filter(urun => urun.tur === kategori);
            
            tabloHTML += `
                <tr>
                    <td colspan="3" class="kategori-baslik-tablo">${kategori}</td>
                </tr>
            `;
            
            kategoriUrunleri.forEach(urun => {
                tabloHTML += `
                    <tr>
                        <td>${urun.ad}</td>
                        <td>${urun.tur}</td>
                        <td>${urun.miktar} adet</td>
                    </tr>
                `;
            });
        });
        
        tabloHTML += `
            <tr>
                <td colspan="2"><strong>Toplam Ürün:</strong></td>
                <td><strong>${secilenUrunler.length}</strong></td>
            </tr>
        `;
    }
    
    tabloHTML += `</table>`;
    const tamOzet = `<p><strong>Tarih:</strong> ${tarih}</p>` + tabloHTML;
    
    Arayuz.ozetGoster(tamOzet);
    
    if (secilenUrunler.length > 0) {
        const siparisKaydi = {
            tarih: tarih,
            urunler: secilenUrunler.map(urun => ({ 
                ad: urun.ad, 
                miktar: urun.miktar,
                tur: urun.tur 
            })),
            toplamUrun: secilenUrunler.length
        };
        Depolama.kaydetSiparis(siparisKaydi);
        Arayuz.gecmisSiparisleriYukle();
    }
  }
  
  function yeniListe() {
    urunler.forEach(urun => urun.miktar = 0);
    Depolama.kaydetUrunler(urunler);
    Arayuz.urunleriYukle();
    Arayuz.temizleOzet();
  }
  
  function kategoriEkle() {
    const yeniKategori = prompt("Yeni kategori adını girin:");
    if (yeniKategori && yeniKategori.trim() !== "") {
        const turler = [...new Set(urunler.map(urun => urun.tur))];
        if (!turler.includes(yeniKategori)) {
            urunler.push(new Urun(`Yeni ${yeniKategori} Ürünü`, 0, yeniKategori));
            Depolama.kaydetUrunler(urunler);
            Arayuz.urunleriYukle();
            populateKategoriSelect();
        } else {
            alert("Bu kategori zaten mevcut!");
        }
    }
  }
  
  function populateKategoriSelect() {
    const kategoriSelect = document.getElementById('yeniUrunTuru');
    if (kategoriSelect) {
        const turler = [...new Set(urunler.map(urun => urun.tur))].sort();
        
        kategoriSelect.innerHTML = '';
        turler.forEach(tur => {
            const option = document.createElement('option');
            option.value = tur;
            option.textContent = tur;
            kategoriSelect.appendChild(option);
        });
    }
  }
  
  // Uygulama başlatma
  document.addEventListener('DOMContentLoaded', () => {
    Arayuz.urunleriYukle();
    Arayuz.gecmisSiparisleriYukle();
    
    populateKategoriSelect();
    
    document.getElementById('yeniUrunAdi').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') yeniUrunEkle();
    });
  });