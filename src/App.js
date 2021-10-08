import React, { useEffect, useState } from 'react';
import TMdb from './Tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';
import Footer from './components/Footer';

import './App.css';

export default () => {
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      //requast list
      let list = await TMdb.getHomeList();
      setMovieList(list);

      //pegando o filme em destak
      let originals = list.filter((i) => i.slug === 'originals');
      //gerar um nro aleatorio
      let randomChosen = Math.floor(
        Math.random() * (originals[0].items.results.length - 1)
      );
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await TMdb.getMovieInfo(chosen.id, 'tv');

      setFeaturedData(chosenInfo);

    };

    loadAll();
  }, []);

  useEffect(()=>{
    const scrollListener = () => {
      if(window.scrollY >= 10){
        setBlackHeader(true);
      }else{
        setBlackHeader(false);
      }
    }
    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  },[])

  return (
    <div className="page">
      <Header black={blackHeader}/>
      {featuredData && <FeaturedMovie item={featuredData} />}

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <Footer/>

      {movieList.length <= 0 &&
        <div className="loading">
          <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="" />
        </div>
      }

    </div>
  );
};
