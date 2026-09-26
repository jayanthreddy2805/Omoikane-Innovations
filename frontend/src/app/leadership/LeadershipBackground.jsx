'use client';

export default function LeadershipBackground() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none', background: '#FAFAF7' }}>
      {/* Soft Vignette and darker center overlay */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'radial-gradient(circle at center, rgba(250, 250, 247, 0.4) 0%, rgba(250, 250, 247, 0.8) 70%, rgba(250, 250, 247, 1) 100%)' 
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(250, 250, 247, 0) 50%, #FAFAF7 100%)' }} />
    </div>
  );
}
