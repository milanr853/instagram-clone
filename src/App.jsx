import "./App.css"
import Header from "./Components/Header/Header";
import Body from "./Components/Body/Body"
import { useDispatch } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom"
import { makeOptionsDisappear } from "./Redux/Feature/accountOptionsVisibilitySlice";
import CreatePost from "./Components/CreatePost/CreatePost";
import { disappearContainer } from "./Redux/Feature/showSearchResultsContainerSlice";
import SinglePostView from "./Components/SinglePostView/SinglePostView";
import DeletePostOption from "./Components/DeletePost/DeletePostOption";




function App() {

  const dispatch = useDispatch()




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
        <DeletePostOption />
        <SinglePostView />
        <CreatePost />
        <Header />
        <Body />
      </Router>
    </div>
  );
}

export default App;
