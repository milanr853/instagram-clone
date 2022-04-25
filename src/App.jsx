import "./App.css"
import Header from "./Components/Header/Header";
import Body from "./Components/Body/Body"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAll_Images } from "./Redux/Feature/imagesSlice"

import { BrowserRouter as Router } from "react-router-dom"

import { makeOptionsDisappear } from "./Redux/Feature/accountOptionsVisibilitySlice";
import CreatePost from "./Components/CreatePost/CreatePost";



function App() {

  const dispatch = useDispatch()


  useEffect(() => {
    dispatch(fetchAll_Images())
  }, [])


  const accountOptionsDisappear = (e) => {
    if (![...e.target.classList].includes("bi-person-circle")) {
      dispatch(makeOptionsDisappear())
    }
  }



  return (
    <div className="App" onClick={accountOptionsDisappear}>
      <Router>
        <CreatePost />
        <Header />
        <Body />
      </Router>
    </div>
  );
}

export default App;
