import NewsList from './containers/NewsList/NewsList';
import NewsItem from './containers/NewsItem/NewsItem';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

function App() {
  return (
    <div className="App">
      
        <Switch>
          <Route exact path="/" render={() => <NewsList />} />
          <Route exact path="/news/:slug" render={() => <NewsItem />} />
          {/* <Route render={() => (<div>Miss</div>)} /> */}
        </Switch>
    </div>
  );
}

export default connect()(App);
