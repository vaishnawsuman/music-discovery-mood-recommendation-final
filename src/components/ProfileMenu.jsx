export default function ProfileMenu({ onClose, onNavigate }) {
  const items = [
    { icon: '👤', label: 'Profile',          action: () => onNavigate('profile') },
    { icon: '▤',  label: 'My Playlists',     action: () => onNavigate('library') },
    { icon: '♡',  label: 'Favorites',        action: () => onNavigate('favorites') },
    { icon: '⟳',  label: 'Recently Played',  action: () => onNavigate('recent') },
    { icon: '⚙',  label: 'Settings',         action: () => onNavigate('settings') },
  ];

  return (
    <>
      <div className="profile-menu-overlay" onClick={onClose} />
      <div className="profile-menu">
        {items.map((item, i) => (
          <div
            key={i}
            className="profile-menu-item"
            onClick={item.action}
          >
            <span style={{ fontSize: 15 }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
        <div className="profile-menu-divider" />
        <div className="profile-menu-item danger" onClick={onClose}>
          <span style={{ fontSize: 15 }}>⎋</span>
          <span>Logout</span>
        </div>
      </div>
    </>
  );
}
