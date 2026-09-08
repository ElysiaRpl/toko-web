/**
 * constants.js — info toko (SITE), menu publik, enum form.
 */

export const SITE = {
  logo_toko: '/logo.png',
  nama_toko: 'ELLYSTITCH',
  tentang:
    'Di Ellystitch, setiap rajutan dibuat dengan cinta dan ketelitian. Kami menghadirkan pakaian, tas, mainan, hingga aksesoris buatan tangan (handmade) yang membawa kehangatan dan sentuhan estetik di setiap momenmu.',
  foto_banner: '/banner.png',
  alamat_toko: 'Rt/Rw. 003/005, Dsn. Bangunsari, Ds.Wagir Kidul, Kec. Pulung, Kab. Ponorogo,Jawa Timur, 63481',
  email_toko: 'elysia@sapiku.my.id',
  tlp_toko: 6285334912798,
  nama_bank_a: 'BCA',
  nama_bank_b: 'Mandiri',
  no_rek_a: 1234567890,
  no_rek_b: 9876543210,
  jam_buka: 8,
  jam_tutup: 20,
  logo_wa: '',
  logo_ig: '',
  logo_fb: '',
  link_wa: 'https://wa.me/6280000000000',
  link_ig: 'https://instagram.com/',
  link_fb: 'https://facebook.com/',
};

export const PUBLIC_NAV = [
  { to: '/', label: 'Beranda', end: true },
  { to: '/toko', label: 'Toko' },
  { to: '/artikel', label: 'Artikel' },
];

export const KELAMIN = ['Laki-laki', 'Perempuan'];
export const KATEGORI_PRODUK = ['Sapi', 'Daging Sapi', 'Susu Sapi'];
export const METODE_BAYAR = ['Bank Transfer', 'COD'];
export const SHIPPING = ['JNT Express', 'JNE'];
export const STATUS_PROSES = ['Tertunda', 'Dikemas', 'Dikirim', 'Diterima', 'Selesai'];
export const STATUS_BAYAR = ['Belum', 'Dibayar'];

export const CATEGORIES = [
  {
    id: 'Baju Rajut',
    nama: 'Baju Rajut',
    deskripsi: 'Baju rajut adalah pakaian berbahan rajutan yang nyaman, hangat, dan cocok digunakan untuk berbagai gaya, dari santai hingga kasual.',
    foto: '/public/baju.png'
  },
  {
    id: 'Tas Rajut',
    nama: 'Tas Rajut',
    deskripsi: 'Tas rajut adalah tas berbahan rajutan yang unik, ringan, dan praktis untuk melengkapi berbagai gaya sehari-hari.',
    foto: '/public/tas.png'
  },
  {
    id: 'Mainan Rajut',
    nama: 'Mainan Rajut',
    deskripsi: 'Mainan rajut adalah mainan handmade yang lembut, unik, dan lucu, cocok sebagai teman bermain sekaligus dekorasi yang menarik.',
    foto: '/public/mainan.png'
  },
   {
    id: 'Aksesoris Rajut',
    nama: 'Aksesoris Rajut',
    deskripsi: 'Aksesori rajut adalah pelengkap handmade yang unik dan cantik, seperti jepit rambut, scrunchie, gelang, dan gantungan kunci untuk mempermanis penampilan.',
    foto: '/public/aksesoris.png'
  }
];
