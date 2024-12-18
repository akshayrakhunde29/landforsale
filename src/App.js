import React, { useState, useEffect } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Slider from "react-slick";
import "./App.css";

const App = () => {
  const [lands, setLands] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchLands = async () => {
    try {
      const response = await axios.get(
        `https://prod-be.1acre.in/lands/?division=24&page_size=10&page=${page}&ordering=-updated_at`
      );
      const newData = response.data.results;
      console.log(newData);
      setLands((prevLands) => [...prevLands, ...newData]);

      if (newData.length === 0) setHasMore(false);

      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchLands();
  }, []);

  const carouselSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false
  };
  
  return (
    <div className="app-container">
      <h1>Land Listings</h1>

      <InfiniteScroll
        dataLength={lands.length}
        next={fetchLands}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>No more lands to load!</p>}
      >
        <div className="card-container">
          {lands.map((land, index) => (
            <div key={index} className="land-card">
              <div className="share-content">
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-heart"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  </svg>
                </button>
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-share2"
                  >
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
                    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
                  </svg>
                </button>
              </div>
              <Slider {...carouselSettings}>
                {land.land_media?.map((img, i) => (
                  <img
                    key={i}
                    src={img?.image}
                    alt={`Land ${i}`}
                    className="carousel-image"
                    width={50}
                    height={50}
                  />
                ))}
              </Slider>

              <div className="card-details">
                <h3>
                  ₹{" "}
                  {land.price_per_acre_crore.crore === 0
                    ? `${land.price_per_acre_crore.lakh} lakhs for full property`
                    : `${land.price_per_acre_crore.crore}${
                        land.price_per_acre_crore.lakh !== 0
                          ? "." + land.price_per_acre_crore.lakh
                          : ""
                      } Cr/acre`}{" "}
                  •{" "}
                  {land.total_land_size_in_acres.acres
                    ? `${land.total_land_size_in_acres.acres} Acres`
                    : ""}{" "}
                  {land.total_land_size_in_acres.guntas
                    ? `${land.total_land_size_in_acres.guntas} Guntas`
                    : ""}
                </h3>
                <p>
                  {land.slug.split("/")[2]} {land.slug.split("/")[1]} (dt)
                </p>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default App;
