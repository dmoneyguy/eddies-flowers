import './AnnouncementBar.css';

export default function AnnouncementBar() {
  return (
    <div className="announcement-bar" role="banner">
      <div className="container">
        <p className="announcement-bar__text">
          🌿 <strong>NOW OPEN</strong> — Visit us in Ashburnham, MA &nbsp;·&nbsp;
          Mon–Sat 10am–8pm &nbsp;·&nbsp; Sun 11am–6pm
          &nbsp;<a href="/deals" className="announcement-bar__link">See Today's Deals →</a>
        </p>
      </div>
    </div>
  );
}
