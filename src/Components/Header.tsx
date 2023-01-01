import styled from "styled-components";
import { motion, useAnimation, useScroll } from "framer-motion"; //라우터 버전 5는 useScroll -> useViewportScroll
import { Link, useMatch, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Nav = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0;
  height: 70px;
  font-size: 14px;
  padding: 20px 60px;
  color: white;
  z-index: 20;
  @media only screen and (max-width: 700px) {
    font-size: 12px;
    padding: 20px 20px;
  }
`;

const Col = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled(motion.svg)`
  margin-right: 50px;
  width: 95px;
  height: 25px;
  fill: ${(props) => props.theme.red};
  path {
    stroke-width: 6px;
    stroke: white;
  }

  @media only screen and (max-width: 700px) {
    margin-right: 20px;
    width: 80px;
  }
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled.li`
  margin-right: 20px;
  color: ${(props) => props.theme.white.darker};
  transition: color 0.3s ease-in-out;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  &:hover {
    color: ${(props) => props.theme.white.lighter};
  }
`;

const Search = styled.form`
  color: white;
  display: flex;
  align-items: center;
  position: relative;
  svg {
    height: 23px;
  }
`;

const Circle = styled(motion.span)`
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 5px;
  bottom: -10px;
  left: 0;
  right: 0;
  margin: 0 auto; //무언가를 중앙에 오고싶게 하려면 left:0, right:0 margin:0 auto 하면 됨
  background-color: ${(props) => props.theme.red};
`;

const Input = styled(motion.input)`
  transform-origin: right center; //변화가 시작하는 위치를 의미 (오른쪽의 중앙에서 시작)
  position: absolute;
  right: 0px;
  padding: 5px 10px;
  padding-left: 40px;
  z-index: -1;
  color: white;
  font-size: 16px;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.white.lighter};
`;

const logoVariants = {
  normal: {
    fillOpacity: 1,
  },
  active: {
    fillOpacity: [0, 1, 0], //반복되는 값을 배열로 줄 수 있음
    transition: { repeat: Infinity }, //애니메이션 무한 반복
  },
};

const navVariants = {
  top: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))",
  },
  scroll: {
    backgroundColor: "rgba(0 ,0 ,0, 1)",
  },
};

interface IForm {
  keyword: string;
}

function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const homeMatch = useMatch("/"); //상대경로로 작성, 라우터 버전 5에서는 useRouteMatch()
  const tvMatch = useMatch("tv");
  const inputAnimation = useAnimation(); //UseAnimation(): 시작 및 중지 메서드가 있는 AnimationControls을 만들 수 있음
  const navAnimation = useAnimation();
  const { scrollY } = useScroll(); //scrollY는 픽셀 단위
  const toggleSearch = () => {
    if (searchOpen) {
      //특정 코드를 통해 애니메이션을 실행시키는 방법, 애니메이션을 동시에 실행시키고 싶을때 유용
      inputAnimation.start({
        scaleX: 0, //문자 그대로 스타일들을 적는 방법
      });
    } else {
      inputAnimation.start({
        scaleX: 1,
      });
      setFocus("keyword");
    }
    setSearchOpen((prev) => !prev);
  };
  useEffect(() => {
    scrollY.onChange(() => {
      //get을 하는 이유는 MotionValue는 값이 바뀌어도 자동으로 업데이트가 되지 않기 때문
      if (scrollY.get() > 80) {
        navAnimation.start("scroll"); //변수를 지정(variants)하는 방법
      } else {
        navAnimation.start("top");
      }
    });
  }, [scrollY, navAnimation]);
  const navigate = useNavigate();
  const { register, handleSubmit, setFocus } = useForm<IForm>();
  const onValid = (data: IForm) => {
    navigate(`/search?keyword=${data.keyword}`);
  };
  return (
    <Nav variants={navVariants} animate={navAnimation} initial={"top"}>
      <Col>
        <Logo
          variants={logoVariants}
          initial="normal"
          whileHover="active"
          xmlns="http://www.w3.org/2000/svg"
          width="1024"
          height="276.742"
          viewBox="0 0 1024 276.742"
        >
          <motion.path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
        </Logo>

        <Items>
          <Item>
            <Link to="/">Home {homeMatch && <Circle layoutId="circle" />}</Link>
          </Item>
          <Item>
            <Link to="tv">Tv Shows {tvMatch && <Circle layoutId="circle" />}</Link>
          </Item>
        </Items>
      </Col>
      <Col>
        <Search onSubmit={handleSubmit(onValid)}>
          <motion.svg
            onClick={toggleSearch}
            animate={{ x: searchOpen ? -215 : 0 }}
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            style={{ cursor: "pointer" }}
            transition={{ bounce: 0, duration: 0.1 }}
          >
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z" />
          </motion.svg>
          <Input
            {...register("keyword", { required: true, minLength: 2 })}
            animate={inputAnimation}
            initial={{ scaleX: 0 }}
            // animate={{ scaleX: searchOpen ? 1 : 0 }}
            placeholder="Search for movie or tv show..."
          />
        </Search>
      </Col>
    </Nav>
  );
}

export default Header;
