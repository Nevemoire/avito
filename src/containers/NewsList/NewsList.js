import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchNews } from '../../store/actions/news'

class NewsList extends Component {
    renderNews() {
        return this.props.newsList.map(news => {
            try {
                const timePosted = Math.floor(((new Date() / 1000) - (new Date(news.data.time))) / 60)
                return(
                <NavLink className='list-group-item list-group-item-action' to={'/news/' + news.data.id} key={news.data.id}>
                    <div className="d-flex w-100 justify-content-between">
                        <small><i className="fa-solid fa-at"></i> {news.data.by}</small>
                        <small>{ timePosted === 0 ? 'just now' : timePosted === 1 ? `${timePosted} minute ago` : `${timePosted} minutes ago`}</small>
                    </div>
                    <h5 className="my-2">{news.data.title} <i className="fa-solid fa-link ms-1"></i></h5>
                    <small>
                        <i className="fa-solid fa-clock me-1"></i>{new Date(news.data.time * 1000).toLocaleTimeString()}
                        <i className="fa-solid fa-star ms-3 me-1" style={{'color':'darkgoldenrod'}}></i> {news.data.score}
                        <i className="fa-solid fa-comment ms-3 me-1"></i> {news.data.descendants}
                    </small>
                </NavLink>
                )
            } catch (e) { 
                console.log(e)
                return 'Oops, something is wrong..' 
            }
        })
        // console.log(this.props.newsList)
    }

    componentDidMount() {
        this.props.fetchNews()
        setInterval(() => {console.log('Обновляем: ', new Date());this.props.fetchNews()}, 60000)
    }

    render() {
        return (
            <div className='section py-5'>
                <div className='container p-5 shadow-lg rounded'>
                    <div className="row">
                        <div className="col">
                            <div className="alert alert-primary d-flex align-items-center" role="alert">
                            <i className="fa-solid fa-info-circle me-2"></i>
                            <div>
                                List automatically updates every 60 seconds.
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col"> 
                            <h3 className='d-flex align-items-center'>
                                <div className="btn btn-sm btn-dark" onClick={() => {console.log('Ручное обновление: ', new Date()); this.props.fetchNews()}}>
                                    <i className='fa-solid fa-refresh'></i>
                                </div>
                                <div className='ms-2'>Latest News</div>
                            </h3>
                        </div>
                    </div>
                    <hr />
                    
                    {
                        <div className='list-group'>{this.renderNews()}</div>
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        newsList: state.news.newsList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchNews: () => dispatch(fetchNews())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewsList)