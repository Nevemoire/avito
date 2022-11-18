import { FETCH_NEWS_START, FETCH_NEWS_ERROR, FETCH_NEWS_SUCCESS, FETCH_ITEM_SUCCESS, FETCH_COMMENTS_SUCCESS } from "../actions/actionTypes"

const initialState = {
    newsList: [],
    newsItem: {},
    comments: [],
    error: null
}

export default function newsReducer (state = initialState, action) {

    switch (action.type) {
        case FETCH_NEWS_START:
            return {
                ...state, newsList: action.newsList
            }
        case FETCH_NEWS_SUCCESS:
            return {
                ...state, newsList: action.newsList
            }
        case FETCH_ITEM_SUCCESS:
            return {
                ...state, newsItem: action.newsItem
            }
        case FETCH_COMMENTS_SUCCESS:
            return {
                ...state, comments: action.comments
            }
        case FETCH_NEWS_ERROR:
            return {
                ...state, error: action.error
            }
        default:
            return state
    }

}