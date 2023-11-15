import { useEffect, useState } from "react";
import "./App.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

function App() {
  const [data, setData] = useState([]);

  const [artist_name, setArtist_name] = useState("");

  const [newData, setNewData] = useState([]);

  const [filter, setFilter] = useState([]);

  const [loved, setLoved] = useState([]);

  const [fav, setFav] = useState(false);

  useEffect(() => {
    const url = "https://nekos.best/api/v2/waifu?amount=50";

    fetch(url)
      .then((res) => res.json())
      .then((d) => setData(d.results))
      .catch((err) => console.error("error fetching", err));
  }, []);

  useEffect(() => {
    setNewData(data.map((newItems) => ({ ...newItems, love: false })));
  }, [data]);

  useEffect(() => {
    const filterData = newData.filter((newFilltered) =>
      newFilltered.artist_name.toLowerCase().includes(artist_name.toLowerCase())
    );

    setFilter(filterData);
  }, [newData, artist_name]);

  useEffect(() => {
    const tt = newData.filter((loveItem) => loveItem.love === true);

    setLoved(tt);
  }, [newData]);

  function handleLoved() {
    setFav((f) => !f);
  }

  function handleSearch(e) {
    setArtist_name(e.target.value);
  }

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={2002}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />

      <NavigationBar
        artistName={setArtist_name}
        artist={artist_name}
        onSearch={handleSearch}
        onLoved={handleLoved}
      />
      <ImageCard
        data={artist_name ? filter : fav ? loved : newData}
        setNewData={setNewData}
        loved={loved}
        newData={newData}
      />
    </div>
  );
}

function NavigationBar({ onSearch, artist, onLoved }) {
  return (
    <header className="bg-red-500 text-white p-4 sticky top-0 w-full z-50">
      <div className="flex justify-around items-center mx-auto">
        <div className="w-7 md:w-10">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png"
            alt="logo"
          />
        </div>
        <div className="flex items-center">
          <input
            placeholder="Search artist..."
            className="h-8 p-2 w-24 text-sm focus:outline-none focus:ring focus:ring-orange-200 rounded-md text-slate-800 font-semibold md:w-64"
            value={artist}
            onChange={onSearch}
          />
        </div>
        <nav className="space-x-2 md:space-x-6 sm:space-x-4">
          <a href="#" className="text-sm font-semibold md:text-base">
            Home
          </a>
          <a onClick={onLoved} className="text-sm font-semibold md:text-base">
            Loved
          </a>
          <a href="#" className="text-sm font-semibold md:text-base">
            About-Us
          </a>
        </nav>
      </div>
    </header>
  );
}

function ImageCard({ data, setNewData, newData }) {
  function handleLove(name) {
    setNewData((prevData) =>
      prevData.map((item) =>
        item.url === name ? { ...item, love: !item.love } : item
      )
    );

    toast("🐣 success", {
      position: "bottom-center",
      autoClose: 2002,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  if (data.length === 0)
    return (
      <div className="flex flex-shrink-0 items-center justify-center flex-wrap mt-5 p-3">
        <img
          className="animate-spin w-20"
          src="https://icones.pro/wp-content/uploads/2021/06/icone-chargement-orange.png"
          alt="loading"
        ></img>
      </div>
    );

  return (
    <div className="flex flex-shrink-0 items-center justify-center flex-wrap gap-5 mt-5 p-3">
      {data.map((item, i) => (
        <div
          className="flex w-auto flex-wrap p-10 shadow-md lg:w-1/4 md:w-1/3 sm:w-1/2"
          key={i}
        >
          <a
            href={item.artist_href}
            className="text-lg font-semibold bg-red-400 text-white rounded-md mb-3 px-2"
          >
            {item.artist_name}
          </a>
          <div className="">
            <LazyLoadImage
              threshold={100}
              effect="blur"
              src={item.url}
              alt="images"
              className="md:w-80 md:h-96 sm:h-80 sm:w-80 object-cover"
            />
          </div>

          <div className="flex mt-5 justify-between w-full">
            <p className="font-semibold">
              Source url : {""}
              <a className="text-blue-400" href={item.source_url}>
                go to the source
              </a>{" "}
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={`${item.love ? "red" : "grey"}`}
              viewBox="0 0 24 24"
              strokeWidth={0}
              stroke="grey"
              className={`w-6 h-6 ${
                item.love ? "animate-bounce transition duration-500" : ""
              } h`}
              onClick={() => handleLove(item.url)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
