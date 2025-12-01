function Moviecard ({ image, genre, title, excerpt, author, avatar, rating }) {
    return (
      <article className="card">
        <img src={image} alt={title} className="card-image" />
        <div className="card-content">
          <div className="badge">{genre}</div>
          <h3 className="card-title">{title}</h3>
          <p className="card-excerpt">{excerpt}</p>
          <div className="card-meta">
            <div className="card-author">
              <img src={avatar} alt={author} className="avatar" />
              <span>{author}</span>
            </div>
            <div className="rating">
              <span>⭐ {rating}</span>
            </div>
          </div>
        </div>
      </article>
    );
  }
  
  export default Moviecard;
  