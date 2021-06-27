const Trailer = ({ trailerUrl }) => (
  <>
    <h2>Trailer</h2>
    <iframe
      width="100%"
      height="515"
      src={trailerUrl}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </>
);

export default Trailer;
