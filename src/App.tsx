import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Header />
      <Routes>
        <Route path={"/"} element={<Home />}>
          <Route path={"/movies/:movieId"} element={<Home />} />
          <Route path={"/movies/upcoming/:movieId"} element={<Home />} />
        </Route>
        <Route path="/tv" element={<Tv />}>
          <Route path={"/tv/:tvId"} element={<Tv />} />
        </Route>
        <Route path="/search" element={<Search />}>
          <Route path="/search/movie/:dataId" element={<Search />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

// 라우터 버전 5에서는 Home을 맨 밑으로 내려야 함
