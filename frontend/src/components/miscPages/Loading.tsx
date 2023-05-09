import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../../images/orderlyLogo.svg";

type Props = {
  children: any;
};

const Loading = (props: Props) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const { pathname } = useLocation();
  const paths = pathname.split("/");

  const navigate = useNavigate();

  React.useEffect(() => {
    const redirectIfOrgDoesntExist = async (orgId: string) => {
      const res = await fetch(`http://localhost:3001/menu/categories/${orgId}`);

      const data = await res.json();
      if (data.output?.length === 0) {
        // navigate("/oops");
      }
    };
    setTimeout(() => {
      if (paths[1] === "restaurant") {
        redirectIfOrgDoesntExist(paths[2]);
      }
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <>
      {isLoading ? (
        <PageCont>
          <img src={Logo} width="150px" height="150px" />
        </PageCont>
      ) : (
        <>{props.children}</>
      )}
    </>
  );
};

export default Loading;

export const PageCont = styled.div`
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  animation-name: pulse;
  animation-duration: 1s;
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;
