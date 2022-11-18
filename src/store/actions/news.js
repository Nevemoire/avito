import axios from 'axios'
import { FETCH_NEWS_ERROR, FETCH_NEWS_START, FETCH_NEWS_SUCCESS, FETCH_ITEM_SUCCESS, FETCH_COMMENTS_SUCCESS } from './actionTypes'

export function fetchNews() {
    return async dispatch => {
        dispatch(fetchNewsStart([])) // Закомментировать если не нужно обнулять список новостей во время обновления
        try {
            const responce = await axios.get('https://hacker-news.firebaseio.com/v0/newstories.json')
            const newsArray = responce.data.slice(0, 100)
            let newsList = []
            for (let i = 0; i < newsArray.length; i++) {
                newsList.push(await axios.get(`https://hacker-news.firebaseio.com/v0/item/${newsArray[i]}.json`))
            }

            dispatch(fetchNewsSuccess(newsList))
        } catch (e) {
            dispatch(fetchNewsError(e))
        }
    }
}

export function fetchNewsItem(newsId) {
    return async dispatch => {
        try {
            const responce = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${newsId}.json`)
            const newsItem = responce.data

            dispatch(fetchItemSuccess(newsItem))
        } catch (e) {
            dispatch(fetchNewsError(e))
        }
    }
}



export function fetchComments(newsId) {
    return async dispatch => {
        dispatch(fetchCommentsSuccess([])) // Закомментировать если не нужно обнулять список комментариев во время обновления
        const responce = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${newsId}.json`)
        const commentsNumber = responce.data.kids
        let comments = []
        async function allDescendants (node) {
            let nLngth
            try {
                nLngth = node.length
            } catch (e) {}
            for (let i = 0; i < nLngth; i++) {
                const responce = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${node[i]}.json`)
                var child = responce.data.kids;
                comments.push(responce.data)
                allDescendants(child);
            }
            return comments
        }

        const flatComments = await allDescendants(commentsNumber)

        async function createTree(list) {
            var map = {},
              node,
              roots = [],
              i;
          
            for (i = 0; i < list.length; i += 1) {
              if (list[i].parent === newsId) {
                list[i].parent = null
              }
              map[list[i].id] = i;
              list[i].children = [];
            }
          
            for (i = 0; i < list.length; i += 1) {
              node = list[i];
              if (node.parent) {
                try{
                    list[map[node.parent]].children.push(node);
                } catch {
                    roots.push(node);}
              } else {
                roots.push(node);
              }
            }
            return roots;
          }

        const nestedComments = await createTree(flatComments)

        dispatch(fetchCommentsSuccess(nestedComments))
    }
}

export function fetchItemSuccess(newsItem) {
    return {
        type: FETCH_ITEM_SUCCESS,
        newsItem
    }
}

export function fetchNewsStart(newsList) {
    return {
        type: FETCH_NEWS_START,
        newsList
    }
}

export function fetchNewsSuccess(newsList) {
    return {
        type: FETCH_NEWS_SUCCESS,
        newsList
    }
}

export function fetchCommentsSuccess(comments) {
    return {
        type: FETCH_COMMENTS_SUCCESS,
        comments
    }
}

export function fetchNewsError(e) {
    return {
        type: FETCH_NEWS_ERROR,
        error: e
    }
}