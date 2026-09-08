import { Link, useNavigate } from 'react-router-dom';
import { mediaUrl } from '../../utils';
import { useAuth } from '../../context/AuthContext';

export default function ProductCard({ item, onDirectBuy, isPembeliPage = false }) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const productId = item.id || item.id_produk;

  const handleBeliClick = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      localStorage.setItem('pending_checkout_product', productId);
      navigate('/login');
    } else {
      if (onDirectBuy) onDirectBuy(item);
    }
  };

  return (
    <div className="card w-100 h-100 border-1 shadow-sm rounded-3 overflow-hidden p-0" style={{ backgroundColor: '#FAF0E6', borderColor: '#8D7B68' }}>
      <img src={mediaUrl(item.foto || item.gambar)} alt={item.nama || item.nama_produk} className="card-img-top pt-3 px-3" style={{ height: '180px', objectFit: 'cover' }} onError={(e) => {e.target.src = '/placeholder-image.jpg'; }}/>
      <div className="card-body p-3 d-flex flex-column justify-content-between">
        <div>
          <p className="fw-bold text-truncate mb-1">{item.nama || item.nama_produk}</p>
          {item.deskripsi && (
            <p className="small text-muted mb-2 text-truncate">{item.deskripsi}</p>
          )}
          <p className="fw-bold mb-3" style={{ color:'#D8838B' }}>Rp {(item.harga || 0)?.toLocaleString('id-ID')}</p>
        </div>

        {isPembeliPage ? (
          <button onClick={handleBeliClick} className="btn btn-sm w-100 text-light fw-semibold text-center border-0 py-2" style={{ backgroundColor: '#D8838B' }} >Pesan</button>
        ) : (
          <div className="d-flex gap-2">
           <Link to={`/produk/${productId}`} className="btn btn-sm w-50 fw-semibold text-decoration-none text-center rounded-2" style={{ color: '#2A1E17', border: '1px solid #8D7B68', backgroundColor: '#FAF0E6' }}>Detail</Link>
            <button onClick={handleBeliClick} className="btn btn-sm w-50 text-light fw-semibold text-center border-0" style={{ backgroundColor: '#D8838B' }}>Beli</button>
          </div>
        )}
      </div>
    </div>
  );
}