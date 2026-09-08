import { Link } from 'react-router-dom';
import { mediaUrl, formatTanggal } from '../../utils';

export default function ArticleCard({ artikel }) {
  if (!artikel) return null;

  return (
    <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden d-flex flex-column" style={{ backgroundColor: '#FAF0E6' }}>
      <img src={mediaUrl(artikel.foto || artikel.gambar)}  alt={artikel.judul} className="card-img-top"  style={{ height: '200px', objectFit: 'cover' }}  onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}/>
      
      <div className="card-body p-4 d-flex flex-column justify-content-between flex-grow-1">
        <div>
          <small className="text-muted d-block mb-2">{formatTanggal(artikel.created_at)}</small>
          
          <p className="card-title fw-bold mb-2 fs-6" style={{ color: '#2A1E17', fontFamily: 'serif', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.8em' }}>{artikel.judul}</p>
          
          <p className="card-text small mb-3" style={{ color: '#8D7B68', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{artikel.ringkasan || artikel.isi}</p>
        </div>

        <div>
          <Link to={`/artikel/${artikel.id || artikel.id_artikel}`}  className="text-decoration-none fw-bold small d-inline-block" style={{ color: '#D8838B' }}>BACA SELENGKAPNYA &rarr;</Link>
        </div>
      </div>
    </div>
  );
}