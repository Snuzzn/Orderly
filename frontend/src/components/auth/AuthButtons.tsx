import {
  withAuthInfo,
  useLogoutFunction,
  useRedirectFunctions,
} from "@propelauth/react";
import { FC } from "react";
import { AiOutlineLogin, AiOutlineUserAdd } from "react-icons/ai";
import { BiLogOutCircle, BiUser } from "react-icons/bi";
import { RiRestaurantLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// isLoggedIn is automatically injected from withAuthInfo
const AuthBtns: FC<any> = ({ isLoggedIn }) => {
  const logoutFn = useLogoutFunction();
  const { redirectToSignupPage, redirectToLoginPage, redirectToAccountPage } =
    useRedirectFunctions();
  let navigate = useNavigate();

  if (isLoggedIn) {
    return (
      <Container>
        <AuthBtn isRegister={false} onClick={redirectToAccountPage}>
          <BiUser size="1.3em" />
          <b>Account</b>
        </AuthBtn>
        <br />
        <AuthBtn
          isRegister={false}
          onClick={() => navigate("/your-restaurants")}
        >
          <RiRestaurantLine size="1.3em" />
          <b>Your Restaurants</b>
        </AuthBtn>
        <br />
        <AuthBtn isRegister={false} onClick={() => logoutFn(true)}>
          <BiLogOutCircle size="1.3em" /> <b>Logout </b>
        </AuthBtn>
      </Container>
    );
  } else {
    return (
      <Container>
        <ButtonsWrapper>
          <AuthBtn isRegister={true} onClick={redirectToSignupPage}>
            <AiOutlineUserAdd size="1.3em" />
            <b>Register</b>
          </AuthBtn>
          <br />
          <AuthBtn isRegister={false} onClick={redirectToLoginPage}>
            <AiOutlineLogin size="1.3em" />
            <b>Login</b>
          </AuthBtn>
        </ButtonsWrapper>
      </Container>
    );
  }
};

export default withAuthInfo(AuthBtns);

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 270px;
  background-color: white;
  border-radius: 20px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`;

const AuthBtn = styled.button<{ isRegister: boolean }>`
  width: 250px;
  border: none;
  border-radius: 20px;
  text-align: center;
  background-color: ${(p) => (p.isRegister ? "#ED956D" : "white")};
  color: ${(p) => (p.isRegister ? "white" : "#eb7347")};
  padding: 20px 40px;
  cursor: pointer;
  font-size: 11pt;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 8rem;
  gap: 10px;
  margin-top: auto;
`;
