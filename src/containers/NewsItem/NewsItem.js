import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchNewsItem, fetchComments } from '../../store/actions/news'
import { withRouter } from "react-router"
import { NavLink } from 'react-router-dom'

class NewsItem extends Component {
    componentDidMount() {
        this.props.fetchNewsItem()
        this.props.fetchComments()
    }

    renderComments() {
        console.log('renderComments', this.props.comments)
        return this.props.comments.map(comment => {
            return <Comment comment={comment} />
        })
    }

    render() {
        return(
            <div className='section py-5  d-flex align-items-center min-vh-100'>
                <div className="container shadow-lg p-5 rounded">
                    <div className="row">
                        <div className="col">
                            <h3><NavLink to="/"><i className="fa-solid fa-home"></i></NavLink> / {this.props.newsItem.title}</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-auto">
                            <i className="fa-solid fa-at me-1"></i>{this.props.newsItem.by}
                        </div>
                        <div className="col-auto">
                            <i className="fa-solid fa-clock me-1"></i>{new Date(this.props.newsItem.time*1000).toLocaleString()}
                        </div>
                        <div className="col-auto">
                            <i className="fa-solid fa-comment me-1"></i>{this.props.newsItem.descendants}
                        </div>
                        <div className="col-auto me-auto">
                            <i className="fa-solid fa-link me-1"></i><a className="link-dark" href={this.props.newsItem.url} target="_blank" rel='noreferrer'>Read full story</a>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col">
                            <h3 className='d-flex align-items-center'>
                                <div className="btn btn-sm btn-dark" onClick={() => {console.log('Ручное обновление: ', new Date()); this.props.fetchComments()}}>
                                    <i className='fa-solid fa-refresh'></i>
                                </div>
                                <div className='ms-2'>Comments:</div>
                            </h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            { this.props.newsItem.descendants === 0 ? 'No comments yet...' : <div className='list-group'>{this.renderComments()}</div> }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function Comment({ comment }) {
    const nestedComments = (comment.children || []).map(comment => {
      return <Comment key={comment.id} comment={comment} />
    })

    const timePosted = Math.floor(((new Date() / 1000) - (new Date(comment.time))) / 60)
  
    return (
      comment.dead !== true && comment.deleted !== true ?
        <div style={{marginLeft: "25px", marginTop: "10px"}}>
            <div><span style={{fontWeight: 700}}><i className='fa-solid fa-at me-1'></i>{comment.by}</span> { timePosted === 0 ? 'just now' : timePosted === 1 ? `${timePosted} minute ago` : `${timePosted} minutes ago`}:</div>
            <div dangerouslySetInnerHTML={{__html: comment.text}}></div>
            { nestedComments }
        </div>
    : null
    )
  }

function mapStateToProps(state) {
    return {
        newsItem: state.news.newsItem,
        comments: state.news.comments
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchNewsItem: () => dispatch(fetchNewsItem(window.location.href.split('/')[4])),
        fetchComments: () => dispatch(fetchComments(window.location.href.split('/')[4]))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewsItem))