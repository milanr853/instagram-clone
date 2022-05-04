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
import { fetchAll_Users } from "./Redux/Feature/usersSlice";



function App() {

  const dispatch = useDispatch()


  useEffect(() => {
    dispatch(fetchAll_Images())
    dispatch(fetchAll_Users())
  }, [])


  const DisappearFeatures = (e) => {
    if (![...e.target.classList].includes("bi-person-circle")) {
      dispatch(makeOptionsDisappear())
    }
    setTimeout(() => {
      if (![...e.target.classList].includes("searchUsersInput") && ![...e.target.classList].includes("search")) {
        dispatch(disappearContainer())
      }
    }, 100);
  }



  return (
    <div className="App" onClick={DisappearFeatures}>
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
