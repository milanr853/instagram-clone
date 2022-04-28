import "./App.css"
import Header from "./Components/Header/Header";
import Body from "./Components/Body/Body"
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { fetchAll_Images } from "./Redux/Feature/imagesSlice"

import { BrowserRouter as Router } from "react-router-dom"

import { makeOptionsDisappear } from "./Redux/Feature/accountOptionsVisibilitySlice";
import CreatePost from "./Components/CreatePost/CreatePost";
import { disappearContainer } from "./Redux/Feature/showSearchResultsContainerSlice";
import SinglePostView from "./Components/SinglePostView/SinglePostView";



function App() {

  const dispatch = useDispatch()


  useEffect(() => {
    dispatch(fetchAll_Images())
  }, [])


  const accountOptionsDisappear = (e) => {
    if (![...e.target.classList].includes("bi-person-circle")) {
      dispatch(makeOptionsDisappear())
    }
    if (![...e.target.classList].includes("searchUsersInput") && ![...e.target.classList].includes("search")) {
      dispatch(disappearContainer())
    }
  }



  return (
    <div className="App" onClick={accountOptionsDisappear}>
      <Router>
        <SinglePostView />
        <CreatePost />
        <Header />
        <Body />
      </Router>
    </div>
  );
}

export default App;
