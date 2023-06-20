import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-medium">Find a movie to watch tonight!</h2>

      <hr className="mt-2" />

      <Link to="/movies">
        <img src="/images/movie_tickets.jpg" alt="" />
      </Link>
    </div>
  );
};

export default Home;
