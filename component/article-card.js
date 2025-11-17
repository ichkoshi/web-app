function ArticleCard({ image, badge, title, excerpt, author, avatar, readTime, date }) {
    return (
      <article className="card">
        <img src={image} alt={title} className="card-image" />
        <div className="card-content">
          <div className={`badge ${badge === 'Featured' ? 'badge-featured' : ''}`}>{badge}</div>
          <h3 className="card-title">{title}</h3>
          <p className="card-excerpt">{excerpt}</p>
          <div className="card-meta">
            <div className="card-author">
              <img src={avatar} alt={author} className="avatar" />
              <span>{author}</span>
            </div>
            <span>{readTime}</span>
            <span>{date}</span>
          </div>
        </div>
      </article>
    );
  }
  
  export default ArticleCard;
  