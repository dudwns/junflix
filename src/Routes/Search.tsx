import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getSearch, IGetSearch } from "../api";
import { makeImagePath } from "../utils";

const Container = styled.div`
  position: relative;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  gap: 7px;
  margin-top: 100px;
  padding: 60px;

  @media only screen and (max-width: 1500px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media only screen and (max-width: 1300px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media only screen and (max-width: 1100px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media only screen and (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ResultText = styled.div`
  color: ${(props) => props.theme.white.lighter};
  position: absolute;
  top: 30px;
  left: 60px;
`;

const Box = styled(motion.div)<{ boxphoto: string }>`
  background-color: ${(props) => props.theme.black.darker};
  background-image: url(${(props) => props.boxphoto});
  background-size: cover;
  background-position: center center;
  height: 150px;
  font-size: 66px;
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const ErrorImg = styled.div`
  font-size: 18px;
  display: flex;
  height: 100%;
  align-items: center;
  padding-left: 20px;
  color: ${(props) => props.theme.white.lighter};
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: fixed;
  width: 950px;
  height: 700px;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  margin-top: 100px;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
  display: flex;

  @media only screen and (max-width: 1000px) {
    width: 600px;
  }

  @media only screen and (max-width: 700px) {
    font-size: 15px;
    width: 100%;
    height: 100%;
    margin-top: 70px;
    border-radius: 0;
  }
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigPoster = styled.div`
  width: 260px;
  height: 370px;
  background-size: cover;
  position: absolute;
  top: 280px;
  left: 50px;

  @media only screen and (max-width: 1000px) {
    width: 160px;
    height: 270px;
    left: 20px;
    top: 60px;
  }

  @media only screen and (max-width: 700px) {
    left: 0;
    right: 0;
    top: 160px;
    margin: 0 auto;
    width: 220px;
    height: 320px;
  }
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  position: absolute;
  top: 330px;
  left: 325px;
  font-size: 38px;
  font-weight: 600;

  @media only screen and (max-width: 1000px) {
    top: 300px;
    left: 200px;
    font-size: 26px;
  }

  @media only screen and (max-width: 700px) {
    left: 0;
    top: 495px;
    width: 100%;
    display: flex;
    justify-content: center;
    font-weight: 400;
  }
`;

const BigInfo = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 420px;
  left: 310px;

  @media only screen and (max-width: 1000px) {
    left: 0;
    top: 420px;
  }
  @media only screen and (max-width: 700px) {
    left: 0;
    top: 550px;
    width: 100%;
  }
`;

const BigList = styled.ul`
  display: flex;

  @media only screen and (max-width: 700px) {
    justify-content: center;
  }
`;

const BigItem = styled.li`
  padding: 0 20px;
  margin-bottom: 20px;
  border-right: 1px solid gray;
  color: ${(props) => props.theme.white.lighter};

  @media only screen and (max-width: 700px) {
    font-size: 13px;
  }

  &:last-child {
    border: none;
  }
`;

const BigOverview = styled.p`
  padding: 0 20px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 14px;

  @media only screen and (max-width: 700px) {
    font-size: 12px;
    width: 100%;
    padding: 0 50px;
    display: flex;
    justify-content: center;
  }
`;

const CloseBtn = styled.svg`
  height: 20px;
  width: 100%;
  position: absolute;
  top: 20px;
  left: 445px;
  fill: ${(props) => props.theme.white.lighter};
  cursor: pointer;
  transition: fill 0.3s linear;
  &:hover {
    fill: ${(props) => props.theme.black.veryDark};
  }

  @media only screen and (max-width: 1000px) {
    top: 20px;
    left: 270px;
  }

  @media only screen and (max-width: 700px) {
    top: 20px;
    left: 45%;
  }
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: { delay: 0.5, duration: 0.3 },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5, duration: 0.3 },
  },
};
function Search() {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/search/movie/:dataId");
  const location = useLocation(); //useLocation(): 지금 있는 곳에 관한 정보를 얻을 수 있음
  const keyword: string = new URLSearchParams(location.search).get("keyword") || ""; //URL에서 특정 쿼리 문자열을 가져오거나 수정할 때 사용한다.
  const { data, isLoading, refetch } = useQuery<IGetSearch>(["search", "resultSearch"], () =>
    getSearch(keyword)
  );

  const clickedMovie =
    bigMovieMatch?.params.dataId &&
    data?.results.find((movie) => movie.id + "" === bigMovieMatch.params.dataId);

  const onBoxClicked = (dataId: number | undefined) => {
    navigate(`/search/movie/${dataId}?keyword=${keyword}`); //url을 바꿔줌
  };
  const onOverlayClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    refetch(); //keyword가 바뀔 때마다 API를 다시 호출
  }, [keyword]);

  return (
    <>
      <Container>
        <ResultText>"{keyword}"으로 검색한 결과입니다.</ResultText>
        <Content>
          {isLoading
            ? "Loading..."
            : data?.results.map((data) => (
                <Box
                  layoutId={data.id + ""}
                  key={data.id}
                  boxphoto={makeImagePath(data.backdrop_path, "w500")}
                  variants={boxVariants}
                  initial="normal"
                  whileHover="hover"
                  onClick={() => onBoxClicked(data.id)}
                >
                  {data.backdrop_path ? null : (
                    <ErrorImg>
                      Sorry,
                      <br /> No images are currently
                      <br /> available.
                    </ErrorImg>
                  )}
                  <Info variants={infoVariants}>
                    <h4>{data.title ? data.title : data.name}</h4>
                  </Info>
                </Box>
              ))}
        </Content>
      </Container>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay onClick={onOverlayClick} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <BigMovie layoutId={bigMovieMatch.params.dataId}>
              {clickedMovie && (
                <>
                  <CloseBtn
                    onClick={onOverlayClick}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                  >
                    <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
                  </CloseBtn>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                        clickedMovie.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  >
                    <BigTitle>
                      {clickedMovie.title ? clickedMovie.title : clickedMovie.name}
                    </BigTitle>
                  </BigCover>
                  <BigPoster
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                        clickedMovie.poster_path,
                        "w500"
                      )})`,
                    }}
                  ></BigPoster>
                  <BigInfo>
                    <BigList>
                      <BigItem>
                        유형:{" "}
                        {clickedMovie?.media_type
                          ? clickedMovie?.media_type.toUpperCase()
                          : "정보 없음"}
                      </BigItem>
                      <BigItem>
                        {clickedMovie.release_date ? clickedMovie.release_date : "정보 없음"}
                      </BigItem>
                      <BigItem>
                        평점:{" "}
                        {clickedMovie.vote_average
                          ? clickedMovie.vote_average.toFixed(1)
                          : "정보 없음"}
                      </BigItem>
                    </BigList>

                    <BigOverview>
                      {clickedMovie.overview ? clickedMovie.overview : "정보 없음"}
                    </BigOverview>
                  </BigInfo>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
export default Search;
