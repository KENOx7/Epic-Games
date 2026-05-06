import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2 } from 'lucide-react';

// oyunun slug-ini yaratmaq ucun (url-de istifade olunur)
function slugYarat(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function GameDetails() {
  const { slug } = useParams();
  const [game, setGame] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // oyun melumatlarin yuklenmesi
  useEffect(() => {
    fetch('/scraped_games/epic-savings/category_summary.json')
      .then((res) => res.json())
      .then((data) => {
        // slug-e uygun oyunu tapiriq
        const tapilmis = data.find((g) => slugYarat(g.title) === slug);
        if (tapilmis) {
          setGame(tapilmis);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div style={{ background: '#101014', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#aaa', fontSize: '18px' }}>Yüklənir...</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div style={{ background: '#101014', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <p style={{ color: '#aaa', fontSize: '18px' }}>Oyun tapılmadı</p>
        <Link to="/" style={{ color: '#26BBFF', textDecoration: 'none' }}>← Geri qayıt</Link>
      </div>
    );
  }

  const folderName = slugYarat(game.title);
  const basePath = `/scraped_games/epic-savings/${folderName}`;

  // screenshot sekillerin siyahisi (cover xaric)
  const screenshots = (game.saved_images || []).filter((img) => img !== 'cover.jpg');

  // hazirki secilmis sekil
  const currentImage = screenshots.length > 0
    ? `${basePath}/${screenshots[selectedImage]}`
    : `${basePath}/cover.jpg`;

  // ulduzlarin gosterilmesi (rating ucun)
  const rating = parseFloat(game.playerRating) || 0;
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;

  return (
    <div style={{ background: '#101014', minHeight: '100vh', color: '#fff' }}>

      {/* Yuxari hisse - oyun adi ve geri dugmesi */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px 0' }}>
        <Link to="/" style={{ color: '#26BBFF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', fontSize: '14px' }}>
          <ArrowLeft size={18} />
          Mağazaya qayıt
        </Link>

        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>{game.title}</h1>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '2px' }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < fullStars ? '#FFD700' : (i === fullStars && hasHalf ? '#FFD700' : 'none')}
                color={i < fullStars || (i === fullStars && hasHalf) ? '#FFD700' : '#555'}
              />
            ))}
          </div>
          <span style={{ color: '#aaa', fontSize: '14px' }}>{game.playerRating}</span>
        </div>
      </div>

      {/* Esas content - 2 sutunlu layout */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px 40px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>

        {/* Sol teref - sekiller */}
        <div style={{ flex: '1 1 650px', minWidth: '0' }}>
          {/* Boyuk sekil */}
          <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', background: '#1a1a1e', marginBottom: '12px' }}>
            <img
              src={currentImage}
              alt={game.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Kicik screenshot-lar */}
          {screenshots.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
              {screenshots.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  style={{
                    minWidth: '100px',
                    height: '60px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedImage === index ? '2px solid #26BBFF' : '2px solid transparent',
                    opacity: selectedImage === index ? 1 : 0.6,
                    transition: 'all 0.2s',
                  }}
                >
                  <img
                    src={`${basePath}/${img}`}
                    alt={`screenshot ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Oyun haqqinda melumat */}
          <div style={{ marginTop: '32px' }}>
            {/* Janr ve xususiyyetler */}
            <div style={{ display: 'flex', gap: '48px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {game.genres && game.genres.length > 0 && (
                <div>
                  <p style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>Genres</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {game.genres.map((genre) => (
                      <span key={genre} style={{ background: '#1e1e24', padding: '4px 12px', borderRadius: '4px', fontSize: '13px', color: '#ccc' }}>
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {game.features && game.features.length > 0 && (
                <div>
                  <p style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>Features</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {game.features.map((feature) => (
                      <span key={feature} style={{ background: '#1e1e24', padding: '4px 12px', borderRadius: '4px', fontSize: '13px', color: '#ccc' }}>
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Aciklama */}
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>{game.title}</h2>
            <p style={{ color: '#bbb', fontSize: '14px', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
              {game.description}
            </p>
          </div>
        </div>

        {/* Sag teref - qiymet ve melumat paneli */}
        <div style={{ width: '320px', flexShrink: 0 }}>
          {/* Cover sekil */}
          <div style={{ width: '100%', height: '180px', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px', background: '#1a1a1e' }}>
            <img
              src={`${basePath}/cover.jpg`}
              alt={game.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Qiymet hissesi */}
          <div style={{ background: '#1a1a1e', borderRadius: '10px', padding: '20px', marginBottom: '16px' }}>
            {/* Endirim badge */}
            {game.discount && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ background: '#26BBFF', color: '#000', fontWeight: 'bold', padding: '4px 10px', borderRadius: '6px', fontSize: '14px' }}>
                  {game.discount}
                </span>
                {game.oldPrice && (
                  <span style={{ color: '#777', textDecoration: 'line-through', fontSize: '14px' }}>{game.oldPrice}</span>
                )}
                {game.newPrice && (
                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '18px' }}>{game.newPrice}</span>
                )}
              </div>
            )}

            {/* Buy Now dugmesi */}
            <button style={{
              width: '100%',
              padding: '14px',
              background: '#26BBFF',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '16px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '10px',
              transition: 'background 0.2s',
            }}
              onMouseEnter={(e) => e.target.style.background = '#72D3FF'}
              onMouseLeave={(e) => e.target.style.background = '#26BBFF'}
            >
              Buy Now
            </button>

            {/* Sebete elave et */}
            <button style={{
              width: '100%',
              padding: '12px',
              background: '#2a2a30',
              color: '#fff',
              fontSize: '14px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '10px',
              transition: 'background 0.2s',
            }}
              onMouseEnter={(e) => e.target.style.background = '#3a3a40'}
              onMouseLeave={(e) => e.target.style.background = '#2a2a30'}
            >
              <ShoppingCart size={16} /> Add to Cart
            </button>

            {/* Wishlist */}
            <button style={{
              width: '100%',
              padding: '12px',
              background: '#2a2a30',
              color: '#fff',
              fontSize: '14px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.2s',
            }}
              onMouseEnter={(e) => e.target.style.background = '#3a3a40'}
              onMouseLeave={(e) => e.target.style.background = '#2a2a30'}
            >
              <Heart size={16} /> Wishlist
            </button>
          </div>

          {/* Oyun melumatlari */}
          <div style={{ background: '#1a1a1e', borderRadius: '10px', padding: '20px' }}>
            <InfoRow label="Developer" value={game.developer} />
            <InfoRow label="Publisher" value={game.publisher} />
            <InfoRow label="Release Date" value={game.releaseDate} />
            <InfoRow label="Platform" value={game.platform} />

            {/* Paylasma dugmesi */}
            <div style={{ borderTop: '1px solid #2a2a30', marginTop: '16px', paddingTop: '16px', display: 'flex', justifyContent: 'center' }}>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: '1px solid #3a3a40',
                color: '#aaa',
                padding: '8px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'color 0.2s',
              }}
                onMouseEnter={(e) => e.target.style.color = '#fff'}
                onMouseLeave={(e) => e.target.style.color = '#aaa'}
              >
                <Share2 size={14} /> Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// melumat setri komponenti (Developer, Publisher ve s.)
function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
      <span style={{ color: '#888' }}>{label}</span>
      <span style={{ color: '#fff' }}>{value}</span>
    </div>
  );
}
