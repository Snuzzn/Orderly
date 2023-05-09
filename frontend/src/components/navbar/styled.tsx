import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px solid #dcdcdc;
  justify-content: space-around;
  padding: 15px;
`;

export const Icon = styled.img<{ selected: boolean }>`
  width: 40px;
  cursor: pointer;
  filter: ${(props) =>
    props.selected
      ? "invert(66%) sepia(13%) saturate(1774%) hue-rotate(333deg) brightness(97%) contrast(95%)"
      : "brightness(3)"};
`;

export const IconTxt = styled.div<{ selected: boolean }>`
  /* color: ${(props) => (props.selected ? "#F19164" : "#636363")}; */
`;

export const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  /* color: props.selected ? "blue" : "red", */
`;
