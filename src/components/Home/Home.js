import React, {Component} from 'react';
import {API_URL,API_KEY,IMAGE_BASE_URL,POSTER_SIZE,BACKDROP_SIZE} from '../../config';
import './Home.css';
import HeroImage from '../elements/HeroImage/HeroImage';
import SearchBar from '../elements/SearchBar/SearchBar';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import MovieThumb from '../elements/MovieThumb/MovieThumb';
import LoadMoreBtn from '../elements/LoadMoreBtn/LoadMoreBtn';
import Spinner from '../elements/Spinner/Spinner';

class Home extends Component {
    state ={
        movies:[],//we need to fetch an array of movie objects
        heroImage:null,
        loading:false,
        currPage:0,
        totalPages:0,
        searchTerm:''
    } 

    //lifecycle events...fires when component is loaded
    componentDidMount(){
        if (localStorage.getItem("HomeState")){
            const state = JSON.parse(localStorage.getItem("HomeState"));
            this.setState({...state});
        }
        else
        {
            //before call api mark state variable to loading : true
            this.setState({loading:true});
            const endPoint =`${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
            this.fetchItems(endPoint);
        }
    }

    searchItems = (searchTerm) => {
        let endpoint ='';
        this.setState({
            movies:[],
            loading:true,
            searchTerm:searchTerm
        });

        if (searchTerm === '')
        {
            endpoint =`${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        } else {
            endpoint =`${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}`;
        }

         //call existing method to fetch data from created url and populate more movies into 
        //movies array
        this.fetchItems(endpoint);
    }

    loadMoreItems = ()=>{
        let endpoint = '';
        this.setState({loading:true});

        //just return next page of popular movies
        if (this.state.searchTerm === '')
        {
            endpoint =`${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${this.state.currPage+1}`;
        }
        else { //fetch next of searched films
            endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${this.state.searchTerm}&page=${this.state.currPage + 1}`;
        }

        //call existing method to fetch data from created url and populate more movies into 
        //movies array
        this.fetchItems(endpoint);
    }

    fetchItems = (endPoint) =>{
        fetch(endPoint)
        .then(result => result.json())
        .then(result => {
            console.log('filmovi',result);
           this.setState({
               movies:[...this.state.movies,...result.results],
               heroImage: result.results[0],
               loading:false,
               currPage:result.page,
               totalPages:result.total_pages
           },()=> {
               localStorage.setItem("HomeState",JSON.stringify(this.state));
           })
        })
    }

    renderGrid = () => {
        const allMovies = this.state.movies.map((element,i)=>{
            return (<MovieThumb 
                        key={i}
                        clickable={true}
                        image={element.poster_path ? 
                            `${IMAGE_BASE_URL}${POSTER_SIZE}${element.poster_path}` : './images/no_image.jpg'}
                        movieId={element.id}
                        movieName={element.orginal_title}
                    />)
        });

        return allMovies;
    }

    render() {
        return (
            <div className="rmdb-home">
                <div>
                    {this.state.heroImage && <HeroImage image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${this.state.heroImage.backdrop_path}`}
                    title={this.state.heroImage.original_title}
                    text={this.state.heroImage.overview}/>}
                    {this.state.heroImage && <SearchBar callback={this.searchItems}/>}
                </div>
                <div className="rmdb-home-grid">
                    <FourColGrid
                        header = {this.state.searchTerm ? 'Search Result' : 'Popular Movies'}
                        loading = {this.state.loading}
                    >
                        {
                            this.renderGrid()
                        }
                    </FourColGrid>
                    {this.state.loading && <Spinner/>}
                    {this.state.currPage <= this.state.totalPages && !this.state.loading &&
                    <LoadMoreBtn
                        text="Load more..."
                        onClick={this.loadMoreItems}
                    />}
                </div>
            </div>
        )
    }
}

export default Home;